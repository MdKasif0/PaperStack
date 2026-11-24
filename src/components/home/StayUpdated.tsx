import { ArrowRight, Rss } from "lucide-react";

import { SectionLabel } from "@/components/ui";

import { NewsletterForm } from "./NewsletterForm";

/** Two ways to follow the journal: the feed, and the digest. */
export function StayUpdated() {
  return (
    <section aria-labelledby="stay-updated">
      <SectionLabel
        index="05"
        title="Stay updated"
        titleAs="h2"
        id="stay-updated"
      />
      <div className="mt-10 grid gap-y-12 md:grid-cols-2">
        <div className="md:pr-10 lg:pr-16">
          <p className="max-w-[27em] text-[1.1875rem] leading-[1.65] text-pretty text-ink">
            Occasional digests of new papers and revised versions, no tracking,
            no noise. Or take the whole feed:
          </p>
          <a
            href="/feed.xml"
            className="group/cta mt-6 inline-flex min-h-11 items-center gap-2.5 font-medium text-green-700 no-underline hover:text-green-900"
          >
            <Rss aria-hidden="true" className="size-4.5" />
            <span className="link-rule link-rule-drawn pb-0.5">
              Subscribe via RSS
            </span>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.75}
              className="arrow-forward size-4.5 text-terracotta-700"
            />
          </a>
        </div>
        <div className="md:border-l md:border-rule md:pl-10 lg:pl-16">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
