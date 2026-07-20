#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async filename => JSON.parse(await readFile(path.join(ROOT, "data", filename), "utf8"));
const slugify = value => String(value || "item").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "item";

async function fetchProducts(endpoint) {
  const products = [];
  for (let page = 1; page <= 2; page += 1) {
    let response;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      response = await fetch(`${endpoint}${endpoint.includes("?") ? "&" : "?"}limit=250&page=${page}`, { headers: { "accept-language": "en-US,en;q=0.9", "user-agent": "CUEBOTS catalog finalizer/1.0" } });
      if (response.ok) break;
      await new Promise(resolve => setTimeout(resolve, attempt * 5000));
    }
    if (!response?.ok) throw new Error(`Unable to fetch ${endpoint} page ${page}: HTTP ${response?.status}`);
    const payload = await response.json();
    products.push(...(payload.products || []));
  }
  return products;
}

function classify(product) {
  if (product.productClass) return product.productClass;
  const type = String(product.sourceProductType || "").toLowerCase();
  const title = String(product.title || "").toLowerCase();
  if (type === "maxbing") return "bundle";
  if (/\bcuebots\s+cue\b/.test(title)) return "complete-cue";
  if (/joint protector|weight bolt|microfiber towel/.test(title)) return "accessory";
  return null;
}

const [products, collections, pages, manifest] = await Promise.all([
  readJson("products.json"), readJson("collections.json"), readJson("pages.json"), readJson("import-manifest.json")
]);
const defaultProducts = await fetchProducts("https://www.cuebots.com/products.json");
const defaultByHandle = new Map(defaultProducts.map(product => [product.handle, product]));

for (const product of products) {
  const defaultProduct = defaultByHandle.get(product.slug);
  const defaultVariants = new Map((defaultProduct?.variants || []).map(variant => [String(variant.id), variant]));
  product.variants = (product.variants || []).map(variant => {
    const source = defaultVariants.get(String(variant.id));
    const price = Number(variant.price) < 100000 && source?.price != null ? Number(source.price) : Number(variant.price);
    const compareAtPrice = Number(variant.compareAtPrice) < 100000 && source?.compare_at_price != null ? Number(source.compare_at_price) : Number(variant.compareAtPrice);
    return { ...variant, price, compareAtPrice: Number.isFinite(compareAtPrice) && compareAtPrice > 0 ? compareAtPrice : null };
  });
  const prices = product.variants.map(variant => variant.price).filter(Number.isFinite);
  const comparePrices = product.variants.map(variant => variant.compareAtPrice).filter(Number.isFinite);
  product.price = prices.length ? Math.min(...prices) : product.price;
  product.compareAtPrice = comparePrices.length ? Math.max(...comparePrices) : null;
  product.currency = "VND";
  product.productClass = classify(product);
  product.images = (product.images || []).map((image, index) => ({ ...image, localPath: `assets/images/imported/${slugify(product.slug)}-${String(index + 1).padStart(2, "0")}.webp` }));
}

const uncertain = products.filter(product => !product.productClass).map(product => ({ slug: product.slug, title: product.title, sourceProductType: product.sourceProductType, collections: product.collections }));
await writeFile(path.join(ROOT, "data", "products.json"), `${JSON.stringify(products, null, 2)}\n`, "utf8");
await writeFile(path.join(ROOT, "data", "taxonomy-overrides.json"), `${JSON.stringify({ overrides: {}, needsReview: uncertain }, null, 2)}\n`, "utf8");

const siteBase = "https://tungdxrhino.github.io/Cuebots";
const locations = [
  `${siteBase}/`,
  ...collections.map(collection => `${siteBase}/pages/collection-view.html?id=${encodeURIComponent(collection.slug)}`),
  ...products.map(product => `${siteBase}/pages/product-view.html?id=${encodeURIComponent(product.slug)}`),
  ...pages.map(page => `${siteBase}/pages/content-view.html?id=${encodeURIComponent(page.id)}`)
];
const xmlEscape = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
await writeFile(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(locations)].map(url => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");

const failures = manifest.failures || [];
const imageRows = manifest.images || [];
const downloaded = imageRows.filter(image => ["downloaded", "existing", "duplicate"].includes(image.status)).length;
const generatedAt = new Date().toISOString();
const report = `# CUEBOTS import report\n\nGenerated: ${generatedAt}\n\n## Summary\n\n- URLs discovered: ${manifest.urlsDiscovered || 0}\n- Public collections imported: ${collections.length}\n- Public products imported: ${products.length}\n- Static pages and articles imported: ${pages.length}\n- Local image mappings: ${downloaded}\n- Failed URLs: ${failures.length}\n- Products requiring taxonomy review: ${uncertain.length}\n\n## Data integrity\n\n- Every classified product has exactly one primary \`productClass\`.\n- Case and glove products are excluded from Accessories by primary taxonomy.\n- Reviews remain empty unless a public, attributable review can be verified.\n- No discount or countdown is generated without verified source data.\n- The source exposes mixed Shopify Markets prices. Values already expressed as VND are retained; products returned as low-value USD in the US endpoint use the matching default-market VND price.\n\n## Products requiring manual taxonomy review\n\n${uncertain.length ? uncertain.map(item => `- ${item.title} — ${item.sourceProductType || "empty"}`).join("\n") : "None."}\n\n## Failed source URLs\n\n${failures.length ? failures.map(item => `- ${item.url} — ${item.error}`).join("\n") : "None."}\n\n## Production checks\n\n- Confirm legal policy wording and update dates against the source immediately before launch.\n- Confirm joint compatibility when the source description is ambiguous.\n- Re-run the importer after Shopify taxonomy or Markets configuration changes.\n`;
await writeFile(path.join(ROOT, "reports", "cuebots-import-report.md"), report, "utf8");
console.log(JSON.stringify({ products: products.length, collections: collections.length, pages: pages.length, uncertain: uncertain.length, failedSourceUrls: failures.length }, null, 2));
