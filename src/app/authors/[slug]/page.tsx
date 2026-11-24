import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaperList } from "@/components/papers/PaperList";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";
import {
  getAllAuthors,
  getAllTopics,
  getAuthor,
  getPapersByAuthor,
} from "@/lib/content";

const LINK_LABELS = {
  website: "Website",
  orcid: "ORCID",
  googleScholar: "Google Scholar",
  github: "GitHub",
  x: "X",
} as const;

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
  return { title: author?.name ?? "Author", description: author?.bio };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const [papers, authors, topics] = await Promise.all([
    getPapersByAuthor(author.slug),
    getAllAuthors(),
    getAllTopics(),
  ]);
  const authorNames = new Map(authors.map((entry) => [entry.slug, entry.name]));
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const links = (
    Object.keys(LINK_LABELS) as (keyof typeof LINK_LABELS)[]
  ).flatMap((key) => {
    const href = author.links?.[key];
    return href ? [{ href, label: LINK_LABELS[key] }] : [];
  });

  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader
        label="Author"
        title={author.name}
        meta={
          <>
            {author.role} · {author.affiliation}
          </>
        }
      >
        <p>{author.bio}</p>
        {links.length > 0 && (
          <ul className="mt-5 mb-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-small">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        )}
      </PageHeader>
      <p className="mt-8 text-small text-ink-muted">
        {papers.length} {papers.length === 1 ? "paper" : "papers"}
      </p>
      {papers.length > 0 ? (
        <PaperList
          papers={papers}
          authorNames={authorNames}
          topics={topicBySlug}
          titleAs="h2"
        />
      ) : (
        <p className="mt-10 font-serif text-h3 text-ink-soft">
          The first paper is in preparation.
        </p>
      )}
    </Container>
  );
}
