#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "https://www.cuebots.com";
const DATA_DIR = path.join(ROOT, "data");
const IMAGE_DIR = path.join(ROOT, "assets", "images", "imported");
const REPORT_DIR = path.join(ROOT, "reports");
const DOWNLOAD_IMAGES = !process.argv.includes("--skip-images");
const CONCURRENCY = 10;

const failures = [];
const warnings = [];
const urlSet = new Set();

const decodeEntities = value => String(value || "")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const stripHtml = value => decodeEntities(String(value || "")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<br\s*\/?\s*>/gi, "\n")
  .replace(/<\/p>|<\/li>|<\/h[1-6]>/gi, "\n")
  .replace(/<[^>]+>/g, " "))
  .replace(/[ \t]+/g, " ")
  .replace(/\n\s+/g, "\n")
  .trim();

const slugify = value => String(value || "item")
  .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "item";

async function fetchText(url, attempts = 3) {
  urlSet.add(url);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "CUEBOTS catalog importer/1.0", "accept-language": "en-US,en;q=0.9" },
        redirect: "follow"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, attempt * 450));
    }
  }
  failures.push({ url, error: String(lastError?.message || lastError) });
  return "";
}

async function fetchJson(url) {
  const text = await fetchText(url);
  if (!text) return null;
  try { return JSON.parse(text); }
  catch (error) {
    failures.push({ url, error: `Invalid JSON: ${error.message}` });
    return null;
  }
}

function sitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map(match => decodeEntities(match[1].trim()))
    .filter(url => url.startsWith(SOURCE));
}

async function collectSitemaps() {
  const rootXml = await fetchText(`${SOURCE}/sitemap.xml`);
  const childSitemaps = sitemapUrls(rootXml).filter(url => /sitemap_/i.test(url));
  const entries = [];
  for (const sitemap of childSitemaps) {
    const xml = await fetchText(sitemap);
    entries.push(...sitemapUrls(xml).map(url => ({ url, sitemap })));
  }
  return { childSitemaps, entries };
}

async function collectPaged(endpoint, key) {
  const output = [];
  for (let page = 1; page < 50; page += 1) {
    const joiner = endpoint.includes("?") ? "&" : "?";
    const payload = await fetchJson(`${endpoint}${joiner}limit=250&page=${page}`);
    const rows = payload?.[key] || [];
    output.push(...rows);
    if (rows.length < 250) break;
  }
  return output;
}

const normalized = value => String(value || "").trim().toLowerCase();

function includesAny(value, terms) {
  const haystack = normalized(value);
  return terms.some(term => haystack.includes(term));
}

function inferProductClass(product, collectionHandles = []) {
  const type = normalized(product.product_type || product.type);
  const title = normalized(product.title);
  const collections = collectionHandles.join(" ").toLowerCase();
  const combined = `${type} ${collections} ${title}`;

  if (includesAny(type, ["service", "customize", "exchange"])) return "service";
  if (includesAny(type, ["cue butt", "butt only"]) || includesAny(title, ["butt only", "cue butt"])) return "cue-butt";
  if (includesAny(type, ["shaft"]) || /\bshaft\b/.test(title)) return "shaft";
  if (includesAny(type, ["cue case"]) || /\bcase\b/.test(title)) return "case";
  if (includesAny(type, ["glove"]) || /\bglove\b/.test(title)) return "glove";
  if (type === "maxbing") return "bundle";
  if (/\bcuebots\s+cue\b/.test(title)) return "complete-cue";
  if (includesAny(type, ["pool cue", "break cue", "jump cue", "carom cue"]) || /\b(pool|break|jump|carom)\s+cue\b/.test(title)) return "complete-cue";
  if (includesAny(combined, ["bundle", "set of", "combo", "package"])) return "bundle";
  if (includesAny(type, ["accessor", "extension", "weight bolt", "joint tester", "billiard tip"]) || includesAny(title, ["joint protector", "weight bolt", "microfiber towel"])) return "accessory";
  return null;
}

