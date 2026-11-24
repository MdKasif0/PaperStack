"use client";

import { useEffect, useMemo, useState } from "react";

import type { TocEntry } from "@/lib/content/toc";
import { cn } from "@/lib/utils";

function flatten(entries: TocEntry[]): TocEntry[] {
  return entries.flatMap((entry) => [entry, ...flatten(entry.children)]);
}

/** Contents list that marks the section being read. */
export function PaperToc({ entries }: { entries: TocEntry[] }) {
  const items = useMemo(
    () => flatten(entries).filter((entry) => entry.depth <= 3),
    [entries],
  );
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const heading = document.getElementById(item.slug);
        if (heading && heading.getBoundingClientRect().top <= 140) {
          current = item.slug;
        }
      }
      setActive(current);
    }
    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <ol className="m-0 list-none border-l border-rule p-0">
      {items.map((item) => {
        const isActive = item.slug === active;
        return (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pr-2 text-small no-underline transition-colors",
                item.depth === 2 ? "pl-4" : "pl-8",
                isActive
                  ? "border-green-700 font-medium text-green-700"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
