import MiniSearch from "minisearch";

/**
 * Client search index. The build script serialises it to
 * public/search/index.json; the library page and the command palette load
 * it lazily and hydrate it with MiniSearch.loadJSON via createMiniSearch(),
 * so the field configuration here is the single source of truth.
 *
 * Stored fields intentionally carry everything the library rows need to
 * render (dates, PDF paths, author slugs, DOIs) so no second data source
 * is required on the client.
 */

export interface SearchDocument {
  slug: string;
  paperStackId: string;
  title: string;
  abstract: string;
  /** Author display names, in paper order. */
  authors: string[];
  /** Author slugs, parallel to `authors`; used by the author filter. */
  authorSlugs: string[];
  topics: string[];
  keywords: string[];
  type: string;
  year: number;
  /** ISO date, e.g. 2026-02-10. */
  publishedAt: string;
  pdf: string | null;
  doi: string | null;
}

export const miniSearchOptions = {
  idField: "slug",
  fields: ["title", "abstract", "keywords", "authors", "topics"],
  storeFields: [
    "slug",
    "paperStackId",
    "title",
    "abstract",
    "authors",
    "authorSlugs",
    "topics",
    "keywords",
    "type",
    "year",
    "publishedAt",
    "pdf",
    "doi",
  ],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 3, keywords: 2 },
  },
} as const;

export function createMiniSearch(): MiniSearch<SearchDocument> {
  return new MiniSearch<SearchDocument>({
    idField: miniSearchOptions.idField,
    fields: [...miniSearchOptions.fields],
    storeFields: [...miniSearchOptions.storeFields],
  });
}

export interface SearchablePaper {
  slug: string;
  paperId: string;
  title: string;
  abstract: string;
  topics: string[];
  keywords: string[];
  type: string;
  publishedAt: Date;
  pdf?: string;
  links?: { doi?: string };
  authors: readonly { slug: string }[];
}

export function toSearchDocuments(
  papers: readonly SearchablePaper[],
  authorNames: ReadonlyMap<string, string>,
): SearchDocument[] {
  return papers.map((paper) => ({
    slug: paper.slug,
    paperStackId: paper.paperId,
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors.map(
      (author) => authorNames.get(author.slug) ?? author.slug,
    ),
    authorSlugs: paper.authors.map((author) => author.slug),
    topics: paper.topics,
    keywords: paper.keywords,
    type: paper.type,
    year: paper.publishedAt.getUTCFullYear(),
    publishedAt: paper.publishedAt.toISOString().slice(0, 10),
    pdf: paper.pdf ?? null,
    doi: paper.links?.doi ?? null,
  }));
}

export function serializeSearchIndex(documents: SearchDocument[]): string {
  const miniSearch = createMiniSearch();
  miniSearch.addAll(documents);
  return JSON.stringify(
    {
      version: 2,
      generatedAt: new Date().toISOString(),
      searchOptions: miniSearchOptions.searchOptions,
      documents,
      ...miniSearch.toJSON(),
    },
    null,
    2,
  );
}
