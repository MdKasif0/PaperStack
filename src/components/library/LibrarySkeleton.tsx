import { Skeleton } from "@/components/ui";

/** Calm loading state for the library while the search index hydrates. */
export function LibraryRowsSkeleton() {
  return (
    <div role="status" aria-label="Loading papers" aria-busy="true">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="grid gap-x-8 gap-y-3 border-b border-rule py-8 sm:grid-cols-[1fr_8rem]"
        >
          <div className="flex flex-col gap-3">
            <Skeleton className="h-7 w-full max-w-lg" />
            <Skeleton className="h-4 w-48" />
            <div className="mt-1 flex flex-col gap-2">
              <Skeleton className="h-3.5 w-full max-w-xl" />
              <Skeleton className="h-3.5 w-11/12 max-w-xl" />
              <Skeleton className="h-3.5 w-3/5 max-w-xl" />
            </div>
            <Skeleton className="mt-1 h-4 w-40" />
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
