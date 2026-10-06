"use client";

import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";

import { NavLinks } from "./NavLinks";
import { useDialog } from "./useDialog";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

/**
 * Full-screen menu for small screens: focus-trapped, Escape-closable,
 * scroll-locked, with a short fade that collapses under reduced motion.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const panelRef = useDialog({ open, onClose: close });

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-haspopup="dialog"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-green-900"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-paper transition-[opacity,visibility] duration-150 motion-reduce:transition-none",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-rule px-5">
          <Wordmark />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-green-900"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between px-5 pt-12 pb-10">
          <NavLinks
            ariaLabel="Menu"
            large
            onNavigate={close}
            className="w-full"
          />
          <p className="text-label text-ink-muted uppercase">
            An open journal of independent research
          </p>
        </div>
      </div>
    </div>
  );
}
