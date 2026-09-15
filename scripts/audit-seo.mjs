import fs from "node:fs";
import assert from "node:assert/strict";
import { plainText } from "../src/app/lib/seo-utils.mjs";

const base = (process.argv[2] || "https://uefnmap.com").replace(/\/$/, "");
const canonicalOrigin = "https://uefnmap.com";
const results = [], failures = [];
function check(condition, message) { if (!condition) failures.push(message); }
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), plainText(match[2] ?? match[3])]));
}
function meta(html, name) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attrs(match[0])).find(item => item.name === name || item.property === name)?.content;
}
async function get(path, redirect = "follow") {
  const response = await fetch(new URL(path, base), { redirect, headers: { "User-Agent": "UEFNMAP-SEO-Audit" }, signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
}

const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.response.status, 200, "Sitemap unavailable");
const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => plainText(match[1]));
assert.ok(urls.length > 7, "Sitemap unexpectedly empty");
check(new Set(urls).size === urls.length, "Duplicate sitemap URLs");
const queue = [...urls];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    try {
      const parsed = new URL(url); check(parsed.origin === canonicalOrigin, `Unexpected sitemap origin: ${url}`);
      const { response, html } = await get(parsed.pathname + parsed.search, "manual");
      const title = plainText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
      const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attrs(match[0])).filter(item => item.rel === "canonical");
      const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => plainText(match[1]));
      const description = meta(html, "description"), robots = meta(html, "robots") || "";
      const graph = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
      check(response.status === 200, `${url}: status ${response.status}`);
      check(title && title.includes("UEFNMAP"), `${url}: missing branded title`);
      check(description?.length > 20, `${url}: missing description`);
      check(canonical.length === 1 && canonical[0].href === url, `${url}: canonical mismatch`);
      check(h1.length === 1 && !!h1[0], `${url}: expected one nonempty H1, found ${h1.length}`);
      check(!robots.includes("noindex"), `${url}: noindex page in sitemap`);
      check(meta(html, "og:url") === url, `${url}: social URL mismatch`);
      check(!!meta(html, "og:image") && !!meta(html, "twitter:card"), `${url}: missing social preview`);
      check(!html.includes("s3Key"), `${url}: private storage field in response HTML`);
      if (parsed.pathname.startsWith("/marketplace/")) check(graph.some(item => item["@graph"]?.some(node => node["@type"] === "Product")), `${url}: missing product schema`);
      results.push({ url, status: response.status, title, description, canonical: canonical[0]?.href, h1, jsonLd: graph.length });
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
}));
const titles = results.map(item => item.title);
check(new Set(titles).size === titles.length, "Duplicate titles among sitemap pages");

const robots = await get("/robots.txt");
check(robots.response.status === 200 && robots.html.includes(`${canonicalOrigin}/sitemap.xml`), "Robots sitemap reference missing");
for (const path of ["/cart", "/my-assets", "/auth/login", "/admin"]) {
  const result = await get(path, "manual");
  check((result.response.headers.get("x-robots-tag") || "").includes("noindex"), `${path}: missing noindex response header`);
  check(!robots.html.includes(`Disallow: ${path}`), `${path}: robots blocks reading noindex`);
}
for (const path of ["/marketplace/000000000000000000000000", "/legal/not-a-real-policy", "/pages/game-modes/000000000000000000000000", "/marketplace?page=9999", "/marketplace?page=oops", "/pages/featured/all-assets?page=9999"]) {
  const { response, html } = await get(path);
  check(response.status === 404 || meta(html, "robots")?.includes("noindex"), `${path}: missing page is indexable`);
}
const emptyMode = "/pages/game-modes/69a2176d68bc882ff9a28a84";
const empty = await get(emptyMode);
if (empty.html.includes("No assets found")) {
  check(meta(empty.html, "robots")?.includes("noindex"), "Empty game type is indexable");
  check(!urls.includes(canonicalOrigin + emptyMode), "Empty game type is in sitemap");
}
const filtered = await get("/marketplace?search=Pit");
check(meta(filtered.html, "robots")?.includes("noindex"), "Internal search results are indexable");
check(filtered.html.includes("The Pit Fortnite Map"), "Search results not server rendered");
const sampleId = "69a45a813e7a524a0dc9aa46";
const duplicate = await get(`/pages/featured/${sampleId}`, "manual");
check(duplicate.response.status === 308 && duplicate.response.headers.get("location")?.endsWith(`/marketplace/${sampleId}`), "Featured duplicate does not permanently redirect to product");
const image = await fetch(new URL("/opengraph-image", base), { signal: AbortSignal.timeout(30000) });
const bytes = Buffer.from(await image.arrayBuffer());
check(image.status === 200 && image.headers.get("content-type")?.includes("image/png"), "Social image unavailable");
check(bytes.length >= 24 && bytes.readUInt32BE(16) === 1200 && bytes.readUInt32BE(20) === 630, "Social image dimensions incorrect");
const report = { checkedAt: new Date().toISOString(), base, pages: results.length, failures, results };
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: results.length, failures, result: failures.length ? "FAIL" : "PASS" }, null, 2));
if (failures.length) process.exitCode = 1;
