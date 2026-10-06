import readingTime from "reading-time";

const WORDS_PER_MINUTE = 220;

/**
 * Strips the parts of MDX that should not count towards reading time:
 * fenced code blocks, display math, inline code, images, and table/
 * emphasis markup. Headings and table cell text still count as prose.
 */
export function stripMdxForReading(mdx: string): string {
  return mdx
    .replace(/^```[\s\S]*?^```$/gm, "")
    .replace(/^~~~[\s\S]*?^~~~$/gm, "")
    .replace(/^\$\$[\s\S]*?\$\$$/gm, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-*|\s]+/gm, " ")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ReadingTime {
  minutes: number;
  words: number;
}

export function computeReadingTime(mdx: string): ReadingTime {
  const result = readingTime(stripMdxForReading(mdx), {
    wordsPerMinute: WORDS_PER_MINUTE,
  });
  return {
    minutes: Math.max(Math.round(result.minutes), 1),
    words: result.words,
  };
}