function inferCueType(product) {
  const value = `${product.product_type || ""} ${product.title || ""}`.toLowerCase();
  if (/\bcarom\b/.test(value)) return "carom";
  if (/\bbreak\b/.test(value)) return "break";
  if (/\bjump\b/.test(value)) return "jump";
  if (/\bpool\b/.test(value)) return "pool";
  return null;
}

function inferShaftPurpose(product) {
  if (inferProductClass(product) !== "shaft") return null;
  const value = `${product.product_type || ""} ${product.title || ""}`.toLowerCase();
  if (/\bcarom\b/.test(value)) return "carom";
  if (/\bbreak\b/.test(value)) return "break";
  return "playing";
}

function inferCaseType(product) {
  if (inferProductClass(product) !== "case") return null;
  const value = `${product.title || ""} ${product.body_html || ""}`.toLowerCase();
  if (/\bsoft\b/.test(value)) return "soft";
  if (/\bhard\b/.test(value)) return "hard";
  return null;
}

function inferGloveHand(product) {
  if (inferProductClass(product) !== "glove") return null;
  const value = `${product.product_type || ""} ${product.title || ""}`.toLowerCase();
  const left = /\bleft\b/.test(value);
  const right = /\bright\b/.test(value);
  if (left && right) return "both";
  if (left) return "left";
  if (right) return "right";
  return null;
}

function optionValues(product, pattern) {
  return (product.options || [])
    .filter(option => pattern.test(option.name || ""))
    .flatMap(option => option.values || [])
    .map(String).filter(Boolean);
}

