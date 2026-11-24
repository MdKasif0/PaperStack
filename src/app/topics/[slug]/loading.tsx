import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <div role="status" aria-label="Loading topic">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-12 w-72 max-w-full" />
        <Skeleton className="mt-6 h-4 w-full max-w-xl" />
        <Skeleton className="mt-3 h-4 w-4/5 max-w-xl" />
        <Skeleton className="mt-10 h-4 w-40" />
      </div>
    </Container>
  );
}
