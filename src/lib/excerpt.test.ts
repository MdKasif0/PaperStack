import { describe, expect, it } from "vitest";

import { excerpt } from "./excerpt";

describe("excerpt", () => {
  it("returns short text unchanged", () => {
    expect(excerpt("A short abstract.", 40)).toBe("A short abstract.");
  });

  it("ends on a whole word", () => {
    expect(excerpt("during knowledge distillation", 13)).toBe("during…");
  });

  it("drops trailing punctuation before the ellipsis", () => {
    expect(excerpt("three build tools, cataloguing", 20)).toBe(
      "three build tools…",
    );
  });

  it("stays within the limit plus the ellipsis", () => {
    expect(excerpt("word ".repeat(80), 155).length).toBeLessThanOrEqual(156);
  });
});
