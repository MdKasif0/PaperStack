import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getAllAuthors } from "../src/lib/content/authors";
import { getAllPapers } from "../src/lib/content/papers";
import {
  serializeSearchIndex,
  toSearchDocuments,
} from "../src/lib/content/search-index";

async function main(): Promise<void> {
  const [papers, authors] = await Promise.all([
    getAllPapers(),
    getAllAuthors(),
  ]);
  const authorNames = new Map(
    authors.map((author) => [author.slug, author.name]),
  );
  const json = serializeSearchIndex(toSearchDocuments(papers, authorNames));

  const outDir = path.join(process.cwd(), "public", "search");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "index.json");
  await writeFile(outFile, json, "utf8");
  console.log(
    `search index: ${papers.length} documents -> ${path.relative(process.cwd(), outFile)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
