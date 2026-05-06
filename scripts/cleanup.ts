import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { aws } from "./providers/aws";
import type { ProviderConfig } from "./providers/types";
import { dedup } from "./utils/naming";

const ROOT = join(import.meta.dirname, "..");
const RAW_DIR = join(ROOT, ".raw-svgs");

const PROVIDERS: ProviderConfig[] = [aws];

function cleanupProvider(provider: ProviderConfig): void {
  const providerDir = join(RAW_DIR, provider.name);
  const unzippedDir = join(providerDir, "unzipped");
  const cleanedDir = join(providerDir, "cleaned");

  if (!existsSync(unzippedDir)) {
    console.log(`  [skip] ${provider.name}: no unzipped directory`);
    return;
  }

  if (existsSync(cleanedDir)) {
    rmSync(cleanedDir, { recursive: true });
  }
  mkdirSync(cleanedDir, { recursive: true });

  const svgFiles = provider.extractSvgs(unzippedDir);
  console.log(`  [found] ${provider.name}: ${svgFiles.length} SVGs`);

  const normalizedNames = svgFiles.map((f) => provider.normalizeFilename(f.originalName));
  const uniqueNames = dedup(normalizedNames);

  let copied = 0;
  for (let i = 0; i < svgFiles.length; i++) {
    const file = svgFiles[i];
    const cleanName = `${uniqueNames[i]}.svg`;
    const dest = join(cleanedDir, cleanName);

    copyFileSync(file.absolutePath, dest);
    copied++;
  }

  const categoryMap = new Map<string, string[]>();
  for (let i = 0; i < svgFiles.length; i++) {
    const category = svgFiles[i].category;
    const name = uniqueNames[i];
    const existing = categoryMap.get(category) ?? [];
    existing.push(name);
    categoryMap.set(category, existing);
  }

  const categoriesPath = join(providerDir, "categories.json");
  const categoriesData: Record<string, string[]> = Object.fromEntries(categoryMap);
  writeFileSync(categoriesPath, JSON.stringify(categoriesData, null, 2));

  console.log(`  [cleaned] ${provider.name}: ${copied} files, ${categoryMap.size} categories`);
}

function main(): void {
  console.log("icons:cleanup");

  for (const provider of PROVIDERS) {
    cleanupProvider(provider);
  }

  console.log("Cleanup complete");
}

main();
