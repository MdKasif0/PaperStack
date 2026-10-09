import MiniSearch from "minisearch";

import { miniSearchOptions, type SearchDocument } from "./search-index";

export interface LoadedSearchIndex {
  miniSearch: MiniSearch<SearchDocument>;
  documents: SearchDocument[];
}

let cache: Promise<LoadedSearchIndex> | null = null;

/**
 * Lazily fetches and hydrates the build-time MiniSearch index. The promise
 * is cached per page load; `resetSearchIndexCache` allows a retry after a
 * failed fetch.
 */
export function loadSearchIndex(): Promise<LoadedSearchIndex> {
  cache ??= (async () => {
    const response = await fetch("/search/index.json");
    if (!response.ok) {
      throw new Error(`Search index failed to load (${response.status})`);
    }
    const text = await response.text();
    const miniSearch = MiniSearch.loadJSON<SearchDocument>(text, {
      idField: miniSearchOptions.idField,
      fields: [...miniSearchOptions.fields],
      storeFields: [...miniSearchOptions.storeFields],
    });
    const json = JSON.parse(text) as { documents: SearchDocument[] };
    return { miniSearch, documents: json.documents };
  })();
  return cache;
}

export function resetSearchIndexCache(): void {
  cache = null;
}

export function searchOptions() {
  return miniSearchOptions.searchOptions;
}
