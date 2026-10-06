import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container width="site" className="py-16 sm:py-24">
      <div role="status" aria-label="Loading author">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-12 w-64 max-w-full" />
        <Skeleton className="mt-4 h-4 w-48" />
        <div className="mt-8 flex max-w-prose flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </Container>
  );
}
