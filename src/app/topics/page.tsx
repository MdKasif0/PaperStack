import type { Metadata } from "next";
import Link from "next/link";

import { Container, SectionLabel } from "@/components/ui";
import { getAllTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Topics",
  description: "The subjects PaperStack covers.",
};

const accentDot: Record<string, string> = {
  green: "bg-green-700",
  terracotta: "bg-terracotta-600",
  gold: "bg-gold-500",
};

// Stub — full topic pages arrive in a later step.
export default async function TopicsPage() {
  const topics = await getAllTopics();

  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Subjects" />
      <h1 className="mt-6 font-serif text-h1 text-ink">Topics</h1>

      <ul className="mt-12 flex max-w-3xl list-none flex-col divide-y divide-rule p-0">
        {topics.map((topic) => (
          <li key={topic.slug} className="py-6 first:pt-0">
            <Link
              href={`/topics/${topic.slug}`}
              className="group block no-underline"
            >
              <h2 className="flex items-center gap-3 font-serif text-h3 text-ink transition-colors group-hover:text-green-900">
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${accentDot[topic.accent] ?? "bg-green-700"}`}
                />
                {topic.name}
              </h2>
              <p className="mt-2 max-w-prose text-body text-ink-soft">
                {topic.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
