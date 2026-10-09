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
      <div className="border-b border-rule bg-paper">
        <div className="mx-auto flex h-9 w-full max-w-site items-center justify-between gap-4 px-5 sm:px-8">
          <p className="truncate text-label text-ink-muted uppercase">
            An open journal of independent research
          </p>
          <p className="shrink-0 font-mono text-label text-ink-muted tabular-nums">
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
