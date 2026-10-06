import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { formatValidationError, topicSchema, type Topic } from "./schema";

const TOPICS_FILE = path.join(
  process.cwd(),
  "content",
  "topics",
  "topics.json",
);

async function loadTopics(): Promise<Topic[]> {
  const filePath = TOPICS_FILE;
  let raw: string;
  let parsedJson: unknown;
  try {
    raw = await readFile(filePath, "utf8");
    parsedJson = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Could not read ${filePath}: ${String(error)}`);
  }
  const parsed = topicSchema.array().safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error(formatValidationError(parsed.error, filePath));
  }
  return parsed.data;
}

let topicsCache: Promise<Topic[]> | null = null;

export async function getAllTopics(): Promise<Topic[]> {
  topicsCache ??= loadTopics();
  return topicsCache;
}
