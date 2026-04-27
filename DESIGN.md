# Escritos da Geo — Design

> Sistema de design vivo, mantido manualmente. Pareie com `app/globals.css` — esse é o documento que explica **o porquê**; o CSS é a verdade técnica.

---

## 1. Filosofia

**Estética:** táctil / skeuomórfica. O produto é uma _papelaria digital_ — caderno, polaroide, washi tape, fita, dobra de papel. Tudo que existe na tela tem uma analogia física no mundo de quem escreve à mão.

**Posicionamento:** privado por padrão, público por escolha. Ferramenta de santuário — não rede social. Fricção consciente onde for necessária.

**Atemporalidade:** sem dark mode no MVP, sem temas alternativos. A paleta é o _produto_, não preferência.

---

## 2. Paleta

Sistema baseado em **earthy neutrals** — papel, tinta, sálvia, washi tan. Tokens seguem nomenclatura Material 3 pra que qualquer componente shadcn caia direto.

### Superfícies

| Token                              | Hex       | Uso                                 |
| ---------------------------------- | --------- | ----------------------------------- |
| `--color-background`               | `#fff8f0` | fundo da página (papel envelhecido) |
| `--color-surface-container-lowest` | `#ffffff` | cartões, polaroides, post-it real   |
| `--color-surface-container-low`    | `#fcf3e1` | nav, badges secundárias             |
| `--color-surface-container`        | `#f6eddb` | cards de destaque                   |
| `--color-surface-container-high`   | `#f0e7d5` | superfícies elevadas                |
| `--color-surface-variant`          | `#eae2d0` | divisores fortes                    |

### Texto

| Token                        | Hex       | Uso                       |
| ---------------------------- | --------- | ------------------------- |
| `--color-on-surface`         | `#1f1b10` | texto editorial primário  |
| `--color-on-surface-variant` | `#4d453e` | meta, captions, navegação |

### Cores acentuadas

| Token                         | Hex       | Família                                         |
| ----------------------------- | --------- | ----------------------------------------------- |
| `--color-primary`             | `#68594b` | **Sépia ink** — botões primários, links, hover  |
| `--color-primary-fixed`       | `#f4dfcc` | washi tape, fundos de hover suave               |
| `--color-secondary`           | `#59614e` | **Sálvia** — sucesso, status público            |
| `--color-secondary-container` | `#dee6ce` | chips de tag, banners de confirmação            |
| `--color-tertiary`            | `#7b542b` | **Washi tan** — hovers de destaque, ênfase rara |
| `--color-tertiary-fixed`      | `#ffdcbd` | fundos cremosos quentes                         |

### Erro

| Token                     | Hex       |
| ------------------------- | --------- |
| `--color-error`           | `#ba1a1a` |
| `--color-error-container` | `#ffdad6` |

**Regra:** nunca use cores fora do sistema. Se precisar de um tom novo, adicione como token primeiro.

---

## 3. Tipografia

Três famílias, papéis distintos. Geo escolhe duas em `/configuracoes` (uma editorial pra ler, uma manuscrita pra escrever) — UI tem a terceira fixa.

| Família        | Variável         | Default    | Uso                                   |
| -------------- | ---------------- | ---------- | ------------------------------------- |
| **Editorial**  | `--font-serif`   | Newsreader | títulos, parágrafos longos, leitura   |
| **Manuscrita** | `--font-writing` | Caveat     | legendas, marginalia, corpo do editor |
| **UI / sans**  | `--font-sans`    | Epilogue   | navegação, labels, micro-cópia        |

### Como a Geo escolhe

- `/configuracoes` → 2 grids de FontPicker (`kind="serif"` e `kind="writing"`)
- 9 opções editoriais + 7 manuscritas pré-carregadas via `next/font/google`
- Persistência em `localStorage` (`escritos-da-geo:font-serif` / `escritos-da-geo:font-writing`)
- Anti-FOUT: `<script>` inline no `<head>` lê localStorage e injeta `--font-serif` / `--font-writing` antes do CSS aplicar

