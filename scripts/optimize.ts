import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { optimize } from "svgo";

import svgoConfig from "../svgo.config";

const ROOT = join(import.meta.dirname, "..");
const RAW_DIR = join(ROOT, ".raw-svgs");

const PROVIDERS = ["aws", "azure", "gcp"];

function optimizeProvider(providerName: string): void {
  const providerDir = join(RAW_DIR, providerName);
  const cleanedDir = join(providerDir, "cleaned");
  const optimizedDir = join(providerDir, "optimized");

  if (!existsSync(cleanedDir)) {
    console.log(`  [skip] ${providerName}: no cleaned directory`);
    return;
  }

  if (existsSync(optimizedDir)) {
    rmSync(optimizedDir, { recursive: true });
  }
  mkdirSync(optimizedDir, { recursive: true });

  const files = readdirSync(cleanedDir).filter((f) => f.endsWith(".svg"));
  console.log(`  [optimize] ${providerName}: ${files.length} SVGs`);

  let optimized = 0;
  for (const file of files) {
    const inputPath = join(cleanedDir, file);
    const outputPath = join(optimizedDir, file);
    const svgContent = readFileSync(inputPath, "utf-8");

    const result = optimize(svgContent, {
      ...svgoConfig,
      path: inputPath,
    });

    writeFileSync(outputPath, result.data);
    optimized++;
  }

  console.log(`  [done] ${providerName}: ${optimized} files optimized`);
}

function main(): void {
  console.log("icons:optimize");

  for (const provider of PROVIDERS) {
    optimizeProvider(provider);
  }

  console.log("Optimize complete");
}

main();
