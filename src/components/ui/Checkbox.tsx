"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, id: idProp, className, ...props },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <div className="group/check -mx-2 flex items-start gap-2.5 rounded-sm px-2 transition-colors hover:bg-paper-sunk">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn("checkbox-box mt-2 size-4 shrink-0", className)}
          aria-describedby={descriptionId}
          {...props}
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <label
            htmlFor={id}
            className="cursor-pointer py-1.5 text-small text-ink-soft transition-colors group-hover/check:text-ink group-has-checked/check:font-medium group-has-checked/check:text-green-700"
          >
            {label}
          </label>
          {description && (
            <p id={descriptionId} className="pb-1.5 text-small text-ink-muted">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);
