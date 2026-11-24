import Link from "next/link";
import { ArrowUpRight, Layers, UserRound } from "lucide-react";

import { buttonClasses } from "@/components/ui";
import type { PaperSummary } from "@/lib/content";

export interface FeaturedPaperProps {
  /** Undefined until the first paper is published. */
  paper: PaperSummary | undefined;
  authorNames: string[];
  topicNames: string[];
}

const panelClasses =
  "featured-panel relative overflow-hidden rounded-md border border-rule bg-paper-sunk p-6 sm:p-8";

export function FeaturedPaper({
  paper,
  authorNames,
  topicNames,
}: FeaturedPaperProps) {
  if (!paper) {
    return (
      <aside aria-labelledby="featured-heading" className={panelClasses}>
        <p id="featured-heading" className="text-label text-ink-soft uppercase">
          Currently featured
        </p>
        <p className="mt-5 font-serif text-h3 text-ink-soft">
          The first paper is in preparation.
        </p>
        <p className="mt-3 text-small text-ink-muted">
          It will appear here the day it is set.
        </p>
      </aside>
    );
  }

  const href = `/papers/${paper.slug}`;

  return (
    <aside aria-labelledby="featured-heading" className={panelClasses}>
      {/* A turned corner: the marked page in the stack. */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 size-6 bg-green-700 [clip-path:polygon(0_0,100%_0,0_100%)]"
      />

      <div className="flex items-center gap-4">
        <p id="featured-heading" className="text-label text-ink-soft uppercase">
          Currently featured
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-rule" />
        <p className="font-mono text-meta text-ink-soft tabular-nums">
          {paper.paperId}
        </p>
      </div>

      <h2 className="featured-title mt-6 font-serif text-balance text-ink">
        <Link
          href={href}
          className="text-ink no-underline transition-colors hover:text-green-700"
        >
          {paper.title}
        </Link>
      </h2>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-small">
        <p className="flex items-center gap-2 text-ink-soft">
          <UserRound
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-muted"
          />
          {authorNames.join(", ")}
        </p>
        {topicNames.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {topicNames.map((name) => (
              <li
                key={name}
                className="inline-flex items-center gap-1.5 rounded-xs border border-terracotta-600/25 bg-terracotta-100 px-2.5 py-0.5 text-meta text-ink"
              >
                <Layers
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-terracotta-700"
                />
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 max-w-[66ch] font-serif text-body leading-[1.65] text-ink-soft">
        {paper.abstract}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href={href}
          className={buttonClasses(
            "primary",
            "md",
            "group/cta h-12 rounded-md px-7 no-underline hover:text-paper",
          )}
        >
          Read paper
          <ArrowUpRight aria-hidden="true" className="arrow-nudge size-4" />
        </Link>
        {paper.hasPdf && paper.pdf && (
          <a
            href={paper.pdf}
            className="group/cta inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-terracotta-700 no-underline hover:text-ink"
          >
            <span className="link-rule link-rule-drawn pb-0.5">PDF</span>
          </a>
        )}
      </div>
    </aside>
  );
}
