import GithubSlugger from "github-slugger";

export interface TocEntry {
  depth: 2 | 3 | 4;
  text: string;
  slug: string;
  children: TocEntry[];
}

const FENCE_PATTERN = /^\s*(`{3,}|~{3,})/;

/**
 * Extracts h2–h4 headings from raw MDX into a nested tree. Slugs are
 * produced with github-slugger, the same algorithm rehype-slug uses at
 * render time, so the ids stay in sync with the rendered headings.
 */
export function extractTableOfContents(mdx: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const root: TocEntry[] = [];
  const stack: TocEntry[] = [];
  let fence: string | null = null;

  for (const line of mdx.split("\n")) {
    const fenceMatch = line.match(FENCE_PATTERN);
    if (fenceMatch) {
      const marker = fenceMatch[1] ?? "";
      if (fence === null) {
        fence = marker.charAt(0);
      } else if (marker.startsWith(fence)) {
        fence = null;
      }
      continue;
    }
    if (fence !== null) continue;

    const headingMatch = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (!headingMatch) continue;

    const hashes = headingMatch[1] ?? "";
    const rawText = headingMatch[2] ?? "";
    const text = rawText
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();
    const depth = hashes.length as TocEntry["depth"];
    const entry: TocEntry = {
      depth,
      text,
      slug: slugger.slug(text),
      children: [],
    };

    while (stack.length > 0 && (stack.at(-1)?.depth ?? 0) >= depth) {
      stack.pop();
    }
    const parent = stack.at(-1);
    if (parent) {
      parent.children.push(entry);
    } else {
      root.push(entry);
    }
    stack.push(entry);
  }

  return root;
}
