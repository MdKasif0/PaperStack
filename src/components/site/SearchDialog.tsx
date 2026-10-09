"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, X } from "lucide-react";

import { useDialog } from "./useDialog";
import {
  loadSearchIndex,
  searchOptions,
  type LoadedSearchIndex,
} from "@/lib/content/search-client";
import { cn } from "@/lib/utils";

export interface PaletteAuthor {
  slug: string;
  name: string;
}

export interface PaletteTopic {
  slug: string;
  name: string;
}

type PaletteItem =
  | { kind: "paper"; slug: string; title: string; paperStackId: string }
  | { kind: "author"; slug: string; name: string }
  | { kind: "topic"; slug: string; name: string }
  | { kind: "recent"; label: string }
  | { kind: "library"; label: string };

const RECENTS_KEY = "paperstack:recent-searches";
const MAX_RECENTS = 5;

function loadRecents(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string): void {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;
    const next = [
      trimmed,
      ...loadRecents().filter((entry) => entry !== trimmed),
    ].slice(0, MAX_RECENTS);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // Private mode or full storage: recents are a nice-to-have.
  }
}

function clearRecents(): void {
  try {
    window.localStorage.removeItem(RECENTS_KEY);
  } catch {
    // Ignore.
  }
}

export interface SearchDialogProps {
  authors: PaletteAuthor[];
  topics: PaletteTopic[];
}

/**
 * The Cmd/Ctrl+K command palette: searches papers through the lazy
 * MiniSearch index and authors/topics by name, with full arrow-key
 * navigation, Enter to open, and recent searches in localStorage.
 */
