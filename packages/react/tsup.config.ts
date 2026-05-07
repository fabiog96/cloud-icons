import { existsSync } from "node:fs";
import { defineConfig } from "tsup";

const providerEntries: Record<string, string> = {};
for (const provider of ["aws", "azure", "gcp"]) {
  const entryPath = `src/${provider}/index.ts`;
  if (existsSync(entryPath)) {
    providerEntries[`${provider}/index`] = entryPath;
  }
}

export default defineConfig({
  entry: {
    index: "src/index.ts",
    ...providerEntries,
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ["react"],
  jsx: "automatic",
});
