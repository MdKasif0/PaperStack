import { z } from "zod";

/**
 * Content schemas. Everything that enters the pipeline (MDX frontmatter,
 * author JSON, topic JSON) is validated against these at load time so a bad
 * file fails the build with an error that names the offending file.
 */

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

/* ------------------------------------------------------------------ */
/* Paper                                                               */
/* ------------------------------------------------------------------ */

export const paperAuthorRefSchema = z.object({
  /** Author slug; must match an author file in content/authors/. */
  slug: slugSchema,
  /** Marks the corresponding author (max one per paper, not enforced here). */
  corresponding: z.boolean().optional(),
});

export const paperLinksSchema = z.object({
  doi: z.url().optional(),
  arxiv: z.url().optional(),
  github: z.url().optional(),
  dataset: z.url().optional(),
  slides: z.url().optional(),
});

export const paperVersionSchema = z.object({
  version: z.string().min(1),
  date: z.coerce.date(),
  note: z.string().min(1),
});

export const paperFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: slugSchema,
  abstract: z.string().min(1),
  /** Ordered author list; the first entry is the primary author. */
  authors: z.array(paperAuthorRefSchema).min(1),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  topics: z.array(slugSchema),
  keywords: z.array(z.string().min(1)),
  type: z.enum(["research-paper", "preprint", "technical-report", "survey"]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
  /** Static PDF path served from public/, e.g. /papers/<slug>/paper.pdf. */
  pdf: z
    .string()
    .refine((value) => value.startsWith("/papers/"), {
      message: "must be a path under /papers/",
    })
    .optional(),
  links: paperLinksSchema.optional(),
  versions: z.array(paperVersionSchema).optional(),
  license: z.string().optional(),
  acknowledgements: z.string().optional(),
  /** Sample/demo papers are filtered out when SAMPLE_CONTENT is false. */
  sample: z.boolean().optional(),
});

export type PaperAuthorRef = z.infer<typeof paperAuthorRefSchema>;
export type PaperLinks = z.infer<typeof paperLinksSchema>;
export type PaperVersion = z.infer<typeof paperVersionSchema>;
export type PaperFrontmatter = z.infer<typeof paperFrontmatterSchema>;
export type PaperType = PaperFrontmatter["type"];
export type PaperStatus = PaperFrontmatter["status"];

/* ------------------------------------------------------------------ */
/* Author                                                              */
/* ------------------------------------------------------------------ */

export const authorLinksSchema = z.object({
  orcid: z.url().optional(),
  googleScholar: z.url().optional(),
  github: z.url().optional(),
  x: z.url().optional(),
  website: z.url().optional(),
});

export const authorSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  affiliation: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  avatar: z.string().optional(),
  email: z.email().optional(),
  links: authorLinksSchema.optional(),
});

export type AuthorLinks = z.infer<typeof authorLinksSchema>;
export type Author = z.infer<typeof authorSchema>;

/* ------------------------------------------------------------------ */
/* Topic                                                               */
/* ------------------------------------------------------------------ */

export const topicSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  accent: z.enum(["green", "terracotta", "gold"]),
});

export type Topic = z.infer<typeof topicSchema>;

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

/** Formats a ZodError as a build-time message that names the file. */
export function formatValidationError(
  error: z.ZodError,
  filePath: string,
): string {
  const issues = error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  return `Invalid content in ${filePath}:\n${issues}`;
}
