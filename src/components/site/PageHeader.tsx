import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Small-caps line above the title. */
  label: string;
  title: ReactNode;
  /** Quiet line under the title: role, affiliation, and so on. */
  meta?: ReactNode;
  /** Introductory copy, set beside the title on wide screens. */
  children?: ReactNode;
  className?: string;
}

/** The shared opening of every inner page. */
export function PageHeader({
  label,
  title,
  meta,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "grid gap-x-16 gap-y-7 border-b border-ink pb-10 sm:pb-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end",
        className,
      )}
    >
      <div>
        <p className="flex items-center gap-4 text-label text-ink-soft uppercase">
          <span
            aria-hidden="true"
            className="hidden h-0.5 w-10 shrink-0 bg-terracotta-600 sm:block"
          />
          {label}
        </p>
        <h1 className="mt-5 font-serif text-h1 text-balance text-ink">
          {title}
        </h1>
        {meta && <p className="mt-4 text-small text-ink-muted">{meta}</p>}
      </div>
      {children && (
        <div className="max-w-[34rem] text-body-lg text-ink-soft">
          {children}
        </div>
      )}
    </header>
  );
}
