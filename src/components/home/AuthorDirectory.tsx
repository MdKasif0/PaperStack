import Link from "next/link";

import { SectionLabel } from "@/components/ui";
import type { Author } from "@/lib/content";

/** Contributors, listed like an academic directory. */
export function AuthorDirectory({ authors }: { authors: Author[] }) {
  return (
    <section aria-labelledby="authors">
      <SectionLabel index="04" title="Authors" titleAs="h2" id="authors" />
      <ul className="m-0 mt-10 grid list-none gap-y-8 p-0 sm:grid-cols-2">
        {authors.map((author) => (
          <li
            key={author.slug}
            className="border-rule max-sm:not-first:border-t max-sm:not-first:pt-8 sm:odd:pr-9 sm:even:border-l sm:even:pl-9"
          >
            <Link
              href={`/authors/${author.slug}`}
              className="group block py-1 no-underline"
            >
              <span className="text-[1.125rem] font-medium text-ink transition-colors duration-200 group-hover:text-green-700">
                <span className="link-rule pb-0.5">{author.name}</span>
              </span>
              <span className="mt-2 block text-[0.9375rem] leading-relaxed text-ink-muted">
                {author.affiliation}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
