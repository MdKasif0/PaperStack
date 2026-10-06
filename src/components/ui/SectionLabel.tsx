import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  /** Numbered index, e.g. "01". Rendered in mono with tabular figures. */
  index: string;
  title: string;
  className?: string;
}

export function SectionLabel({ index, title, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="font-mono text-label text-terracotta-700 tabular-nums">
        {index}
      </span>
      <span aria-hidden="true" className="text-label text-ink-muted">
        —
      </span>
      <span className="text-label text-green-900 uppercase">{title}</span>
      <span aria-hidden="true" className="h-px flex-1 self-center bg-rule" />
    </div>
  );
}
