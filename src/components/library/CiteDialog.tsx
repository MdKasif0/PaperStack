"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { useDialog } from "@/components/site/useDialog";
import { formatCitation } from "@/lib/citations";
import type { SearchDocument } from "@/lib/content/search-index";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface CiteDialogProps {
  doc: SearchDocument;
  open: boolean;
  onClose: () => void;
}

/** Citation formats for one paper, with copy-to-clipboard. */
export function CiteDialog({ doc, open, onClose }: CiteDialogProps) {
  const panelRef = useDialog({ open, onClose });
  const [copied, setCopied] = useState<string | null>(null);

  const citationInput = {
    paperStackId: doc.paperStackId,
    title: doc.title,
    authors: doc.authors,
    year: doc.year,
    doi: doc.doi ?? undefined,
    url: `${SITE_URL}/papers/${doc.slug}`,
  } as const;

  const formats = [
    { label: "APA 7", text: formatCitation("apa", citationInput) },
    { label: "MLA 9", text: formatCitation("mla", citationInput) },
    { label: "IEEE", text: formatCitation("ieee", citationInput) },
    { label: "BibTeX", text: formatCitation("bibtex", citationInput) },
  ];

  function copy(label: string, text: string) {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Cite ${doc.title}`}
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-paper/90 transition-[opacity,visibility] duration-150 motion-reduce:transition-none",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="mx-auto mt-[10vh] w-[min(640px,calc(100vw-2.5rem))] rounded-sm border border-rule-strong bg-paper-raised">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
          <p className="text-label text-ink-muted uppercase">
            Cite {doc.paperStackId}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close citation dialog"
            className="inline-flex size-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper-sunk hover:text-green-900"
          >
            <span aria-hidden="true" className="text-h4 leading-none">
              ×
            </span>
          </button>
        </div>
        <ul className="m-0 list-none divide-y divide-rule p-0">
          {formats.map((format) => (
            <li key={format.label} className="flex gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-label text-ink-muted uppercase">
                  {format.label}
                </p>
                <p className="mt-1.5 font-mono text-small leading-relaxed break-words text-ink-soft">
                  {format.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copy(format.label, format.text)}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-sm border border-rule-strong bg-paper px-3 text-small text-ink-soft transition-colors hover:border-green-700 hover:text-green-900"
              >
                {copied === format.label ? (
                  <>
                    <Check
                      aria-hidden="true"
                      className="size-3.5 text-green-700"
                    />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" className="size-3.5" />
                    Copy
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
