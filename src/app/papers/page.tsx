import type { Metadata } from "next";
import { Suspense } from "react";

import { LibraryClient } from "@/components/library/LibraryClient";
import { LibraryRowsSkeleton } from "@/components/library/LibrarySkeleton";
import { Container } from "@/components/ui";
import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Papers",
  description:
    "Browse the PaperStack library — filter by topic, year, author, type, and keyword, or search the full text.",
};

export default async function PapersPage() {
  const [papers, authors, topics] = await Promise.all([
    getAllPapers(),
    getAllAuthors(),
    getAllTopics(),
  ]);
  const paperCount = papers.length;

  return (
    <Container width="site" className="py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-label text-ink-muted uppercase">
          Browse the collection
        </p>
        <h1 className="mt-4 font-serif text-h1 text-ink">The Library</h1>
        <p className="mt-4 text-body-lg text-ink-soft">
          {paperCount} {paperCount === 1 ? "paper" : "papers"}, filterable by
          topic, year, author, type, and keyword.
        </p>
      </header>

      <Suspense fallback={<LibraryRowsSkeleton />}>
        <LibraryClient
          topics={topics}
          authors={authors}
          totalCount={paperCount}
        />
      </Suspense>
    </Container>
  );
}
