import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { FrameworkGenerator, IconInfo } from "./types";

function generateIconFile(icon: IconInfo): string {
  return [
    `export const ${icon.camelName}Svg = \`${icon.innerContent}\`;`,
    `export const ${icon.camelName}ViewBox = "${icon.viewBox}";`,
    "",
  ].join("\n");
}

function generateBarrelFile(icons: IconInfo[]): string {
  return icons
    .map((icon) => `export { ${icon.camelName}Svg, ${icon.camelName}ViewBox } from "./${icon.kebabName}";`)
    .join("\n") + "\n";
}

export const coreGenerator: FrameworkGenerator = {
  name: "core",

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
        const filePath = join(providerDir, `${icon.kebabName}.ts`);
        writeFileSync(filePath, generateIconFile(icon));
      }

      const barrelPath = join(providerDir, "index.ts");
      writeFileSync(barrelPath, generateBarrelFile(providerIcons));
    }

    console.log(`  [core] Generated ${icons.length} icon modules`);
  },
};
