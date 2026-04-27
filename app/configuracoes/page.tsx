import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { FontPicker } from '@/components/preferences/FontPicker';
import { PasswordForm } from '@/components/profile/PasswordForm';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { getAvatarUrl, getMyProfile } from '@/lib/db/profile';

export const metadata: Metadata = {
  title: 'Configurações — Escritos da Geo',
  robots: { index: false, follow: false },
};

export default async function ConfiguracoesPage() {
  const profile = await getMyProfile();
  if (!profile) redirect('/entrar');

  const avatarUrl = getAvatarUrl(
    profile.avatar_path,
    profile.updated_at ? new Date(profile.updated_at).getTime().toString() : undefined,
  );

  return (
    <main className="px-4 py-12 sm:px-8">
      <Container as="article">
        <header className="mb-12 flex items-baseline justify-between">
          <h1 className="text-on-surface text-4xl tracking-tight">Configurações</h1>
          <Link
            href="/casa"
            className="text-on-surface-variant hover:text-primary font-sans text-sm tracking-wider uppercase no-underline transition-colors"
          >
            voltar
          </Link>
        </header>

        {/* ---------- Perfil ---------- */}
        <section aria-labelledby="perfil-heading" className="mb-16">
          <h2 id="perfil-heading" className="text-on-surface mb-2 text-2xl tracking-tight">
            Perfil
          </h2>
          <p className="text-on-surface-variant font-sans mb-8 text-sm italic">
            Como você quer aparecer pra quem visita o santuário.
          </p>
          <ProfileForm profile={profile} avatarUrl={avatarUrl} />
        </section>

        {/* ---------- Senha ---------- */}
        <section
          aria-labelledby="senha-heading"
          className="border-outline-variant/40 mb-16 border-t pt-12"
        >
          <h2 id="senha-heading" className="text-on-surface mb-2 text-2xl tracking-tight">
            Segurança
          </h2>
          <p className="text-on-surface-variant font-sans mb-8 text-sm italic">
            Troque a senha sempre que sentir necessidade.
          </p>
          <PasswordForm />
        </section>

        {/* ---------- Tipografia ---------- */}
        <section
          aria-labelledby="tipografia-heading"
          className="border-outline-variant/40 border-t pt-12"
        >
          <h2 id="tipografia-heading" className="text-on-surface mb-2 text-2xl tracking-tight">
            Tipografia
          </h2>
          <p className="text-on-surface-variant font-sans mb-8 text-sm italic">
            Escolha duas fontes — uma pra ler, outra pra escrever — e elas se aplicam em todo o
            santuário.
          </p>

          <div className="mb-10">
            <h3 className="text-on-surface-variant font-sans mb-3 text-xs tracking-widest uppercase">
              Fonte de leitura
            </h3>
            <p className="text-on-surface-variant/70 mb-4 text-sm">
              Aparece em títulos, parágrafos, navegação — todo o tom editorial.
            </p>
            <FontPicker kind="serif" />
          </div>

          <div>
            <h3 className="text-on-surface-variant font-sans mb-3 text-xs tracking-widest uppercase">
              Fonte de escrita
            </h3>
            <p className="text-on-surface-variant/70 mb-4 text-sm">
              Aparece em legendas das fotos, no caderno de escrever, em frases manuscritas.
            </p>
            <FontPicker kind="writing" />
          </div>
        </section>
      </Container>
    </main>
  );
}
