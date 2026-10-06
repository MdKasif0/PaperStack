/**
 * Stable PaperStack IDs, assigned in publication order within a calendar
 * year: PS-2026.001, PS-2026.002, … The ordinal is 0-based and derived from
 * `publishedAt` ascending, so an ID never changes once content is published
 * unless an earlier paper is inserted into the same year.
 */
export function generatePaperStackId(
  publishedAt: Date,
  ordinal: number,
): string {
  const year = publishedAt.getUTCFullYear();
  const number = String(ordinal + 1).padStart(3, "0");
  return `PS-${year}.${number}`;
}
