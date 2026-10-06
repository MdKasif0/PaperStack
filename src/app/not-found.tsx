import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container width="site" className="py-24 sm:py-36">
      <div className="mx-auto max-w-[68ch]">
        <p className="font-mono text-small text-terracotta-700 tabular-nums">
          404
        </p>
        <h1 className="mt-3 font-serif text-h1 text-ink">
          This page has been withdrawn.
        </h1>
        <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
          The address may be wrong, or the page was removed from the current
          issue. Nothing else has moved.
        </p>
        <p className="mt-8 text-body text-ink-soft">
          <Link href="/">Return to the front page</Link> or{" "}
          <Link href="/papers">browse the library</Link>.
        </p>
      </div>
    </Container>
  );
}
