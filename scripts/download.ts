import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

interface ManifestEntry {
  url: string;
  sha256: string;
  version: string;
  lastUpdated: string;
}

type Manifest = Record<string, ManifestEntry>;

const ROOT = join(import.meta.dirname, "..");
const RAW_DIR = join(ROOT, ".raw-svgs");
const MANIFEST_PATH = join(ROOT, "icons-manifest.json");

async function computeSha256(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  for await (const chunk of stream) {
    hash.update(chunk);
  }

  return hash.digest("hex");
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("Response body is empty");
  }

  const fileStream = createWriteStream(dest);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await pipeline(Readable.fromWeb(response.body as any), fileStream);
}

async function downloadProvider(name: string, entry: ManifestEntry): Promise<void> {
  const providerDir = join(RAW_DIR, name);
  const unzippedDir = join(providerDir, "unzipped");
  const zipPath = join(providerDir, `${name}-icons.zip`);

  if (existsSync(unzippedDir)) {
    console.log(`  [skip] ${name}: already downloaded`);
    return;
  }

  mkdirSync(providerDir, { recursive: true });

  console.log(`  [download] ${name}: ${entry.url}`);
  await downloadFile(entry.url, zipPath);

  const sha256 = await computeSha256(zipPath);
  console.log(`  [sha256] ${name}: ${sha256}`);

  if (entry.sha256 && entry.sha256 !== sha256) {
    rmSync(zipPath);
    throw new Error(
      `SHA256 mismatch for ${name}:\n  expected: ${entry.sha256}\n  got:      ${sha256}`,
    );
  }

  if (!entry.sha256) {
    console.log(`  [info] ${name}: no sha256 in manifest, computed: ${sha256}`);
    console.log(`  [info] Update icons-manifest.json with this value`);
  }

  console.log(`  [unzip] ${name}`);
  mkdirSync(unzippedDir, { recursive: true });
  execSync(`unzip -q -o "${zipPath}" -d "${unzippedDir}"`);

  rmSync(zipPath);
  console.log(`  [done] ${name}`);
}

async function main(): Promise<void> {
  console.log("icons:download");

  const manifest: Manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  const providers = Object.entries(manifest);

  if (providers.length === 0) {
    console.log("No providers in icons-manifest.json");
    return;
  }

  mkdirSync(RAW_DIR, { recursive: true });

  for (const [name, entry] of providers) {
    await downloadProvider(name, entry);
  }

  console.log("Download complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
