import { describe, expect, it } from "vitest";

import { scoreRelatedPapers, type RelatedInput } from "./related";

function paper(
  slug: string,
  topics: string[],
  keywords: string[],
  day: number,
): RelatedInput {
  return {
    slug,
    topics,
    keywords,
    publishedAt: new Date(`2026-01-${String(day).padStart(2, "0")}T00:00:00Z`),
  };
}

const current = paper(
  "current",
  ["ai", "security"],
  ["distillation", "tls"],
  10,
);

const candidates: RelatedInput[] = [
  // Shares one topic and two keywords -> highest score (4).
  paper("strong", ["ai", "web"], ["distillation", "tls", "other"], 12),
  // Shares one keyword only -> score 1.
  paper("weak", ["web"], ["distillation"], 14),
  // Shares one topic only -> score 2.
  paper("medium", ["security"], ["unrelated"], 16),
  // Shares nothing -> score 0, still listed.
  paper("unrelated", ["web"], ["hydration"], 18),
];

describe("scoreRelatedPapers", () => {
  it("excludes the current paper", () => {
    const scored = scoreRelatedPapers(current, [...candidates, current]);
    expect(scored.map((entry) => entry.paper.slug)).not.toContain("current");
  });

  it("weights shared topics double and keywords once", () => {
    const scored = scoreRelatedPapers(current, candidates);
    const bySlug = new Map(scored.map((entry) => [entry.paper.slug, entry]));
    expect(bySlug.get("strong")?.score).toBe(4);
    expect(bySlug.get("medium")?.score).toBe(2);
    expect(bySlug.get("weak")?.score).toBe(1);
    expect(bySlug.get("unrelated")?.score).toBe(0);
  });

  it("sorts by score, then by recency for ties", () => {
    const a = paper("tie-a", ["ai"], [], 5);
    const b = paper("tie-b", ["ai"], [], 20);
    const scored = scoreRelatedPapers(current, [a, b]);
    expect(scored.map((entry) => entry.paper.slug)).toEqual(["tie-b", "tie-a"]);
  });

  it("matches keywords case-insensitively", () => {
    const upper = paper("upper", ["web"], ["Distillation"], 22);
    const scored = scoreRelatedPapers(current, [upper]);
    expect(scored[0]?.sharedKeywords).toEqual(["Distillation"]);
  });

  it("reports the shared lists", () => {
    const scored = scoreRelatedPapers(current, candidates);
    const strong = scored.find((entry) => entry.paper.slug === "strong");
    expect(strong?.sharedTopics).toEqual(["ai"]);
    expect(strong?.sharedKeywords).toEqual(["distillation", "tls"]);
  });
});
