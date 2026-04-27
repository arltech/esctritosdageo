/**
 * Gera slug URL-safe a partir de um título.
 * - lowercase
 * - acentos removidos via normalize NFD
 * - espaços e símbolos viram hífen
 * - hífens duplicados colapsam
 * - max 60 char
 *
 * Pra unicidade, append de hash curto fica a cargo do caller (action).
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/**
 * Hash curto (6 chars hex) pra desambiguar slugs duplicados.
 * Não criptográfico — só pra evitar colisão em URLs.
 */
export function shortHash(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6);
}
