# Escritos da Geo — Product Requirements Document (PRD)

> **Documento:** PRD v1.0
> **Autor:** Morgan (`@pm`) a partir do Project Brief v1.0 facilitado por Atlas (`@analyst`)
> **Data:** 2026-04-26
> **Status:** Rascunho aguardando validação com Geovana Soares (stakeholder primária) + handoff para `@architect`
> **Origem:** [Project Brief](./brief.md)

---

## 1. Goals and Background Context

### Goals

- Substituir o caderno físico de Geovana como ferramenta primária de escrita ritualística diária dentro de 6 meses
- Validar a hipótese *product-of-one*: 1 usuária real escrevendo 5+ dias/semana por 90 dias consecutivos
- Provar que existe vão de mercado para "escrita íntima com saída pública opt-in" no nicho lusófono
- Estabelecer base técnica e estética para escalar de 1 para 50-200 escritoras em 12 meses sem reescrita
- Operar em custo ≤ R$ 100/mês até 100 usuárias ativas (free tier Vercel + Supabase)
- Criar identidade visual e tipográfica reconhecível como referência de "escrita digital com alma"
- Garantir privacidade radical: zero incidentes de exposição não-autorizada no horizonte de 12 meses
- Construir crescimento orgânico (≥70% por indicação direta, sem orçamento de marketing)

### Background Context

**Escritos da Geo** nasce da observação de uma usuária real — Geovana Soares, escritora-de-caderno há anos — e do mapeamento de um vão de mercado mal-servido por produtos atuais. O ecossistema de escrita digital obriga uma escolha forçada entre três mundos imperfeitos: caderno físico (frágil, sem busca, sem ponte para o público), apps de diário privado tipo Day One (privado-eterno, sem caminho para leitores), ou plataformas sociais como Substack/Medium/Instagram (público-por-padrão, otimizadas para crescimento, hostis à escrita íntima). Ninguém atende quem quer **silêncio do diário com a opção da audiência**.

A estratégia é *product-of-one*: construído primeiro 100% para Geovana usar diariamente como substituto ritualístico do caderno físico. Se ela usar e amar (validação: 5+ dias/semana por 90 dias), o produto se prova. Daí, expansão controlada para escritoras com perfil similar — convite-only, qualidade sobre quantidade, anti-algoritmo como doutrina. Stack: Next.js 16 + Supabase + Vercel, executável por dev solo (Lucas) em 6-8 semanas part-time. Sem investidores, sem marketing pago, sem urgência externa. O sucesso é medido em profundidade de uso e devoção, não em escala viral.

### Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-04-26 | 1.0 | Versão inicial do PRD a partir do Project Brief v1.0 | Morgan (`@pm`) |

---

## 2. Requirements

### Functional Requirements

**Autenticação e identidade**

- **FR1:** O sistema deve autenticar usuárias via Magic Link (link único enviado por email pela Supabase Auth), expirando em 1 hora e de uso único.
- **FR2:** No MVP, o sistema deve permitir acesso de **uma única usuária** (Geovana). O cadastro de novas autoras é fora do escopo do MVP, sendo bloqueado por allowlist de email no nível da aplicação.
- **FR3:** O sistema deve manter sessão autenticada via cookie HttpOnly Supabase Auth, com renovação silenciosa enquanto a usuária estiver ativa.
- **FR4:** O sistema deve permitir logout explícito, encerrando a sessão e limpando os cookies.

**Editor e escrita**

- **FR5:** O sistema deve oferecer um editor de escrita rico com markdown invisível bidirecional (atalhos de teclado para negrito, itálico, cabeçalho, listas e bloco de citação), sem barra de formatação visível por padrão.
- **FR6:** O editor deve usar tipografia serifada cuidadosamente escolhida (decisão final em testes com Geovana), com tamanho de fonte e altura de linha otimizados para leitura prolongada.
- **FR7:** O sistema deve salvar o texto automaticamente (autosave) com debounce de 800ms, sem ação manual da usuária.
- **FR8:** O editor deve oferecer **modo zen** que oculta sidebar/menu durante a escrita; elementos de UI reaparecem ao mover o cursor do mouse ou tocar a tela em mobile.
- **FR9:** O sistema deve permitir criação de novo texto a partir de um botão único e visível, levando direto à tela de escrita com cursor pronto.

**Organização e arquivo**

- **FR10:** O sistema deve apresentar a lista de todos os textos da usuária em ordenação cronológica reversa (mais recentes primeiro), exibindo título, primeira frase e data de criação de cada item.
- **FR11:** Cada item da lista deve indicar discretamente o status do texto: privado (padrão) ou público.
- **FR12:** A usuária deve poder editar título e corpo de qualquer texto a qualquer momento; alterações são autossalvas com a mesma lógica de FR7.
- **FR13:** A usuária deve poder excluir um texto, com confirmação explícita; exclusão é permanente (sem lixeira no MVP).

**Privacidade e publicação**

- **FR14:** Todo texto criado deve nascer com status **privado** por padrão, sem opção de criar texto público diretamente.
- **FR15:** A ação "tornar público" deve estar disponível apenas em fluxo separado (após salvar), com confirmação explícita exibindo a URL final e mensagem clara sobre o que será exposto.
- **FR16:** O sistema deve auto-gerar um slug a partir do título do texto ao publicar; a usuária pode editar o slug antes de confirmar a publicação.
- **FR17:** A ação "despublicar" deve estar disponível em 1 clique (com confirmação), removendo o texto do índice público e fazendo a URL retornar 404.

**Páginas públicas**

