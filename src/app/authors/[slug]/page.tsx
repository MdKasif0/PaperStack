import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container, SectionLabel } from "@/components/ui";
import { getAllAuthors, getAuthor, getPapersByAuthor } from "@/lib/content";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  return { title: author?.name ?? "Author" };
}

// Stub — full author pages arrive in a later step.
export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const papers = await getPapersByAuthor(author.slug);

  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Author" />
      <h1 className="mt-6 font-serif text-h1 text-ink">{author.name}</h1>
      <p className="mt-3 text-small text-ink-muted">
        {author.role} · {author.affiliation}
      </p>
      <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
        {author.bio}
      </p>
      <p className="mt-6 text-small text-ink-muted">
        {papers.length} paper{papers.length === 1 ? "" : "s"} — the full author
        page arrives in a later step.
      </p>
    </Container>
  );
}
