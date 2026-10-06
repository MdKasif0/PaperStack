/**
 * Related-paper scoring: shared topics count double, shared keywords once.
 * Pure functions so the scoring can be unit-tested without touching the
 * file system.
 */

export interface RelatedInput {
  slug: string;
  topics: string[];
  keywords: string[];
  publishedAt: Date;
}

export interface ScoredPaper<TPaper extends RelatedInput> {
  paper: TPaper;
  score: number;
  sharedTopics: string[];
  sharedKeywords: string[];
}

const TOPIC_WEIGHT = 2;
const KEYWORD_WEIGHT = 1;

function lowercaseSet(values: string[]): Set<string> {
  return new Set(values.map((value) => value.toLowerCase()));
}

function intersection(values: string[], seen: Set<string>): string[] {
  return values.filter((value) => seen.has(value.toLowerCase()));
}

export function scoreRelatedPapers<TPaper extends RelatedInput>(
  current: TPaper,
  candidates: TPaper[],
): ScoredPaper<TPaper>[] {
  const currentTopics = lowercaseSet(current.topics);
  const currentKeywords = lowercaseSet(current.keywords);

  return candidates
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const sharedTopics = intersection(candidate.topics, currentTopics);
      const sharedKeywords = intersection(candidate.keywords, currentKeywords);
      return {
        paper: candidate,
        score:
          sharedTopics.length * TOPIC_WEIGHT +
          sharedKeywords.length * KEYWORD_WEIGHT,
        sharedTopics,
        sharedKeywords,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.paper.publishedAt.getTime() - a.paper.publishedAt.getTime(),
    );
}