- **FR18:** Cada texto público deve ter uma URL única no formato `escritosdageo.com.br/[slug]`, renderizada com tipografia idêntica à do editor, sem sidebar e sem comentários (no MVP).
- **FR19:** O sistema deve gerar uma imagem Open Graph dinâmica para cada página pública, otimizada para compartilhamento em redes sociais.
- **FR20:** A página `escritosdageo.com.br` (raiz) deve exibir o índice de textos públicos em ordenação cronológica reversa, contendo nome da autora, uma linha de descrição, e a lista de títulos + datas + primeiras frases — sem fotos ou bio extensa.
- **FR21:** As páginas públicas devem ser server-side rendered (SSR) para garantir SEO e tempo de carregamento mínimo.

**Exportação e segurança psicológica**

- **FR22:** A usuária deve poder exportar todos os seus textos em formato `.md` (Markdown), entregues como arquivo ZIP único e baixável a partir de uma ação na área de configurações.
- **FR23:** A exportação deve incluir metadados mínimos por texto (data de criação, data de publicação se aplicável, status).

**Responsividade**

- **FR24:** Toda a aplicação (editor, lista, páginas públicas) deve funcionar em browsers modernos de desktop e mobile, com layout responsivo otimizado para telas de 320px a 2560px de largura.

### Non Functional Requirements

**Performance**

- **NFR1:** O TTI (Time to Interactive) deve ser inferior a 2,0 segundos em conexão 4G simulada.
- **NFR2:** O FCP (First Contentful Paint) deve ser inferior a 1,0 segundo em conexão 4G simulada.
- **NFR3:** O CLS (Cumulative Layout Shift) deve ser inferior a 0,05 em todas as telas.
- **NFR4:** Lighthouse score deve ser ≥ 95 nas 4 categorias para todas as páginas públicas.
- **NFR5:** Latência percebida do autosave deve ser zero (debounce 800ms, salva em background).

**Acessibilidade**

- **NFR6:** A aplicação deve atender WCAG 2.1 nível AA — contraste, navegação por teclado, leitor de tela, `prefers-reduced-motion`.

**Segurança**

- **NFR7:** Toda comunicação deve ser via HTTPS, com HSTS habilitado.
- **NFR8:** O sistema deve usar Row-Level Security (RLS) no Supabase como segunda camada de autorização.
- **NFR9:** Markdown deve ser renderizado server-side com `rehype-sanitize` ou `DOMPurify` para prevenir XSS.
- **NFR10:** Rate limiting deve ser aplicado nas rotas públicas via Vercel Edge (limite inicial: 60 req/min por IP).
- **NFR11:** Magic links devem expirar em 60 minutos e ser de uso único.
- **NFR12:** Secrets devem ser armazenados exclusivamente em variáveis de ambiente Vercel.

**Privacidade e conformidade (LGPD)**

- **NFR13:** O sistema deve coletar dados pessoais mínimos: apenas e-mail e textos da usuária — sem analytics comportamental, sem cookies de tracking de terceiros.
- **NFR14:** O sistema deve oferecer exclusão completa de conta sob demanda da usuária, removendo todos os dados pessoais e textos do banco em até 30 dias.
- **NFR15:** Política de Privacidade e Termos de Uso devem estar publicados em linguagem clara em português brasileiro.
- **NFR16:** Observabilidade (Sentry) deve registrar apenas erros do servidor e nunca conteúdo de textos.

**Disponibilidade e confiabilidade**

- **NFR17:** A aplicação deve manter uptime ≥ 99,5%.
- **NFR18:** Backup automático do banco de dados deve ocorrer diariamente via Supabase, com retenção mínima de 7 dias.
- **NFR19:** O autosave deve funcionar mesmo em condições de conexão intermitente, com retry automático (máximo 3 tentativas, intervalo exponencial).
- **NFR20:** Não pode ocorrer perda de dados persistente: textos uma vez digitados e autossalvados devem permanecer recuperáveis.

**Custo operacional**

- **NFR21:** O custo de infraestrutura no MVP (1 usuária ativa) deve ser ≤ R$ 50/mês.
- **NFR22:** O custo por usuária ativa não pode exceder R$ 2,00/mês até a base atingir 100 usuárias.

**Compatibilidade**

- **NFR23:** A aplicação deve funcionar nas últimas 2 versões estáveis de Chrome, Safari, Firefox e Edge.
- **NFR24:** Suporte explícito a iOS Safari 16+ e Chrome Android 110+.

**Manutenibilidade**

- **NFR25:** Todas as migrações de banco devem ser versionadas em `supabase/migrations/` desde o dia 1.
- **NFR26:** Variáveis de ambiente sensíveis devem ser documentadas em `.env.local.example`.

**Internacionalização**

- **NFR27:** No MVP, a aplicação será exclusivamente em português brasileiro. Estrutura de strings deve permitir i18n futura sem refactor profundo.

---

## 3. User Interface Design Goals

### Overall UX Vision

A interface de **Escritos da Geo** é regida por uma única doutrina: **a página em branco é o produto**. Toda decisão de design parte da pergunta "isto serve à escrita ou a interrompe?". Elementos que não servem à escrita são removidos, escondidos ou empurrados para a periferia.

A experiência é **silenciosa, lenta e bonita**. Sem badges de notificação. Sem números de métrica visíveis. Sem call-to-action competindo por atenção. Sem onboarding tutorial. A usuária entra, escreve, sai. O app desaparece quando está fazendo seu trabalho — e reaparece com discrição quando solicitado.

**Estética visual:** tipografia serifada elegante como protagonista, espaço em branco generoso, paleta neutra-quente (papel, sépia leve, preto suave), zero ilustração decorativa, zero ícones supérfluos. Inspiração: Bear Blog, iA Writer, Are.na, Posthaven.

### Key Interaction Paradigms

