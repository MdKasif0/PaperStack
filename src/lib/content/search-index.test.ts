import { describe, expect, it } from "vitest";
import MiniSearch from "minisearch";

import {
  miniSearchOptions,
  serializeSearchIndex,
  toSearchDocuments,
  type SearchDocument,
  type SearchablePaper,
} from "./search-index";

const papers: SearchablePaper[] = [
  {
    slug: "attention-preserving-distillation",
    paperId: "PS-2026.001",
    title: "Attention-Preserving Distillation for Compact Language Models",
    abstract:
      "We ask whether preserving attention geometry during distillation keeps students calibrated under distribution shift.",
    topics: ["artificial-intelligence"],
    keywords: ["distillation", "transformers"],
    type: "research-paper",
    publishedAt: new Date("2026-02-10T00:00:00Z"),
    pdf: "/papers/attention-preserving-distillation/paper.pdf",
    links: { doi: "https://doi.org/10.0000/paperstack.ps-2026.001" },
    authors: [{ slug: "md-kasif-uddin" }, { slug: "placeholder" }],
  },
  {
    slug: "tls-handshake-timing-fingerprinting",
    paperId: "PS-2026.002",
    title: "Fingerprinting TLS Clients from Handshake Timing Alone",
    abstract: "Timing profiles distinguish browser families passively.",
    topics: ["cybersecurity"],
    keywords: ["TLS", "side channels"],
    type: "technical-report",
    publishedAt: new Date("2026-05-21T00:00:00Z"),
    authors: [{ slug: "md-kasif-uddin" }],
  },
];

const authorNames = new Map([
  ["md-kasif-uddin", "Md Kasif Uddin"],
  ["placeholder", "Co-Author Placeholder"],
]);

describe("search index round trip", () => {
  const documents = toSearchDocuments(papers, authorNames);
  const serialized = serializeSearchIndex(documents);

  it("stores the display fields the library rows need", () => {
    const first = documents[0];
    expect(first).toMatchObject({
      slug: "attention-preserving-distillation",
      paperStackId: "PS-2026.001",
      authors: ["Md Kasif Uddin", "Co-Author Placeholder"],
      authorSlugs: ["md-kasif-uddin", "placeholder"],
      year: 2026,
      publishedAt: "2026-02-10",
      pdf: "/papers/attention-preserving-distillation/paper.pdf",
    });
  });

  it("hydrates from the serialized JSON and finds exact terms", () => {
    const hydrated = MiniSearch.loadJSON<SearchDocument>(serialized, {
      idField: miniSearchOptions.idField,
      fields: [...miniSearchOptions.fields],
      storeFields: [...miniSearchOptions.storeFields],
    });
    const hits = hydrated.search(
      "distillation",
      miniSearchOptions.searchOptions,
    );
    expect(hits.map((hit) => hit.id)).toContain(
      "attention-preserving-distillation",
    );
  });

  it("matches with the fuzzy/prefix options the client uses", () => {
    const hydrated = MiniSearch.loadJSON<SearchDocument>(serialized, {
      idField: miniSearchOptions.idField,
      fields: [...miniSearchOptions.fields],
      storeFields: [...miniSearchOptions.storeFields],
    });
    // Prefix match
    expect(
      hydrated.search("fingerprint", miniSearchOptions.searchOptions),
    ).toHaveLength(1);
    // Fuzzy match: one edit away from "timing"
    const fuzzy = hydrated.search("tining", miniSearchOptions.searchOptions);
    expect(fuzzy.map((hit) => hit.id)).toContain(
      "tls-handshake-timing-fingerprinting",
    );
  });
});
