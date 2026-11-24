import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";
import { getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Topics",
  description: "The subjects PaperStack covers.",
};

// Stub — full topic pages arrive in a later step.
export default async function TopicsPage() {
  const topics = await getAllTopics();

  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Subjects" title="Topics" />

      <ul className="list-none divide-y divide-rule p-0">
        {topics.map((topic) => (
          <li key={topic.slug} className="paper-row group">
            <Link
              href={`/topics/${topic.slug}`}
              className="grid gap-x-16 gap-y-2 py-9 no-underline lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-baseline"
            >
              <h2 className="flex items-center gap-3 font-serif text-h2 text-ink transition-colors group-hover:text-green-700">
                {topic.name}
              </h2>
              <p className="max-w-prose text-body text-ink-soft">
                {topic.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