export function SearchDialog({ authors, topics }: SearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [index, setIndex] = useState<LoadedSearchIndex | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => setOpen(false), []);

  // Opening resets the session state; all of it is event-driven so no
  // effect needs to call setState in its body.
  const openDialog = useCallback(() => {
    setOpen(true);
    setRecents(loadRecents());
    setQueryInput("");
    setActiveIndex(0);
  }, []);

  const panelRef = useDialog({ open, onClose: close });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => {
          if (value) return false;
          setRecents(loadRecents());
          setQueryInput("");
          setActiveIndex(0);
          return true;
        });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open || index) return;
    loadSearchIndex()
      .then(setIndex)
      .catch(() => setIndex(null));
  }, [open, index]);

  const trimmed = queryInput.trim();
  const lower = trimmed.toLowerCase();

  const items = useMemo<PaletteItem[]>(() => {
    if (!trimmed) {
      return [
        ...recents.map((label): PaletteItem => ({ kind: "recent", label })),
        ...topics.map((topic): PaletteItem => ({ kind: "topic", ...topic })),
      ];
    }
    const paperItems: PaletteItem[] = index
      ? index.miniSearch
          .search(trimmed, searchOptions())
          .slice(0, 6)
          .flatMap((result) => {
            const doc = index.documents.find(
              (candidate) => candidate.slug === result.id,
            );
            return doc
              ? [
                  {
                    kind: "paper" as const,
                    slug: doc.slug,
                    title: doc.title,
                    paperStackId: doc.paperStackId,
                  },
                ]
              : [];
          })
      : [];
    const authorItems: PaletteItem[] = authors
      .filter((author) => author.name.toLowerCase().includes(lower))
      .slice(0, 3)
      .map((author) => ({ kind: "author" as const, ...author }));
    const topicItems: PaletteItem[] = topics
      .filter((topic) => topic.name.toLowerCase().includes(lower))
      .slice(0, 3)
      .map((topic) => ({ kind: "topic" as const, ...topic }));
    return [
      ...paperItems,
      ...authorItems,
      ...topicItems,
      { kind: "library", label: trimmed },
    ];
  }, [trimmed, lower, index, authors, topics, recents]);

  const [prevQueryInput, setPrevQueryInput] = useState(queryInput);
  if (queryInput !== prevQueryInput) {
    setPrevQueryInput(queryInput);
    setActiveIndex(0);
  }

  const activate = useCallback(
    (item: PaletteItem | undefined) => {
      if (!item) return;
      switch (item.kind) {
        case "paper":
          saveRecent(trimmed);
          router.push(`/papers/${item.slug}`);
          break;
        case "author":
          router.push(`/authors/${item.slug}`);
          break;
        case "topic":
          router.push(`/topics/${item.slug}`);
          break;
        case "recent":
          saveRecent(item.label);
          router.push(`/papers?q=${encodeURIComponent(item.label)}`);
          break;
        case "library":
          saveRecent(item.label);
          router.push(`/papers?q=${encodeURIComponent(item.label)}`);
          break;
      }
      close();
    },
    [router, trimmed, close],
  );

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        items.length === 0 ? 0 : (current + 1) % items.length,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        items.length === 0 ? 0 : (current - 1 + items.length) % items.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      activate(items[activeIndex] ?? items[0]);
    }
  }

  function itemLabel(item: PaletteItem): string {
    switch (item.kind) {
      case "paper":
        return item.title;
      case "author":
      case "topic":
        return item.name;
      case "recent":
      case "library":
        return item.label;
    }
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={openDialog}
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-sm border border-rule-strong bg-paper-raised px-2.5 text-small text-ink-muted",
          "transition-colors hover:border-green-700 hover:text-green-900",
        )}
      >
        <Search aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden font-mono text-label text-ink-muted sm:inline">
          ⌘K
        </kbd>
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search papers, authors, and topics"
        aria-hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className={cn(
          "fixed inset-0 z-50 overflow-y-auto bg-paper/90 transition-[opacity,visibility] duration-150 motion-reduce:transition-none",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="mx-auto mt-[12vh] w-[min(560px,calc(100vw-2.5rem))] rounded-sm border border-rule-strong bg-paper-raised">
          <div className="flex items-center gap-3 border-b border-rule px-4">
            <Search
              aria-hidden="true"
              className="size-4 shrink-0 text-ink-muted"
            />
            <input
              role="combobox"
              aria-expanded={open}
              aria-controls="palette-list"
              aria-activedescendant={
                items.length > 0 ? `palette-option-${activeIndex}` : undefined
              }
              aria-autocomplete="list"
              aria-label="Search papers, authors, and topics"
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search papers, authors, topics…"
              className="h-12 w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper-sunk hover:text-green-900"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <ul
            id="palette-list"
            role="listbox"
            aria-label="Results"
            className="m-0 max-h-[50vh] list-none overflow-y-auto p-0"
          >
            {items.length === 0 && (
              <li
                role="presentation"
                className="px-4 py-4 text-small text-ink-muted"
              >
                {index ? "Nothing found." : "Loading the index…"}
              </li>
            )}
            {items.map((item, position) => {
              const showGroupHeader =
                position === 0 || items[position - 1]?.kind !== item.kind;
              const groupLabel =
                item.kind === "paper"
                  ? "Papers"
                  : item.kind === "author"
                    ? "Authors"
                    : item.kind === "topic"
                      ? "Topics"
                      : item.kind === "recent"
                        ? "Recent searches"
                        : "Library";
              return (
                <li
                  key={`${item.kind}:${itemLabel(item)}:${position}`}
                  role="presentation"
                >
                  {showGroupHeader && (
                    <p
                      role="presentation"
                      className="border-b border-rule bg-paper-sunk/60 px-4 pt-3 pb-1.5 text-label text-ink-muted uppercase first:pt-2"
                    >
                      {groupLabel}
                      {item.kind === "recent" && (
                        <button
                          type="button"
                          onClick={() => {
                            clearRecents();
                            setRecents([]);
                          }}
                          className="ml-3 tracking-normal text-ink-muted normal-case underline decoration-rule-strong underline-offset-2 transition-colors hover:text-terracotta-700"
                        >
                          Clear
                        </button>
                      )}
                    </p>
                  )}
                  <div
                    id={`palette-option-${position}`}
                    role="option"
                    aria-selected={position === activeIndex}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(position)}
                    onClick={() => activate(item)}
                    className={cn(
                      "flex cursor-pointer items-baseline justify-between gap-4 px-4 py-3",
                      position === activeIndex && "bg-paper-sunk",
                    )}
                  >
                    <span className="min-w-0 truncate text-small text-ink">
                      {item.kind === "recent" && (
                        <Clock
                          aria-hidden="true"
                          className="mr-2 inline size-3.5 text-ink-muted"
                        />
                      )}
                      {itemLabel(item)}
                    </span>
                    {item.kind === "paper" && (
                      <span className="shrink-0 font-mono text-small text-ink-muted tabular-nums">
                        {item.paperStackId}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="border-t border-rule px-4 py-2.5 text-small text-ink-muted">
            <kbd className="font-mono text-label">↑↓</kbd> to navigate ·{" "}
            <kbd className="font-mono text-label">↵</kbd> to open ·{" "}
            <kbd className="font-mono text-label">esc</kbd> to close
          </p>
        </div>
      </div>
    </>
  );
}
