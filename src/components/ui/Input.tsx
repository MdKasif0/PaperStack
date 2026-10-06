"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id: idProp, className, ...props },
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
      <input
        ref={ref}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full rounded-sm border border-rule-strong bg-paper-raised px-3 text-body text-ink transition-colors placeholder:text-ink-muted hover:border-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700",
          error && "border-terracotta-700",
          className,
        )}
        {...props}
      />
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
});
