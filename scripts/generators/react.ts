import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { FrameworkGenerator, IconInfo } from "./types";

function generateIconComponent(icon: IconInfo): string {
  const lines = [
    `import { createIcon } from "../icon-base";`,
    "",
    `export const ${icon.pascalName} = createIcon(`,
    `  "${icon.pascalName}",`,
    `  "${icon.viewBox}",`,
    `  () => (`,
    `    <>`,
    `      ${icon.jsxContent}`,
    `    </>`,
    `  ),`,
    `);`,
    "",
  ];

  return lines.join("\n");
}

function generateBarrelFile(icons: IconInfo[]): string {
  return icons
    .map((icon) => `export { ${icon.pascalName} } from "./${icon.kebabName}";`)
    .join("\n") + "\n";
}

export const reactGenerator: FrameworkGenerator = {
  name: "react",

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
        const filePath = join(providerDir, `${icon.kebabName}.tsx`);
        writeFileSync(filePath, generateIconComponent(icon));
      }

      const barrelPath = join(providerDir, "index.ts");
      writeFileSync(barrelPath, generateBarrelFile(providerIcons));
    }

    console.log(`  [react] Generated ${icons.length} React components`);
  },
};
