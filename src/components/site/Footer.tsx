import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";

import { getAllTopics } from "@/lib/content";
import { cn } from "@/lib/utils";

import { Wordmark } from "./Wordmark";

const BROWSE_LINKS = [
  { href: "/papers", label: "Papers" },
  { href: "/topics", label: "Topics" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const columnClasses = "lg:border-l lg:border-rule lg:pl-10";

const actionClasses =
  "group/cta inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-green-700 no-underline duration-200 hover:text-green-900 lg:min-h-9";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-label font-medium text-ink-soft uppercase">
      {children}
    </h2>
  );
}

function FooterNav({
  heading,
  links,
}: {
  heading: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={heading} className={columnClasses}>
      <FooterHeading>{heading}</FooterHeading>
      <ul className="m-0 mt-2.5 list-none p-0 lg:mt-6 lg:space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-[0.9375rem] text-ink-soft no-underline transition-colors duration-200 hover:text-green-700 lg:min-h-0"
            >
              <span className="link-rule pb-0.5">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The journal's closing matter: identity, directory, and colophon line. */
export async function Footer() {
  const topics = await getAllTopics();
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-20 border-t border-rule-strong/60 sm:mt-24">
      <div className="mx-auto w-full max-w-site px-5 sm:px-8">
        <div className="grid gap-x-12 gap-y-12 py-14 md:grid-cols-2 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,0.85fr)_minmax(0,1.1fr)_minmax(0,1.3fr)] lg:gap-x-0 lg:py-16">
          <div className="lg:pr-12">
            <Wordmark className="[&_span]:text-h3 [&_svg]:size-7" />
            <p className="mt-7 mb-0 max-w-[23rem] font-serif text-[0.9375rem] leading-[1.7] text-ink-soft">
              An open journal of independent research, careful work on machine
              learning, security, and web engineering, published slowly and in
              public.
            </p>
            <span
              aria-hidden="true"
              className="mt-6 block h-0.5 w-8 bg-terracotta-600"
            />
            <p className="mt-5 mb-0 max-w-[23rem] text-meta text-ink-muted">
              Papers are licensed CC BY 4.0 unless noted otherwise.
            </p>
          </div>

          <FooterNav heading="Browse" links={BROWSE_LINKS} />

          <FooterNav
            heading="Topics"
            links={topics.map((topic) => ({
              href: `/topics/${topic.slug}`,
              label: topic.name,
            }))}
          />

          <section aria-label="Stay in touch" className={columnClasses}>
            <FooterHeading>Stay in touch</FooterHeading>
            <p className="mt-5 mb-0 max-w-[21rem] text-[0.9375rem] leading-[1.65] text-ink-soft lg:mt-6">
              Occasional digests of new papers and revised versions. No
              tracking, no noise.
            </p>
            <ul className="m-0 mt-4 list-none p-0 lg:mt-5">
              <li>
                <Link href="/#updates" className={actionClasses}>
                  <span className="link-rule link-rule-drawn pb-0.5">
                    Get updates
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="arrow-nudge size-4"
                  />
                </Link>
              </li>
              <li>
                <a href="/feed.xml" className={cn(actionClasses, "gap-2.5")}>
                  <Rss aria-hidden="true" className="arrow-nudge size-4" />
                  <span className="link-rule link-rule-drawn pb-0.5">
                    RSS feed
                  </span>
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-x-6 gap-y-2 border-t border-rule py-6 text-meta text-ink-muted md:flex-row md:items-baseline md:justify-between">
          <p className="m-0 tabular-nums">
            © {year} PaperStack · Md Kasif Uddin
          </p>
          <p className="m-0 font-mono">
            Built with Next.js · Deployed on Netlify
          </p>
        </div>
      </div>
    </footer>
  );
}