- **Direct Writing** — Da home, 1 clique abre o editor com cursor pronto.
- **Modo Zen Automático** — UI periférica desaparece durante digitação; volta ao mover mouse/tocar tela.
- **Autosave Invisível** — Sem ícone "salvando...", só indicação discreta de vida do sistema.
- **Fricção Consciente para Publicar** — Fluxo separado com confirmação clara mostrando URL e implicações.
- **Navegação Linear** — Sidebar cronológica reversa. Sem busca, filtros ou categorias no MVP.
- **Atalhos para Power Users** — `Cmd+N`, `Cmd+P`, `Cmd+E`, `Esc`. Discoverable via tooltip.
- **Mobile como Espaço de Captura** — Otimizado para escrever em movimento; edição longa em desktop.

### Core Screens and Views

1. **Tela de Login (`/entrar`)** — Email + botão. Sem capa de marketing.
2. **Editor (`/escrever/[id]`)** — Tipografia centralizada, sidebar discreta, modo zen automático.
3. **Lista de Textos (`/textos`)** — Cronológica reversa, indicador de status, ação excluir no hover.
4. **Configurações (`/conta`)** — Identidade, exportação, encerrar sessão, excluir conta.
5. **Página Pública Individual (`escritosdageo.com.br/[slug]`)** — Renderização limpa, sem sidebar.
6. **Página Índice Pública (`escritosdageo.com.br`)** — Cronológica, nome + bio + lista.
7. **Confirmação de Publicação** — Dialog com URL, slug editável, confirmação dupla.
8. **Página de Erro 404** — Tela elegante e silenciosa.

### Accessibility: WCAG 2.1 AA

- Contraste mínimo 4.5:1 em texto e 3:1 em UI
- Navegação por teclado completa
- Suporte testado a VoiceOver e NVDA
- Respeito a `prefers-reduced-motion` e `prefers-color-scheme`
- Foco visual claro em todos os elementos interativos

### Branding

- **Fonte primária:** uma única fonte serifada (Lora / Source Serif 4 / Fraunces / EB Garamond — decisão pós-teste com Geovana). Self-hosted via `next/font`.
- **Fonte secundária:** mesma família em pesos diferentes, ou Inter neutro para UI funcional.
- **Paleta:** background papel (`#FAF7F2`), texto preto suave (`#1A1A1A`), acentos sépia/borgonha discretos.
- **Iconografia:** mínima, monoline, Lucide.
- **Espaço em branco:** generoso. Densidade visual baixa.
- **Sem logotipo gráfico** no MVP — marca é o nome em tipografia primária.
- **Tom de voz:** íntimo-sóbrio. Empty states e mensagens com cuidado autoral.

### Target Device and Platforms: Web Responsive

- Desktop primeiro (escrita longa), mobile como secundário funcional
- Sem app nativo no MVP; PWA na Fase 2
- Browsers: últimas 2 versões Chrome/Safari/Firefox/Edge, iOS Safari 16+, Chrome Android 110+

### Assumptions Explícitas a Validar com Geovana

| # | Assumption | Como validar |
|---|------------|--------------|
| 1 | Paleta neutra-quente | Mockup com 2 paletas (quente vs fria) |
| 2 | Tom íntimo-sóbrio | Listar 5-10 mensagens e ela escolhe variantes |
| 3 | Fonte serifada (qual exatamente) | Mockup com mesmo texto em 4 fontes |
| 4 | Sem logotipo gráfico | Confirmar preferência |
| 5 | Editor centralizado largura ~680px | Protótipo com 3 larguras |
| 6 | Mobile como secundário | Confirmar onde ela escreve mais |

---

## 4. Technical Assumptions

### Repository Structure: Monorepo (single project)

Monorepo simples — um único projeto Next.js. Sem turborepo, sem múltiplos packages.

```
escritos-da-geo/
├── app/                    ← Next.js App Router
│   ├── (privado)/          ← Editor, lista, configurações (auth required)
│   ├── (publico)/          ← /[slug], / (índice público)
│   ├── api/                ← Rotas mínimas (webhooks futuros)
│   ├── auth/               ← Login, callback magic link
│   └── layout.tsx
├── components/
├── lib/
│   ├── supabase/
│   ├── editor/
│   ├── db/
│   └── utils/
├── styles/
├── supabase/
│   └── migrations/
├── public/
├── .env.local.example
├── CLAUDE.md
└── package.json
```

### Service Architecture: Monolithic (single-tenant no MVP)

- Sem microserviços, sem workers, sem filas. Tudo no Vercel + Supabase.
- Server Actions para mutações privadas. Route Handlers para webhooks e OG image.
- Single-tenant no MVP, multi-tenant na Fase 2 com RLS por user e cadastro convite-only.

### Testing Requirements: Unit + Integration leve

| Tipo | Cobertura | Ferramenta |
|------|-----------|------------|
| Unit | Funções puras, validações, slug, sanitização | Vitest |
| Integration leve | Server Actions críticas | Vitest + Supabase local |
| Manual | Editor, modo zen, autosave, publicação | Checklist antes de deploy |
| E2E (Fase 2) | Fluxos críticos | Playwright |

### Additional Technical Assumptions and Requests

**Stack definitiva**

- Frontend: Next.js 16 (App Router) + React 19 + TypeScript estrito
- Estilização: Tailwind CSS 4 + shadcn/ui (seletivo)
- Editor: Tiptap (com markdown bidirecional invisível) — spike de comparação com Lexical antes de fechar
- Tipografia: 1 fonte serifada Google Font (decisão pós-teste com Geovana), self-hosted
- Backend: Server Actions + Route Handlers
- Database: Supabase PostgreSQL com migrations versionadas
- Auth: Supabase Auth — Magic Link only
- Hosting: Vercel (Hobby no MVP, Pro depois)
- Email: Supabase Auth nativo no MVP, Resend na Fase 2
- Analytics: Vercel Analytics (privacy-first), Plausible opcional
- Observabilidade: Sentry (free tier, apenas erros server-side)
- Domínio: `escritosdageo.com.br` via Registro.br

