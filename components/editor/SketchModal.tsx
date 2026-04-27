'use client';

import { Eraser, Undo2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { uploadEditorImage } from '@/app/_actions/texts';

interface SketchModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (imageData: { path: string; signedUrl: string; width: number; height: number }) => void;
}

const COLORS = [
  { name: 'sépia', value: '#68594b' },
  { name: 'tinta', value: '#1f1b10' },
  { name: 'sage', value: '#59614e' },
  { name: 'âmbar', value: '#7b542b' },
  { name: 'rosa', value: '#a8525a' },
] as const;

const STROKES = [2, 4, 8] as const;

const CANVAS_W = 720;
const CANVAS_H = 480;

export function SketchModal({ open, onClose, onInsert }: SketchModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  const [color, setColor] = useState<string>(COLORS[0].value);
  const [stroke, setStroke] = useState<number>(STROKES[1]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
  }, []);

  // Inicializa o fundo branco-creme quando abre. setState é legítimo aqui:
  // resetar mensagem de erro ao abrir o modal é sincronização com a abertura.
  useEffect(() => {
    if (!open) return;
    clearCanvas();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset de erro ao abrir
    setError(null);
  }, [open, clearCanvas]);

  // Bloqueia scroll do body com modal aberto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC fecha
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function pushHistory() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(snap);
    // Limita histórico pra não estourar memória
    if (historyRef.current.length > 30) historyRef.current.shift();
  }

  function undo() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const last = historyRef.current.pop();
    if (last) ctx.putImageData(last, 0, 0);
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pushHistory();
    drawingRef.current = true;
    lastPointRef.current = getPos(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const last = lastPointRef.current;
    const curr = getPos(e);
    if (!last) {
      lastPointRef.current = curr;
      return;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();

    lastPointRef.current = curr;
  }

  function handlePointerUp() {
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  async function handleInsert() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSubmitting(true);
    setError(null);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setError('Não consegui gerar o desenho.');
          setSubmitting(false);
          return;
        }
        const file = new File([blob], `sketch-${Date.now()}.png`, { type: 'image/png' });
        const fd = new FormData();
        fd.append('image', file);

        const res = await uploadEditorImage(fd);
        setSubmitting(false);

        if (!res.ok) {
          setError(res.error);
          return;
        }
        onInsert({
          path: res.path,
          signedUrl: res.signedUrl,
          width: canvas.width,
          height: canvas.height,
        });
        onClose();
      },
      'image/png',
      0.92,
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar rabisco"
    >
      <div className="bg-surface-container-lowest shadow-tactile w-full max-w-3xl rounded-lg p-4 sm:p-6">
        <header className="mb-4 flex items-center justify-between">
          <h2
            className="text-on-surface text-xl"
            style={{ fontFamily: 'var(--font-writing)', fontWeight: 600 }}
          >
            rabisco
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-on-surface-variant hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </header>

        {/* Toolbar do canvas */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {/* cores */}
          <div role="radiogroup" aria-label="Cor" className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={color === c.value}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c.value)}
                className={`h-7 w-7 rounded-full border-2 transition-all ${
                  color === c.value ? 'scale-110 border-stone-700' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <span className="bg-outline-variant/60 mx-1 h-6 w-px" aria-hidden />

          {/* espessuras */}
          <div role="radiogroup" aria-label="Espessura" className="flex items-center gap-2">
            {STROKES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={stroke === s}
                aria-label={`Espessura ${s}`}
                onClick={() => setStroke(s)}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                  stroke === s
                    ? 'border-stone-700 bg-stone-100'
                    : 'border-stone-300 hover:border-stone-500'
                }`}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: s + 2,
                    height: s + 2,
                    backgroundColor: color,
                  }}
                />
              </button>
            ))}
          </div>

          <span className="bg-outline-variant/60 mx-1 h-6 w-px" aria-hidden />

          <button
            type="button"
            onClick={undo}
            aria-label="Desfazer"
            title="Desfazer (⌘Z)"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <Undo2 size={16} strokeWidth={1.6} />
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            aria-label="Limpar"
            title="Limpar tudo"
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <Eraser size={16} strokeWidth={1.6} />
          </button>
        </div>

        {/* Canvas */}
        <div className="border-outline-variant/50 overflow-hidden rounded border bg-[#fff8f0]">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="block w-full touch-none"
            style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
          />
        </div>

        {error ? <p className="text-error font-sans mt-3 text-sm italic">{error}</p> : null}

        {/* Footer */}
        <footer className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-on-surface-variant hover:text-on-surface font-sans rounded-sm px-4 py-2 text-sm tracking-wide uppercase transition-colors disabled:opacity-50"
          >
            cancelar
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={submitting}
            className="bg-primary text-on-primary hover:bg-primary-container font-sans rounded-sm px-5 py-2 text-sm tracking-wide uppercase transition-colors disabled:opacity-50"
          >
            {submitting ? 'salvando...' : 'inserir'}
          </button>
        </footer>
      </div>
    </div>
  );
}
