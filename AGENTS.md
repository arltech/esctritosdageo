<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Escritos da Geo — Instruções para AI Agents

> **Conteúdo abaixo é mantido pelo time do projeto e NÃO é gerenciado pelo Next.js.**
> Conteúdo dentro de `<!-- BEGIN:nextjs-agent-rules -->` ... `<!-- END:nextjs-agent-rules -->` pode ser sobrescrito por updates do Next 16.

## O que é este projeto

**Escritos da Geo** é um santuário digital de escrita pessoal — privado por padrão, público por escolha. Construído inicialmente para Geovana Soares (esposa do Lucas) como estratégia _product-of-one_: se ela usar diariamente por 90 dias, o produto se prova; se sim, expande para outras escritoras com perfil similar.

**Status atual (2026-04-26):** MVP em desenvolvimento — Story 1.1 (Bootstrap) em andamento. Nenhum código de produto ainda.

## Documentos de referência (carregue conforme a necessidade da tarefa)

| Arquivo                   | Quando consultar                                                   |
| ------------------------- | ------------------------------------------------------------------ |
| `docs/brief.md`           | Entender o "porquê" estratégico, posicionamento, público-alvo      |
| `docs/prd.md`             | Saber requisitos exatos, AC, escopo MVP, anti-features             |
| `docs/architecture.md`    | Decisões técnicas (stack, schema, padrões, ADRs, coding standards) |
| `docs/stories/*.story.md` | Trabalho atual em curso — uma story por vez                        |

## Stack (versões atuais — `package.json` é fonte da verdade)

- **Next.js 16.2.4** (App Router) + **React 19.2.4** + **TypeScript 5.9.3** estrito
- **Tailwind CSS 4.2.4** (sem `tailwind.config.ts` — config via `@theme` no CSS)
- **shadcn/ui** seletivo (Dialog, Toast, Tooltip — adicionados quando necessários)
- **Supabase** (PostgreSQL + Auth Magic Link) — Story 1.2
- **Tiptap** (editor) — Story 2.2
- **Vercel** (hosting + Edge + Analytics) + **Sentry** (errors only)

## Convenções inegociáveis

1. **TypeScript estrito** — `strict: true` + `noUncheckedIndexedAccess` + `forceConsistentCasingInFileNames`. Sem `any` exceto justificado.
2. **Server Actions são a API primária** — toda mutação privada via `'use server'`; REST só em `/api/health` e OG image.
3. **Privado por padrão** — toda nova feature deve preservar o ethos: nascido privado, exposição opt-in com fricção consciente.
4. **Repository pattern** — queries Supabase encapsuladas em `lib/db/`, nunca diretamente em components.
5. **RLS sempre ativo** — toda tabela tem RLS habilitado com policies "deny by default".
6. **Sanitização HTML server-side** — `body_html` passa por `rehype-sanitize` antes de persistir.
7. **Sem console.log em produção** — use `console.error` (capturado por Sentry); remova `console.log` antes de commit.
8. **Anti-métricas** — não otimizar/exibir: tempo no app, curtidas como número, contadores vaidosos, viralização. **Reactions e bilhetes em textos públicos foram adotados (abr/2026) como exceção**: reactions são emoji-state SEM contagem; bilhetes são privados (só a autora vê em `/recados`, sem badge de não-lido). Continua proibido: contagens visíveis, streaks, "X pessoas curtiram", feeds públicos de comentários. Ver `prd.md` Seção 5 e `DESIGN.md` §10.
9. **Migrations versionadas** — `supabase/migrations/NNNN_descricao.sql`, nunca alterar schema fora desse fluxo.
10. **Service role key server-only** — apenas em `lib/supabase/admin.ts`, nunca exposta ao client.

## Comandos úteis

```bash
pnpm dev              # Next.js 16 + Turbopack (porta 3000)
pnpm build            # Production build (Turbopack)
pnpm lint             # ESLint --max-warnings 0 (bloqueia warnings)
pnpm typecheck        # tsc --noEmit (TS estrito)
pnpm format           # Prettier --write .
pnpm format:check     # Prettier --check . (usado pelo pre-commit)

# Database (após Story 1.2)
pnpm db:migrate       # Aplica migrations Supabase
pnpm db:reset         # Reset completo (dev only)
pnpm db:types         # Regenera lib/supabase/database.types.ts
```

## Pre-commit hook (lefthook)

Roda em paralelo a cada commit (~3s):

1. `prettier --check` (em arquivos staged) — bloqueia se formatação errada
2. `eslint --max-warnings 0` (em arquivos staged) — bloqueia em qualquer warning
3. `tsc --noEmit` (todo o projeto) — bloqueia em qualquer erro de tipo

**Nunca use `--no-verify` para pular hooks.** Se um hook falha, a causa raiz está na sua mudança — investigue e corrija.

## Trabalho com stories (AIOX)

- Cada story vive em `docs/stories/{epic}.{number}.{slug}.story.md`
- Ao trabalhar uma story:
  1. Leia AC + Tasks
  2. Implemente uma Task por vez
  3. Marque checkbox `[x]` ao concluir
  4. Atualize `File List` na seção Dev Agent Record
  5. Adicione Completion Notes em decisões não-óbvias
  6. Mude status para `Ready for Review` somente quando TODAS as tasks (suas) concluírem
- **NUNCA modifique** seções `Status` (até concluir), `Story`, `Acceptance Criteria`, `Dev Notes`, `Testing` — só seções da Dev Agent Record.

## Restrições explícitas

❌ Não usar: Redux, MobX, Zustand (Server Components + `useState` cobrem 95%)
❌ Não usar: ORM (Prisma, Drizzle) — clientes Supabase + queries explícitas
❌ Não usar: GraphQL — Server Actions resolvem
❌ Não integrar: Google Analytics, Mixpanel, Amplitude (viola posicionamento de privacidade)
❌ Não criar: arquivos `.md` de documentação fora de `docs/` sem aprovação
❌ Não fazer `git push` direto — delegar a `@github-devops` (Gage)

## Quando estiver com dúvida

1. Consulte `architecture.md` Seção 17 (Coding Standards — 12 regras críticas)
2. Para padrões Next 16 específicos, leia `node_modules/next/dist/docs/`
3. Para decisões estratégicas, consulte `docs/architecture.md` Seção 20 (ADRs)
4. Em último caso, pergunte ao Lucas antes de inventar
