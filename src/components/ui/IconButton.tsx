import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name; also used as the native tooltip title. */
  label: string;
  variant?: "ghost" | "outline";
}

const variantClasses = {
  ghost: "text-ink-soft hover:bg-paper-sunk hover:text-green-900",
  outline:
    "border border-rule-strong bg-paper-raised text-ink hover:border-green-700 hover:text-green-900",
} as const;

export function IconButton({
  label,
  variant = "ghost",
  type,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type ?? "button"}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
