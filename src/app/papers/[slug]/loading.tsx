import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container width="site" className="py-16 sm:py-24">
      <div
        role="status"
        aria-label="Loading paper"
        className="mx-auto max-w-[68ch]"
      >
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-12 w-full max-w-xl" />
        <Skeleton className="mt-4 h-4 w-56" />
        <Skeleton className="mt-10 h-px w-full" />
        <div className="mt-10 flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </Container>
  );
}
