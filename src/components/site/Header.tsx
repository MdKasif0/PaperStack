import { getAllAuthors, getAllTopics, getVolumeInfo } from "@/lib/content";

import { Masthead } from "./Masthead";

/**
 * Server shell: the small-caps strip above the masthead carries the journal
 * line and the volume, generated from published content. The strip scrolls
 * away; the masthead beneath it sticks.
 */
export async function Header() {
  const [{ volume, year }, authors, topics] = await Promise.all([
    getVolumeInfo(),
    getAllAuthors(),
    getAllTopics(),
  ]);

  return (
    <>
      <div className="mx-auto w-full max-w-site px-5 sm:px-8">
        <div className="flex h-10 items-center justify-between gap-4 border-b border-rule">
          <p className="truncate text-label text-ink-soft uppercase">
            An open journal of independent research
          </p>
          <p className="shrink-0 font-mono text-label text-ink-soft tabular-nums">
            Vol. {volume} · {year}
          </p>
        </div>
      </div>
      <Masthead
        authors={authors.map((author) => ({
          slug: author.slug,
          name: author.name,
        }))}
        topics={topics.map((topic) => ({
          slug: topic.slug,
          name: topic.name,
        }))}
      />
    </>
  );
}
