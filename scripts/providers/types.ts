export interface ProviderConfig {
  name: string;
  extractSvgs: (unzippedDir: string) => SvgFileInfo[];
  normalizeFilename: (original: string) => string;
}

export interface SvgFileInfo {
  absolutePath: string;
  category: string;
  originalName: string;
}
