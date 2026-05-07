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
  const name = basename(filePath, ".svg").toLowerCase();

  if (name.includes("compute") || name.includes("gce") || name.includes("gpu")) return "compute";
  if (name.includes("storage") || name.includes("filestore")) return "storage";
  if (name.includes("sql") || name.includes("spanner") || name.includes("bigtable") || name.includes("datastore") || name.includes("firestore") || name.includes("memorystore")) return "databases";
  if (name.includes("network") || name.includes("vpc") || name.includes("dns") || name.includes("cdn") || name.includes("interconnect") || name.includes("vpn") || name.includes("load_balancing")) return "networking";
  if (name.includes("kubernetes") || name.includes("gke") || name.includes("anthos") || name.includes("container")) return "containers";
  if (name.includes("ai_platform") || name.includes("automl") || name.includes("ml") || name.includes("vertex") || name.includes("vision") || name.includes("natural_language") || name.includes("translation") || name.includes("dialogflow") || name.includes("speech")) return "ai-ml";
  if (name.includes("bigquery") || name.includes("dataflow") || name.includes("dataproc") || name.includes("pubsub") || name.includes("composer") || name.includes("datastream") || name.includes("analytics")) return "analytics";
  if (name.includes("iam") || name.includes("security") || name.includes("key_management") || name.includes("identity") || name.includes("armor")) return "security";
  if (name.includes("cloud_run") || name.includes("cloud_functions") || name.includes("app_engine")) return "serverless";
  if (name.includes("logging") || name.includes("monitoring") || name.includes("stackdriver") || name.includes("trace") || name.includes("debugger") || name.includes("profiler")) return "operations";

  return "general";
}

export const gcp: ProviderConfig = {
  name: "gcp",

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
        // Convert underscores to dashes
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
