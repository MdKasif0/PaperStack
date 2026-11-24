import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FeaturedPaper, type FeaturedPaperProps } from "./FeaturedPaper";

/** Deliberate desktop line breaks; smaller screens balance naturally. */
const HEADLINE_LINES = [
  "How machines learn,",
  "where systems break,",
  "and why the web",
] as const;

export type HeroProps = FeaturedPaperProps;

/** The home page opening: the journal's premise beside its featured paper. */
export function Hero(props: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grid gap-y-14 md:gap-y-16 lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-y-0"
    >
      <div className="lg:border-r lg:border-rule lg:py-2 lg:pr-8 xl:pr-10">
        <p className="hero-rise flex items-center gap-4 text-label text-ink-soft uppercase">
          <span
            aria-hidden="true"
            className="hidden h-0.5 w-10 shrink-0 bg-terracotta-600 sm:block"
          />
          Independent research, published in public
        </p>

        <h1
          id="hero-heading"
          className="hero-headline hero-rise mt-7 font-serif text-ink [--rise-delay:70ms]"
        >
          {HEADLINE_LINES.map((line) => (
            <span key={line} className="lg:block">
              {line}{" "}
            </span>
          ))}
          <span className="lg:block">
            behaves as it{" "}
            <span className="relative inline-block">
              does.
              <svg
                aria-hidden="true"
                viewBox="0 0 120 10"
                preserveAspectRatio="none"
                className="absolute -bottom-[0.1em] left-0 h-[0.15em] w-full text-terracotta-600"
                fill="currentColor"
              >
                <path d="M0 8.2C28 3.4 72 1 120 2.2C78 2.8 34 5.2 1.5 9.8C.2 10-.8 8.4 0 8.2Z" />
              </svg>
            </span>
          </span>
        </h1>

        <p className="hero-rise mt-8 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-ink-soft [--rise-delay:140ms] lg:mt-10 lg:text-body-lg">
          PaperStack is an independent journal of small, careful research. Every
          paper is written to be checked rather than skimmed, with its data, its
          method, and its revision history published alongside.
        </p>

        <p className="hero-rise mt-7 [--rise-delay:210ms] lg:mt-9">
          <Link
            href="/papers"
            className="group/cta inline-flex min-h-11 items-center gap-2 text-[1.125rem] font-medium text-green-700 no-underline hover:text-green-900"
          >
            <span className="link-rule link-rule-drawn pb-1">
              Browse the library
            </span>
            <ArrowUpRight aria-hidden="true" className="arrow-nudge size-5" />
          </Link>
        </p>
      </div>

      <div className="hero-rise [--rise-delay:180ms] lg:pl-8 xl:pl-10">
        <FeaturedPaper {...props} />
      </div>
    </section>
  );
}