### Escala

Definida em `@theme`. Componentes consomem via classes Tailwind correspondentes.

| Token                 | Tamanho | Line-height | Uso                               |
| --------------------- | ------- | ----------- | --------------------------------- |
| `--text-headline-lg`  | 48px    | 1.1 / 600   | hero, títulos de marca            |
| `--text-headline-md`  | 32px    | 1.2 / 500   | títulos de seção                  |
| `--text-body-md`      | 18px    | 1.6 / 400   | corpo padrão                      |
| `--text-marginalia`   | 16px    | 1.4 / 400   | side notes, metadados secundários |
| `--text-caption-hand` | 14px    | 1.3 / 300   | legendas manuscritas              |

### Largura de leitura

`--reading-max-width: 680px` (~65 caracteres). Sempre que renderizar texto longo (página pública, leitura de entrada salva), enquadre nesse limite.

---

## 4. Espaçamento

Sistema apoiado em valores Tailwind padrão + 3 tokens semânticos.

| Token                        | Valor      | Uso                                               |
| ---------------------------- | ---------- | ------------------------------------------------- |
| `--spacing-margin-page`      | `2.5rem`   | margens externas de página em desktop             |
| `--spacing-gutter-organic`   | `1.5rem`   | gap entre elementos relacionados                  |
| `--spacing-overlap-negative` | `-1.25rem` | sobreposição de elementos (washi sobre polaroide) |

Para o resto, use a escala Tailwind. Padrão da estrutura:

- Cards: `p-6` (mobile) → `sm:p-10` → `lg:p-14`
- Gap entre cards: `gap-4` ou `gap-6`
- Páginas: `px-4 py-8` (mobile) → `sm:px-8 sm:py-12`

---

## 5. Primitivas táteis

Utilities CSS em `@utility` blocks no `globals.css`. Combinam cor + textura + sombra pra simular materiais físicos.

### `paper-grain`

Ruído SVG sutil aplicado como `background-image` sobre superfícies brancas. Quebra a "perfeição digital" do papel.

```css
@utility paper-grain {
  /* SVG fractalNoise opacity 0.05 */
}
```

### `washi-tape-primary` / `washi-tape-sage`

Faixas de fita decorativas, sempre semi-transparentes (opacity ~0.7) com `backdrop-filter: blur(2px)`. Aplicar como `<div>` posicionado absolutamente sobre cards.

- **Primary** (tan): combina com sépia
- **Sage** (verde acinzentado): combina com secondary
- Use rotações sutis (`-rotate-3`, `rotate-12`) pra evitar simetria perfeita
- Tamanhos típicos: `h-5 w-16` (pequena), `h-6 w-24` (média), `h-7 w-36` (grande, hero)

### `shadow-tactile` e `shadow-polaroid`

Duas variantes de sombra suave em camadas:

- **`shadow-tactile`**: 3 camadas, leve elevação — cards, badges, papel preso
- **`shadow-polaroid`**: 3 camadas mais profundas — fotos polaroides, pesos sentidos

Nunca use `shadow-md/lg/xl` do Tailwind — quebram a coerência. Sempre uma das duas tactile.

### `deckle-edge`

`clip-path` com 50+ pontos simulando borda irregular de papel artesanal. Use sparingly — em superfícies grandes (papel principal) e raras.

### `wall-surface`

Fundo de "parede" pra galeria — bege levemente texturado com hatching diagonal. Usado em `/` (galeria pública) e `/casa` (mural).

### `notebook-paper`

Linhas horizontais a cada 40px (`linear-gradient`). Usado em superfícies de escrita longa. **Atualmente não em uso** porque o editor migrou pra fluxo livre — mantido pra reabrir se a Geo pedir caderno pautado.

---

## 6. Componentes recorrentes

### Polaroide (`<WallItem>` + flutuantes na landing)

