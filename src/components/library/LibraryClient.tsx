"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

import {
  FilterChip,
  FilterControls,
  PAPER_TYPE_OPTIONS,
  type FilterSelections,
  type KeywordOption,
  type SortValue,
} from "./FilterControls";
import { LibraryRowsSkeleton } from "./LibrarySkeleton";
import { PaperRow } from "./PaperRow";
import { useDialog } from "@/components/site/useDialog";
import { Button } from "@/components/ui";
import {
  loadSearchIndex,
  resetSearchIndexCache,
  searchOptions,
  type LoadedSearchIndex,
} from "@/lib/content/search-client";
import type { Author, Topic } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export interface LibraryClientProps {
  topics: Topic[];
  authors: Author[];
  totalCount: number;
}

function isSortValue(value: string | null): value is SortValue {
  return (
    value === "newest" ||
    value === "oldest" ||
    value === "title" ||
    value === "views"
  );
}

export function LibraryClient({
  topics,
  authors,
  totalCount,
}: LibraryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: SortValue = isSortValue(sortParam) ? sortParam : "newest";

  const selected: FilterSelections = useMemo(
    () => ({
      topics: new Set(searchParams.getAll("topic")),
      years: new Set(searchParams.getAll("year")),
      authors: new Set(searchParams.getAll("author")),
      types: new Set(searchParams.getAll("type")),
      keywords: new Set(
        searchParams.getAll("keyword").map((k) => k.toLowerCase()),
      ),
    }),
    [searchParams],
  );

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const queryString = params.toString();
      router.push(queryString ? `/papers?${queryString}` : "/papers", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const toggle = useCallback(
    (key: "topic" | "year" | "author" | "type" | "keyword", value: string) => {
      update((params) => {
        const values = params.getAll(key);
        params.delete(key);
        const next = values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value];
        for (const v of next) params.append(key, v);
      });
    },
    [update],
  );

  const clearAll = useCallback(() => {
    router.push("/papers", { scroll: false });
  }, [router]);

  // Debounced search input. When the URL q changes (back/forward, chip
  // removal), the input follows via the adjust-during-render pattern rather
  // than an effect.
  const [queryInput, setQueryInput] = useState(query);
  const [lastUrlQuery, setLastUrlQuery] = useState(query);
  if (query !== lastUrlQuery) {
    setLastUrlQuery(query);
    setQueryInput(query);
  }
  useEffect(() => {
    if (queryInput === query) return;
    const timer = window.setTimeout(() => {
      update((params) => {
        if (queryInput) params.set("q", queryInput);
        else params.delete("q");
      });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [queryInput, query, update]);

  // Lazy index
  const [index, setIndex] = useState<LoadedSearchIndex | null>(null);
  const [indexError, setIndexError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  useEffect(() => {
    let cancelled = false;
    loadSearchIndex()
      .then((loaded) => {
        if (!cancelled) setIndex(loaded);
      })
      .catch(() => {
        if (!cancelled) setIndexError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  const retry = useCallback(() => {
    resetSearchIndexCache();
    setIndexError(false);
    setRetryToken((token) => token + 1);
  }, []);

  // Option lists derived from the whole index
  const years = useMemo(() => {
    if (!index) return [];
    return [...new Set(index.documents.map((doc) => String(doc.year)))].sort(
      (a, b) => b.localeCompare(a),
    );
  }, [index]);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    if (index) {
      for (const doc of index.documents) {
        counts.set(doc.type, (counts.get(doc.type) ?? 0) + 1);
      }
    }
    return counts;
  }, [index]);

  const keywordOptions: KeywordOption[] = useMemo(() => {
    if (!index) return [];
    const counts = new Map<string, { keyword: string; count: number }>();
    for (const doc of index.documents) {
      for (const keyword of doc.keywords) {
        const key = keyword.toLowerCase();
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { keyword, count: 1 });
      }
    }
    return [...counts.values()].sort((a, b) =>
      a.keyword.localeCompare(b.keyword),
    );
  }, [index]);

  // Combined filters + full-text search + sort
  const results = useMemo(() => {
    if (!index) return null;
    const filtered = index.documents.filter((doc) => {
      if (
        selected.topics.size > 0 &&
        !doc.topics.some((t) => selected.topics.has(t))
      )
        return false;
      if (selected.years.size > 0 && !selected.years.has(String(doc.year)))
        return false;
      if (
        selected.authors.size > 0 &&
        !doc.authorSlugs.some((a) => selected.authors.has(a))
      )
        return false;
      if (selected.types.size > 0 && !selected.types.has(doc.type))
        return false;
      if (
        selected.keywords.size > 0 &&
        !doc.keywords.some((k) => selected.keywords.has(k.toLowerCase()))
      )
        return false;
      return true;
    });

    const trimmed = query.trim();
    if (trimmed.length > 0) {
      const ranked = index.miniSearch.search(trimmed, searchOptions());
      const rankBySlug = new Map(
        ranked.map((result, position) => [result.id, position]),
      );
      return filtered
        .filter((doc) => rankBySlug.has(doc.slug))
        .sort(
          (a, b) =>
            (rankBySlug.get(a.slug) ?? 0) - (rankBySlug.get(b.slug) ?? 0),
        );
    }

    const sorted = [...filtered];
    if (sort === "oldest") {
      sorted.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    } else if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // "views" falls back to newest until view counts land in step 9.
      sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    }
    return sorted;
  }, [index, selected, query, sort]);

  const terms = useMemo(
    () =>
      query
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 1),
    [query],
  );

  const topicsMap = useMemo(
    () => new Map(topics.map((topic) => [topic.slug, topic])),
    [topics],
  );
  const authorsBySlug = useMemo(
    () => new Map(authors.map((author) => [author.slug, author])),
    [authors],
  );

  const activeChips = useMemo(() => {
    const chips: { key: string; value: string; label: string }[] = [];
    if (query) chips.push({ key: "q", value: query, label: `“${query}”` });
    for (const value of selected.topics) {
      chips.push({
        key: "topic",
        value,
        label: topicsMap.get(value)?.name ?? value,
      });
    }
    for (const value of selected.years)
      chips.push({ key: "year", value, label: value });
    for (const value of selected.authors) {
      chips.push({
        key: "author",
        value,
        label: authorsBySlug.get(value)?.name ?? value,
      });
    }
    for (const value of selected.types) {
      const option = PAPER_TYPE_OPTIONS.find(
        (candidate) => candidate.value === value,
      );
      chips.push({ key: "type", value, label: option?.label ?? value });
    }
    for (const value of selected.keywords) {
      const original = keywordOptions.find(
        (option) => option.keyword.toLowerCase() === value,
      );
      chips.push({ key: "keyword", value, label: original?.keyword ?? value });
    }
    if (sort !== "newest") {
      // Sort is shown as a chip so it is removable too.
      const option = SORT_LABELS[sort];
      chips.push({ key: "sort", value: sort, label: option });
    }
    return chips;
  }, [query, selected, topicsMap, authorsBySlug, keywordOptions, sort]);

  const hasActive = activeChips.length > 0 || queryInput.length > 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const drawerRef = useDialog({ open: drawerOpen, onClose: closeDrawer });

  const activeFilterCount = activeChips.length;

  const filterControls = (idPrefix: string) => (
    <FilterControls
      idPrefix={idPrefix}
      queryInput={queryInput}
      onQueryInput={setQueryInput}
      topics={topics}
      authors={authors}
      years={years}
      typeCounts={typeCounts}
      keywords={keywordOptions}
      selected={selected}
      onToggle={toggle}
      sort={sort}
      onSort={(value) =>
        update((params) => {
          if (value === "newest") params.delete("sort");
          else params.set("sort", value);
        })
      }
      onClearAll={clearAll}
      hasActive={hasActive}
    />
  );

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[17rem_1fr] lg:gap-16">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filterControls("rail")}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p
            role="status"
            aria-live="polite"
            className="text-small text-ink-muted"
          >
            {results === null
              ? "Loading the library…"
              : `${results.length} ${results.length === 1 ? "paper" : "papers"}`}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            aria-haspopup="dialog"
            onClick={() => setDrawerOpen(true)}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <FilterChip
                key={`${chip.key}:${chip.value}`}
                label={chip.label}
                onRemove={() => {
                  if (chip.key === "q") {
                    setQueryInput("");
                    update((params) => params.delete("q"));
                  } else if (chip.key === "sort") {
                    update((params) => params.delete("sort"));
                  } else {
                    toggle(
                      chip.key as
                        "topic" | "year" | "author" | "type" | "keyword",
                      chip.value,
                    );
                  }
                }}
              />
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-small text-ink-muted underline decoration-rule-strong decoration-1 underline-offset-4 transition-colors hover:text-terracotta-700 hover:decoration-terracotta-600"
            >
              Clear all
            </button>
          </div>
        )}

        <div aria-busy={results === null} className="mt-6">
          {indexError ? (
            <div className="border-b border-rule py-14">
              <p className="font-serif text-h3 text-ink">
                The index did not load.
              </p>
              <p className="mt-3 max-w-prose text-small text-ink-muted">
                The search index could not be fetched. The filters need it to
                list papers.
              </p>
              <div className="mt-6">
                <Button variant="secondary" size="sm" onClick={retry}>
                  Retry
                </Button>
              </div>
            </div>
          ) : results === null ? (
            <LibraryRowsSkeleton />
          ) : results.length === 0 ? (
            (index?.documents.length ?? 0) === 0 ? (
              <div className="border-b border-rule py-14">
                <p className="font-serif text-h3 text-ink-soft">
                  The first paper is in preparation.
                </p>
              </div>
            ) : (
              <div className="border-b border-rule py-14">
                <p className="font-serif text-h3 text-ink">No papers match.</p>
                <p className="mt-3 max-w-prose text-small text-ink-muted">
                  Try fewer filters, or a broader search term.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Button variant="secondary" size="sm" onClick={clearAll}>
                    Clear all filters
                  </Button>
                  <span className="text-small text-ink-muted">Popular:</span>
                  {topics.slice(0, 3).map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="text-small font-medium text-green-700 underline decoration-terracotta-600 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2"
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div aria-label="Papers">
              {results.map((doc) => (
                <PaperRow
                  key={doc.slug}
                  doc={doc}
                  topics={topicsMap}
                  terms={terms}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        aria-hidden={!drawerOpen}
        className={cn(
          "fixed inset-0 z-50 overflow-y-auto bg-paper transition-[opacity,visibility] duration-150 motion-reduce:transition-none lg:hidden",
          drawerOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="mx-auto w-full max-w-md px-5 pt-6 pb-10">
          <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
            <p className="text-label text-ink-muted uppercase">Filters</p>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close filters"
              className="inline-flex size-9 items-center justify-center rounded-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-green-900"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="mt-6">{filterControls("drawer")}</div>
          <Button onClick={closeDrawer} className="mt-8 w-full">
            Show {results?.length ?? totalCount} papers
          </Button>
        </div>
      </div>
    </div>
  );
}

const SORT_LABELS: Record<SortValue, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  title: "Title A–Z",
  views: "Most viewed",
};
