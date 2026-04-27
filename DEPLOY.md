# Deploy — Escritos da Geo

Guia passo a passo pra subir o app: **Supabase ARLIA → Vercel**.

---

## 1. Supabase ARLIA

> **Status atual**: schema `escritos` JÁ FOI APLICADO no projeto ARLIA (`kodzqdvrthkxyafbrroo`). Tabelas, triggers, RLS e buckets prontos. Falta o passo manual de exposição do schema + criar user.

### 1.1 Schema (já aplicado)

O schema `escritos` foi criado dentro do projeto ARLIA pra coexistir com as outras apps do banco (trafia, ss\_\*, arlbrief\_\*, etc.) sem conflitar com a função `handle_new_user` do trafia.

Estrutura:

- **Schema Postgres**: `escritos`
- **Tabelas**: `escritos.profiles`, `escritos.texts`, `escritos.wall_items`
- **Enums**: `escritos.text_status`, `escritos.wall_item_status`
- **Trigger em auth.users**: `on_auth_user_created_escritos` chama `escritos.handle_new_escritos_user` (auto-cria profile)
- **Buckets**: `escritos-wall-images` (privado, 5 MB), `escritos-avatars` (público, 2 MB)
- **RLS** ativa em todas as tabelas + storage policies por bucket prefixado

Re-aplicar (idempotente): cole [`deploy/SCHEMA.sql`](./deploy/SCHEMA.sql) no SQL Editor.

### 1.2 Expor schema na API ⚠️ **OBRIGATÓRIO**

O cliente Supabase (PostgREST) só enxerga schemas explicitamente expostos:

1. Dashboard ARLIA → **Settings** → **API**
2. **Exposed schemas**: adicionar `escritos`
   ```
   public, graphql_public, escritos
   ```
3. **Save** — PostgREST recarrega automaticamente

Sem esse passo, qualquer query de `from('profiles')` retorna erro 404.

### 1.3 Criar usuário inicial

1. Dashboard ARLIA → **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `lucas@arltech.emp.br` (ou o que vai pra `ALLOWED_EMAIL`)
3. Password: senha forte
4. **Auto Confirm User: ON**
5. **Create user**

O trigger `on_auth_user_created_escritos` cria o profile automaticamente em `escritos.profiles` com `display_name='Geovana'`.

### 1.4 Provider de email

1. Dashboard ARLIA → **Authentication** → **Providers** → **Email**
2. Habilitado
3. **Confirm email**: deixar OFF pra MVP

### 1.5 Credenciais (já coletadas via MCP)

| Variável                        | Valor / onde encontrar                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://kodzqdvrthkxyafbrroo.supabase.co`                                                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard → Settings → API → "Project API keys" → **anon public** (legacy ou novo `sb_publishable_*`) |
| `SUPABASE_SERVICE_ROLE_KEY`     | Mesma página → **service_role** (clique "Reveal") ⚠️ **secreta**                                      |
| `ALLOWED_EMAIL`                 | mesmo email cadastrado no passo 1.3                                                                   |

---

## 2. Vercel

### 2.1 Importar repo

1. Vercel dashboard → **Add New** → **Project** → **Import Git Repository**
2. Selecione `arltech/esctritosdageo`
3. **Framework Preset**: Next.js (auto-detectado)
4. **Root Directory**: `./`

### 2.2 Environment Variables

Antes de Deploy, adicione (Production, Preview, Development):

| Nome                            | Valor                                           |
| ------------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://kodzqdvrthkxyafbrroo.supabase.co`      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key do dashboard                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | service_role do dashboard (**Production only**) |
| `ALLOWED_EMAIL`                 | `lucas@arltech.emp.br` (ou seu email)           |

### 2.3 Deploy

1. **Deploy** — build leva ~2-3 min
2. URL provisória: `escritos-da-geo-{hash}.vercel.app`

### 2.4 Domínio (opcional)

**Settings → Domains** → adicionar domínio próprio.

---

## 3. Verificação pós-deploy

- [ ] Landing carrega com hero "Escritos da Geo"
- [ ] `/entrar` aceita email/senha
- [ ] Pós-login → `/casa`
- [ ] `/escrever` abre editor com toolbar superior
- [ ] Salvar entrada cria registro em `escritos.texts` (Table Editor → schema escritos)
- [ ] Upload de foto cria `escritos.wall_items` + arquivo em bucket `escritos-wall-images`
- [ ] `/escritas` lista entradas
- [ ] Toggle público gera slug, `/p/[slug]` carrega anonimamente

---

## 4. Atualizações futuras

### Schema changes

1. Crie `supabase/migrations/00XX_descricao.sql` (local) com prefixo de schema: `create table escritos.X` etc.
2. Aplique manualmente em ARLIA via SQL Editor OU via MCP `apply_migration`
3. Atualize `deploy/SCHEMA.sql` consolidado se for relevante
4. Commit + push → Vercel rebuilda

### Env vars novas

- Adicione em `.env.local.example`
- Adicione em **Vercel → Settings → Environment Variables**

---

## Troubleshooting

**`relation "public.profiles" does not exist`**: você esqueceu de expor `escritos` em Settings → API → Exposed schemas (passo 1.2).

**Build falha com "rehype-sanitize"**: confirme `pnpm-lock.yaml` commitado e Vercel detectou pnpm.

**Login retorna "Email ou senha incorretos"**: confirme `ALLOWED_EMAIL` na Vercel = email do user no Supabase.

**Upload 401**: confirme `SUPABASE_SERVICE_ROLE_KEY` em Production.

**Storage policy não aplicada**: schema usa `drop policy if exists` antes de criar — re-rodar o SQL é seguro.

**RLS bloqueando insert**: verificar policies em `escritos.texts` etc.:

```sql
select * from pg_policies where schemaname = 'escritos';
```
