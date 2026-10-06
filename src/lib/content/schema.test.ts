import { describe, expect, it } from "vitest";

import { authorSchema, paperFrontmatterSchema, topicSchema } from "./schema";

const validPaper = {
  title: "A Sample Paper",
  slug: "a-sample-paper",
  abstract: "An abstract.",
  authors: [{ slug: "md-kasif-uddin", corresponding: true }],
  publishedAt: "2026-02-10",
  topics: ["artificial-intelligence"],
  keywords: ["distillation"],
  type: "research-paper",
  status: "published",
};

describe("paperFrontmatterSchema", () => {
  it("parses valid frontmatter and coerces dates", () => {
    const parsed = paperFrontmatterSchema.parse(validPaper);
    expect(parsed.publishedAt).toBeInstanceOf(Date);
    expect(parsed.authors[0]?.corresponding).toBe(true);
  });

  it("defaults featured to false", () => {
    const parsed = paperFrontmatterSchema.parse(validPaper);
    expect(parsed.featured).toBe(false);
  });

  it("rejects an unknown type", () => {
    expect(() =>
      paperFrontmatterSchema.parse({ ...validPaper, type: "blog-post" }),
    ).toThrow();
  });

  it("rejects a status outside the enum", () => {
    expect(() =>
      paperFrontmatterSchema.parse({ ...validPaper, status: "archived" }),
    ).toThrow();
  });

  it("rejects a pdf path outside /papers/", () => {
    expect(() =>
      paperFrontmatterSchema.parse({
        ...validPaper,
        pdf: "https://example.com/paper.pdf",
      }),
    ).toThrow(/\/papers\//);
  });

  it("accepts a valid pdf path", () => {
    const parsed = paperFrontmatterSchema.parse({
      ...validPaper,
      pdf: "/papers/a-sample-paper/paper.pdf",
    });
    expect(parsed.pdf).toBe("/papers/a-sample-paper/paper.pdf");
  });

  it("requires at least one author", () => {
    expect(() =>
      paperFrontmatterSchema.parse({ ...validPaper, authors: [] }),
    ).toThrow();
  });

  it("strips unknown keys", () => {
    const parsed = paperFrontmatterSchema.parse({
      ...validPaper,
      irrelevant: "value",
    });
    expect("irrelevant" in parsed).toBe(false);
  });
});

describe("authorSchema", () => {
  const validAuthor = {
    slug: "md-kasif-uddin",
    name: "Md Kasif Uddin",
    affiliation: "Chandigarh University, Mohali, India",
    role: "Author",
    bio: "B.Tech student.",
  };

  it("parses a valid author", () => {
    expect(authorSchema.parse(validAuthor).slug).toBe("md-kasif-uddin");
  });

  it("rejects a malformed email", () => {
    expect(() =>
      authorSchema.parse({ ...validAuthor, email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects a non-kebab-case slug", () => {
    expect(() =>
      authorSchema.parse({ ...validAuthor, slug: "Md Kasif" }),
    ).toThrow();
  });
});

describe("topicSchema", () => {
  it("accepts the three accents", () => {
    for (const accent of ["green", "terracotta", "gold"] as const) {
      expect(() =>
        topicSchema.parse({
          slug: "web-engineering",
          name: "Web Engineering",
          description: "Web systems.",
          accent,
        }),
      ).not.toThrow();
    }
  });

  it("rejects an accent outside the palette", () => {
    expect(() =>
      topicSchema.parse({
        slug: "web-engineering",
        name: "Web Engineering",
        description: "Web systems.",
        accent: "blue",
      }),
    ).toThrow();
  });
});
