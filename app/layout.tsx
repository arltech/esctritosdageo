import type { Metadata } from 'next';
import {
  Architects_Daughter,
  Caveat,
  Cormorant_Garamond,
  EB_Garamond,
  Epilogue,
  Fraunces,
  Gloria_Hallelujah,
  Homemade_Apple,
  Kalam,
  Literata,
  Lora,
  Newsreader,
  Patrick_Hand,
  Sacramento,
  Source_Serif_4,
  Spectral,
  Vollkorn,
} from 'next/font/google';

import './globals.css';

/**
 * Família tipográfica do santuário.
 *
 * Editoriais (9): Newsreader (default UI), Literata (corpo), Source Serif 4,
 *   Spectral, Vollkorn, Lora, Fraunces, EB Garamond, Cormorant Garamond
 * Manuscritas (7): Caveat (default), Sacramento, Homemade Apple,
 *   Architects Daughter, Gloria Hallelujah, Kalam, Patrick Hand
 *
 * Defaults (Newsreader, Caveat, Epilogue) carregam com `preload: true`.
 * Alternativas com `preload: false` — só baixam quando a Geo escolhe.
 */
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const literata = Literata({
  variable: '--font-literata',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const spectral = Spectral({
  variable: '--font-spectral',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const vollkorn = Vollkorn({
  variable: '--font-vollkorn',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const sacramento = Sacramento({
  variable: '--font-sacramento',
  weight: ['400'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const homemadeApple = Homemade_Apple({
  variable: '--font-homemade-apple',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const gloriaHallelujah = Gloria_Hallelujah({
  variable: '--font-gloria-hallelujah',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const kalam = Kalam({
  variable: '--font-kalam',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const patrickHand = Patrick_Hand({
  variable: '--font-patrick-hand',
  weight: ['400'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: false,
});

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Escritos da Geo',
  description: 'Santuário digital de escrita pessoal — privado por padrão, público por escolha.',
};

const fontPreferenceScript = `
try {
  var serifMap = {
    newsreader: '--font-newsreader',
    literata: '--font-literata',
    'source-serif': '--font-source-serif',
    spectral: '--font-spectral',
    vollkorn: '--font-vollkorn',
    lora: '--font-lora',
    fraunces: '--font-fraunces',
    'eb-garamond': '--font-eb-garamond',
    cormorant: '--font-cormorant'
  };
  var writingMap = {
    caveat: '--font-caveat',
    sacramento: '--font-sacramento',
    'homemade-apple': '--font-homemade-apple',
    'architects-daughter': '--font-architects-daughter',
    'gloria-hallelujah': '--font-gloria-hallelujah',
    kalam: '--font-kalam',
    'patrick-hand': '--font-patrick-hand'
  };
  var serif = localStorage.getItem('escritos-da-geo:font-serif');
  var writing = localStorage.getItem('escritos-da-geo:font-writing');
  if (serif && serifMap[serif]) {
    document.documentElement.style.setProperty('--font-serif', 'var(' + serifMap[serif] + '), serif');
  }
  if (writing && writingMap[writing]) {
    document.documentElement.style.setProperty('--font-writing', 'var(' + writingMap[writing] + '), cursive');
  }
  // Tema (paleta) — aplica antes do CSS render pra evitar flash
  var theme = localStorage.getItem('escritos-da-geo:theme');
  if (theme && ['areia','salvia','lavanda'].indexOf(theme) !== -1) {
    document.documentElement.setAttribute('data-theme', theme);
  }
} catch (e) {}
`.trim();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    newsreader.variable,
    literata.variable,
    sourceSerif.variable,
    spectral.variable,
    vollkorn.variable,
    lora.variable,
    fraunces.variable,
    ebGaramond.variable,
    cormorant.variable,
    caveat.variable,
    sacramento.variable,
    homemadeApple.variable,
    architectsDaughter.variable,
    gloriaHallelujah.variable,
    kalam.variable,
    patrickHand.variable,
    epilogue.variable,
  ].join(' ');

  return (
    <html lang="pt-BR" className={`${fontVars} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fontPreferenceScript }} />
      </head>
      <body className="bg-background text-on-background paper-grain min-h-full">{children}</body>
    </html>
  );
}
