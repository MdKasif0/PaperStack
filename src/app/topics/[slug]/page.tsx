import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PaperList } from "@/components/papers/PaperList";
import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";
import { getAllAuthors, getAllTopics, getPapersByTopic } from "@/lib/content";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topics = await getAllTopics();
  const topic = topics.find((candidate) => candidate.slug === slug);
  return { title: topic?.name ?? "Topic", description: topic?.description };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topics = await getAllTopics();
  const topic = topics.find((candidate) => candidate.slug === slug);
  if (!topic) notFound();

  const [papers, authors] = await Promise.all([
    getPapersByTopic(topic.slug),
    getAllAuthors(),
  ]);
  const authorNames = new Map(
    authors.map((author) => [author.slug, author.name]),
  );
  const topicBySlug = new Map(topics.map((entry) => [entry.slug, entry]));
  const otherTopics = topics.filter((entry) => entry.slug !== topic.slug);

  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Topic" title={topic.name}>
        <p>{topic.description}</p>
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
      {otherTopics.length > 0 && (
        <nav aria-labelledby="other-topics" className="mt-20 sm:mt-28">
          <h2
            id="other-topics"
            className="border-t border-ink pt-5 font-serif text-h3 text-ink"
          >
            Other topics
          </h2>
          <ul className="mt-6 grid list-none gap-x-16 border-t border-rule p-0 md:grid-cols-2">
            {otherTopics.map((entry) => (
              <li key={entry.slug} className="border-b border-rule">
                <Link
                  href={`/topics/${entry.slug}`}
                  className="group block py-7 no-underline"
                >
                  <span className="font-serif text-h3 text-ink transition-colors group-hover:text-green-700">
                    {entry.name}
                  </span>
                  <span className="mt-1.5 block max-w-prose text-small text-ink-soft">
                    {entry.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Container>
  );
}
