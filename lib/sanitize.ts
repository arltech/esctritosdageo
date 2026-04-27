import 'server-only';

import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

/**
 * Schema custom — apenas tags/atributos que o editor produz.
 * Bloqueia tudo mais (script, iframe, on*, javascript: URLs).
 *
 * Tipagem: rehype-sanitize tem um overload confuso pelo TS — usamos cast
 * via Parameters do próprio rehypeSanitize pra alinhar tipos.
 */
type SanitizeOptions = NonNullable<Parameters<typeof rehypeSanitize>[0]>;

const editorSchema: SanitizeOptions = {
  ...defaultSchema,
  tagNames: ['p', 'br', 'mark', 'img', 'span', 'strong', 'em'],
  attributes: {
    ...defaultSchema.attributes,
    img: ['src', 'alt', ['data-path'], ['data-align', 'left', 'center', 'right']],
    span: [['data-tag']],
    mark: [],
    p: [],
    br: [],
    strong: [],
    em: [],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https'],
  },
};

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, editorSchema)
  .use(rehypeStringify);

/**
 * Sanitiza HTML do editor antes de persistir. Roda server-side apenas.
 * Devolve HTML seguro pra armazenar em texts.body_html.
 */
export async function sanitizeEditorHtml(html: string): Promise<string> {
  const file = await processor.process(html);
  return String(file);
}
