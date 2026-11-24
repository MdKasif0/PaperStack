import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";
import { getAllAuthors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Authors",
  description: "The people behind PaperStack.",
};

// Stub — full author pages arrive in a later step.
export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Masthead" title="Authors" />

      <ul className="list-none divide-y divide-rule p-0">
        {authors.map((author) => (
          <li key={author.slug} className="paper-row group">
            <Link
              href={`/authors/${author.slug}`}
              className="grid gap-x-16 gap-y-2 py-9 no-underline lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-baseline"
            >
              <h2 className="font-serif text-h2 text-ink transition-colors group-hover:text-green-700">
                {author.name}
              </h2>
              <p className="text-body text-ink-soft">
                {author.role} · {author.affiliation}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
