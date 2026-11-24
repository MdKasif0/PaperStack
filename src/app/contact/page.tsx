import type { Metadata } from "next";

import { PageHeader } from "@/components/site/PageHeader";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to PaperStack — corrections, collaborations, questions.",
};

// Stub — the contact form arrives in a later step.
export default function ContactPage() {
  return (
    <Container width="site" className="pt-12 pb-10 sm:pt-16 lg:pt-20">
      <PageHeader label="Correspondence" title="Contact">
        <p>
          Corrections, questions, and collaboration proposals are welcome. The
          contact form and the letterbox arrive in a later step; until then,
          find me on <a href="https://github.com/MdKasif0">GitHub</a>.
        </p>
      </PageHeader>
    </Container>
  );
}
