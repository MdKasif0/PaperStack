import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "What PaperStack is and how it is run.",
};

// Stub — the full about page arrives in a later step.
export default function AboutPage() {
  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Colophon" title="About">
        <p>
          PaperStack is an open journal of independent research: one writer, a
          small circle of collaborators, and papers published with their data,
          their proofs, and their revision history. The full colophon arrives in
          a later step.
        </p>
      </PageHeader>
    </Container>
  );
}
