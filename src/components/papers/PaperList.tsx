import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PaperSummary, Topic } from "@/lib/content";
import { excerpt } from "@/lib/excerpt";

export interface PaperListProps {
  papers: PaperSummary[];
  authorNames: ReadonlyMap<string, string>;
  topics: ReadonlyMap<string, Topic>;
  /** Heading level for titles, to keep the page outline in order. */
  titleAs?: "h2" | "h3";
}

/**
 * The archive listing: index, then title, byline and abstract, then the
 * publication identifier. The title link covers the whole entry.
 */
export function PaperList({
  papers,
  authorNames,
  topics,
  titleAs: Title = "h3",
}: PaperListProps) {
  return (
    <ul className="m-0 list-none p-0">
      {papers.map((paper, index) => {
        const published = paper.publishedAt.toISOString().slice(0, 10);
        return (
          <li
            key={paper.slug}
            className="paper-row paper-entry group grid gap-x-8 gap-y-5 border-b border-rule py-[2.125rem] md:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[4.5rem_minmax(0,1fr)_auto] lg:gap-x-9"
          >
            <span
              aria-hidden="true"
              className="hidden h-11 items-start justify-between border-r border-rule pt-1.5 font-mono text-small text-terracotta-700 tabular-nums lg:flex"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <Title className="paper-entry-title max-w-[32em] font-serif text-pretty text-ink">
                <Link
                  href={`/papers/${paper.slug}`}
                  className="text-ink no-underline transition-colors duration-200 group-hover:text-green-700 after:absolute after:inset-0"
                >
                  <span className="link-rule">{paper.title}</span>
                </Link>
              </Title>

              <div className="mt-3 flex flex-wrap items-center gap-y-2 text-meta text-ink-muted">
                <p className="meta-line mr-3">
                  <span>
                    {paper.authors
                      .map(
                        (author) => authorNames.get(author.slug) ?? author.slug,
                      )
                      .join(", ")}
                  </span>
                  <time dateTime={published} className="tabular-nums">
                    {published}
                  </time>
                </p>
                {paper.topics.map((slug) => {
                  const topic = topics.get(slug);
                  return topic ? (
                    <span
                      key={slug}
                      className="mr-2 rounded-xs bg-green-100/70 px-2 py-px text-green-900"
                    >
                      {topic.name}
                    </span>
                  ) : null;
                })}
              </div>

              <p className="mt-[1.125rem] line-clamp-6 max-w-[46rem] font-serif text-body leading-[1.65] text-ink-soft md:line-clamp-3">
                {excerpt(paper.abstract, 155)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-7 self-start md:h-10 md:border-l md:border-rule md:pl-7">
              <span className="font-mono text-meta text-ink-muted tabular-nums transition-colors duration-200 group-focus-within:text-ink group-hover:text-ink">
                {paper.paperId}
              </span>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.5}
                className="paper-entry-arrow size-5 text-green-700"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