**Convenções de código**

- TypeScript estrito (`strict: true`, `noUncheckedIndexedAccess: true`)
- ESLint com Next.js config + `jsx-a11y`
- Prettier
- Conventional Commits
- Pre-commit hooks: lint + typecheck + format
- CI Vercel: preview deploy + type-check + lint bloqueando merge

**Restrições explícitas**

- ❌ Não usar: Redux, MobX, Zustand
- ❌ Não usar: ORM (Prisma, Drizzle) — clientes Supabase + queries explícitas
- ❌ Não usar: GraphQL
- ❌ Não usar: Storybook no MVP
- ❌ Não integrar: Google Analytics, Mixpanel, Amplitude (viola posicionamento)

**Decisões delegadas ao `@architect`**

- Esquema final do banco
- Estratégia de cache (Cache Components Next 16, ISR ou full SSR por rota)
- Implementação de OG image dinâmica
- Fluxo exato de magic link (template, copy)
- Estrutura final de pastas dentro de `(privado)` e `(publico)`
- DNS e configuração de subdomínios para Fase 2

---

## 5. Epic List

### Epic 1 — Fundação, Identidade Estética e Login

> Estabelecer infraestrutura (Vercel, Supabase, domínio, CI), implementar autenticação Magic Link funcional para Geovana, e renderizar a primeira tela "casa" minimalista vazia já com tipografia, paleta e tom-de-voz definitivos — entregando o ethos visual do produto desde o primeiro deploy.

**Critérios MVP que valida:** base para todos os demais. Entregável: Geovana faz login e vê o santuário vazio dela.

### Epic 2 — Escrita Privada e Arquivo Pessoal

> Implementar o coração do produto: editor minimalista com markdown invisível, autosave, modo zen, lista cronológica de textos, exportação em Markdown, e configurações mínimas — entregando a experiência completa de escrita privada que substitui o caderno físico no uso diário.

**Critérios MVP que valida:** #1, #2, #3, #5, #6.

### Epic 3 — Publicação Pública e Saída Opt-In

> Implementar o caminho consciente para tornar texto público: fluxo de publicação com fricção deliberada, slug auto-gerado e editável, página pública individual com SSR e Open Graph dinâmico, índice público em `escritosdageo.com.br`, e despublicação reversível — entregando a ponte entre escrita íntima e leitor escolhido.

**Critérios MVP que valida:** #4. Completa a tese de produto.

---

## 6. Epic Details

# Epic 1 — Fundação, Identidade Estética e Login

### Expanded Goal

Estabelecer toda a infraestrutura técnica e a identidade visual fundacional do produto: repositório versionado, ambiente de desenvolvimento local, deploy contínuo em Vercel, banco Supabase configurado com migrations versionadas, autenticação Magic Link funcional restrita a Geovana via allowlist, e a primeira "casa" autenticada renderizando a tipografia e paleta definitivas. Ao final deste epic, Geovana faz login no app deployado em domínio próprio e vê uma tela vazia esteticamente acabada — provando que o ethos visual e a infra técnica estão sólidos antes de qualquer feature de escrita.

### Story 1.1 — Bootstrap do Projeto e Deploy Inicial

**As a** Lucas (desenvolvedor solo),
**I want** inicializar o projeto Next.js 16 com TypeScript estrito, Tailwind 4, ESLint, Prettier e fazer o primeiro deploy no Vercel,
**so that** exista uma base técnica versionada, lintada e deployada antes de qualquer linha de código de produto.

#### Acceptance Criteria

1. Repositório Git inicializado em `~/Projetos/escritos-da-geo` com primeiro commit contendo `README.md` e `.gitignore`.
2. Projeto Next.js 16 com App Router configurado, TypeScript estrito (`strict: true`, `noUncheckedIndexedAccess: true`).
3. Tailwind CSS 4 configurado com `tailwind.config.ts` e `globals.css` importado em `app/layout.tsx`.
4. ESLint configurado com preset `next/core-web-vitals` + `eslint-plugin-jsx-a11y`. Prettier integrado.
5. Pre-commit hook (lefthook ou husky) executa `lint` + `typecheck` + `format`.
6. Repositório conectado ao Vercel; deploy automático na branch `main` retorna HTTP 200.
7. Página inicial renderiza placeholder textual `"Escritos da Geo — em construção"`.
8. `.env.local.example` com lista de variáveis previstas.
9. `CLAUDE.md` na raiz com instruções iniciais para AI agents.

### Story 1.2 — Setup do Supabase e Migrations Versionadas

**As a** Lucas,
**I want** configurar projeto Supabase, integrar cliente no Next.js e estabelecer fluxo de migrations versionadas desde o dia 1,
**so that** toda alteração de schema esteja rastreada e haja banco pronto para receber as próximas stories.

#### Acceptance Criteria

1. Projeto Supabase criado (free tier), `Project URL` e `service_role_key` documentados em `.env.local.example`.
2. Pacotes `@supabase/supabase-js` e `@supabase/ssr` instalados.
3. Clientes Server Components/Server Actions (`lib/supabase/server.ts`) e browser (`lib/supabase/browser.ts`) implementados.
4. Pasta `supabase/migrations/` criada com `0001_initial_setup.sql` (extensões, schema base).
5. Script `npm run db:migrate` configurado.
6. Cliente admin (`lib/supabase/admin.ts`) usando `service_role_key` apenas server-side, com aviso explícito.
7. Variáveis de ambiente configuradas no Vercel (production e preview).
8. Endpoint `/api/health` verifica conectividade Supabase, retorna `{ ok: true }` ou 503.

