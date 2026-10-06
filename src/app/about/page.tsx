import type { Metadata } from "next";

import { Container, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "What PaperStack is and how it is run.",
};

// Stub — the full about page arrives in a later step.
export default function AboutPage() {
  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Colophon" />
      <h1 className="mt-6 font-serif text-h1 text-ink">About</h1>
      <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
        PaperStack is an open journal of independent research: one writer, a
        small circle of collaborators, and papers published with their data,
        their proofs, and their revision history. The full colophon arrives in a
        later step.
      </p>
    </Container>
  );
}
