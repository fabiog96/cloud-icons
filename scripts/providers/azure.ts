import { readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

import type { ProviderConfig, SvgFileInfo } from "./types";

function findSvgFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir)) {
    if (entry === "__MACOSX" || entry === ".DS_Store") continue;

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
  const iconsIndex = parts.findIndex((p) => p === "Icons");

  if (iconsIndex !== -1 && iconsIndex + 1 < parts.length) {
    return parts[iconsIndex + 1].toLowerCase();
  }

  return "general";
}

export const azure: ProviderConfig = {
  name: "azure",

  extractSvgs(unzippedDir: string): SvgFileInfo[] {
    const allSvgs = findSvgFiles(unzippedDir);

    return allSvgs.map((absolutePath) => ({
      absolutePath,
      category: extractCategory(absolutePath),
      originalName: basename(absolutePath),
    }));
  },

  normalizeFilename(original: string): string {
    return (
      original
        .replace(/\.svg$/, "")
        // Remove numeric prefix: "00195-icon-service-"
        .replace(/^\d+-icon-service-/, "")
        // Convert to kebab-case
        .replace(/[_\s]+/g, "-")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()
        // Remove special characters
        .replace(/[.&'(),+]/g, "")
        // Clean up multiple dashes
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    );
  },
};
