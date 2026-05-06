export interface IconInfo {
  kebabName: string;
  pascalName: string;
  camelName: string;
  provider: string;
  category: string;
  svgContent: string;
  viewBox: string;
  innerContent: string;
  jsxContent: string;
}

export interface FrameworkGenerator {
  name: string;
  generate: (icons: IconInfo[], outputDir: string) => void;
}