```
┌─────────────────────┐
│ ▓▓▓ washi tape (10%)│  ← absoluta, -top-2/3, rotação aleatória
│  ┌───────────────┐  │
│  │               │  │  ← aspect 4/5, photo-tone (sépia leve)
│  │     foto      │  │
│  │               │  │
│  └───────────────┘  │
│                     │
│   "legenda mão"     │  ← font-writing
└─────────────────────┘  ← shadow-polaroid, rotate aleatório (-4 a +4)
```

**Regras:**

- Rotação base nunca > 6° (evita parecer caótico)
- Cada polaroide gera washi de uma das 5 variantes (Math index modulo)
- Hover: `translate-y--1 rotate-+1deg` — leve "levantada"
- Filtro `photo-tone` (grayscale 8% / sepia 8%) sempre — unifica fotos diversas

### Marca-texto (`<mark>`)

Gradiente vertical que cobre só o miolo do texto, deixando ascendentes/descendentes livres:

```css
background: linear-gradient(
  180deg,
  transparent 0%,
  transparent 12%,
  rgba(247, 218, 130, 0.6) 12%,
  rgba(247, 218, 130, 0.6) 88%,
  transparent 88%
);
```

Simula marca-texto físico que não cobre toda a linha. Padding lateral 2px.

### Botões

Três variantes principais, sem componente shared (cada uso adapta classes):

- **Primário (CTA)**: `bg-primary text-on-primary` em pílula `rounded-full`
- **Secundário (outline)**: `border-outline-variant bg-surface-container-lowest text-on-surface`, hover muda border pra primary
- **Ghost (ícone)**: só `text-on-surface-variant`, hover ganha `bg-surface-container`

Tamanhos:

- Toolbar/nav: `h-8 w-8` (mobile) → `h-10 w-10`
- Inline: `px-4 py-2 text-sm` (compacto), `px-6 py-3` (padrão)

### Inputs

Sem chrome — papel não tem moldura.

- Bordas só na base (`border-b border-outline-variant/40`) ou nenhuma
- `bg-transparent` sempre (herdam do card pai)
- Placeholder em `text-on-surface-variant/30-40`
- Foco: **sem outline** (regra `.editor-input:focus { outline: none !important }`)
- Ring de foco do `focus-visible` global é neutralizado em inputs do editor

### Chips de tag

```
[ #manhã  × ]
```

`bg-secondary-container text-on-secondary-container rounded-full px-3 py-1 text-xs`. Botão `×` pra remover. Em modo leitura, sem o `×`.

### Cards de listagem (`/escritas`)

`border-outline-variant/40 bg-surface-container-lowest rounded-md`. Hover: `hover:border-primary/40 hover:shadow-tactile`. Animação só de border + shadow, sem translate.

---

## 7. Movimento

**Princípio**: movimento serve à textura, não à atenção. Animações comunicam **materialidade**, não engajamento.

### Padrões aceitos

- **Hover de cards/polaroides**: translate vertical pequeno (-1px a -5px) + rotate sutil (1°), 300ms ease-out
- **Transições de cor**: 200ms ease em todos os hovers de texto/border
- **Loading/pending**: `opacity-50` + `disabled` no botão

### Padrões rejeitados

- ❌ Bounces, springs, parallax — agitam o ambiente
- ❌ Scroll-triggered animations
- ❌ Confete, explosões, micro-celebrações
- ❌ Transições de página (next/link basta)

### `prefers-reduced-motion`

Regra global zera animação:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Sempre que escrever animação custom, declare também o fallback `prefers-reduced-motion: reduce`.

---

## 8. Acessibilidade

- **Foco visível** em links/botões: `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px }`
- **Escapes do foco**: `[contenteditable]` e `.editor-input` neutralizam o ring porque "papel não tem moldura"
- **Aria-label sempre** em ícones-only (toolbar, nav)
- **Title** em ícones complementa pro tooltip nativo
- **Texto alt** em imagens decorativas: `alt=""` + `aria-hidden`
- **Selection**: `::selection { background: var(--color-primary-fixed); color: var(--color-on-primary-fixed) }`

---

## 9. Padrões de imagem

