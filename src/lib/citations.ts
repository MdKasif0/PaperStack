/**
 * Citation generators. All formatters are pure string functions over
 * `CitationInput` so they can be unit-tested without touching content.
 *
 * Name handling assumption: the last whitespace-separated token is the
 * family name and everything before it are given names ("Md Kasif Uddin"
 * -> family "Uddin", given ["Md", "Kasif"]). Good enough for this site's
 * bylines; revisit if publishing authors with particle names.
 */

export type CitationStyle = "apa" | "mla" | "ieee" | "bibtex" | "plain";

export const CITATION_STYLES: readonly CitationStyle[] = [
  "apa",
  "mla",
  "ieee",
  "bibtex",
  "plain",
] as const;

export interface CitationInput {
  /** Stable PaperStack ID, used as the BibTeX citation key. */
  paperStackId: string;
  title: string;
  /** Author names in natural order: "Md Kasif Uddin". */
  authors: string[];
  year: number;
  /** Bare DOI or a full https://doi.org/ URL. */
  doi?: string;
  /** Canonical URL; falls back to the DOI URL when omitted. */
  url?: string;
  publisher?: string;
}

const DEFAULT_PUBLISHER = "PaperStack";

interface ParsedName {
  given: string[];
  family: string;
}

export function splitAuthorName(name: string): ParsedName {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);
  if (parts.length === 0) return { given: [], family: "Unknown" };
  return { given: parts.slice(0, -1), family: parts.at(-1) ?? "Unknown" };
}

function initials(given: string[]): string {
  return given.map((name) => `${name.charAt(0)}.`).join(" ");
}

function publisherOf(input: CitationInput): string {
  return input.publisher ?? DEFAULT_PUBLISHER;
}

/** Strips an optional https://doi.org/ prefix, leaving the bare DOI. */
export function bareDoi(input: CitationInput): string | undefined {
  return input.doi?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "");
}

/** The link a citation should point at: explicit URL, else the DOI URL. */
export function citationUrl(input: CitationInput): string | undefined {
  if (input.url) return input.url;
  const doi = bareDoi(input);
  return doi ? `https://doi.org/${doi}` : undefined;
}

function nonEmpty(value: string | undefined): value is string {
  return value !== undefined && value.length > 0;
}

/* ------------------------------------------------------------------ */
/* APA 7                                                               */
/* ------------------------------------------------------------------ */

function apaAuthorList(authors: string[]): string {
  const formatted = authors.map((name) => {
    const { family, given } = splitAuthorName(name);
    const inits = initials(given);
    return inits.length > 0 ? `${family}, ${inits}` : family;
  });
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0] ?? "";
  const last = formatted.at(-1) ?? "";
  return `${formatted.slice(0, -1).join(", ")}, & ${last}`;
}

export function formatApa(input: CitationInput): string {
  return [
    `${apaAuthorList(input.authors)} (${input.year}).`,
    `${input.title}.`,
    `${publisherOf(input)}.`,
    citationUrl(input),
  ]
    .filter(nonEmpty)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* MLA 9                                                               */
/* ------------------------------------------------------------------ */

function mlaName(name: string): string {
  const { family, given } = splitAuthorName(name);
  return given.length > 0 ? `${family}, ${given.join(" ")}` : family;
}

function mlaAuthorList(authors: string[]): string {
  if (authors.length === 0) return "";
  const first = mlaName(authors[0] ?? "");
  if (authors.length === 1) return first;
  if (authors.length === 2) {
    return `${first}, and ${mlaName(authors[1] ?? "")}`;
  }
  // The trailing period is appended by formatMla.
  return `${first}, et al`;
}

export function formatMla(input: CitationInput): string {
  const authorPart =
    input.authors.length > 0 ? `${mlaAuthorList(input.authors)}.` : undefined;
  return [
    authorPart,
    `"${input.title}."`,
    `${publisherOf(input)},`,
    `${input.year},`,
    citationUrl(input),
  ]
    .filter(nonEmpty)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* IEEE                                                                */
/* ------------------------------------------------------------------ */

function ieeeAuthorList(authors: string[]): string {
  const formatted = authors.map((name) => {
    const { family, given } = splitAuthorName(name);
    const inits = initials(given);
    return inits.length > 0 ? `${inits} ${family}` : family;
  });
  if (formatted.length === 0) return "";
  if (formatted.length <= 6) {
    if (formatted.length === 1) return formatted[0] ?? "";
    const last = formatted.at(-1) ?? "";
    return `${formatted.slice(0, -1).join(", ")} and ${last}`;
  }
  return `${formatted.slice(0, 6).join(", ")} et al.`;
}

export function formatIeee(input: CitationInput): string {
  const doi = bareDoi(input);
  return [
    `${ieeeAuthorList(input.authors)},`,
    `"${input.title},"`,
    `${publisherOf(input)},`,
    `${input.year}.`,
    doi ? `doi: ${doi}.` : undefined,
  ]
    .filter(nonEmpty)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* BibTeX                                                              */
/* ------------------------------------------------------------------ */

export function formatBibtex(input: CitationInput): string {
  const authorField = input.authors
    .map((name) => {
      const { family, given } = splitAuthorName(name);
      return given.length > 0 ? `${family}, ${given.join(" ")}` : family;
    })
    .join(" and ");
  const doi = bareDoi(input);
  const url = citationUrl(input);
  return [
    `@misc{${input.paperStackId},`,
    `  title = {{${input.title}}},`,
    `  author = {${authorField}},`,
    `  year = {${input.year}},`,
    `  publisher = {${publisherOf(input)}},`,
    doi ? `  doi = {${doi}},` : undefined,
    url ? `  url = {${url}},` : undefined,
    `}`,
  ]
    .filter(nonEmpty)
    .join("\n");
}

/* ------------------------------------------------------------------ */
/* Plain text                                                          */
/* ------------------------------------------------------------------ */

export function formatPlainText(input: CitationInput): string {
  const names =
    input.authors.length > 0
      ? input.authors.join(", ").replace(/, ([^,]*)$/, " and $1")
      : "Unknown";
  return [
    `${names} (${input.year}).`,
    `${input.title}.`,
    `${publisherOf(input)}.`,
    citationUrl(input),
  ]
    .filter(nonEmpty)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export function formatCitation(
  style: CitationStyle,
  input: CitationInput,
): string {
  switch (style) {
    case "apa":
      return formatApa(input);
    case "mla":
      return formatMla(input);
    case "ieee":
      return formatIeee(input);
    case "bibtex":
      return formatBibtex(input);
    case "plain":
      return formatPlainText(input);
  }
}
