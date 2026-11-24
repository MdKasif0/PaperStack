import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** True when a root-relative URL resolves to a file inside public/. */
export function publicFileExists(url: string): boolean {
  if (!url.startsWith("/")) return false;
  const file = path.join(PUBLIC_DIR, url);
  return file.startsWith(PUBLIC_DIR + path.sep) && existsSync(file);
}
