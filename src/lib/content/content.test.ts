import { describe, expect, it } from "vitest";

import { getAllAuthors } from "./authors";
import { getAllPapers, getPaperBySlug, getRelatedPapers } from "./papers";
import { getAllTopics } from "./topics";

/**
 * Smoke tests over the real repository content: these fail the test suite
 * exactly where the build would fail, but with friendlier output.
 */

describe("repository content", () => {
  it("exposes the three core topics", async () => {
    const topics = await getAllTopics();
    expect(topics.map((topic) => topic.slug)).toEqual([
      "artificial-intelligence",
      "cybersecurity",
      "web-engineering",
    ]);
  });

  it("loads both author files, including the placeholder", async () => {
    const authors = await getAllAuthors();
    expect(authors.map((author) => author.slug).sort()).toEqual([
      "md-kasif-uddin",
      "placeholder-co-author",
    ]);
  });

  it("parses the three sample papers, newest first", async () => {
    const papers = await getAllPapers();
    expect(papers).toHaveLength(3);
    const dates = papers.map((paper) => paper.publishedAt.getTime());
    expect([...dates].sort((a, b) => b - a)).toEqual(dates);
    for (const paper of papers) {
      expect(paper.status).toBe("published");
      expect(paper.sample).toBe(true);
      expect(paper.abstract).toContain("Sample content");
    }
  });

  it("assigns stable PaperStack IDs in publish order", async () => {
    const papers = await getAllPapers();
    const chronological = [...papers].sort(
      (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime(),
    );
    expect(chronological.map((paper) => paper.paperId)).toEqual([
      "PS-2026.001",
      "PS-2026.002",
      "PS-2026.003",
    ]);
  });

  it("computes reading time and a table of contents with the paper sections", async () => {
    const detail = await getPaperBySlug("attention-preserving-distillation");
    expect(detail).not.toBeNull();
    expect(detail?.readingTimeMinutes).toBeGreaterThan(0);
    const headings = (detail?.toc ?? []).map((entry) => entry.text);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Abstract",
        "Introduction",
        "Method",
        "Results",
        "Discussion",
        "References",
      ]),
    );
  });

  it("ranks related papers by shared topics and keywords", async () => {
    const related = await getRelatedPapers("attention-preserving-distillation");
    expect(related).toHaveLength(2);
    for (const entry of related) {
      expect(entry.score).toBeGreaterThanOrEqual(0);
    }
    // The web-engineering survey shares the "benchmarking" keyword.
    const webSurvey = related.find(
      (entry) => entry.paper.slug === "static-guarantees-spa-hydration",
    );
    expect(webSurvey?.sharedKeywords).toContain("benchmarking");
  });
});