function parseSpecs(product) {
  const raw = `${stripHtml(product.body_html)} ${(product.options || []).map(option => `${option.name}: ${(option.values || []).join(", ")}`).join(" ")}`;
  const findMany = regex => [...raw.matchAll(regex)].map(match => match[1].trim()).filter(Boolean);
  const joints = [...new Set([...optionValues(product, /joint|pin/i), ...findMany(/\b(radial|uni[- ]?loc|uni[- ]?qr|3\/8[- ](?:8|10|11|14)|5\/16[- ](?:14|18))\b/gi)])];
  const diameters = [...new Set([...optionValues(product, /diameter/i), ...findMany(/\b(\d{1,2}(?:\.\d+)?)\s*mm\b/gi).map(value => `${value} mm`)])];
  const weights = [...new Set([...optionValues(product, /weight/i), ...findMany(/\b(\d{1,2}(?:\.\d+)?)\s*(?:oz|ounce)/gi).map(value => `${value} oz`)])];
  const lengths = [...new Set([...optionValues(product, /length/i), ...findMany(/\b(\d{2})\s*(?:inches|inch|in\.?|\")/gi).map(value => `${value} in`)])];
  return {
    joint: joints,
    diameter: diameters,
    weight: weights,
    length: lengths,
    wrap: optionValues(product, /wrap/i),
    color: optionValues(product, /color|colour|finish/i),
    size: optionValues(product, /size/i),
    hand: optionValues(product, /hand/i),
    tip: optionValues(product, /tip/i),
    taper: optionValues(product, /taper/i),
    capacity: findMany(/\b(\d\s*[xÃ—]\s*\d)\b/gi)
  };
}

function priceNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeProduct(product, membership) {
  const collections = membership.get(product.handle) || [];
  const productClass = inferProductClass(product, collections);
  const variants = (product.variants || []).map(variant => ({
    id: String(variant.id),
    title: variant.title,
    sku: variant.sku || "",
    available: Boolean(variant.available),
    price: priceNumber(variant.price),
    compareAtPrice: priceNumber(variant.compare_at_price),
    options: [variant.option1, variant.option2, variant.option3].filter(Boolean),
    weightGrams: Number.isFinite(variant.grams) ? variant.grams : null
  }));
  const prices = variants.map(item => item.price).filter(Number.isFinite);
  const comparePrices = variants.map(item => item.compareAtPrice).filter(Number.isFinite);
  return {
    id: String(product.id),
    slug: product.handle,
    title: product.title,
    descriptionHtml: product.body_html || "",
    description: stripHtml(product.body_html),
    vendor: product.vendor || "CUEBOTS",
    sourceProductType: product.product_type || "",
    productClass,
    cueType: inferCueType(product),
    shaftPurpose: inferShaftPurpose(product),
    caseType: inferCaseType(product),
    gloveHand: inferGloveHand(product),
    series: (product.tags || []).find(tag => /series/i.test(tag)) || null,
    tags: product.tags || [],
    collections,
    price: prices.length ? Math.min(...prices) : null,
    compareAtPrice: comparePrices.length ? Math.max(...comparePrices) : null,
    currency: "VND",
    available: variants.some(variant => variant.available),
    specs: parseSpecs(product),
    options: product.options || [],
    variants,
    images: (product.images || []).map((image, index) => ({
      sourceUrl: image.src,
      localPath: `assets/images/imported/${slugify(product.handle)}-${String(index + 1).padStart(2, "0")}.webp`,
      width: image.width || null,
      height: image.height || null,
      alt: `${product.title}${index ? ` detail ${index + 1}` : ""}`,
      position: image.position || index + 1
    })),
    publishedAt: product.published_at || null,
    updatedAt: product.updated_at || null,
    canonicalUrl: `${SOURCE}/products/${product.handle}`,
    reviews: []
  };
}

async function mapCollectionMembership(collections) {
  const membership = new Map();
  for (const collection of collections) {
    const products = await collectPaged(`${SOURCE}/collections/${collection.handle}/products.json?country=US`, "products");
    for (const product of products) {
      if (!membership.has(product.handle)) membership.set(product.handle, []);
      membership.get(product.handle).push(collection.handle);
    }
  }
  return membership;
}

function mergeMixedMarketPrices(usProducts, defaultProducts) {
  const defaultByHandle = new Map(defaultProducts.map(product => [product.handle, product]));
  return usProducts.map(product => {
    const defaultProduct = defaultByHandle.get(product.handle);
    const defaultVariants = new Map((defaultProduct?.variants || []).map(variant => [String(variant.id), variant]));
    return {
      ...product,
      variants: (product.variants || []).map(variant => {
        const defaultVariant = defaultVariants.get(String(variant.id));
        const usPrice = Number(variant.price);
        const usCompare = Number(variant.compare_at_price);
        return {
          ...variant,
          price: Number.isFinite(usPrice) && usPrice < 100000 && defaultVariant?.price != null ? defaultVariant.price : variant.price,
          compare_at_price: Number.isFinite(usCompare) && usCompare < 100000 && defaultVariant?.compare_at_price != null ? defaultVariant.compare_at_price : variant.compare_at_price
        };
      })
    };
  });
}

function extractPage(url, html, kind) {
  const title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").replace(/\s*[|â€“-]\s*CUEBOTS.*$/i, "").trim();
  const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || html;
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1] || url;
  const publishedAt = (html.match(/(?:article:published_time|datePublished)[^>"']*["'][^"']*["']([^"']+)/i) || [])[1] || null;
  const image = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) || [])[1] || null;
  return { id: slugify(new URL(url).pathname), type: kind, title, bodyHtml: main, body: stripHtml(main), image, publishedAt, canonicalUrl: canonical, sourceUrl: url };
}

async function downloadImages(products) {
  const jobs = products.flatMap(product => product.images.map(image => ({ product, image })));
  const hashToPath = new Map();
  let cursor = 0;
  let downloaded = 0;
  let deduplicated = 0;
  const manifest = [];

  async function worker() {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      const destination = path.join(ROOT, job.image.localPath);
      try {
        await access(destination);
        manifest.push({ sourceUrl: job.image.sourceUrl, localPath: job.image.localPath, status: "existing" });
        continue;
      } catch {}
      try {
        const optimizedUrl = new URL(job.image.sourceUrl);
        optimizedUrl.searchParams.set("width", String(Math.min(job.image.width || 1600, 1600)));
        optimizedUrl.searchParams.set("format", "webp");
        const response = await fetch(optimizedUrl, { headers: { "user-agent": "CUEBOTS catalog importer/1.0", accept: "image/webp" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!String(response.headers.get("content-type") || "").includes("image/webp")) throw new Error(`Unexpected image type: ${response.headers.get("content-type") || "unknown"}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (hashToPath.has(digest)) {
          job.image.localPath = hashToPath.get(digest);
          deduplicated += 1;
          manifest.push({ sourceUrl: job.image.sourceUrl, optimizedUrl: String(optimizedUrl), localPath: job.image.localPath, hash: digest, status: "duplicate" });
          continue;
        }
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, buffer);
        hashToPath.set(digest, job.image.localPath);
        downloaded += 1;
        manifest.push({ sourceUrl: job.image.sourceUrl, optimizedUrl: String(optimizedUrl), localPath: job.image.localPath, hash: digest, bytes: buffer.length, status: "downloaded" });
      } catch (error) {
        failures.push({ url: job.image.sourceUrl, error: String(error.message || error) });
        manifest.push({ sourceUrl: job.image.sourceUrl, localPath: job.image.localPath, status: "failed" });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { manifest, downloaded, deduplicated };
}

async function writeJson(filename, value) {
  await writeFile(path.join(DATA_DIR, filename), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function main() {
  await Promise.all([mkdir(DATA_DIR, { recursive: true }), mkdir(IMAGE_DIR, { recursive: true }), mkdir(REPORT_DIR, { recursive: true })]);
  const startedAt = new Date().toISOString();
  const { childSitemaps, entries } = await collectSitemaps();
  const [usProducts, defaultProducts] = await Promise.all([
    collectPaged(`${SOURCE}/products.json?country=US`, "products"),
    collectPaged(`${SOURCE}/products.json`, "products")
  ]);
  const rawProducts = mergeMixedMarketPrices(usProducts, defaultProducts);
  const rawCollections = await collectPaged(`${SOURCE}/collections.json?country=US`, "collections");
  const membership = await mapCollectionMembership(rawCollections);
  const products = rawProducts.map(product => normalizeProduct(product, membership));
  const uncertain = products.filter(product => !product.productClass).map(product => ({ slug: product.slug, title: product.title, sourceProductType: product.sourceProductType, collections: product.collections }));

  const pageEntries = entries.filter(entry => /sitemap_(pages|blogs)_/i.test(entry.sitemap));
  const pages = [];
  for (const entry of pageEntries) {
    if (/\/cart|\/checkout|\/account|\/search/i.test(new URL(entry.url).pathname)) continue;
    const html = await fetchText(entry.url);
    if (!html) continue;
    pages.push(extractPage(entry.url, html, /\/blogs\//i.test(entry.url) ? "article" : "page"));
  }

  const collections = rawCollections.map(collection => ({
    id: String(collection.id),
    slug: collection.handle,
    title: collection.title,
    descriptionHtml: collection.body_html || "",
    description: stripHtml(collection.body_html),
    image: collection.image ? { sourceUrl: collection.image.src, localPath: `assets/images/imported/collection-${slugify(collection.handle)}.webp`, width: collection.image.width || null, height: collection.image.height || null, alt: collection.image.alt || collection.title } : null,
    productSlugs: products.filter(product => product.collections.includes(collection.handle)).map(product => product.slug),
    canonicalUrl: `${SOURCE}/collections/${collection.handle}`
  }));

  const imageOwners = [...products, ...collections.map(collection => ({ images: collection.image ? [collection.image] : [] }))];
  const imageResult = DOWNLOAD_IMAGES ? await downloadImages(imageOwners) : { manifest: imageOwners.flatMap(owner => owner.images.map(image => ({ sourceUrl: image.sourceUrl, localPath: image.localPath, status: "not-downloaded" }))), downloaded: 0, deduplicated: 0 };
  const importedAt = new Date().toISOString();

  const navigation = {
    items: ["HOME", "CUES", "BUTTS", "SHAFTS", "CASES & GLOVES", "ACCESSORIES", "DISCOVER", "SUPPORT"],
    source: SOURCE,
    generatedAt: importedAt
  };
  const promotions = [
    { id: "compatibility-help", title: "Check Compatibility", subtitle: "Confirm your joint and fit before ordering a butt or shaft.", type: "support", targetCollections: ["cue-butts", "shafts"], targetProducts: [], discountPercent: null, discountAmount: null, code: null, startAt: null, endAt: null, imageDesktop: "", imageMobile: "", ctaLabel: "OPEN COMPATIBILITY GUIDE", ctaUrl: "pages/compatibility-help.html", active: true, sourceUrl: `${SOURCE}/pages/contact` },
    { id: "limited-lifetime-warranty", title: "Limited Lifetime Warranty", subtitle: "Review coverage and support before choosing your equipment.", type: "support", targetCollections: [], targetProducts: [], discountPercent: null, discountAmount: null, code: null, startAt: null, endAt: null, imageDesktop: "", imageMobile: "", ctaLabel: "VIEW WARRANTY", ctaUrl: "pages/warranty.html", active: true, sourceUrl: `${SOURCE}/pages/limited-lifetime-warranty` }
  ];
  const manifest = { source: SOURCE, startedAt, importedAt, urlsDiscovered: entries.length, childSitemaps, images: imageResult.manifest, failures };

  await Promise.all([
    writeJson("products.json", products),
    writeJson("collections.json", collections),
    writeJson("pages.json", pages),
    writeJson("navigation.json", navigation),
    writeJson("promotions.json", promotions),
    writeJson("import-manifest.json", manifest),
    writeJson("taxonomy-overrides.json", { overrides: {}, needsReview: uncertain })
  ]);

  const duplicateUrls = entries.length - new Set(entries.map(entry => entry.url)).size;
  const report = `# CUEBOTS import report\n\nGenerated: ${importedAt}\n\n## Summary\n\n- URLs discovered: ${entries.length}\n- Public collections imported: ${collections.length}\n- Public products imported: ${products.length}\n- Static pages and articles imported: ${pages.length}\n- Images downloaded: ${imageResult.downloaded}\n- Duplicate images reused: ${imageResult.deduplicated}\n- Duplicate sitemap URLs: ${duplicateUrls}\n- Failed URLs: ${failures.length}\n- Products requiring taxonomy review: ${uncertain.length}\n\n## Missing or uncertain data\n\n- Reviews are intentionally empty unless a public, attributable review record can be verified.\n- Inventory is limited to the public variant availability flag.\n- Series, compatibility and technical fields remain empty when the source does not expose them clearly.\n- No discount or countdown is generated without a verifiable source record.\n\n## Products requiring manual taxonomy review\n\n${uncertain.length ? uncertain.map(item => `- [${item.title}](${SOURCE}/products/${item.slug}) — type: \`${item.sourceProductType || "empty"}\`; collections: ${item.collections.join(", ") || "none"}`).join("\n") : "None."}\n\n## Failed URLs\n\n${failures.length ? failures.map(item => `- ${item.url} — ${item.error}`).join("\n") : "None."}\n\n## Manual checks\n\n- The storefront exposes mixed market prices. The importer keeps values already expressed as VND and uses the default-market VND value when the US endpoint returns a converted value below 100,000. Review this threshold if Shopify Markets configuration changes.\n- Confirm legal policy text against the source immediately before launch.\n- Review joint compatibility where product descriptions are ambiguous.\n`;
  await writeFile(path.join(REPORT_DIR, "cuebots-import-report.md"), report, "utf8");
  const siteBase = "https://tungdxrhino.github.io/Cuebots";
  const sitemapLocations = [
    `${siteBase}/`,
    ...collections.map(collection => `${siteBase}/pages/collection-view.html?id=${encodeURIComponent(collection.slug)}`),
    ...products.map(product => `${siteBase}/pages/product-view.html?id=${encodeURIComponent(product.slug)}`),
    ...pages.map(page => `${siteBase}/pages/content-view.html?id=${encodeURIComponent(page.id)}`)
  ];
  const xmlEscape = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await writeFile(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemapLocations)].map(url => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
  console.log(JSON.stringify({ products: products.length, collections: collections.length, pages: pages.length, imagesDownloaded: imageResult.downloaded, imagesDeduplicated: imageResult.deduplicated, failures: failures.length, uncertain: uncertain.length }, null, 2));
}

main().catch(async error => {
  console.error(error);
  try { await writeFile(path.join(REPORT_DIR, "cuebots-import-report.md"), `# CUEBOTS import failed\n\n${error.stack || error}\n`, "utf8"); } catch {}
  process.exitCode = 1;
});
