import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Stacked sheets drawn with hairlines only — the site's typographic mark.
 */
export function StackMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden="true"
      className={cn("h-6 w-6 text-green-700", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10.5 7h7" />
      <path d="M9 11.5h10" />
      <path d="M7.5 16h13" />
      <path d="M6 20.5h16" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PaperStack — home"
      className={cn(
        "inline-flex items-center gap-2.5 text-green-700 no-underline transition-colors hover:text-green-900",
        className,
      )}
    >
      <StackMark />
      <span className="font-serif text-h4 font-medium tracking-[-0.01em] text-ink">
        PaperStack
      </span>
    </Link>
  );
}
