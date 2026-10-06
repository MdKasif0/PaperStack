import type { Metadata } from "next";
import Link from "next/link";

import { Container, SectionLabel } from "@/components/ui";
import { getAllPapers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Papers",
  description: "The PaperStack paper library.",
};

// Stub — the full library layout arrives in a later step.
export default async function PapersPage() {
  const papers = await getAllPapers();

  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Library" />
      <h1 className="mt-6 font-serif text-h1 text-ink">Papers</h1>
      <p className="mt-4 max-w-prose text-body-lg text-ink-soft">
        {papers.length} papers, newest first. The full library layout arrives in
        a later step.
      </p>

      <ul className="mt-12 flex max-w-3xl list-none flex-col divide-y divide-rule p-0">
        {papers.map((paper) => (
          <li key={paper.slug} className="py-6 first:pt-0">
            <Link
              href={`/papers/${paper.slug}`}
              className="group block no-underline"
            >
              <p className="font-mono text-small text-terracotta-700 tabular-nums">
                {paper.paperId}
              </p>
              <h2 className="mt-1 font-serif text-h3 text-ink transition-colors group-hover:text-green-900">
                {paper.title}
              </h2>
              <p className="mt-1.5 text-small text-ink-muted">
                {paper.type} · {paper.publishedAt.toISOString().slice(0, 10)} ·{" "}
                {paper.readingTimeMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
