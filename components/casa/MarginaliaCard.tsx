// Citações curadas — frases sobre escrita, presença, intimidade.
// Pool fixa por enquanto; quando os textos da Geo existirem (Story 2.x),
// trocar pra `getRandomQuoteFromMyTexts()` puxando do banco.
const QUOTES: ReadonlyArray<{ text: string; source: string }> = [
  {
    text: 'Escrever é resistir ao esquecimento — não como inimigo, mas como aliado da matéria viva.',
    source: 'Marginalia',
  },
  {
    text: 'Há dias em que a única coragem é abrir o caderno.',
    source: 'Marginalia',
  },
  {
    text: 'O que não é dito ocupa o mesmo espaço do que é dito — apenas em outra forma.',
    source: 'Marginalia',
  },
  {
    text: 'Toda página em branco já é uma promessa.',
    source: 'Marginalia',
  },
  {
    text: 'A escrita íntima não pede leitor — ela pede presença.',
    source: 'Marginalia',
  },
  {
    text: 'Lembrar é uma forma de escrever; escrever é uma forma de não esquecer.',
    source: 'Marginalia',
  },
  {
    text: 'O silêncio também tem sintaxe.',
    source: 'Marginalia',
  },
  {
    text: 'Escrever pra si mesma é o ato mais generoso que existe.',
    source: 'Marginalia',
  },
];

function quoteOfTheDay() {
  // Determinístico por dia — mesma frase ao longo de 24h, troca à meia-noite
  const today = new Date();
  const seed = today.getFullYear() * 1000 + today.getMonth() * 50 + today.getDate();
  return QUOTES[seed % QUOTES.length]!;
}

/**
 * Marginalia rotativa — uma frase por dia. Sem like, sem share, sem fonte
 * algorítmica. Apenas presença textual no canto da casa.
 */
export function MarginaliaCard() {
  const quote = quoteOfTheDay();

  return (
    <aside className="bg-surface-container-low border-outline-variant/40 relative rounded-md border-l-2 px-5 py-5">
      <div className="washi-tape-primary absolute -top-2 right-4 h-5 w-12 rotate-6" aria-hidden />
      <p
        className="text-on-surface text-lg leading-snug italic"
        style={{ fontFamily: 'var(--font-writing)' }}
      >
        “{quote.text}”
      </p>
      <p className="text-on-surface-variant font-sans mt-3 text-[10px] tracking-widest uppercase opacity-60">
        — {quote.source}
      </p>
    </aside>
  );
}