### Story 1.3 — Identidade Visual Fundacional

**As a** Geovana (usuária-âncora),
**I want** que toda página, mesmo as vazias, transmita o ethos visual definitivo do produto,
**so that** desde o primeiro acesso eu reconheça que este é o santuário construído para mim.

#### Acceptance Criteria

1. Fonte serifada primária (default: Lora) carregada via `next/font` self-hosted.
2. Tokens de cor: background papel (`#FAF7F2`), texto preto suave (`#1A1A1A`), acentos sépia.
3. `app/layout.tsx` com fonte global, background neutro-quente, meta tags básicas.
4. Componente `<Container>` com largura máxima ~680px, centralização e padding responsivo.
5. Tipografia base estilizada: `h1`-`h4`, parágrafo, link, blockquote.
6. `prefers-reduced-motion` respeitado em transições.
7. `app/page.tsx` renderiza "Escritos da Geo" centralizado em tipografia primária.
8. Lighthouse ≥ 90 em Performance, Accessibility, Best Practices.

### Story 1.4 — Magic Link Authentication com Allowlist

**As a** Geovana (única usuária do MVP),
**I want** entrar no app digitando meu email e clicando em um link enviado para minha caixa de entrada,
**so that** eu acesse meu santuário sem precisar lembrar de senhas.

#### Acceptance Criteria

1. Página `/entrar` com formulário minimalista (email + botão "enviar link").
2. Server Action invoca `supabase.auth.signInWithOtp` com `emailRedirectTo` para `/auth/callback`.
3. Allowlist via `ALLOWED_EMAIL` env var: apenas Geovana recebe magic link; outros emails recebem mensagem genérica de sucesso sem envio.
4. Estado de confirmação pós-submissão em tom íntimo-sóbrio.
5. `/auth/callback` consome token, troca por sessão, redireciona para `/`. Erro → `/entrar?erro=link-invalido`.
6. Magic link expira em 1h, single-use.
7. Sessão em cookie HttpOnly, Secure, SameSite=Lax, com renovação silenciosa.
8. Logout disponível na Story 1.5.
9. Acesso a rota autenticada sem sessão → redireciona para `/entrar`.
10. Sem cadastro aberto: nenhuma tela de "criar conta" no MVP.

### Story 1.5 — Tela "Casa" Autenticada (Canary Visível)

**As a** Geovana (recém-autenticada),
**I want** ver uma tela inicial silenciosa, bonita e vazia ao entrar no app,
**so that** eu sinta que este é o meu espaço pronto para receber minha primeira escrita.

#### Acceptance Criteria

1. Rota `/` (raiz autenticada) protegida; sem sessão → `/entrar`.
2. Header minimalista: nome "Escritos da Geo" à esquerda + ícone "sair" à direita.
3. Empty state em tom íntimo-sóbrio: *"Você ainda não escreveu nada aqui. Comece."*
4. Botão "escrever" abaixo (placeholder leva a `/escrever`, implementado em Epic 2).
5. Click em "sair" executa logout e redireciona para `/entrar`.
6. Layout responsivo: 375px+ a 1280px+.
7. Lighthouse ≥ 95 em Performance, Accessibility, Best Practices.
8. Domínio `escritosdageo.com.br` configurado no Vercel (validar registro antes desta story).
9. Sentry integrado capturando erros server-side.
10. Vercel Analytics habilitado (privacy-first).

---

# Epic 2 — Escrita Privada e Arquivo Pessoal

### Expanded Goal

Implementar o coração do produto: experiência completa de escrita privada que substitui o caderno físico no uso ritualístico diário. Geovana abre o app, escreve em editor minimalista com markdown invisível, vê seus textos salvos automaticamente, navega pelo arquivo cronológico, exporta tudo a qualquer momento, e tudo isso em modo zen que apaga a UI durante a escrita. Ao final deste epic, o produto valida 5 dos 6 critérios de sucesso do MVP — falta apenas a publicação pública (Epic 3). Geovana já pode usar diariamente.

### Story 2.1 — Schema de Dados para Textos e RLS

**As a** Lucas,
**I want** definir a estrutura de dados para textos com migration versionada, RLS habilitado, e types TypeScript gerados,
**so that** as próximas stories tenham fundação de dados sólida e segura.

#### Acceptance Criteria

1. Migration `0002_create_texts_table.sql` define tabela `texts`: `id` (uuid PK), `user_id` (uuid FK auth.users), `title` (text), `body_markdown` (text), `body_html` (text), `slug` (text nullable, unique), `status` (enum 'private'|'public'), `published_at` (timestamptz nullable), `created_at`, `updated_at`.
2. Trigger `update_updated_at` aplicado.
3. Índices: `user_id`, `(user_id, created_at DESC)`, `(slug, status)` unique parcial onde public.
4. RLS habilitado: SELECT (próprio + textos público lidos sem auth), INSERT (`user_id = auth.uid()`), UPDATE/DELETE (próprio).
5. Migration `0003_create_profiles_table.sql`: `id` (PK FK auth.users), `display_name`, `bio`, timestamps. RLS: leitura pública, escrita própria.
6. Trigger `handle_new_user` cria registro em `profiles` automaticamente.
7. Types TypeScript gerados via `supabase gen types typescript` em `lib/supabase/database.types.ts`.
8. `npm run db:migrate` aplica sem erros em local.
9. Reexports ergonômicos em `lib/types.ts`.

### Story 2.2 — Criar Texto e Editor Tiptap Minimalista

**As a** Geovana,
**I want** clicar em "escrever" e cair em uma tela de editor onde posso digitar livremente com markdown invisível,
**so that** eu possa começar a escrever imediatamente, sem fricção.

