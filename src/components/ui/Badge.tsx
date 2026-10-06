import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type BadgeStatus = "published" | "preprint" | "in-review" | "draft";

const statusConfig: Record<BadgeStatus, { label: string; className: string }> =
  {
    published: {
      label: "Published",
      className: "border-green-100 bg-green-50 text-green-900",
    },
    preprint: {
      label: "Preprint",
      className: "border-gold-500/40 bg-gold-100 text-ink",
    },
    "in-review": {
      label: "In review",
      className: "border-terracotta-100 bg-terracotta-100 text-terracotta-700",
    },
    draft: {
      label: "Draft",
      className: "border-rule bg-paper-sunk text-ink-soft",
    },
  };

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  label?: string;
}

export function Badge({ status, label, className, ...props }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-label uppercase",
        config.className,
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label ?? config.label}
    </span>
  );
}
