import MiniSearch from "minisearch";

/**
 * Client search index. `serializeSearchIndex` produces JSON that the client
 * hydrates with MiniSearch.loadJSON using the same options, so the exact
 * field configuration must stay in sync with the options exported here.
 */

export interface SearchDocument {
  slug: string;
  paperStackId: string;
  title: string;
  abstract: string;
  authors: string[];
  topics: string[];
  keywords: string[];
  type: string;
  year: number;
}

export const miniSearchOptions = {
  idField: "slug",
  fields: ["title", "abstract", "keywords", "authors", "topics"],
  storeFields: [
    "slug",
    "paperStackId",
    "title",
    "authors",
    "topics",
    "type",
    "year",
  ],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 3, keywords: 2 },
  },
} as const;

export function toSearchDocuments(
  papers: readonly {
    slug: string;
    paperId: string;
    title: string;
    abstract: string;
    topics: string[];
    keywords: string[];
    type: string;
    publishedAt: Date;
    authors: readonly { slug: string }[];
  }[],
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
    topics: paper.topics,
    keywords: paper.keywords,
    type: paper.type,
    year: paper.publishedAt.getUTCFullYear(),
  }));
}

export function serializeSearchIndex(documents: SearchDocument[]): string {
  const miniSearch = new MiniSearch<SearchDocument>({
    idField: miniSearchOptions.idField,
    fields: [...miniSearchOptions.fields],
    storeFields: [...miniSearchOptions.storeFields],
  });
  miniSearch.addAll(documents);
  return JSON.stringify(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      searchOptions: miniSearchOptions.searchOptions,
      ...miniSearch.toJSON(),
    },
    null,
    2,
  );
}
