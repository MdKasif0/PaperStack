import "server-only";

import { getAllPapers } from "./papers";

export interface VolumeInfo {
  /** One up per publishing year, e.g. papers from 2026 only -> Vol. 1. */
  volume: number;
  year: number;
}

/**
 * The masthead strip shows the current volume and year. Volume is derived
 * from content: each distinct publishing year adds one.
 */
export async function getVolumeInfo(): Promise<VolumeInfo> {
  const papers = await getAllPapers();
  const years = [
    ...new Set(papers.map((paper) => paper.publishedAt.getUTCFullYear())),
  ].sort((a, b) => a - b);
  const year = years.at(-1) ?? new Date().getUTCFullYear();
  return { volume: Math.max(years.length, 1), year };
}
