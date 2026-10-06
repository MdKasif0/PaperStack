import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { SAMPLE_CONTENT } from "./config";
import { generatePaperStackId } from "./ids";
import { scoreRelatedPapers, type ScoredPaper } from "./related";
import {
  formatValidationError,
  paperFrontmatterSchema,
  type PaperAuthorRef,
  type PaperFrontmatter,
  type PaperLinks,
  type PaperStatus,
  type PaperType,
  type PaperVersion,
} from "./schema";
import { computeReadingTime } from "./reading-time";
import { extractTableOfContents, type TocEntry } from "./toc";

const PAPERS_DIR = path.join(process.cwd(), "content", "papers");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export interface PaperSummary extends PaperFrontmatter {
  paperId: string;
  readingTimeMinutes: number;
  hasPdf: boolean;
}

export interface PaperDetail extends PaperSummary {
  /** Raw MDX body, ready for next-mdx-remote at render time. */
  content: string;
  toc: TocEntry[];
}

export type {
  PaperAuthorRef,
  PaperLinks,
  PaperStatus,
  PaperType,
  PaperVersion,
};

interface RawPaper {
  slug: string;
  frontmatter: PaperFrontmatter;
  content: string;
}

async function readRawPapers(): Promise<RawPaper[]> {
  let entries;
  try {
    entries = await readdir(PAPERS_DIR, { withFileTypes: true });
  } catch {
    throw new Error(`content/papers directory not found at ${PAPERS_DIR}`);
  }

  const errors: string[] = [];
  const papers: RawPaper[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(PAPERS_DIR, entry.name, "index.mdx");
    let raw: string;
    try {
      raw = await readFile(filePath, "utf8");
    } catch {
      errors.push(`${filePath}: paper folder has no index.mdx`);
      continue;
    }
    const { data, content } = matter(raw);
    const parsed = paperFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      errors.push(formatValidationError(parsed.error, filePath));
      continue;
    }
    if (parsed.data.slug !== entry.name) {
      errors.push(
        `${filePath}: frontmatter slug "${parsed.data.slug}" does not match folder name "${entry.name}"`,
      );
      continue;
    }
    papers.push({ slug: entry.name, frontmatter: parsed.data, content });
  }

  if (errors.length > 0) {
    throw new Error(`Invalid paper content:\n${errors.join("\n\n")}`);
  }
  return papers;
}

/**
 * Drafts are visible in every environment except production builds; sample
 * papers disappear entirely once SAMPLE_CONTENT is switched off.
 */
function isVisible(frontmatter: PaperFrontmatter): boolean {
  if (frontmatter.sample && !SAMPLE_CONTENT) return false;
  if (IS_PRODUCTION && frontmatter.status === "draft") return false;
  return true;
}

async function loadPaperSummaries(): Promise<PaperSummary[]> {
  const rawPapers = await readRawPapers();
  const visible = rawPapers.filter(({ frontmatter }) => isVisible(frontmatter));

  const chronological = [...visible].sort(
    (a, b) =>
      a.frontmatter.publishedAt.getTime() - b.frontmatter.publishedAt.getTime(),
  );
  const summaries = chronological.map((paper, ordinal) => ({
    ...paper.frontmatter,
    paperId: generatePaperStackId(paper.frontmatter.publishedAt, ordinal),
    readingTimeMinutes: computeReadingTime(paper.content).minutes,
    hasPdf: paper.frontmatter.pdf !== undefined,
  }));

  return summaries.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );
}

let summariesCache: Promise<PaperSummary[]> | null = null;

export async function getAllPapers(): Promise<PaperSummary[]> {
  summariesCache ??= loadPaperSummaries();
  return summariesCache;
}

export async function getPaperBySlug(
  slug: string,
): Promise<PaperDetail | null> {
  const summaries = await getAllPapers();
  const summary = summaries.find((paper) => paper.slug === slug);
  if (!summary) return null;

  const filePath = path.join(PAPERS_DIR, slug, "index.mdx");
  const raw = await readFile(filePath, "utf8");
  const { content } = matter(raw);
  return { ...summary, content, toc: extractTableOfContents(content) };
}

export async function getPapersByTopic(
  topicSlug: string,
): Promise<PaperSummary[]> {
  const papers = await getAllPapers();
  return papers.filter((paper) => paper.topics.includes(topicSlug));
}

export async function getPapersByAuthor(
  authorSlug: string,
): Promise<PaperSummary[]> {
  const papers = await getAllPapers();
  return papers.filter((paper) =>
    paper.authors.some((author) => author.slug === authorSlug),
  );
}

export async function getRelatedPapers(
  slug: string,
  limit = 3,
): Promise<ScoredPaper<PaperSummary>[]> {
  const papers = await getAllPapers();
  const current = papers.find((paper) => paper.slug === slug);
  if (!current) {
    throw new Error(`getRelatedPapers: no paper with slug "${slug}"`);
  }
  return scoreRelatedPapers(current, papers).slice(0, limit);
}

export interface AdjacentPapers {
  newer: PaperSummary | null;
  older: PaperSummary | null;
}

export async function getAdjacentPapers(slug: string): Promise<AdjacentPapers> {
  const papers = await getAllPapers();
  const index = papers.findIndex((paper) => paper.slug === slug);
  if (index === -1) {
    throw new Error(`getAdjacentPapers: no paper with slug "${slug}"`);
  }
  // Papers are sorted newest-first, so the neighbours in the array are the
  // chronologically adjacent papers.
  return {
    newer: papers[index - 1] ?? null,
    older: papers[index + 1] ?? null,
  };
}
