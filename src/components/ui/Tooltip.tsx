import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "content"
> {
  content: ReactNode;
  /**
   * Pass the same value as `aria-describedby` on the trigger element so
   * assistive tech links the two (e.g. id="tip-cite" on both).
   */
  id?: string;
  children: ReactNode;
}

export function Tooltip({
  content,
  id,
  className,
  children,
  ...props
}: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)} {...props}>
      {children}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-64 -translate-x-1/2 rounded-sm bg-ink px-2.5 py-1.5 text-small text-paper opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
