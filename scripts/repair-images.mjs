#!/usr/bin/env node

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(await readFile(path.join(ROOT, "data", "products.json"), "utf8"));
const images = products.flatMap(product => product.images || []);
const missing = [];
for (const image of images) {
  try { await access(path.join(ROOT, image.localPath)); }
  catch { missing.push(image); }
}

let cursor = 0;
let repaired = 0;
const failed = [];
async function worker() {
  while (cursor < missing.length) {
    const image = missing[cursor++];
    const url = new URL(image.sourceUrl);
    url.searchParams.set("width", String(Math.min(Number(image.width) || 1600, 1600)));
    url.searchParams.set("format", "webp");
    let completed = false;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const response = await fetch(url, { headers: { accept: "image/webp", "user-agent": "CUEBOTS image repair/1.0" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!String(response.headers.get("content-type") || "").includes("image/webp")) throw new Error("Source did not return WebP");
        const destination = path.join(ROOT, image.localPath);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, Buffer.from(await response.arrayBuffer()));
        repaired += 1;
        completed = true;
        break;
      } catch (error) {
        if (attempt === 5) failed.push({ sourceUrl: image.sourceUrl, localPath: image.localPath, error: error.message });
        else await new Promise(resolve => setTimeout(resolve, attempt * 4000));
      }
    }
    if (!completed && failed.length > 30) await new Promise(resolve => setTimeout(resolve, 15000));
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
await writeFile(path.join(ROOT, "reports", "image-repair-report.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), missingBefore: missing.length, repaired, failed }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ missingBefore: missing.length, repaired, failed: failed.length }, null, 2));
if (failed.length) process.exitCode = 1;
