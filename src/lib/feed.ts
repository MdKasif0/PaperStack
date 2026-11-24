export interface FeedPaper {
  slug: string;
  paperId: string;
  title: string;
  abstract: string;
  publishedAt: Date;
  authorNames: string[];
  topicNames: string[];
}

export interface FeedOptions {
  siteUrl: string;
  title: string;
  description: string;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Renders papers, newest first, as an RSS 2.0 document. */
export function renderFeed(
  papers: readonly FeedPaper[],
  { siteUrl, title, description }: FeedOptions,
): string {
  const items = papers.map((paper) => {
    const link = escapeXml(`${siteUrl}/papers/${paper.slug}`);
    return [
      "    <item>",
      `      <title>${escapeXml(paper.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${paper.publishedAt.toUTCString()}</pubDate>`,
      ...paper.authorNames.map(
        (name) => `      <dc:creator>${escapeXml(name)}</dc:creator>`,
      ),
      ...paper.topicNames.map(
        (name) => `      <category>${escapeXml(name)}</category>`,
      ),
      `      <description>${escapeXml(paper.abstract)}</description>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
