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
      <div className="flex items-start gap-2.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn("checkbox-box mt-0.5 size-4 shrink-0", className)}
          aria-describedby={descriptionId}
          {...props}
        />
        <div className="flex flex-col gap-0.5">
          <label htmlFor={id} className="text-small font-medium text-ink">
            {label}
          </label>
          {description && (
            <p id={descriptionId} className="text-small text-ink-muted">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  },
);