| Tipo                                      | Tratamento                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ | -------------------- |
| **Polaroide** (mural, landing flutuantes) | `photo-tone` (sépia 8%), aspect 4/5 fixo, washi tape, sombra polaroide                           |
| **Avatar**                                | circular, `border border-outline-variant/60`, `object-cover`, fallback inicial em `--font-serif` |
| **Imagem inline no editor**               | sem filtro, alinhamento via `data-align="left                                                    | center | right"`, sombra leve |
| **Decorativas (Unsplash fallback)**       | mesmo tratamento de polaroide, `loading="eager"`                                                 |

### Otimização

- Avatares de bucket público Supabase: `<img>` direto (não `next/image` ainda — `remotePatterns` deferido pra Story posterior)
- Imagens do editor/wall: signed URLs Supabase com TTL longo (24h)
- Suprimir warning ESLint com comentário justificando: `eslint-disable-next-line @next/next/no-img-element -- signed URL Supabase`

---

## 10. Anti-padrões

Coisas que **não** existem no produto, mesmo que UX moderna sugira:

- ❌ **Modo escuro** — paleta é warm/luz, escolha de identidade. **Atualização (abr/2026):** múltiplas paletas warm foram adotadas (Sépia, Areia, Sálvia, Lavanda) — todas claras, configuráveis em `/configuracoes`. Não é dark mode, é variação de identidade.
- ❌ **Métricas de engajamento visíveis** — sem contadores, streaks, "dias seguidos". **Continua válido:** reactions existem mas SEM contagem visível, e bilhetes não têm badge "X não lidos".
- ❌ **Notificações in-app** — sem badges vermelhos, sem contadores não lidos. Bilhetes ficam acessíveis via `/recados` mas sem aviso visual de quantidade.
- ❌ **Skeleton loaders animados** — usar fallback estático ou nada
- ❌ **Tooltips agressivos** — só nativo via `title`, sem libraries de tooltip
- ❌ **Scroll restoration custom** — comportamento nativo basta
- ❌ **Avatares de seguidores / sociais** — produto é de uma só pessoa
- ⚠️ **Reactions/bilhetes em textos públicos** (adotado abr/2026 com fricção) — NÃO é "rede social leve". Reactions são **5 emoji-state sem contagem**; bilhetes são **privados, só a autora vê**. Sem feed público de comentários, sem repost, sem perfil de leitor.

---

## 11. Convenções de código

### CSS

- Tokens em `@theme {}` no topo de `globals.css`
- Utilities em `@utility name {}` — nunca `.name {}` direto
- Pseudo-elementos via aninhamento `&::before` dentro de `@utility`
- `!important` apenas pra neutralizar regras globais (`focus-visible`)

### Componentes

- Classes Tailwind primeiro, `style={{}}` só pra `font-family` quando precisa de var dinâmica
- Ordem: layout → spacing → typography → colors → states (hover, focus)
- Nada de `clsx`/`cn` ainda — string concatenation cobre

### Server vs client

- Páginas e renderização de conteúdo: Server Components
- Interatividade (toolbar, popover, modal, formulário com state): `'use client'`
- Forms de mutação: `<form action={serverAction}>` + `useActionState` no client quando precisar de feedback

---

## 12. Onde está cada coisa

```
app/
  globals.css            ← tokens + utilities + base styles
  layout.tsx             ← fonts (Google) + anti-FOUT script

components/
  layout/Container.tsx   ← max-w-680px, padding lateral responsivo
  editor/                ← Editor, SketchModal, EditorToolbar, BookmarkButton
  wall/                  ← WallItem, WallUploadForm, WallItemControls
  casa/                  ← WritePrompt, MiniCalendar, MarginaliaCard, WallFeedGrouped
  preferences/           ← FontPicker
  profile/               ← ProfileForm
  texts/                 ← TextActions
```

Quando dúvida sobre estilo: olhe primeiro a primitiva mais próxima existente. Quando criar novo: revise se ele encaixa nos princípios da seção 1.