#### Acceptance Criteria

1. `/escrever` cria registro vazio em `texts` (Server Action) e redireciona para `/escrever/[id]`.
2. `/escrever/[id]` carrega texto via RLS e renderiza editor Tiptap.
3. Tiptap configurado com extensões mínimas: Document, Paragraph, Text, Bold, Italic, Heading (h1-h3), BulletList, OrderedList, Blockquote, HardBreak.
4. Markdown bidirecional invisível: digitar `**negrito**`, `_itálico_`, `# título`, `> citação`, `- lista` renderiza visualmente sem mostrar sintaxe.
5. Atalhos de teclado padrão: `Cmd/Ctrl+B`, `Cmd/Ctrl+I`, `Cmd/Ctrl+Shift+1/2/3`.
6. Sem barra de formatação visível por padrão.
7. Tipografia primária, ~18-20px desktop / ~17-19px mobile, line-height 1.6-1.8.
8. Largura máxima ~680px centralizada.
9. Campo de título acima do corpo com placeholder *"Sem título"*; mudança de foco persiste no banco.
10. Botão "Salvar" temporário (será removido na Story 2.3) — Server Action persiste `body_markdown` + `body_html` (renderizado server-side).
11. Conteúdo sanitizado server-side com `rehype-sanitize`.

### Story 2.3 — Autosave Invisível com Debounce

**As a** Geovana,
**I want** que o texto seja salvo automaticamente enquanto eu escrevo,
**so that** eu nunca perca conteúdo e meu fluxo não seja interrompido.

#### Acceptance Criteria

1. Autosave com debounce de 800ms desde a última alteração.
2. Server Action persiste `title`, `body_markdown`, `body_html`, atualiza `updated_at`.
3. Botão "Salvar" da Story 2.2 removido.
4. Indicador visual mínimo (reticência ou ponto pulsante), sem texto "salvando...".
5. Retry automático com backoff exponencial (1s, 2s, 4s) em falha de rede.
6. `beforeunload` força flush pendente.
7. Latência percebida zero (background, sem bloquear UI).
8. Teste de integração: digitar 100 caracteres, esperar 1s, verificar persistência.
9. Logs de falha em console + Sentry (sem conteúdo, só metadata).

### Story 2.4 — Lista Cronológica de Textos com Navegação

**As a** Geovana,
**I want** ver todos os meus textos em lista cronológica, navegar com 1 clique, e excluir os que não quero mais,
**so that** o app vire a estante onde meu arquivo vive.

#### Acceptance Criteria

1. `/textos` (autenticada) renderiza lista cronológica reversa via Server Component + RLS.
2. Cada item: título (ou *"Sem título"*), primeira frase (~120 chars desformatado), data relativa brasileira (*"hoje", "ontem"*).
3. Indicador discreto: privado sem ícone, público com `•` em cor de acento.
4. Click navega para `/escrever/[id]`.
5. Botão "escrever" no topo cria novo texto.
6. Hover revela ação "excluir" (ícone Trash) à direita.
7. Click em "excluir" abre Dialog: *"Tem certeza que quer apagar este texto? Isto não pode ser desfeito."*
8. Confirmação invoca Server Action que remove registro.
9. Lista atualiza via `revalidatePath`.
10. Empty state: *"Você ainda não escreveu nada. Comece."* + botão "escrever".
11. Layout responsivo (1 ou 2-3 colunas).
12. Home (Story 1.5) atualizada: 3-5 mais recentes + link "ver tudo" → `/textos`.

### Story 2.5 — Modo Zen (Auto-Fade da UI Periférica)

**As a** Geovana,
**I want** que a UI ao redor do editor desapareça automaticamente quando eu começo a digitar,
**so that** eu fique imersa na escrita sem distrações.

#### Acceptance Criteria

1. `keydown` no campo de digitação dispara entrada em modo zen.
2. Modo zen: header, indicador autosave e periféricos com `opacity: 0` em transição de 1-2s.
3. Saída: `mousemove` ou `touchstart` retorna `opacity: 1` em 300ms.
4. Comportamento natural: parar de digitar + mover mouse = sai; voltar a digitar = volta após 2s contínuos.
5. Atalho `Esc` toggle manual; tooltip discoverable.
6. Mobile: zen entra após 3s sem touch com teclado virtual ativo; toque retorna UI.
7. `prefers-reduced-motion`: transições reduzidas para 0ms.
8. NÃO esconde: campo de texto, cursor, título, indicador de autosave.
9. Estado local ao componente, não persistido.
10. Teste manual desktop e mobile sem oscilações.

### Story 2.6 — Configurações, Exportação Markdown e Exclusão de Conta

**As a** Geovana,
**I want** uma tela única de configurações onde edito identidade, exporto meus textos em Markdown, e (em fluxo separado) excluo minha conta,
**so that** eu tenha controle total e segurança psicológica de poder sair quando quiser.

#### Acceptance Criteria

1. `/conta` renderiza tela mínima com 3 seções: Identidade, Arquivo, Conta.
2. **Identidade**: campos `display_name` e `bio`, salvar via Server Action atualizando `profiles`.
3. **Arquivo**: botão *"Exportar todos os meus textos (.md)"* gera ZIP com:
   - 1 arquivo `.md` por texto, nomeado `[YYYY-MM-DD]-[slug-ou-id].md`
   - Frontmatter YAML: `title`, `created_at`, `updated_at`, `published_at`, `status`
   - Conteúdo markdown puro
   - `INDEX.md` listando todos
4. Download via streaming response, nome `escritos-da-geo-[YYYY-MM-DD].zip`.
5. **Conta**: botão "Encerrar sessão" (logout) + link discreto "excluir minha conta".
6. "Excluir conta" abre `/conta/excluir` com confirmação dupla:
   - Texto explicativo
   - Campo onde digita `EXCLUIR MINHA CONTA` para habilitar botão
   - Botão final destrutivo + cancelar
