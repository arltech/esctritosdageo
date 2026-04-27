# Deploy — Escritos da Geo

Guia passo a passo pra subir o app: **Supabase (ARLIA) → Vercel**.

---

## 1. Supabase (projeto ARLIA)

### 1.1 Criar projeto

1. Entre no Supabase dashboard com a conta ARLIA
2. **New project** → nome `escritos-da-geo` → região mais próxima (ex.: `us-east-1`) → senha forte do Postgres
3. Aguarde provisionar (~2 min)

### 1.2 Aplicar schema

1. No projeto criado: **SQL Editor** → **New query**
2. Cole o conteúdo INTEIRO de [`deploy/SCHEMA.sql`](./deploy/SCHEMA.sql)
3. **Run** — deve completar sem erros (todas as instruções são idempotentes)

O schema cria:

- Tabelas: `profiles`, `texts`, `wall_items`
- Enums: `text_status`, `wall_item_status`
- Indexes (incluindo GIN em `tags` e parciais em `status='public'` / `on_home=true`)
- Triggers: `handle_new_user` (auto-cria profile) e `set_updated_at`
- RLS policies em todas as tabelas (owner-only + public selects condicionais)
- Storage buckets: `wall-images` (privado, 5 MB) e `avatars` (público, 2 MB)
- Storage policies por bucket

### 1.3 Criar usuário inicial

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `lucas@arltech.emp.br` (ou o que vai pra `ALLOWED_EMAIL`)
3. Password: senha forte
4. **Auto Confirm User: ON** (senão precisa de email confirmation flow)
5. **Create user**

O trigger `handle_new_user` cria o profile automaticamente com `display_name='Geovana'`.

### 1.4 Configurar provider de auth

1. **Authentication** → **Providers** → **Email**
2. Garanta que está habilitado
3. **Confirm email**: pode deixar OFF pra MVP (ou ON se quiser flow de confirmação)

### 1.5 Coletar credenciais

1. **Project Settings** → **API**
2. Copie:
   - **Project URL** → vai em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (clique em "Reveal") → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **secreta**

Guarde — vai usar na Vercel.

---

## 2. Vercel

### 2.1 Importar repo

1. Entre na Vercel dashboard
2. **Add New** → **Project** → **Import Git Repository**
3. Selecione `arltech/esctritosdageo`
4. **Framework Preset**: Next.js (auto-detectado)
5. **Root Directory**: `./` (default)

### 2.2 Environment Variables

Antes de clicar Deploy, abra **Environment Variables** e adicione:

| Nome                            | Valor                     | Onde                             |
| ------------------------------- | ------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do passo 1.5          | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key do passo 1.5     | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY`     | service_role do passo 1.5 | **Production only** (sensível)   |
| `ALLOWED_EMAIL`                 | `lucas@arltech.emp.br`    | Production, Preview, Development |

> **Não setar agora** (opcional): `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`. Adicione quando integrar Sentry.

### 2.3 Deploy

1. Clique **Deploy**
2. Acompanhe o build (~2-3 min)
3. URL provisória: `escritos-da-geo-{hash}.vercel.app`

### 2.4 Domínio (opcional)

- **Settings** → **Domains** → adicionar domínio próprio
- Configurar DNS conforme instruções

---

## 3. Verificação pós-deploy

Acesse o domínio e:

- [ ] **Landing** carrega com hero "Escritos da Geo" + post-it
- [ ] `/entrar` aceita o email/senha cadastrado
- [ ] Pós-login redireciona pra `/casa`
- [ ] `/escrever` abre editor com toolbar superior
- [ ] Salvar entrada cria registro em `texts` (verificar via Supabase Table Editor)
- [ ] Upload de foto na `/casa` cria registro em `wall_items` + arquivo em `wall-images` bucket
- [ ] `/escritas` lista entradas salvas
- [ ] Toggle público em `/escritas/[id]` gera slug e a URL `/p/[slug]` carrega anonimamente

---

## 4. Atualizações futuras

### Schema changes

1. Crie novo arquivo em `supabase/migrations/00XX_descricao.sql`
2. Aplique manualmente no Supabase ARLIA (SQL Editor)
3. Atualize `deploy/SCHEMA.sql` (consolidado) se for relevante pra novos deploys
4. Commit + push → Vercel rebuilda automaticamente

### Env vars novas

- Adicione em `.env.local.example` (só placeholder)
- Adicione na Vercel via **Settings** → **Environment Variables**
- Trigger novo deploy (Vercel faz auto se setar Production)

---

## Troubleshooting

**Build falha na Vercel com "rehype-sanitize"**: confirme que `pnpm-lock.yaml` está commitado e a Vercel detectou pnpm.

**Login retorna "Email ou senha incorretos"**: confirme `ALLOWED_EMAIL` na Vercel = email do user no Supabase.

**Upload de imagem 401**: confirme que `SUPABASE_SERVICE_ROLE_KEY` está setado em Production.

**RLS bloqueando insert**: rode no SQL Editor `select * from pg_policies where tablename = 'texts';` pra ver policies ativas. Schema deveria ter criado todas.

**Storage policy não aplicada**: o schema tenta `drop policy if exists` antes de criar. Se conflitar, rode manualmente no SQL Editor:

```sql
drop policy if exists "wall_images_owner_upload" on storage.objects;
-- ... depois cole de novo a CREATE POLICY do SCHEMA.sql
```
