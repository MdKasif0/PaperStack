import { cn } from "@/lib/utils";

export type SkeletonProps = { className?: string };

/** Calm loading placeholder in paper-sunk; pulses unless reduced motion. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-sm bg-paper-sunk motion-reduce:animate-none",
        className,
      )}
    />
  );
}
