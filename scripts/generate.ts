import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { coreGenerator } from "./generators/core";
import { reactGenerator } from "./generators/react";
import { svgGenerator } from "./generators/svg";
import type { IconInfo } from "./generators/types";
import { toCamelCase, toPascalCase } from "./utils/naming";
import { extractSvgContent, svgToJsx } from "./utils/svg-parser";

const ROOT = join(import.meta.dirname, "..");
const RAW_DIR = join(ROOT, ".raw-svgs");
const PACKAGES_DIR = join(ROOT, "packages");

const PROVIDERS = ["aws"];

function loadIcons(providerName: string): IconInfo[] {
  const optimizedDir = join(RAW_DIR, providerName, "optimized");
  const categoriesPath = join(RAW_DIR, providerName, "categories.json");

  if (!existsSync(optimizedDir)) {
    console.log(`  [skip] ${providerName}: no optimized directory`);
    return [];
  }

  const categories: Record<string, string[]> = existsSync(categoriesPath)
    ? JSON.parse(readFileSync(categoriesPath, "utf-8"))
    : {};

  const categoryByName = new Map<string, string>();
  for (const [category, names] of Object.entries(categories)) {
    for (const name of names) {
      categoryByName.set(name, category);
    }
  }

  const files = readdirSync(optimizedDir).filter((f) => f.endsWith(".svg"));
  const icons: IconInfo[] = [];

  for (const file of files) {
    const kebabName = file.replace(/\.svg$/, "");
    const svgContent = readFileSync(join(optimizedDir, file), "utf-8");
    const { innerContent, viewBox } = extractSvgContent(svgContent);
    const jsxContent = svgToJsx(innerContent);

    icons.push({
      kebabName,
      pascalName: `${toPascalCase(providerName)}${toPascalCase(kebabName)}`,
      camelName: `${providerName}${toPascalCase(kebabName)}`,
      provider: providerName,
      category: categoryByName.get(kebabName) ?? "general",
      svgContent,
      viewBox,
      innerContent,
      jsxContent,
    });
  }

  return icons;
}

function main(): void {
  console.log("icons:generate");

  const allIcons: IconInfo[] = [];

  for (const provider of PROVIDERS) {
    const icons = loadIcons(provider);
    allIcons.push(...icons);
    console.log(`  [loaded] ${provider}: ${icons.length} icons`);
  }

  if (allIcons.length === 0) {
    console.log("No icons found. Run icons:optimize first.");
    return;
  }

  coreGenerator.generate(allIcons, join(PACKAGES_DIR, "core", "src"));
  svgGenerator.generate(allIcons, join(PACKAGES_DIR, "svg"));
  reactGenerator.generate(allIcons, join(PACKAGES_DIR, "react", "src"));

  console.log(`Generate complete: ${allIcons.length} icons total`);
}

main();
