"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Checkbox, Select } from "@/components/ui";
import type { Author, Topic } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

export const PAPER_TYPE_OPTIONS = [
  { value: "research-paper", label: "Research paper" },
  { value: "preprint", label: "Preprint" },
  { value: "technical-report", label: "Technical report" },
  { value: "survey", label: "Survey" },
] as const;

export type SortValue = "newest" | "oldest" | "title" | "views";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
  { value: "views", label: "Most viewed" },
] as const;

export interface FilterSelections {
  topics: Set<string>;
  years: Set<string>;
  authors: Set<string>;
  types: Set<string>;
  keywords: Set<string>;
}

export interface KeywordOption {
  keyword: string;
  count: number;
}

export interface FilterControlsProps {
  idPrefix: string;
  queryInput: string;
  onQueryInput: (value: string) => void;
  topics: Topic[];
  authors: Author[];
  years: string[];
  typeCounts: Map<string, number>;
  keywords: KeywordOption[];
  selected: FilterSelections;
  onToggle: (
    key: "topic" | "year" | "author" | "type" | "keyword",
    value: string,
  ) => void;
  sort: SortValue;
  onSort: (value: SortValue) => void;
  onClearAll: () => void;
  hasActive: boolean;
}

/**
 * The full filter form, rendered both in the desktop sticky rail and inside
 * the mobile drawer. `idPrefix` keeps input ids unique between the two.
 */
export function FilterControls({
  idPrefix,
  queryInput,
  onQueryInput,
  topics,
  authors,
  years,
  typeCounts,
  keywords,
  selected,
  onToggle,
  sort,
  onSort,
  onClearAll,
  hasActive,
}: FilterControlsProps) {
  const searchId = `${idPrefix}-filter-search`;
  const keywordSearchId = `${idPrefix}-keyword-search`;
  const [keywordQuery, setKeywordQuery] = useState("");

  const visibleKeywords = keywords.filter((option) =>
    option.keyword.includes(keywordQuery.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label
          htmlFor={searchId}
          className="text-label text-ink-muted uppercase"
        >
          Search
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            id={searchId}
            type="search"
            value={queryInput}
            onChange={(event) => onQueryInput(event.target.value)}
            placeholder="Title, abstract, keywords…"
            className="h-11 w-full border-b border-rule-strong bg-transparent pr-3 pl-9 text-body text-ink transition-colors placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-label text-ink-muted uppercase">Topic</legend>
        <div className="mt-1.5 flex flex-col">
          {topics.map((topic) => (
            <Checkbox
              key={topic.slug}
              label={topic.name}
              checked={selected.topics.has(topic.slug)}
              onChange={() => onToggle("topic", topic.slug)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label text-ink-muted uppercase">Year</legend>
        <div className="mt-1.5 flex flex-col">
          {years.map((year) => (
            <Checkbox
              key={year}
              label={year}
              checked={selected.years.has(year)}
              onChange={() => onToggle("year", year)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label text-ink-muted uppercase">Author</legend>
        <div className="mt-1.5 flex flex-col">
          {authors.map((author) => (
            <Checkbox
              key={author.slug}
              label={author.name}
              checked={selected.authors.has(author.slug)}
              onChange={() => onToggle("author", author.slug)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label text-ink-muted uppercase">Type</legend>
        <div className="mt-1.5 flex flex-col">
          {PAPER_TYPE_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={`${option.label} (${typeCounts.get(option.value) ?? 0})`}
              checked={selected.types.has(option.value)}
              onChange={() => onToggle("type", option.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-label text-ink-muted uppercase">Keyword</legend>
        <div className="mt-3">
          <label htmlFor={keywordSearchId} className="sr-only">
            Filter keyword list
          </label>
          <input
            id={keywordSearchId}
            type="search"
            value={keywordQuery}
            onChange={(event) => setKeywordQuery(event.target.value)}
            placeholder="Find a keyword…"
            className="h-9 w-full rounded-sm border border-rule-strong bg-paper-raised px-3 text-small text-ink transition-colors placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          />
        </div>
        <div className="-mx-2 mt-2 flex max-h-48 flex-col overflow-y-auto px-2">
          {visibleKeywords.map((option) => (
            <Checkbox
              key={option.keyword}
              label={`${option.keyword} (${option.count})`}
              checked={selected.keywords.has(option.keyword.toLowerCase())}
              onChange={() => onToggle("keyword", option.keyword)}
            />
          ))}
          {visibleKeywords.length === 0 && (
            <p className="text-small text-ink-muted">No keywords match.</p>
          )}
        </div>
      </fieldset>

      <div>
        <Select
          id={`${idPrefix}-sort`}
          label="Sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortValue)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {hasActive && (
        <div>
          <button
            type="button"
            onClick={onClearAll}
            className="text-small font-medium text-green-700 underline decoration-green-700/45 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

/** Removable chip for one active filter value. */
export function FilterChip({
  label,
  onRemove,
  className,
}: {
  label: string;
  onRemove: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border border-green-700/40 bg-green-50 py-1 pr-1 pl-2.5 text-small font-medium text-green-900",
        className,
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="inline-flex size-6 items-center justify-center rounded-xs text-green-700 transition-colors hover:bg-green-100 hover:text-green-900"
      >
        <span aria-hidden="true" className="text-small leading-none">
          ×
        </span>
      </button>
    </span>
  );
}
