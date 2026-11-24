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
  const isHeading = TitleTag === "h2";
  return (
    <div
      className={cn(
        "flex items-baseline gap-4 border-t border-ink",
        isHeading ? "pt-5" : "pt-3",
        className,
      )}
    >
      <span className="font-mono text-label text-terracotta-700 tabular-nums">
        {index}
      </span>
      <span aria-hidden="true" className="text-label text-ink-muted">
        —
      </span>
      <TitleTag
        id={id}
        className={
          isHeading
            ? "font-serif text-h3 text-ink"
            : "text-label text-ink uppercase"
        }
      >
        {title}
      </TitleTag>
    </div>
  );
}
