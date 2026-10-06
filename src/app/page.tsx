import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import {
  Button,
  Container,
  Input,
  SectionLabel,
  Tag,
  type TagTone,
} from "@/components/ui";
import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  description:
    "An open journal of independent research — careful papers on AI, cybersecurity, and web engineering, published with their data and their revision history.",
};

const topicTone: Record<string, TagTone> = {
  green: "green",
  terracotta: "terracotta",
  gold: "gold",
};

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const textLinkClasses =
  "inline-flex items-center gap-1.5 font-medium text-green-700 underline decoration-terracotta-600 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2";

export default async function HomePage() {
  const [papers, authors, topics] = await Promise.all([
    getAllPapers(),
    getAllAuthors(),
    getAllTopics(),
  ]);

  const authorNames = new Map(
    authors.map((author) => [author.slug, author.name]),
  );
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
  const featured = papers.find((paper) => paper.featured) ?? papers[0];
  const latest = papers.slice(0, 5);
  const topicCounts = topics.map((topic) => ({
    topic,
    count: papers.filter((paper) => paper.topics.includes(topic.slug)).length,
  }));
  const totalReadingMinutes = papers.reduce(
    (sum, paper) => sum + paper.readingTimeMinutes,
    0,
  );

  const figures = [
    { value: papers.length, label: "Papers" },
    { value: authors.length, label: "Authors" },
    { value: topics.length, label: "Topics" },
    { value: totalReadingMinutes, label: "Minutes of reading" },
  ];

  return (
    <Container width="site" className="pt-14 pb-10 sm:pt-20">
      {/* ---------------------------------------------------------- */}
      {/* Opening: editorial masthead with the featured paper panel   */}
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <p className="text-label text-ink-muted uppercase">
            Independent research, published in public
          </p>
          <h1 className="mt-6 max-w-[15em] font-serif text-display text-ink">
            How machines learn, where systems break, and why the web behaves as
            it does.
          </h1>
          <p className="mt-8 max-w-prose text-body-lg text-ink-soft">
            PaperStack is an independent journal of small, careful research.
            Every paper is written to be checked rather than skimmed — with its
            data, its method, and its revision history published alongside.
          </p>
          <p className="mt-9">
            <Link href="/papers" className={textLinkClasses}>
              Browse the library
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5">
          {featured ? (
            <aside
              aria-labelledby="featured-heading"
              className="rounded-sm border border-rule bg-paper-raised p-6 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  id="featured-heading"
                  className="text-label text-ink-muted uppercase"
                >
                  Currently featured
                </p>
                <p className="font-mono text-small text-terracotta-700 tabular-nums">
                  {featured.paperId}
                </p>
              </div>
              <h2 className="mt-5 font-serif text-h3 text-ink">
                <Link
                  href={`/papers/${featured.slug}`}
                  className="no-underline transition-colors hover:text-green-900"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-3 text-small text-ink-muted">
                {featured.authors
                  .map((author) => authorNames.get(author.slug) ?? author.slug)
                  .join(", ")}
              </p>
              <p className="mt-4 line-clamp-2 text-small leading-relaxed text-ink-soft">
                {featured.abstract}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule pt-5">
                {featured.topics.map((slug) => {
                  const topic = topicBySlug.get(slug);
                  return topic ? (
                    <Tag key={slug} tone={topicTone[topic.accent] ?? "neutral"}>
                      {topic.name}
                    </Tag>
                  ) : null;
                })}
              </div>
              <div className="mt-5 flex items-center gap-6 border-t border-rule pt-5">
                <Link
                  href={`/papers/${featured.slug}`}
                  className={textLinkClasses}
                >
                  Read paper
                </Link>
                {featured.hasPdf && featured.pdf && (
                  <a href={featured.pdf} className={textLinkClasses}>
                    PDF
                  </a>
                )}
              </div>
            </aside>
          ) : (
            <aside
              aria-labelledby="featured-heading"
              className="rounded-sm border border-rule bg-paper-raised p-6 sm:p-8"
            >
              <p
                id="featured-heading"
                className="text-label text-ink-muted uppercase"
              >
                Currently featured
              </p>
              <p className="mt-5 font-serif text-h3 text-ink-soft">
                The first paper is in preparation.
              </p>
              <p className="mt-3 text-small text-ink-muted">
                It will appear here the day it is set.
              </p>
            </aside>
          )}
        </Reveal>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 01 — Latest papers                                          */}
      <Reveal className="mt-24 sm:mt-32">
        <section aria-labelledby="latest-papers">
          <SectionLabel
            index="01"
            title="Latest papers"
            titleAs="h2"
            id="latest-papers"
          />
          {latest.length > 0 ? (
            <ul className="mt-2 list-none divide-y divide-rule p-0">
              {latest.map((paper) => (
                <li
                  key={paper.slug}
                  className="group relative grid gap-x-6 gap-y-2 py-7 sm:grid-cols-[9rem_1fr]"
                >
                  <div className="font-mono text-small text-ink-muted tabular-nums">
                    <p className="text-terracotta-700">{paper.paperId}</p>
                    <p className="mt-0.5">{isoDate(paper.publishedAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-serif text-h3 text-ink">
                      <Link
                        href={`/papers/${paper.slug}`}
                        className="no-underline group-hover:underline group-hover:decoration-terracotta-600 group-hover:decoration-1 group-hover:underline-offset-4 after:absolute after:inset-0"
                      >
                        {paper.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-small text-ink-muted">
                      {paper.authors
                        .map(
                          (author) =>
                            authorNames.get(author.slug) ?? author.slug,
                        )
                        .join(", ")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {paper.topics.map((slug) => {
                        const topic = topicBySlug.get(slug);
                        return topic ? (
                          <Tag
                            key={slug}
                            tone={topicTone[topic.accent] ?? "neutral"}
                          >
                            {topic.name}
                          </Tag>
                        ) : null;
                      })}
                    </div>
                    <p className="mt-3 line-clamp-1 max-w-prose text-small text-ink-soft">
                      {paper.abstract}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-prose">
              <p className="font-serif text-h3 text-ink-soft">
                The first paper is in preparation.
              </p>
              <p className="mt-3 text-small text-ink-muted">
                Subscribe below and it will reach you the day it is set.
              </p>
            </div>
          )}
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- */}
      {/* 02 — Browse by topic                                        */}
      <Reveal className="mt-24 sm:mt-32">
        <section aria-labelledby="browse-by-topic">
          <SectionLabel
            index="02"
            title="Browse by topic"
            titleAs="h2"
            id="browse-by-topic"
          />
          <ul className="mt-2 list-none divide-y divide-rule p-0">
            {topicCounts.map(({ topic, count }) => (
              <li
                key={topic.slug}
                className="group relative grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[1fr_auto] sm:items-baseline"
              >
                <div>
                  <h3 className="font-serif text-h2 text-ink">
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="no-underline group-hover:underline group-hover:decoration-terracotta-600 group-hover:decoration-1 group-hover:underline-offset-[6px] after:absolute after:inset-0"
                    >
                      {topic.name}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-prose text-body text-ink-soft">
                    {topic.description}
                  </p>
                </div>
                <p className="font-mono text-small text-ink-muted tabular-nums sm:text-right">
                  {count} {count === 1 ? "paper" : "papers"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- */}
      {/* 03 — The collection in numbers                              */}
      <Reveal className="mt-24 sm:mt-32">
        <section aria-labelledby="in-numbers">
          <SectionLabel
            index="03"
            title="The collection in numbers"
            titleAs="h2"
            id="in-numbers"
          />
          <div className="mt-8 grid grid-cols-2 gap-px border-y border-rule bg-rule lg:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="bg-paper px-5 py-7 sm:px-8">
                <p className="font-mono text-h2 text-green-900 tabular-nums">
                  {figure.value}
                </p>
                <p className="mt-2 text-label text-ink-muted uppercase">
                  {figure.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- */}
      {/* 04 — Authors                                                */}
      <Reveal className="mt-24 sm:mt-32">
        <section aria-labelledby="authors">
          <SectionLabel index="04" title="Authors" titleAs="h2" id="authors" />
          <ul className="mt-10 flex list-none flex-wrap gap-x-14 gap-y-8 p-0">
            {authors.map((author) => (
              <li key={author.slug}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="group block no-underline"
                >
                  <span className="text-body font-medium text-ink underline-offset-4 transition-colors group-hover:text-green-900 group-hover:underline group-hover:decoration-terracotta-600">
                    {author.name}
                  </span>
                  <span className="mt-1 block max-w-56 text-small text-ink-muted">
                    {author.affiliation}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- */}
      {/* 05 — Stay updated                                           */}
      <Reveal className="mt-24 sm:mt-32">
        <section aria-labelledby="stay-updated">
          <SectionLabel
            index="05"
            title="Stay updated"
            titleAs="h2"
            id="stay-updated"
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <p className="max-w-prose text-body-lg text-ink-soft">
                Occasional digests of new papers and revised versions — no
                tracking, no noise. Or take the whole feed:
              </p>
              <a href="/feed.xml" className={textLinkClasses + " mt-6"}>
                <Rss aria-hidden="true" className="size-4" />
                Subscribe via RSS
              </a>
            </div>
            <form
              className="flex max-w-md flex-col gap-6"
              aria-describedby="newsletter-note"
            >
              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="you@institution.edu"
                hint="One digest per issue. Unsubscribe any time."
              />
              <div>
                <Button type="button">Subscribe</Button>
              </div>
              <p id="newsletter-note" className="text-small text-ink-muted">
                The letterbox opens with the next issue; RSS is live today.
              </p>
            </form>
          </div>
        </section>
      </Reveal>
    </Container>
  );
}
