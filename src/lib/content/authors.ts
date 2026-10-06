import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { authorSchema, formatValidationError, type Author } from "./schema";

const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");

async function loadAuthors(): Promise<Author[]> {
  let entries;
  try {
    entries = await readdir(AUTHORS_DIR, { withFileTypes: true });
  } catch {
    throw new Error(`content/authors directory not found at ${AUTHORS_DIR}`);
  }

  const errors: string[] = [];
  const authors: Author[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const filePath = path.join(AUTHORS_DIR, entry.name);
    let raw: string;
    let parsedJson: unknown;
    try {
      raw = await readFile(filePath, "utf8");
      parsedJson = JSON.parse(raw);
    } catch (error) {
      errors.push(`${filePath}: unreadable or invalid JSON (${String(error)})`);
      continue;
    }
    const parsed = authorSchema.safeParse(parsedJson);
    if (!parsed.success) {
      errors.push(formatValidationError(parsed.error, filePath));
      continue;
    }
    if (parsed.data.slug !== entry.name.replace(/\.json$/, "")) {
      errors.push(
        `${filePath}: slug "${parsed.data.slug}" does not match file name "${entry.name}"`,
      );
      continue;
    }
    authors.push(parsed.data);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid author content:\n${errors.join("\n\n")}`);
  }
  return authors.sort((a, b) => a.name.localeCompare(b.name));
}

let authorsCache: Promise<Author[]> | null = null;

export async function getAllAuthors(): Promise<Author[]> {
  authorsCache ??= loadAuthors();
  return authorsCache;
}

export async function getAuthor(slug: string): Promise<Author | null> {
  const authors = await getAllAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
}
