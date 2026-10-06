import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  /** Numbered index, e.g. "01". Rendered in mono with tabular figures. */
  index: string;
  title: string;
  /** Render the title as a real h2 for section headings (default: span). */
  titleAs?: "span" | "h2";
  /** Id for the title element, for section aria-labelledby. */
  id?: string;
  className?: string;
}

export function SectionLabel({
  index,
  title,
  titleAs = "span",
  id,
  className,
}: SectionLabelProps) {
  const TitleTag = titleAs;
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="font-mono text-label text-terracotta-700 tabular-nums">
        {index}
      </span>
      <span aria-hidden="true" className="text-label text-ink-muted">
        —
      </span>
      <TitleTag id={id} className="text-label text-green-900 uppercase">
        {title}
      </TitleTag>
      <span aria-hidden="true" className="h-px flex-1 self-center bg-rule" />
    </div>
  );
}
