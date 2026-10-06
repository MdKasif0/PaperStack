"use client";

import { useEffect } from "react";

import { Button, Container } from "@/components/ui";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container width="site" className="py-24 sm:py-36">
      <div className="mx-auto max-w-[68ch]">
        <p className="font-mono text-small text-terracotta-700 tabular-nums">
          Press error
        </p>
        <h1 className="mt-3 font-serif text-h1 text-ink">
          Something jammed in the press room.
        </h1>
        <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
          The page could not be set. This is on us, not on you — try again, and
          if it keeps failing, send word via the contact page.
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-small text-ink-muted">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </Container>
  );
}
