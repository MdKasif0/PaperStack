import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { Button, Container, Input, SectionLabel } from "@/components/ui";
import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  description:
    "An open journal of independent research — careful papers on AI, cybersecurity, and web engineering, published with their data and their revision history.",
};

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const textLinkClasses =
  "inline-flex items-center gap-1.5 font-medium text-green-700 underline decoration-green-700/45 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2";

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
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <Hero
        paper={featured}
        authorNames={(featured?.authors ?? []).map(
          (author) => authorNames.get(author.slug) ?? author.slug,
        )}
        topicNames={(featured?.topics ?? []).flatMap(
          (slug) => topicBySlug.get(slug)?.name ?? [],
        )}
      />

      {/* ---------------------------------------------------------- */}
      {/* 01 — Latest papers                                          */}
      <div className="mt-16 sm:mt-20">
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
                  className="paper-row group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[1fr_8rem]"
                >
                  <div>
                    <h3 className="font-serif text-h3 text-balance text-ink">
                      <Link
                        href={`/papers/${paper.slug}`}
                        className="text-ink no-underline transition-colors group-hover:text-green-700 after:absolute after:inset-0"
                      >
                        {paper.title}
                      </Link>
                    </h3>
                    <p className="meta-line mt-2 text-meta text-ink-muted">
                      <span>
                        {paper.authors
                          .map(
                            (author) =>
                              authorNames.get(author.slug) ?? author.slug,
                          )
                          .join(", ")}
                      </span>
                      <span className="tabular-nums">
                        {isoDate(paper.publishedAt)}
                      </span>
                      {paper.topics.map((slug) => {
                        const topic = topicBySlug.get(slug);
                        return topic ? (
                          <span key={slug}>{topic.name}</span>
                        ) : null;
                      })}
                    </p>
                    <p className="mt-4 line-clamp-3 max-w-[66ch] font-serif text-abstract text-ink-soft">
                      {paper.abstract}
                    </p>
                  </div>
                  <p className="font-mono text-meta text-ink-muted tabular-nums sm:pt-1.5 sm:text-right">
                    {paper.paperId}
                  </p>
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
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 02 — Browse by topic                                        */}
      <div className="mt-16 sm:mt-20">
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
                className="paper-row group grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline"
              >
                <div>
                  <h3 className="font-serif text-h2 text-ink">
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="text-ink no-underline transition-colors group-hover:text-green-700 after:absolute after:inset-0"
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
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 03 — The collection in numbers                              */}
      <div className="mt-16 sm:mt-20">
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
                <p className="font-serif text-h2 text-ink tabular-nums">
                  {figure.value}
                </p>
                <p className="mt-2 text-label text-ink-muted uppercase">
                  {figure.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 04 — Authors                                                */}
      <div className="mt-16 sm:mt-20">
        <section aria-labelledby="authors">
          <SectionLabel index="04" title="Authors" titleAs="h2" id="authors" />
          <ul className="mt-10 flex list-none flex-wrap gap-x-14 gap-y-8 p-0">
            {authors.map((author) => (
              <li key={author.slug}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="group block no-underline"
                >
                  <span className="text-body font-medium text-ink underline-offset-4 transition-colors group-hover:text-green-900 group-hover:underline group-hover:decoration-green-700/45">
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
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 05 — Stay updated                                           */}
      <div className="mt-16 sm:mt-20">
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
      </div>
    </Container>
  );
}