7. Confirmação executa Server Action: deleta textos, perfil, encerra sessão, remove auth user. Redireciona para `/entrar` com mensagem.
8. `/conta` requer autenticação.
9. Header da home e da lista ganha link discreto para `/conta` (ícone Settings ou nome clicável).
10. Layout responsivo, tipografia consistente, tom íntimo-sóbrio.

---

# Epic 3 — Publicação Pública e Saída Opt-In

### Expanded Goal

Implementar a ponte deliberada entre escrita íntima e leitor escolhido. Geovana ganha a capacidade de tornar um texto público com fricção consciente (não impulso), publicado em URL própria com renderização SSR otimizada para SEO e compartilhamento social. O índice público em `escritosdageo.com.br` serve como vitrine cronológica curada da obra dela. Despublicar é tão simples quanto publicar — devolvendo controle total. Ao final deste epic, o produto está completo para o teste MVP de 90 dias e valida o critério #4 (pelo menos 1 publicação pública voluntária).

### Story 3.1 — Slug Generator e Server Actions de Publicar/Despublicar

**As a** Lucas,
**I want** funções utilitárias para gerar slugs únicos e Server Actions transacionais para publicar/despublicar,
**so that** o fluxo público tenha base lógica sólida antes de implementar UI.

#### Acceptance Criteria

1. `generateSlug(title)` em `lib/utils/slug.ts`: normaliza acentos, lowercase, hifens, remove não-alfanuméricos, trunca em 80 chars preservando palavras. Vazio → `texto-${shortId}`.
2. `ensureUniqueSlug(baseSlug, excludeId?)` em `lib/db/texts.ts`: append `-2`, `-3` em conflito; `excludeId` evita conflito consigo mesmo.
3. Server Action `publishText(textId, customSlug?)`: verifica ownership, gera/usa slug, garante unicidade, atualiza `status='public'`, `slug`, `published_at`, revalida `/`, `/[slug]`, `/textos`. Retorna `{ ok, slug, url }` ou `{ ok: false, error }`.
4. Server Action `unpublishText(textId)`: ownership, atualiza `status='private'`, `published_at=null` (mantém slug histórico), revalida.
5. Testes Vitest cobrindo `generateSlug` (acentos, símbolos, vazios, longos, idênticos).
6. Teste de integração: criar, publicar, query slug retorna; despublicar, query retorna null.
7. Validação Zod nos inputs (UUID, slug regex).

### Story 3.2 — Fluxo de Publicação com Fricção Consciente

**As a** Geovana,
**I want** que tornar texto público seja ação separada e consciente, com confirmação clara,
**so that** eu nunca publique por impulso ou acidente.

#### Acceptance Criteria

1. Editor exibe botão "publicar" flutuante quando `title` e `body_markdown` não-vazios.
2. Click abre Dialog:
   - Título: *"Este texto vai sair do silêncio."*
   - Texto: *"Vai para o endereço abaixo. Qualquer pessoa com o link poderá ler. Você pode despublicar a qualquer momento."*
   - URL prevista: `escritosdageo.com.br/[slug]`
   - Campo editável de slug com validação visual
   - Botões: "publicar" (primário) / "voltar"
3. Submissão invoca `publishText` (Story 3.1).
4. Sucesso: dialog fecha, Toast íntimo *"Está publicado em escritosdageo.com.br/[slug]"* com link copiável.
5. Erro: mensagem clara dentro do dialog, sem fechar.
6. Indicador de status muda para "público" no editor e na lista.
7. Texto público exibe botão "despublicar" no editor, abre dialog: *"Despublicar este texto? O link deixa de funcionar."*
8. Confirmação invoca `unpublishText`, com Toast.
9. Edição de texto público autossalva normalmente; alterações propagam para página pública após `revalidatePath`.
10. Atalho `Cmd/Ctrl+Shift+P` abre dialog de publicação (tooltip discoverable).

### Story 3.3 — Página Pública Individual com SSR

**As a** leitora pública,
**I want** abrir `escritosdageo.com.br/[slug]` e ler em página limpa, bonita e otimizada,
**so that** eu tenha experiência de leitura que respeita a obra.

#### Acceptance Criteria

1. `app/(publico)/[slug]/page.tsx` Server Component.
2. Query Supabase server-side por slug onde `status='public'`. Não encontrado → `notFound()`.
3. Renderiza:
   - Cabeçalho: nome da autora linkando para `/`
   - Título (h1, tipografia primária destacada)
   - Data de publicação extensa (*"publicado em 15 de junho de 2026"*)
   - Corpo a partir de `body_html` sanitizado
   - Sem sidebar, sem comentários, sem botões
4. Tipografia/paleta/largura ~680px consistentes com editor.
5. Meta tags otimizadas: `<title>`, `description`, `og:*`, `twitter:card`, JSON-LD Article.
6. SSR confirmado (HTML completo no view-source).
7. Lighthouse ≥ 95 em todas as 4 categorias.
8. Cache: Next.js Cache Components ou `revalidate` apropriado, invalidação via `revalidatePath`.
9. WCAG 2.1 AA validado.
10. Responsivo mobile + desktop.

### Story 3.4 — Open Graph Image Dinâmica

**As a** leitora pública compartilhando o link,
**I want** que a prévia mostre imagem bonita e identificável,
**so that** a partilha respeite a estética e atraia leitura genuína.

#### Acceptance Criteria

