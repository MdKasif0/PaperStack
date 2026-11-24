"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";

import { CiteDialog } from "./CiteDialog";
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
      <mark key={index} className="rounded-xs bg-green-100 text-green-900">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

const actionLinkClasses =
  "inline-flex min-h-8 items-center text-small font-medium text-green-700 underline decoration-green-700/45 decoration-1 underline-offset-4 transition-colors hover:text-green-900 hover:decoration-2";

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
    <article className="paper-row group grid gap-x-8 gap-y-3 border-b border-rule py-8 sm:grid-cols-[1fr_8rem]">
      <div>
        <h3 className="font-serif text-h3 text-balance text-ink">
          <Link
            href={`/papers/${doc.slug}`}
            className="text-ink no-underline transition-colors group-hover:text-green-700 hover:underline hover:decoration-green-700/45 hover:decoration-1 hover:underline-offset-4"
          >
            {highlight(doc.title, terms)}
          </Link>
        </h3>
        <p className="meta-line mt-2 text-meta text-ink-muted">
          <span>{doc.authors.join(", ")}</span>
          <span className="tabular-nums">{doc.publishedAt}</span>
          {doc.topics.map((slug) => {
            const topic = topics.get(slug);
            return topic ? <span key={slug}>{topic.name}</span> : null;
          })}
        </p>
        <p
          id={abstractId}
          className={cn(
            "mt-4 max-w-[66ch] font-serif text-abstract text-ink-soft",
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
          <Link
            href={`/papers/${doc.slug}`}
            className={cn(actionLinkClasses, "font-semibold")}
          >
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
      <div className="font-mono text-meta text-ink-muted tabular-nums sm:pt-1.5 sm:text-right">
        <p>{doc.paperStackId}</p>
        <p className="mt-0.5 capitalize">{typeLabel}</p>
      </div>
      <CiteDialog
        doc={doc}
        open={citeOpen}
        onClose={() => setCiteOpen(false)}
      />
    </article>
  );
}
