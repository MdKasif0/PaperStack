import { describe, expect, it } from "vitest";

import { generatePaperStackId } from "./ids";

describe("generatePaperStackId", () => {
  it("formats the first paper of a year", () => {
    expect(generatePaperStackId(new Date("2026-02-10T00:00:00Z"), 0)).toBe(
      "PS-2026.001",
    );
  });

  it("pads ordinals to three digits", () => {
    expect(generatePaperStackId(new Date("2026-02-10T00:00:00Z"), 11)).toBe(
      "PS-2026.012",
    );
  });

  it("uses the UTC year of the publish date", () => {
    expect(generatePaperStackId(new Date("2025-12-31T23:30:00Z"), 4)).toBe(
      "PS-2025.005",
    );
  });
});
