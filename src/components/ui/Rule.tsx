import { cn } from "@/lib/utils";

export interface RuleProps {
  /** When present, the rule renders as a labelled separator. */
  label?: string;
  className?: string;
}

export function Rule({ label, className }: RuleProps) {
  if (!label) {
    return <hr className={cn("border-0 border-t border-rule", className)} />;
  }

  return (
    <div role="separator" className={cn("flex items-center gap-4", className)}>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
      <span className="text-label text-ink-muted uppercase">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
    </div>
  );
}
