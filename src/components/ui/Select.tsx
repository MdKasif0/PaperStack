"use client";

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  /** `<option>` elements. */
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, hint, error, id: idProp, className, children, ...props },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const describedBy =
      [hint && !error ? hintId : null, error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor={id} className="text-small font-medium text-ink">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={cn(
              "h-10 w-full appearance-none rounded-sm border border-rule-strong bg-paper-raised pr-9 pl-3 text-body text-ink transition-colors hover:border-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700",
              error && "border-terracotta-700",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
          />
        </div>
        {hint && !error && (
          <p id={hintId} className="text-small text-ink-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-small text-terracotta-700">
            {error}
          </p>
        )}
      </div>
    );
  },
);
