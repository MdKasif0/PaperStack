import type { Metadata } from "next";

import { Container, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Write to PaperStack — corrections, collaborations, questions.",
};

// Stub — the contact form arrives in a later step.
export default function ContactPage() {
  return (
    <Container width="site" className="py-16 sm:py-24">
      <SectionLabel index="00" title="Correspondence" />
      <h1 className="mt-6 font-serif text-h1 text-ink">Contact</h1>
      <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
        Corrections, questions, and collaboration proposals are welcome. The
        contact form and the letterbox arrive in a later step; until then, find
        me on <a href="https://github.com/MdKasif0">GitHub</a>.
      </p>
    </Container>
  );
}
