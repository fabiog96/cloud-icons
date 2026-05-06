import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { FrameworkGenerator, IconInfo } from "./types";

export const svgGenerator: FrameworkGenerator = {
  name: "svg",

  generate(icons: IconInfo[], outputDir: string): void {
    const byProvider = new Map<string, IconInfo[]>();

    for (const icon of icons) {
      const existing = byProvider.get(icon.provider) ?? [];
      existing.push(icon);
      byProvider.set(icon.provider, existing);
    }

    for (const [provider, providerIcons] of byProvider) {
      const providerDir = join(outputDir, provider);

      if (!existsSync(providerDir)) {
        mkdirSync(providerDir, { recursive: true });
      }

      for (const icon of providerIcons) {
        const filePath = join(providerDir, `${icon.kebabName}.svg`);
        writeFileSync(filePath, icon.svgContent);
      }
    }

    console.log(`  [svg] Copied ${icons.length} SVG files`);
  },
};
