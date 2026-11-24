import type { Metadata } from "next";
import { Suspense } from "react";

import { LibraryClient } from "@/components/library/LibraryClient";
import { LibraryRowsSkeleton } from "@/components/library/LibrarySkeleton";
import { PageHeader } from "@/components/site/PageHeader";
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
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Browse the collection" title="The Library">
        <p>
          {paperCount} {paperCount === 1 ? "paper" : "papers"}, filterable by
          topic, year, author, type, and keyword.
        </p>
      </PageHeader>

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
