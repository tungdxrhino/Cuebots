#!/usr/bin/env node

import { access, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = path.join(ROOT, "reports");
const broken = [];
const checked = new Set();

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
}

function localTarget(sourceFile, raw) {
  if (!raw || /^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(raw)) return null;
  const clean = decodeURIComponent(raw.split(/[?#]/)[0]);
  if (!clean) return null;
  return path.resolve(path.dirname(sourceFile), clean);
}

async function verify(sourceFile, raw, kind) {
  const target = localTarget(sourceFile, raw);
  if (!target) return;
  const key = `${sourceFile}|${target}`;
  if (checked.has(key)) return;
  checked.add(key);
  if (!target.toLowerCase().startsWith(ROOT.toLowerCase())) {
    broken.push({ source: path.relative(ROOT, sourceFile), reference: raw, kind, error: "Path escapes repository" });
    return;
  }
  try {
    const info = await stat(target);
    if (kind === "link" && info.isDirectory()) await access(path.join(target, "index.html"));
  } catch {
    broken.push({ source: path.relative(ROOT, sourceFile), reference: raw, kind, error: "Missing target" });
  }
}

const files = await walk(ROOT);
const htmlFiles = files.filter(file => file.endsWith(".html"));
for (const file of htmlFiles) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/\bhref=["']([^"']+)["']/gi)) await verify(file, match[1], "link");
  for (const match of text.matchAll(/\bsrc(?:set)?=["']([^"']+)["']/gi)) {
    const candidates = match[1].split(",").map(value => value.trim().split(/\s+/)[0]);
    for (const candidate of candidates) await verify(file, candidate, "asset");
  }
}

let products = [];
try { products = JSON.parse(await readFile(path.join(ROOT, "data", "products.json"), "utf8")); } catch {}
for (const product of products) {
  for (const image of product.images || []) await verify(path.join(ROOT, "index.html"), image.localPath, "catalog-image");
}

const result = {
  generatedAt: new Date().toISOString(),
  htmlFiles: htmlFiles.length,
  catalogProducts: products.length,
  referencesChecked: checked.size,
  brokenCount: broken.length,
  broken
};
await writeFile(path.join(REPORTS, "site-check-report.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ htmlFiles: result.htmlFiles, catalogProducts: result.catalogProducts, referencesChecked: result.referencesChecked, brokenCount: result.brokenCount }, null, 2));
if (broken.length) process.exitCode = 1;
