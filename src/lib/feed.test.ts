import { describe, expect, it } from "vitest";

import { escapeXml, renderFeed } from "./feed";

const options = {
  siteUrl: "https://example.org",
  title: "Journal",
  description: "Papers",
};

describe("renderFeed", () => {
  it("escapes markup in titles and abstracts", () => {
    const xml = renderFeed(
      [
        {
          slug: "a-paper",
          paperId: "PS-2026.001",
          title: "Cats & <dogs>",
          abstract: 'A "quoted" abstract',
          publishedAt: new Date("2026-02-10"),
          authorNames: ["O'Neil"],
          topicNames: ["R&D"],
        },
      ],
      options,
    );
    expect(xml).toContain("<title>Cats &amp; &lt;dogs&gt;</title>");
    expect(xml).toContain("<dc:creator>O&apos;Neil</dc:creator>");
    expect(xml).toContain("<link>https://example.org/papers/a-paper</link>");
    expect(xml).toContain("<pubDate>Tue, 10 Feb 2026 00:00:00 GMT</pubDate>");
  });

  it("renders an empty channel", () => {
    expect(renderFeed([], options)).not.toContain("<item>");
  });
});

describe("escapeXml", () => {
  it("escapes ampersands once", () => {
    expect(escapeXml("a & b")).toBe("a &amp; b");
  });
});
