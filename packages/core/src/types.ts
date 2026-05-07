export type ProviderName = "aws" | "azure" | "gcp";

export interface IconMetadata {
  name: string;
  provider: ProviderName;
  category: string;
  aliases: string[];
  tags: string[];
}

export interface IconEntry {
  svg: string;
  viewBox: string;
  metadata: IconMetadata;
}

export type IconSize = number | string;
