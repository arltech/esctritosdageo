'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  Camera,
  Highlighter,
  Italic,
  Pencil,
  Plus,
  Tag as TagIcon,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';

import { saveText, uploadEditorImage, type SaveTextResult } from '@/app/_actions/texts';

import { SketchModal } from './SketchModal';

interface EditorProps {
  /** Quando passado, salva como UPDATE no texto existente. */
  editingId?: string;
  initialTitle?: string;
  initialBodyHtml?: string;
  initialTags?: string[];
  /** Label da data formatada — ex.: '27 abril · 2026' */
  dateLabel: string;
  /** Href do botão voltar — default /casa */
  backHref?: string;
  placeholderTitle?: string;
  placeholderBody?: string;
}

const SAVED_FLASH_MS = 1800;

export function Editor({
  editingId,
  initialTitle = '',
  initialBodyHtml = '',
  initialTags = [],
  dateLabel,
  backHref = '/casa',
  placeholderTitle = 'Título da entrada...',
  placeholderBody = 'Comece a escrever...',
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const bodyHiddenRef = useRef<HTMLInputElement | null>(null);
  const lastStateRef = useRef<SaveTextResult | null>(null);

  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagDraft, setTagDraft] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [sketchOpen, setSketchOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Imagem clicada (mostra popover de alinhamento)
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [imgPopover, setImgPopover] = useState<{ top: number; left: number } | null>(null);

  const [state, formAction, pending] = useActionState<SaveTextResult | null, FormData>(
    saveText,
    null,
  );

  /* ---------------- Selection helpers ---------------- */
  function saveSelection(): Range | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return sel.getRangeAt(0).cloneRange();
  }

  function restoreSelection(range: Range | null) {
    if (!range) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  /* ---------------- Tools ---------------- */

  function applyExecCommand(cmd: 'bold' | 'italic') {
    editorRef.current?.focus();
    document.execCommand(cmd);
    syncBodyToHidden();
  }

  function applyHighlight() {
    const editor = editorRef.current;
    const sel = window.getSelection();
    if (!editor || !sel || sel.isCollapsed || sel.rangeCount === 0) {
      editor?.focus();
      return;
    }
    const range = sel.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    const mark = document.createElement('mark');
    try {
      mark.appendChild(range.extractContents());
      range.insertNode(mark);
      const newRange = document.createRange();
      newRange.setStartAfter(mark);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      syncBodyToHidden();
    } catch (err) {
      console.error('[applyHighlight] falhou', err);
    }
  }

  function triggerImagePicker() {
    fileInputRef.current?.click();
  }

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const savedRange = saveSelection();

    setImageUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const res = await uploadEditorImage(fd);
    setImageUploading(false);

    if (!res.ok) {
      alert(res.error);
      return;
    }
    insertImageNode(res.signedUrl, res.path, savedRange);
  }

  function insertImageNode(src: string, path: string, savedRange: Range | null) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection(savedRange);

    const img = document.createElement('img');
    img.src = src;
    img.setAttribute('data-path', path);
    img.setAttribute('data-align', 'center');
    img.setAttribute('data-size', 'medium');
    img.alt = '';

    const wrap = document.createElement('p');
    wrap.appendChild(img);

    // Parágrafo vazio depois pra cursor cair em linha nova clicável
    const trailing = document.createElement('p');
    trailing.appendChild(document.createElement('br'));

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).startContainer)) {
      const range = sel.getRangeAt(0);
      range.collapse(false);
      range.insertNode(trailing);
      range.insertNode(wrap);
      const newRange = document.createRange();
      newRange.setStart(trailing, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      editor.appendChild(wrap);
      editor.appendChild(trailing);
      const newRange = document.createRange();
      newRange.setStart(trailing, 0);
      newRange.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(newRange);
    }
    syncBodyToHidden();
  }

  function alignSelectedImage(align: 'left' | 'center' | 'right') {
    if (!selectedImg) return;
    selectedImg.setAttribute('data-align', align);
    syncBodyToHidden();
    requestAnimationFrame(() => positionPopoverFor(selectedImg));
  }

  function resizeSelectedImage(size: 'small' | 'medium' | 'large') {
    if (!selectedImg) return;
    selectedImg.setAttribute('data-size', size);
    syncBodyToHidden();
    requestAnimationFrame(() => positionPopoverFor(selectedImg));
  }

  function deleteSelectedImage() {
    if (!selectedImg) return;
    const parent = selectedImg.parentElement;
    selectedImg.remove();
    if (
      parent &&
      parent.tagName === 'P' &&
      !parent.textContent?.trim() &&
      !parent.querySelector('img')
    ) {
      parent.remove();
    }
    setSelectedImg(null);
    setImgPopover(null);
    syncBodyToHidden();
  }

  function positionPopoverFor(img: HTMLImageElement) {
    const editor = editorRef.current;
    if (!editor) return;
    const editorRect = editor.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    setImgPopover({
      top: imgRect.top - editorRect.top - 44,
      left: imgRect.left - editorRect.left + imgRect.width / 2,
    });
  }

  function handleEditorClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      editorRef.current
        ?.querySelectorAll('img.is-selected')
        .forEach((el) => el.classList.remove('is-selected'));
      img.classList.add('is-selected');
      setSelectedImg(img);
      positionPopoverFor(img);
    } else {
      editorRef.current
        ?.querySelectorAll('img.is-selected')
        .forEach((el) => el.classList.remove('is-selected'));
      setSelectedImg(null);
      setImgPopover(null);
    }
  }

  /* ---------------- Tags ---------------- */

  function commitTag() {
    const v = tagDraft.trim();
    if (!v) {
      setTagDraft('');
      return;
    }
    setTags((curr) => {
      if (curr.includes(v)) return curr;
      return curr.length >= 16 ? curr : [...curr, v];
    });
    setTagDraft('');
  }

  function removeTag(t: string) {
    setTags((curr) => curr.filter((x) => x !== t));
  }

  function openTagInput() {
    setShowTagInput(true);
    setTimeout(() => tagInputRef.current?.focus(), 0);
  }

  /* ---------------- Body sync (avoid stale state on submit) ---------------- */

  function syncBodyToHidden() {
    const editor = editorRef.current;
    const hidden = bodyHiddenRef.current;
    if (editor && hidden) hidden.value = editor.innerHTML;
  }

  function handleSketchInsert(data: { signedUrl: string; path: string }) {
    insertImageNode(data.signedUrl, data.path, null);
  }

  /* ---------------- Hydrate (modo edição) ---------------- */

  useEffect(() => {
    if (titleRef.current && initialTitle) titleRef.current.value = initialTitle;
    if (editorRef.current && initialBodyHtml) editorRef.current.innerHTML = initialBodyHtml;
    if (bodyHiddenRef.current) bodyHiddenRef.current.value = initialBodyHtml;
    // Força <p> como separador quando Enter é pressionado (HTML mais limpo)
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só hidrata no mount
  }, []);

  /**
   * Garante que Enter funciona quando o cursor está num parágrafo que só
   * contém imagem (browser às vezes não cria <p> novo abaixo, deixando o
   * cursor preso). Cria parágrafo vazio depois e move o cursor pra ele.
   */
  function handleEditorKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    let node: Node | null = range.startContainer;
    while (node && node !== editorRef.current) {
      if (node.nodeType === 1 && (node as Element).tagName === 'P') break;
      node = node.parentNode;
    }
    if (node && node !== editorRef.current && (node as Element).tagName === 'P') {
      const p = node as HTMLElement;
      if (p.querySelector('img') && !p.textContent?.trim()) {
        e.preventDefault();
        const newP = document.createElement('p');
        newP.appendChild(document.createElement('br'));
        p.after(newP);
        const newRange = document.createRange();
        newRange.setStart(newP, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        syncBodyToHidden();
      }
    }
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const editor = editorRef.current;
      if (!editor) return;
      const target = e.target as Node;
      if (!editor.contains(target)) {
        editor
          .querySelectorAll('img.is-selected')
          .forEach((el) => el.classList.remove('is-selected'));
        setSelectedImg(null);
        setImgPopover(null);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  /* ---------------- Saved flash (efêmero) ---------------- */

  useEffect(() => {
    if (!state || state === lastStateRef.current) return;
    lastStateRef.current = state;
    if (state.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ack visual de save
      setSavedFlash(true);
      const t = window.setTimeout(() => setSavedFlash(false), SAVED_FLASH_MS);
      return () => window.clearTimeout(t);
    }
  }, [state]);

  /* ---------------- Render ---------------- */

  return (
    <>
      <form action={formAction} onSubmit={syncBodyToHidden}>
        {editingId ? <input type="hidden" name="id" value={editingId} /> : null}
        <input ref={bodyHiddenRef} type="hidden" name="body_html" defaultValue="" />
        {tags.map((t) => (
          <input key={t} type="hidden" name="tags" value={t} />
        ))}

        {/* ===== Top toolbar (sticky) ===== */}
        <header className="border-outline-variant/40 bg-surface-container-low/95 sticky top-0 z-30 border-b backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 sm:px-6">
            {/* Voltar */}
            <Link
              href={backHref}
              aria-label="Voltar"
              title="Voltar"
              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 shrink-0 items-center justify-center rounded-md no-underline transition-colors"
            >
              <ArrowLeft size={18} strokeWidth={1.6} />
            </Link>

            {/* Ferramentas (centro) */}
            <div className="mx-auto flex items-center gap-0.5">
              <ToolBtn label="Negrito" onClick={() => applyExecCommand('bold')}>
                <Bold size={16} strokeWidth={1.8} />
              </ToolBtn>
              <ToolBtn label="Itálico" onClick={() => applyExecCommand('italic')}>
                <Italic size={16} strokeWidth={1.8} />
              </ToolBtn>
              <ToolBtn label="Marca-texto" onClick={applyHighlight}>
                <Highlighter size={16} strokeWidth={1.6} />
              </ToolBtn>
              <Divider />
              <ToolBtn
                label="Adicionar foto"
                onClick={triggerImagePicker}
                disabled={imageUploading}
              >
                <Camera size={16} strokeWidth={1.6} />
              </ToolBtn>
              <ToolBtn label="Adicionar rabisco" onClick={() => setSketchOpen(true)}>
                <Pencil size={16} strokeWidth={1.6} />
              </ToolBtn>
              <ToolBtn label="Marcar com tag" onClick={openTagInput}>
                <TagIcon size={16} strokeWidth={1.6} />
              </ToolBtn>
            </div>

            {/* Salvo + Salvar (direita) */}
            <div className="flex shrink-0 items-center gap-3">
              {savedFlash ? (
                <span
                  className="text-secondary font-sans text-sm italic"
                  style={{ fontFamily: 'var(--font-writing)' }}
                  aria-live="polite"
                >
                  salvo ✓
                </span>
              ) : null}
              {state && !state.ok ? (
                <span className="text-error font-sans text-xs italic" aria-live="polite">
                  {state.error}
                </span>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="bg-primary text-on-primary hover:bg-primary-container font-sans rounded-full px-5 py-1.5 text-sm tracking-wide transition-colors disabled:opacity-50"
              >
                {pending ? 'salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </header>

        {/* ===== Container de escrita ===== */}
        <div className="mx-auto max-w-[680px] px-4 pt-10 pb-32 sm:px-6 sm:pt-14">
          {/* Título */}
          <input
            ref={titleRef}
            type="text"
            name="title"
            maxLength={200}
            placeholder={placeholderTitle}
            className="editor-input text-on-surface placeholder:text-on-surface-variant/30 w-full border-none bg-transparent text-2xl font-medium tracking-tight outline-none sm:text-3xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          />

          {/* Meta: data · #tags · [+] */}
          <div className="text-on-surface-variant mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm">
            <span>{dateLabel}</span>

            {tags.length > 0 ? (
              <span className="text-on-surface-variant/40" aria-hidden>
                ·
              </span>
            ) : null}

            {tags.map((t) => (
              <span
                key={t}
                className="bg-secondary-container text-on-secondary-container inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  aria-label={`Remover tag ${t}`}
                  className="hover:text-on-surface ml-0.5"
                >
                  <X size={11} strokeWidth={2} />
                </button>
              </span>
            ))}

            {showTagInput ? (
              <input
                ref={tagInputRef}
                type="text"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    commitTag();
                  }
                  if (e.key === 'Escape') {
                    setShowTagInput(false);
                    setTagDraft('');
                  }
                  if (e.key === 'Backspace' && !tagDraft && tags.length > 0) {
                    setTags((c) => c.slice(0, -1));
                  }
                }}
                onBlur={() => {
                  commitTag();
                  setShowTagInput(false);
                }}
                placeholder="nova tag..."
                className="editor-input text-on-surface placeholder:text-on-surface-variant/40 bg-transparent text-xs outline-none"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={openTagInput}
                aria-label="Adicionar tag"
                title="Adicionar tag"
                className="text-on-surface-variant/50 hover:text-on-surface inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors"
              >
                <Plus size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="border-outline-variant/30 my-8 border-t" />

          {/* Corpo + popover de imagem */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncBodyToHidden}
              onClick={handleEditorClick}
              onKeyDown={handleEditorKeyDown}
              data-placeholder={placeholderBody}
              className="text-on-surface notebook-paper min-h-[60vh] sm:min-h-[65vh]"
              style={{
                fontFamily: 'var(--font-writing)',
                fontSize: '1.5rem',
                lineHeight: '40px',
                paddingTop: '8px',
              }}
            />

            {imgPopover ? (
              <div
                role="toolbar"
                aria-label="Posicionar imagem"
                className="bg-inverse-surface text-inverse-on-surface absolute z-30 flex -translate-x-1/2 items-center gap-0.5 rounded-md px-1 py-1 shadow-lg"
                style={{ top: imgPopover.top, left: imgPopover.left }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <PopoverBtn label="Esquerda" onClick={() => alignSelectedImage('left')}>
                  <AlignLeft size={14} strokeWidth={1.8} />
                </PopoverBtn>
                <PopoverBtn label="Centro" onClick={() => alignSelectedImage('center')}>
                  <AlignCenter size={14} strokeWidth={1.8} />
                </PopoverBtn>
                <PopoverBtn label="Direita" onClick={() => alignSelectedImage('right')}>
                  <AlignRight size={14} strokeWidth={1.8} />
                </PopoverBtn>
                <span className="bg-white/20 mx-1 h-4 w-px" aria-hidden />
                <SizeBtn label="Pequena" onClick={() => resizeSelectedImage('small')}>
                  P
                </SizeBtn>
                <SizeBtn label="Média" onClick={() => resizeSelectedImage('medium')}>
                  M
                </SizeBtn>
                <SizeBtn label="Grande" onClick={() => resizeSelectedImage('large')}>
                  G
                </SizeBtn>
                <span className="bg-white/20 mx-1 h-4 w-px" aria-hidden />
                <PopoverBtn label="Remover" onClick={deleteSelectedImage}>
                  <Trash2 size={14} strokeWidth={1.8} />
                </PopoverBtn>
              </div>
            ) : null}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageSelected}
        />
      </form>

      <SketchModal
        open={sketchOpen}
        onClose={() => setSketchOpen(false)}
        onInsert={handleSketchInsert}
      />
    </>
  );
}

/* ---------------- Sub-components ---------------- */

interface ToolBtnProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolBtn({ label, onClick, disabled, children }: ToolBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md transition-colors disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="bg-outline-variant/60 mx-1 h-5 w-px" aria-hidden />;
}

function PopoverBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="hover:bg-white/10 flex h-7 w-7 items-center justify-center rounded transition-colors"
    >
      {children}
    </button>
  );
}

function SizeBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="hover:bg-white/10 font-sans flex h-7 w-7 items-center justify-center rounded text-xs font-semibold transition-colors"
    >
      {children}
    </button>
  );
}
