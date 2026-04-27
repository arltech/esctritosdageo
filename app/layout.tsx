import type { Metadata } from 'next';
import { Lora } from 'next/font/google';

import './globals.css';

/**
 * Tipografia primária — Lora (serifada, legível, atemporal).
 * Decisão sujeita a re-avaliação após mockup tipográfico com Geovana
 * (Lora vs Source Serif 4 vs Fraunces vs EB Garamond).
 *
 * `display: 'swap'` evita FOIT (Flash of Invisible Text); aceita FOUT
 * com fallback de sistema serif durante 100ms iniciais.
 */
const lora = Lora({
  variable: '--font-serif',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Escritos da Geo',
  description: 'Santuário digital de escrita pessoal — privado por padrão, público por escolha.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${lora.variable} h-full antialiased`}>
      <body className="bg-paper text-ink min-h-full font-serif">{children}</body>
    </html>
  );
}
