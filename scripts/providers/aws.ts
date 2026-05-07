import { readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

import type { ProviderConfig, SvgFileInfo } from "./types";

const TARGET_SIZE = "48";

function findSvgFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (entry === "__MACOSX") continue;

    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      results.push(...findSvgFiles(full));
    } else if (entry.endsWith(".svg")) {
      results.push(full);
    }
  }

  return results;
}

function extractCategory(filePath: string): string {
  const parts = filePath.split("/");
  const categoryIndex = parts.findIndex((p) =>
    /^(Architecture-Service-Icons|Resource-Icons|Category-Icons|Architecture-Group-Icons)/.test(p),
  );

  if (categoryIndex !== -1 && categoryIndex + 1 < parts.length) {
    return parts[categoryIndex + 1]
      .replace(/^Arch_|^Res_|^Cat_/, "")
      .replace(/_/g, "-")
      .toLowerCase();
  }

  return "general";
}

export const aws: ProviderConfig = {
  name: "aws",

  extractSvgs(unzippedDir: string): SvgFileInfo[] {
    const allSvgs = findSvgFiles(unzippedDir);

    const targetSvgs = allSvgs.filter((filePath) => {
      const name = basename(filePath);

      if (!name.includes(`_${TARGET_SIZE}`)) return false;

      // Resource Icons: prefer Light variant, skip Dark
      if (name.includes("_Dark")) return false;

      return true;
    });

    return targetSvgs.map((absolutePath) => ({
      absolutePath,
      category: extractCategory(absolutePath),
      originalName: basename(absolutePath),
    }));
  },

  normalizeFilename(original: string): string {
    return (
      original
        .replace(/\.svg$/, "")
        // Remove prefixes: Arch_, Res_, Cat_
        .replace(/^(Arch|Res|Cat)_/, "")
        // Remove size + variant suffix: _48, _48_Light, _48_Dark
        .replace(/_\d+(_Light|_Dark)?$/, "")
        // Remove "Amazon-" and "AWS-" prefixes
        .replace(/^(Amazon|AWS)-?/, "")
        // Remove special characters (dots, ampersands, etc.)
        .replace(/[.&'(),+]/g, "")
        // Convert to kebab-case
        .replace(/[_\s]+/g, "-")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()
        // Clean up multiple dashes
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    );
  },
};
