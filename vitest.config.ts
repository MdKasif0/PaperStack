import path from "node:path";

import { defineConfig } from "vitest/config";

/**
 * server-only throws when resolved through Vite's default conditions (it is
 * meant for Next.js's react-server resolution). Under Vitest, point it at
 * the package's own empty entry so loader tests can import the loaders.
 */
const serverOnlyStub = path.resolve(
  import.meta.dirname,
  "node_modules/server-only/empty.js",
);

export default defineConfig({
  resolve: {
    alias: {
      "server-only": serverOnlyStub,
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
