import { describe, expect, it } from "vitest";

import { extractTableOfContents } from "./toc";

describe("extractTableOfContents", () => {
  it("builds a nested tree from h2–h4 headings", () => {
    const mdx = [
      "## Introduction",
      "",
      "## Method",
      "",
      "### Alignment objective",
      "",
      "#### Details",
      "",
      "### Training configuration",
      "",
      "## Results",
      "",
      "### Tables",
      "",
      "## References",
    ].join("\n");

    const toc = extractTableOfContents(mdx);
    expect(toc.map((entry) => entry.text)).toEqual([
      "Introduction",
      "Method",
      "Results",
      "References",
    ]);
    const method = toc.find((entry) => entry.text === "Method");
    expect(method?.children.map((entry) => entry.text)).toEqual([
      "Alignment objective",
      "Training configuration",
    ]);
    expect(method?.children[0]?.children[0]?.text).toBe("Details");
  });

  it("ignores headings inside fenced code blocks", () => {
    const mdx = [
      "## Real",
      "",
      "```python",
      "## not a heading",
      "### also not",
      "```",
      "",
      "## Also real",
    ].join("\n");

    const toc = extractTableOfContents(mdx);
    expect(toc.map((entry) => entry.text)).toEqual(["Real", "Also real"]);
  });

  it("strips inline markdown and slugs like rehype-slug", () => {
    const mdx = "## The `fast` path — **measured**";
    const toc = extractTableOfContents(mdx);
    expect(toc[0]?.text).toBe("The fast path — measured");
    expect(toc[0]?.slug).toBe("the-fast-path--measured");
  });

  it("returns an empty tree for heading-free content", () => {
    expect(extractTableOfContents("Just a paragraph.")).toEqual([]);
  });
});
