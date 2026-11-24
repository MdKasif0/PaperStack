import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/home/Hero";
import { AuthorDirectory } from "@/components/home/AuthorDirectory";
import { CollectionNumbers } from "@/components/home/CollectionNumbers";
import { LatestPapers } from "@/components/home/LatestPapers";
import { StayUpdated } from "@/components/home/StayUpdated";
import { Reveal } from "@/components/site/Reveal";
import { Container, SectionLabel } from "@/components/ui";
import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  description:
    "An open journal of independent research — careful papers on AI, cybersecurity, and web engineering, published with their data and their revision history.",
};

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

  // Counted from published papers, so the figures describe the collection.
  const uniqueAuthors = new Set(
    papers.flatMap((paper) => paper.authors.map((author) => author.slug)),
  );
  const uniqueTopics = new Set(papers.flatMap((paper) => paper.topics));

  const figures = [
    { value: papers.length, label: "Papers" },
    { value: uniqueAuthors.size, label: "Authors" },
    { value: uniqueTopics.size, label: "Topics" },
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
      <div className="mt-20 sm:mt-28">
        <LatestPapers
          papers={latest}
          authorNames={authorNames}
          topics={topicBySlug}
        />
      </div>

      {/* ---------------------------------------------------------- */}
      {/* 02 — Browse by topic                                        */}
      <div className="mt-20 sm:mt-28">
        <section aria-labelledby="browse-by-topic">
          <SectionLabel
            index="02"
            title="Browse by topic"
            titleAs="h2"
            id="browse-by-topic"
          />
          <ul className="mt-6 grid list-none divide-y divide-rule border-y border-rule p-0 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {topicCounts.map(({ topic, count }) => (
              <li
                key={topic.slug}
                className="topic-cell group relative flex flex-col justify-between gap-8 py-8 lg:px-8 lg:py-10 lg:first:pl-0 lg:last:pr-0"
              >
                <div>
                  <h3 className="font-serif text-h3 text-ink">
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="text-ink no-underline transition-colors group-hover:text-green-700 after:absolute after:inset-0"
                    >
                      {topic.name}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-prose text-body text-ink-soft">
                    {topic.description}
                  </p>
                </div>
                <p className="font-mono text-meta text-ink-muted tabular-nums">
                  {count} {count === 1 ? "paper" : "papers"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Reveal className="mt-20">
        <CollectionNumbers figures={figures} />
      </Reveal>
      <Reveal className="mt-[4.75rem]">
        <AuthorDirectory authors={authors} />
      </Reveal>
      <Reveal className="mt-[4.75rem]">
        <StayUpdated />
      </Reveal>
    </Container>
  );
}
