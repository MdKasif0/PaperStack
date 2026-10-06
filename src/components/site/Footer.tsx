import Link from "next/link";
import { Rss } from "lucide-react";

import { getAllTopics } from "@/lib/content";

import { StackMark } from "./Wordmark";

const BROWSE_LINKS = [
  { href: "/papers", label: "Papers" },
  { href: "/topics", label: "Topics" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function FooterHeading({ children }: { children: string }) {
  return <h2 className="text-label text-ink-muted uppercase">{children}</h2>;
}

export async function Footer() {
  const topics = await getAllTopics();
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-24 border-t border-rule bg-paper">
      <div className="mx-auto grid w-full max-w-site gap-x-8 gap-y-12 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5 text-green-700">
            <StackMark className="h-5 w-5" />
            <span className="font-serif text-h4 font-medium tracking-[-0.01em] text-ink">
              PaperStack
            </span>
          </div>
          <p className="mt-4 max-w-sm text-small leading-relaxed text-ink-soft">
            An open journal of independent research — careful work on machine
            learning, security, and web engineering, published slowly and in
            public.
          </p>
          <p className="mt-4 text-small text-ink-muted">
            Papers are licensed CC BY 4.0 unless noted otherwise.
          </p>
        </div>

        <nav aria-label="Browse" className="md:col-span-2">
          <FooterHeading>Browse</FooterHeading>
          <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
            {BROWSE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-small text-ink-soft no-underline transition-colors hover:text-green-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Topics" className="md:col-span-2">
          <FooterHeading>Topics</FooterHeading>
          <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="text-small text-ink-soft no-underline transition-colors hover:text-green-900"
                >
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <FooterHeading>Stay in touch</FooterHeading>
          <p className="mt-4 text-small leading-relaxed text-ink-soft">
            Occasional digests of new papers and revised versions. No tracking,
            no noise.
          </p>
          <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
            <li>
              <Link
                href="/contact"
                className="text-small text-green-700 no-underline transition-colors hover:text-green-900"
              >
                Get updates
              </Link>
            </li>
            <li>
              <a
                href="/feed.xml"
                className="inline-flex items-center gap-1.5 text-small text-green-700 no-underline transition-colors hover:text-green-900"
              >
                <Rss aria-hidden="true" className="size-3.5" />
                RSS feed
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-site flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 sm:px-8">
          <p className="text-small text-ink-muted tabular-nums">
            © {year} PaperStack · Md Kasif Uddin
          </p>
          <p className="font-mono text-small text-ink-muted">
            Built with Next.js · Deployed on Netlify
          </p>
        </div>
      </div>
    </footer>
  );
}
