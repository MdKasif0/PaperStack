"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";

import { CiteDialog } from "./CiteDialog";
import { Tag } from "@/components/ui";
import type { SearchDocument } from "@/lib/content/search-index";
import type { Topic } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps query terms in <mark> so matches read at a glance. */
export function highlight(text: string, terms: string[]): ReactNode {
  const patterns = terms
    .map((term) => term.trim())
    .filter((term) => term.length > 1)
    .map(escapeRegex);
  if (patterns.length === 0) return text;

  const regex = new RegExp(`(${patterns.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="rounded-xs bg-gold-100 text-ink">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

const actionLinkClasses =
  "no-underline inline-flex items-center text-small font-medium text-green-700 underline decoration-terracotta-600 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2";

export interface PaperRowProps {
  doc: SearchDocument;
  topics: Map<string, Topic>;
  terms: string[];
}

export function PaperRow({ doc, topics, terms }: PaperRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [citeOpen, setCiteOpen] = useState(false);
  const abstractId = useId();
  const typeLabel = doc.type.replace(/-/g, " ");

  return (
    <article className="grid gap-x-6 gap-y-2 border-b border-rule py-7 sm:grid-cols-[9rem_1fr]">
      <div className="font-mono text-small text-ink-muted tabular-nums">
        <p className="text-terracotta-700">{doc.paperStackId}</p>
        <p className="mt-0.5">{doc.publishedAt}</p>
        <p className="mt-0.5 capitalize">{typeLabel}</p>
      </div>
      <div>
        <h3 className="font-serif text-h3 text-ink">
          <Link
            href={`/papers/${doc.slug}`}
            className="no-underline transition-colors hover:text-green-900 hover:underline hover:decoration-terracotta-600 hover:decoration-1 hover:underline-offset-4"
          >
            {highlight(doc.title, terms)}
          </Link>
        </h3>
        <p className="mt-1.5 text-small text-ink-muted">
          {doc.authors.join(", ")}
        </p>
        {doc.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doc.topics.map((slug) => {
              const topic = topics.get(slug);
              return topic ? (
                <Tag key={slug} tone={topic.accent}>
                  {topic.name}
                </Tag>
              ) : null;
            })}
          </div>
        )}
        <p
          id={abstractId}
          className={cn(
            "mt-3 max-w-prose text-small leading-relaxed text-ink-soft",
            !expanded && "line-clamp-3",
          )}
        >
          {highlight(doc.abstract, terms)}
        </p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={abstractId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-small font-medium text-green-700 transition-colors hover:text-green-900"
        >
          {expanded ? "Hide abstract" : "Show abstract"}
        </button>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href={`/papers/${doc.slug}`} className={actionLinkClasses}>
            Read
          </Link>
          {doc.pdf && (
            <a href={doc.pdf} className={actionLinkClasses}>
              PDF
            </a>
          )}
          <button
            type="button"
            onClick={() => setCiteOpen(true)}
            className={cn(actionLinkClasses, "cursor-pointer")}
          >
            Cite
          </button>
        </div>
      </div>
      <CiteDialog
        doc={doc}
        open={citeOpen}
        onClose={() => setCiteOpen(false)}
      />
    </article>
  );
}