1. `app/(publico)/[slug]/opengraph-image.tsx` usa `@vercel/og` para gerar 1200x630.
2. Design: background neutro-quente, fonte primária embedded, título centralizado + assinatura *"escritos da geo"* no rodapé.
3. Imagem cacheada na edge.
4. Meta tag `og:image` aponta para esta rota.
5. Validação manual em WhatsApp e Twitter.
6. Fallback sem título: primeira frase truncada em ~80 chars.
7. Performance: < 500ms na geração, < 50ms cached.

### Story 3.5 — Página Índice Público

**As a** leitora pública chegando ao domínio raiz,
**I want** ver lista cronológica calma de todos os textos públicos da autora,
**so that** eu explore a obra sem algoritmo, em ordem natural do tempo.

#### Acceptance Criteria

1. `app/(publico)/page.tsx` Server Component.
2. Query Supabase: textos `status='public'` ordenados `published_at DESC`.
3. Renderiza:
   - Cabeçalho: `display_name` em tipografia primária + `bio` discreto
   - Lista cronológica: título (link), data relativa, primeira frase
   - Rodapé minimalista: link RSS placeholder, copyright
4. Sem fotos, sem capa, sem CTA. Texto puro.
5. Empty state: *"Ainda em silêncio."*
6. Meta tags raiz: `<title>Escritos da Geo</title>`, description, `og:*` com imagem padrão.
7. SSR confirmado, Lighthouse ≥ 95.
8. `app/sitemap.ts` gera sitemap incluindo raiz + todas as URLs públicas.
9. `app/robots.ts`: permite indexação públicas, bloqueia `/escrever`, `/conta`, `/textos`, `/auth`.
10. Atualização dinâmica via `revalidatePath('/')` ao publicar/despublicar.

### Story 3.6 — Pre-Launch Polish e Smoke Tests

**As a** Lucas,
**I want** rodada de polimento, testes de fumaça e auditoria antes de entregar para Geovana,
**so that** o lançamento ocorra sem bugs óbvios e com a qualidade prometida.

#### Acceptance Criteria

1. Auditoria Lighthouse nas 7 telas críticas: ≥ 90 todas categorias; públicas ≥ 95.
2. Página 404 customizada (`app/not-found.tsx`) em tom íntimo-sóbrio.
3. Smoke test manual em `docs/smoke-test.md` cobrindo: login, allowlist, CRUD texto, modo zen, publicar/despublicar, export, logout.
4. Política de Privacidade e Termos de Uso publicados em pt-BR (LGPD-aware), links discretos no rodapé.
5. Health check estendido em `/api/health` (Supabase + storage + auth).
6. Sentry confirmado em produção (teste com erro proposital).
7. Vercel Analytics confirmado coletando page views sem cookies.
8. Backup script local: `npm run backup:local` baixa export Markdown completo (Lucas executa semanal).
9. Variáveis de ambiente production auditadas.
10. Domínio `escritosdageo.com.br` com SSL válido, redirect www, DNS propagado.
11. `CLAUDE.md` atualizado com instruções pós-MVP para AI agents.
12. Tag `v1.0.0-mvp` no Git.
13. Comunicação para Geovana preparada (email/mensagem com link e instruções).

---

## 7. Checklist Results Report

> *Resumo preliminar dos critérios mais importantes. PM Checklist completo a ser executado formalmente após validação com Geovana.*

| Critério | Status | Observação |
|----------|--------|------------|
| Goals derivados do brief sem redundância | ✅ Aprovado | 8 goals SMART alinhados |
| Requirements (FR + NFR) cobrem MVP scope | ✅ Aprovado | 24 FRs + 27 NFRs |
| UI Goals capturam visão sem virar spec detalhado | ✅ Aprovado | 6 assumptions explícitas |
| Technical Assumptions são constraints claros | ✅ Aprovado | Stack definida, decisões delegadas marcadas |
| Epics são logicamente sequenciais e deployáveis | ✅ Aprovado | 3 epics, slice vertical cada |
| Stories têm tamanho de "junior dev 2-4h" | ✅ Aprovado | 17 stories totais (5 + 6 + 6) |
| Stakeholder validation completa | ⚠️ **PENDENTE** | Geovana ainda não validou brief nem PRD |
| CodeRabbit quality gates embedded | ⚠️ **PENDENTE** | A definir com `@architect` em CI config |

---

## 8. Next Steps

### UX Expert Prompt

> Aria (`@architect` em modo UX/Design), por favor revise este PRD com foco em **fluxo de interação** e **arquitetura de informação** das 7 telas centrais. Seu output deve ser `docs/ux-spec.md` contendo: wireframes conceituais (low-fi) das 7 telas, fluxo completo de publicação (estados visuais antes/durante/depois), comportamento detalhado do modo zen em desktop e mobile, e definição final de tokens de design (paleta, tipografia, espaçamento, componentes shadcn). **Atenção crítica à Seção 3 (UI Design Goals) — 6 assumptions explícitas a validar com Geovana.**

### Architect Prompt

> Aria (`@architect`), por favor use este PRD como entrada para criar `docs/architecture.md` cobrindo: schema completo do banco com migrations propostas, estrutura de pastas final do Next.js App Router, estratégia de cache (Cache Components Next 16 vs ISR vs full SSR por rota), implementação detalhada do autosave com debounce e retry, integração Tiptap + sanitização markdown, configuração CSP e RLS policies, plano de migração single → multi-tenant para Fase 2, e ADRs (Architecture Decision Records) para as 5-7 decisões mais relevantes. **Atenção à Seção 4 (Technical Assumptions) — decisões já travadas vs decisões delegadas a você.**

---

*PRD gerado por Morgan (`@pm`) em modo Interactive (Seções 1-6 stories 1-2.6) + YOLO (resto), seguindo template AIOX `prd-tmpl.yaml v2.0`. Próximo handoff: `@architect` (Aria) para criação do documento de arquitetura.*
