// TEMPORARY (step 3 definition of done): proves the content loaders end to
// end against real files. The real papers library page replaces this route
// in a later step.
import type { Metadata } from "next";

import { Container } from "@/components/ui";
import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Loader preview — PaperStack",
  description: "Internal check of the content loaders.",
  robots: { index: false, follow: false },
};

export default async function DevPapersPage() {
  const [papers, authors, topics] = await Promise.all([
    getAllPapers(),
    getAllAuthors(),
    getAllTopics(),
  ]);

  return (
    <Container width="site" className="py-16 sm:py-24">
      <p className="text-label text-ink-muted uppercase">
        Temporary · Step 3 · Not indexed
      </p>
      <h1 className="mt-3 font-serif text-h2 text-ink">Loader preview</h1>
      <p className="mt-4 max-w-prose text-body text-ink-soft">
        {papers.length} papers · {topics.length} topics · {authors.length}{" "}
        authors ({authors.map((author) => author.name).join(", ")})
      </p>

      <ul className="mt-12 flex flex-col gap-10">
        {papers.map((paper) => (
          <li key={paper.slug} className="border-t border-rule pt-8">
            <p className="font-mono text-small text-terracotta-700 tabular-nums">
              {paper.paperId}
            </p>
            <h2 className="mt-1.5 font-serif text-h3 text-ink">
              {paper.title}
            </h2>
            <p className="mt-2 text-small text-ink-muted">
              {paper.type} · {paper.status} ·{" "}
              {paper.publishedAt.toISOString().slice(0, 10)} ·{" "}
              {paper.readingTimeMinutes} min read
              {paper.hasPdf ? " · PDF" : ""}
            </p>
            <p className="mt-3 max-w-prose text-body text-ink-soft">
              {paper.abstract}
            </p>
            <p className="mt-4 text-small text-ink-muted">
              Authors:{" "}
              {paper.authors
                .map(
                  (author) =>
                    `${author.slug}${author.corresponding ? " (corresponding)" : ""}`,
                )
                .join(", ")}
            </p>
            <p className="mt-1 text-small text-ink-muted">
              Topics: {paper.topics.join(", ")} · Keywords:{" "}
              {paper.keywords.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
