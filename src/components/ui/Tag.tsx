import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type TagTone = "neutral" | "green" | "terracotta" | "gold";

const toneClasses: Record<TagTone, string> = {
  neutral: "border-rule bg-paper-sunk text-ink-soft",
  green: "border-green-100 bg-green-50 text-green-900",
  terracotta: "border-terracotta-100 bg-terracotta-100 text-terracotta-700",
  gold: "border-gold-500/40 bg-gold-100 text-ink",
};

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
}

export function Tag({ tone = "neutral", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-0.5 text-label uppercase",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
