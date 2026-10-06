import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container, Rule } from "@/components/ui";
import { getAllPapers, getPaperBySlug } from "@/lib/content";

interface PaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const papers = await getAllPapers();
  return papers.map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({
  params,
}: PaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  return { title: paper?.title ?? "Paper" };
}

// Stub — the full paper reader arrives in a later step.
export default async function PaperPage({ params }: PaperPageProps) {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) notFound();

  return (
    <Container width="site" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[68ch]">
        <p className="font-mono text-small text-terracotta-700 tabular-nums">
          {paper.paperId}
        </p>
        <h1 className="mt-2 font-serif text-h1 text-ink">{paper.title}</h1>
        <p className="mt-4 text-small text-ink-muted">
          {paper.type} · {paper.publishedAt.toISOString().slice(0, 10)} ·{" "}
          {paper.readingTimeMinutes} min read
        </p>
        <Rule className="my-8" />
        <p className="text-body-lg text-ink-soft">{paper.abstract}</p>
        <p className="mt-8 text-small text-ink-muted">
          The full paper reader — MDX body, math, figures, and citations —
          arrives in a later step.
        </p>
      </div>
    </Container>
  );
}
