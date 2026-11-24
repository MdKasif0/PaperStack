import { PaperList, type PaperListProps } from "@/components/papers/PaperList";

export type LatestPapersProps = Omit<PaperListProps, "titleAs">;

/** The home page archive: section mark, heading, and the newest papers. */
export function LatestPapers(props: LatestPapersProps) {
  return (
    <section aria-labelledby="latest-papers">
      <header>
        <p className="flex items-center gap-3 text-label text-ink-muted uppercase">
          <span className="font-mono text-terracotta-700 tabular-nums">01</span>
          <span aria-hidden="true">/</span>
          Latest papers
          <span
            aria-hidden="true"
            className="ml-2 h-0.5 w-9 bg-terracotta-600"
          />
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-7 gap-y-2">
          <h2 id="latest-papers" className="font-serif text-h1 text-ink">
            Recent Research
          </h2>
          <span
            aria-hidden="true"
            className="hidden h-px min-w-12 flex-1 -translate-y-1.5 bg-rule md:block"
          />
          <p className="font-serif text-abstract text-ink-soft italic">
            The latest papers from the PaperStack archive.
          </p>
        </div>
      </header>

      {props.papers.length > 0 ? (
        <div className="mt-4 sm:mt-5">
          <PaperList {...props} />
        </div>
      ) : (
        <div className="mt-9 max-w-prose">
          <p className="font-serif text-h3 text-ink-soft">
            The first paper is in preparation.
          </p>
          <p className="mt-3 text-small text-ink-muted">
            Subscribe below and it will reach you the day it is set.
          </p>
        </div>
      )}
    </section>
  );
}
