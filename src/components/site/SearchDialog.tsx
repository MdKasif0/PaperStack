"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { useDialog } from "./useDialog";
import { cn } from "@/lib/utils";

export interface SearchItem {
  slug: string;
  title: string;
  paperId: string;
}

/**
 * Command-palette shell. Step 6 replaces the static results with the
 * MiniSearch index; the trigger, the Cmd/Ctrl+K shortcut and the dialog
 * behaviour are final.
 */
export function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const panelRef = useDialog({ open, onClose: close });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-8 items-center gap-2 rounded-sm border border-rule-strong bg-paper-raised px-2.5 text-small text-ink-muted no-underline",
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
        aria-label="Search papers"
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
              type="search"
              aria-label="Search papers, topics, and authors"
              placeholder="Search papers, topics, authors…"
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

          <ul className="m-0 max-h-[50vh] list-none divide-y divide-rule overflow-y-auto p-0">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/papers/${item.slug}`}
                  onClick={close}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 no-underline transition-colors hover:bg-paper-sunk"
                >
                  <span className="text-small text-ink">{item.title}</span>
                  <span className="font-mono text-small text-ink-muted tabular-nums">
                    {item.paperId}
                  </span>
                </Link>
              </li>
            ))}
            {items.length === 0 && (
              <li className="px-4 py-3 text-small text-ink-muted">
                No papers yet.
              </li>
            )}
          </ul>

          <p className="border-t border-rule px-4 py-2.5 text-small text-ink-muted">
            Full-text search arrives in a later step — for now, browse the{" "}
            <Link href="/papers" onClick={close}>
              library
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
