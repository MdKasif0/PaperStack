import { describe, expect, it } from "vitest";

import {
  bareDoi,
  citationUrl,
  formatApa,
  formatBibtex,
  formatCitation,
  formatIeee,
  formatMla,
  formatPlainText,
  splitAuthorName,
  type CitationInput,
} from "./citations";

const single: CitationInput = {
  paperStackId: "PS-2026.001",
  title: "Attention-Preserving Distillation for Compact Language Models",
  authors: ["Md Kasif Uddin"],
  year: 2026,
  doi: "https://doi.org/10.0000/paperstack.ps-2026.001",
};

const twoAuthors: CitationInput = {
  ...single,
  authors: ["Md Kasif Uddin", "Co-Author Placeholder"],
};

const threeAuthors: CitationInput = {
  ...single,
  authors: ["Md Kasif Uddin", "Co-Author Placeholder", "Ada Lovelace"],
};

const sevenAuthors: CitationInput = {
  ...single,
  authors: [
    "A One",
    "B Two",
    "C Three",
    "D Four",
    "E Five",
    "F Six",
    "G Seven",
  ],
};

describe("splitAuthorName", () => {
  it("splits multi-part names into given names and family name", () => {
    expect(splitAuthorName("Md Kasif Uddin")).toEqual({
      given: ["Md", "Kasif"],
      family: "Uddin",
    });
  });

  it("treats a single token as the family name", () => {
    expect(splitAuthorName("Plato")).toEqual({ given: [], family: "Plato" });
  });

  it("falls back to Unknown for empty input", () => {
    expect(splitAuthorName("   ")).toEqual({ given: [], family: "Unknown" });
  });
});

describe("doi helpers", () => {
  it("strips the doi.org prefix", () => {
    expect(bareDoi(single)).toBe("10.0000/paperstack.ps-2026.001");
  });

  it("prefers an explicit url over the doi", () => {
    expect(
      citationUrl({ ...single, url: "https://paperstack.example/paper" }),
    ).toBe("https://paperstack.example/paper");
  });

  it("builds a doi url when only a bare doi is given", () => {
    expect(citationUrl({ ...single, doi: "10.1234/abc" })).toBe(
      "https://doi.org/10.1234/abc",
    );
  });
});

describe("formatApa", () => {
  it("formats a single author", () => {
    expect(formatApa(single)).toBe(
      "Uddin, M. K. (2026). Attention-Preserving Distillation for Compact Language Models. PaperStack. https://doi.org/10.0000/paperstack.ps-2026.001",
    );
  });

  it("joins two authors with an ampersand", () => {
    expect(formatApa(twoAuthors)).toContain(
      "Uddin, M. K., & Placeholder, C. (2026).",
    );
  });

  it("places the ampersand before the last of three or more authors", () => {
    expect(formatApa(threeAuthors)).toContain(
      "Uddin, M. K., Placeholder, C., & Lovelace, A. (2026).",
    );
  });
});

describe("formatMla", () => {
  it("formats a single author with given names intact", () => {
    expect(formatMla(single)).toBe(
      'Uddin, Md Kasif. "Attention-Preserving Distillation for Compact Language Models." PaperStack, 2026, https://doi.org/10.0000/paperstack.ps-2026.001',
    );
  });

  it("joins two authors with and", () => {
    expect(formatMla(twoAuthors)).toContain(
      'Uddin, Md Kasif, and Placeholder, Co-Author. "',
    );
  });

  it("uses et al. for three or more authors", () => {
    expect(formatMla(threeAuthors)).toContain("Uddin, Md Kasif, et al. ");
  });
});

describe("formatIeee", () => {
  it("formats initials before the family name", () => {
    expect(formatIeee(single)).toBe(
      'M. K. Uddin, "Attention-Preserving Distillation for Compact Language Models," PaperStack, 2026. doi: 10.0000/paperstack.ps-2026.001.',
    );
  });

  it("joins two authors with and", () => {
    expect(formatIeee(twoAuthors)).toContain(
      'M. K. Uddin and C. Placeholder, "',
    );
  });

  it("truncates to six authors plus et al.", () => {
    const citation = formatIeee(sevenAuthors);
    expect(citation).toContain(
      "A. One, B. Two, C. Three, D. Four, E. Five, F. Six et al.",
    );
    expect(citation).not.toContain("Seven");
  });
});

describe("formatBibtex", () => {
  it("uses the PaperStack ID as the citation key and braces the title", () => {
    const bibtex = formatBibtex(single);
    expect(bibtex.startsWith("@misc{PS-2026.001,")).toBe(true);
    expect(bibtex).toContain(
      "  title = {{Attention-Preserving Distillation for Compact Language Models}},",
    );
    expect(bibtex).toContain("  author = {Uddin, Md Kasif},");
    expect(bibtex).toContain("  doi = {10.0000/paperstack.ps-2026.001},");
    expect(bibtex.endsWith("}")).toBe(true);
  });

  it("separates bibtex authors with and", () => {
    expect(formatBibtex(twoAuthors)).toContain(
      "  author = {Uddin, Md Kasif and Placeholder, Co-Author},",
    );
  });
});

describe("formatPlainText", () => {
  it("formats a plain-text citation", () => {
    expect(formatPlainText(single)).toBe(
      "Md Kasif Uddin (2026). Attention-Preserving Distillation for Compact Language Models. PaperStack. https://doi.org/10.0000/paperstack.ps-2026.001",
    );
  });

  it("joins two authors with and", () => {
    expect(formatPlainText(twoAuthors)).toMatch(
      /^Md Kasif Uddin and Co-Author Placeholder \(2026\)\./,
    );
  });
});

describe("formatCitation", () => {
  it("dispatches to the requested style", () => {
    for (const style of ["apa", "mla", "ieee", "bibtex", "plain"] as const) {
      expect(formatCitation(style, single).length).toBeGreaterThan(0);
    }
  });
});
