/**
 * Shortens prose to at most `limit` characters, always ending on a whole
 * word. CSS line clamping alone can cut a word in half.
 */
export function excerpt(text: string, limit: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  const slice = trimmed.slice(0, limit);
  const lastSpace = slice.lastIndexOf(" ");
  const words = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${words.replace(/[\s,;:.—–-]+$/u, "")}…`;
}
