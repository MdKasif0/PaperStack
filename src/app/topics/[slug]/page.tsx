import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container, SectionLabel } from "@/components/ui";
import { getAllTopics, getPapersByTopic } from "@/lib/content";

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
  return { title: topic?.name ?? "Topic" };
}

// Stub — full topic pages arrive in a later step.
export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topics = await getAllTopics();
  const topic = topics.find((candidate) => candidate.slug === slug);
  if (!topic) notFound();

  const papers = await getPapersByTopic(topic.slug);

  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Topic" />
      <h1 className="mt-6 font-serif text-h1 text-ink">{topic.name}</h1>
      <p className="mt-4 max-w-prose text-body-lg text-ink-soft">
        {topic.description}
      </p>
      <p className="mt-6 text-small text-ink-muted">
        {papers.length} paper{papers.length === 1 ? "" : "s"} — the full topic
        page arrives in a later step.
      </p>
    </Container>
  );
}
