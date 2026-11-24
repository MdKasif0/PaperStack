import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import "katex/dist/katex.min.css";

import { PaperBody } from "@/components/mdx/PaperBody";
import { CiteButton } from "@/components/papers/CiteButton";
import { PaperList } from "@/components/papers/PaperList";
import { PaperToc } from "@/components/papers/PaperToc";
import { ButtonLink, Container, SectionLabel } from "@/components/ui";
import {
  getAdjacentPapers,
  getAllAuthors,
  getAllPapers,
  getAllTopics,
  getPaperBySlug,
  getRelatedPapers,
  toSearchDocuments,
} from "@/lib/content";
import { publicFileExists } from "@/lib/public-file";

interface PaperPageProps {
  params: Promise<{ slug: string }>;
}

const LINK_LABELS = {
  doi: "DOI",
  arxiv: "arXiv",
  github: "Code",
  dataset: "Dataset",
  slides: "Slides",
} as const;

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
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
  if (!paper) return { title: "Paper" };
  return { title: paper.title, description: paper.abstract };
}

function DetailTerm({ children }: { children: string }) {
  return <dt className="text-label text-ink-muted uppercase">{children}</dt>;
}

export default async function PaperPage({ params }: PaperPageProps) {
  const { slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) notFound();

  const [authors, topics, related, adjacent] = await Promise.all([
    getAllAuthors(),
    getAllTopics(),
    getRelatedPapers(slug),
    getAdjacentPapers(slug),
  ]);

  const authorNames = new Map(
    authors.map((author) => [author.slug, author.name]),
  );
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const [doc] = toSearchDocuments([paper], authorNames);
  const relatedPapers = related
    .filter((entry) => entry.score > 0)
    .map((entry) => entry.paper);
  const corresponding = paper.authors.find((author) => author.corresponding);
  const hasPdf = paper.pdf !== undefined && publicFileExists(paper.pdf);
  const links = (
    Object.keys(LINK_LABELS) as (keyof typeof LINK_LABELS)[]
  ).flatMap((key) => {
    const href = paper.links?.[key];
    return href ? [{ href, label: LINK_LABELS[key] }] : [];
  });

  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <article>
        <header className="border-b border-ink pb-10 sm:pb-12">
          <p className="flex items-center gap-4 font-mono text-meta text-ink-soft tabular-nums">
            <span
              aria-hidden="true"
              className="hidden h-0.5 w-10 shrink-0 bg-terracotta-600 sm:block"
            />
            {paper.paperId}
          </p>
          <h1 className="mt-5 max-w-[20em] font-serif text-h1 text-balance text-ink">
            {paper.title}
          </h1>
          <p className="mt-6 text-body text-ink">
            {paper.authors.map((author, index) => (
              <span key={author.slug}>
                {index > 0 && ", "}
                <Link
                  href={`/authors/${author.slug}`}
                  className="text-ink decoration-rule-strong hover:text-green-700"
                >
                  {authorNames.get(author.slug) ?? author.slug}
                </Link>
              </span>
            ))}
          </p>
          <p className="meta-line mt-3 text-small text-ink-muted">
            <span className="inline-block first-letter:uppercase">
              {paper.type.replace(/-/g, " ")}
            </span>
            <span className="tabular-nums">{isoDate(paper.publishedAt)}</span>
            <span>{paper.readingTimeMinutes} min read</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hasPdf && <ButtonLink href={paper.pdf ?? ""}>PDF</ButtonLink>}
            {doc && <CiteButton doc={doc} />}
          </div>
        </header>

        <div className="grid gap-x-16 pt-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:pt-14 xl:gap-x-24">
          <div className="min-w-0 lg:order-2">
            {paper.toc.length > 0 && (
              <>
                <details className="mb-10 border-y border-rule lg:hidden">
                  <summary className="cursor-pointer py-3.5 text-small font-medium text-ink">
                    Contents
                  </summary>
                  <nav aria-label="Contents" className="pb-5">
                    <PaperToc entries={paper.toc} />
                  </nav>
                </details>
                <nav
                  aria-labelledby="contents-heading"
                  className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
                >
                  <p
                    id="contents-heading"
                    className="mb-4 text-label text-ink-soft uppercase"
                  >
                    Contents
                  </p>
                  <PaperToc entries={paper.toc} />
                </nav>
              </>
            )}
          </div>

          <div className="min-w-0 lg:order-1 lg:max-w-[46rem]">
            <PaperBody source={paper.content} />

            <section
              aria-labelledby="paper-details"
              className="mt-16 border-t border-ink pt-6"
            >
              <h2 id="paper-details" className="font-serif text-h3 text-ink">
                About this paper
              </h2>
              <dl className="mt-6 grid gap-x-10 gap-y-7 text-small text-ink-soft sm:grid-cols-2">
                {corresponding && (
                  <div>
                    <DetailTerm>Corresponding author</DetailTerm>
                    <dd className="mt-2 ml-0">
                      <Link href={`/authors/${corresponding.slug}`}>
                        {authorNames.get(corresponding.slug) ??
                          corresponding.slug}
                      </Link>
                    </dd>
                  </div>
                )}
                {paper.topics.length > 0 && (
                  <div>
                    <DetailTerm>Topics</DetailTerm>
                    <dd className="mt-2 ml-0 flex flex-wrap gap-x-4 gap-y-1">
                      {paper.topics.map((topicSlug) => (
                        <Link key={topicSlug} href={`/topics/${topicSlug}`}>
                          {topicBySlug.get(topicSlug)?.name ?? topicSlug}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
                {paper.keywords.length > 0 && (
                  <div>
                    <DetailTerm>Keywords</DetailTerm>
                    <dd className="mt-2 ml-0 flex flex-wrap gap-x-4 gap-y-1">
                      {paper.keywords.map((keyword) => (
                        <Link
                          key={keyword}
                          href={`/papers?keyword=${encodeURIComponent(keyword.toLowerCase())}`}
                        >
                          {keyword}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
                {links.length > 0 && (
                  <div>
                    <DetailTerm>Links</DetailTerm>
                    <dd className="mt-2 ml-0 flex flex-wrap gap-x-4 gap-y-1">
                      {links.map((link) => (
                        <a key={link.label} href={link.href}>
                          {link.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
                {paper.license && (
                  <div>
                    <DetailTerm>License</DetailTerm>
                    <dd className="mt-2 ml-0">{paper.license}</dd>
                  </div>
                )}
                {paper.acknowledgements && (
                  <div className="sm:col-span-2">
                    <DetailTerm>Acknowledgements</DetailTerm>
                    <dd className="mt-2 ml-0 max-w-prose">
                      {paper.acknowledgements}
                    </dd>
                  </div>
                )}
                {paper.versions && paper.versions.length > 0 && (
                  <div className="sm:col-span-2">
                    <DetailTerm>Revision history</DetailTerm>
                    <dd className="mt-2 ml-0">
                      <ol className="m-0 list-none divide-y divide-rule border-y border-rule p-0">
                        {[...paper.versions].reverse().map((entry) => (
                          <li
                            key={entry.version}
                            className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[4rem_7rem_1fr]"
                          >
                            <span className="font-mono text-meta text-ink">
                              {entry.version}
                            </span>
                            <span className="font-mono text-meta text-ink-muted tabular-nums">
                              {isoDate(entry.date)}
                            </span>
                            <span>{entry.note}</span>
                          </li>
                        ))}
                      </ol>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        </div>
      </article>

      {relatedPapers.length > 0 && (
        <section aria-labelledby="related-papers" className="mt-20 sm:mt-28">
          <SectionLabel
            index="01"
            title="Related papers"
            titleAs="h2"
            id="related-papers"
          />
          <PaperList
            papers={relatedPapers}
            authorNames={authorNames}
            topics={topicBySlug}
          />
        </section>
      )}

      {(adjacent.newer ?? adjacent.older) && (
        <nav
          aria-label="Adjacent papers"
          className="mt-16 grid border-y border-rule sm:grid-cols-2"
        >
          {[
            { label: "Older paper", paper: adjacent.older, end: false },
            { label: "Newer paper", paper: adjacent.newer, end: true },
          ].map(({ label, paper: neighbour, end }) =>
            neighbour ? (
              <Link
                key={label}
                href={`/papers/${neighbour.slug}`}
                className={
                  "topic-cell group block py-7 no-underline sm:px-6 " +
                  (end
                    ? "sm:col-start-2 sm:border-l sm:border-rule sm:text-right"
                    : "max-sm:border-b max-sm:border-rule")
                }
              >
                <span className="block text-label text-ink-muted uppercase">
                  {label}
                </span>
                <span className="mt-2 block font-serif text-h4 text-balance text-ink transition-colors group-hover:text-green-700">
                  {neighbour.title}
                </span>
              </Link>
            ) : null,
          )}
        </nav>
      )}
    </Container>
  );
}
