import Link from "next/link";

import type { PaperSummary, Topic } from "@/lib/content";

export interface PaperListProps {
  papers: PaperSummary[];
  authorNames: ReadonlyMap<string, string>;
  topics: ReadonlyMap<string, Topic>;
  /** Heading level for titles, to keep the page outline in order. */
  titleAs?: "h2" | "h3";
}

/** Ruled rows: title and byline, abstract, identifier. */
export function PaperList({
  papers,
  authorNames,
  topics,
  titleAs: Title = "h3",
}: PaperListProps) {
  return (
    <ul className="m-0 list-none divide-y divide-rule p-0">
      {papers.map((paper) => (
        <li
          key={paper.slug}
          className="paper-row group grid gap-x-10 gap-y-4 py-9 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_6.5rem]"
        >
          <div>
            <Title className="font-serif text-h3 text-balance text-ink">
              <Link
                href={`/papers/${paper.slug}`}
                className="text-ink no-underline transition-colors group-hover:text-green-700 after:absolute after:inset-0"
              >
                {paper.title}
              </Link>
            </Title>
            <p className="meta-line mt-2 text-meta text-ink-muted">
              <span>
                {paper.authors
                  .map((author) => authorNames.get(author.slug) ?? author.slug)
                  .join(", ")}
              </span>
              <span className="tabular-nums">
                {paper.publishedAt.toISOString().slice(0, 10)}
              </span>
              {paper.topics.map((slug) => {
                const topic = topics.get(slug);
                return topic ? <span key={slug}>{topic.name}</span> : null;
              })}
            </p>
          </div>
          <p className="line-clamp-3 max-w-[66ch] self-start font-serif text-abstract text-ink-soft">
            {paper.abstract}
          </p>
          <p className="font-mono text-meta text-ink-muted tabular-nums lg:pt-1.5 lg:text-right">
            {paper.paperId}
          </p>
        </li>
      ))}
    </ul>
  );
}
