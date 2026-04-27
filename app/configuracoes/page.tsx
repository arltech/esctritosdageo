import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Container } from '@/components/layout/Container';
import { FontPicker } from '@/components/preferences/FontPicker';
import { SettingsTabs } from '@/components/preferences/SettingsTabs';
import { ThemePicker } from '@/components/preferences/ThemePicker';
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

  const tabs = [
    {
      id: 'perfil',
      label: 'Perfil',
      description: 'Como você quer aparecer pra quem visita o santuário.',
      content: <ProfileForm profile={profile} avatarUrl={avatarUrl} />,
    },
    {
      id: 'seguranca',
      label: 'Segurança',
      description: 'Troque a senha sempre que sentir necessidade.',
      content: <PasswordForm />,
    },
    {
      id: 'tema',
      label: 'Tema',
      description:
        'A paleta inteira do santuário muda — fundos, textos, fitas, sombras. Escolha a que combina com o que você vai escrever hoje.',
      content: <ThemePicker />,
    },
    {
      id: 'tipografia',
      label: 'Tipografia',
      description:
        'Escolha duas fontes — uma pra ler, outra pra escrever — e elas se aplicam em todo o santuário.',
      content: (
        <div className="flex flex-col gap-10">
          <div>
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
        </div>
      ),
    },
  ];

  return (
    <main className="px-4 py-12 sm:px-8">
      <Container as="article">
        <header className="mb-10 flex items-baseline justify-between">
          <h1 className="text-on-surface text-3xl tracking-tight sm:text-4xl">Configurações</h1>
          <Link
            href="/casa"
            className="text-on-surface-variant hover:text-primary font-sans text-sm tracking-wider uppercase no-underline transition-colors"
          >
            voltar
          </Link>
        </header>

        <SettingsTabs tabs={tabs} defaultTab="perfil" />
      </Container>
    </main>
  );
}
