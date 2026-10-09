"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { SearchDialog } from "./SearchDialog";
import type { PaletteAuthor, PaletteTopic } from "./SearchDialog";
import { Wordmark } from "./Wordmark";

/**
 * The sticky masthead. Its hairline border appears only after scrolling —
 * no blur, no background shift, just a rule.
 */
export function Masthead({
  authors,
  topics,
}: {
  authors: PaletteAuthor[];
  topics: PaletteTopic[];
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-paper transition-[border-color] duration-150 motion-reduce:transition-none",
        scrolled ? "border-b border-rule" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-6">
          <NavLinks className="hidden md:block" />
          <SearchDialog authors={authors} topics={topics} />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
