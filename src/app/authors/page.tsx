import type { Metadata } from "next";
import Link from "next/link";

import { Container, SectionLabel } from "@/components/ui";
import { getAllAuthors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Authors",
  description: "The people behind PaperStack.",
};

// Stub — full author pages arrive in a later step.
export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Masthead" />
      <h1 className="mt-6 font-serif text-h1 text-ink">Authors</h1>

      <ul className="mt-12 flex max-w-3xl list-none flex-col divide-y divide-rule p-0">
        {authors.map((author) => (
          <li key={author.slug} className="py-6 first:pt-0">
            <Link
              href={`/authors/${author.slug}`}
              className="group block no-underline"
            >
              <h2 className="font-serif text-h3 text-ink transition-colors group-hover:text-green-900">
                {author.name}
              </h2>
              <p className="mt-1 text-small text-ink-muted">
                {author.role} · {author.affiliation}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
