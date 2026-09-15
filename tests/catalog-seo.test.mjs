import test from "node:test";
import assert from "node:assert/strict";
import { collectPages, listingUrl, pageNumber, pageMetadata, collectionStructuredData } from "../src/app/lib/catalog-seo.mjs";
import { sanitizeContent } from "../src/app/lib/sanitize-content.mjs";

test("pagination rejects malformed, repeated and excessive page parameters", () => {
  assert.equal(pageNumber(undefined), 1);
  assert.equal(pageNumber("2"), 2);
  for (const input of ["0", "-1", "02", "2oops", "1.5", ["2", "3"], "10001"]) assert.equal(pageNumber(input), null);
  assert.equal(listingUrl("/marketplace", 1, { category: "All", sort: "newest", search: "" }), "/marketplace");
  assert.equal(listingUrl("/marketplace", 2, { search: "maps & scripts" }), "/marketplace?page=2&search=maps+%26+scripts");
});
test("sitemap exhausts paginated inventory and rejects outages or stuck pagination", async () => {
  const inventory = [{ _id: "a" }, { _id: "b" }, { _id: "c" }];
  assert.deepEqual(await collectPages(async page => ({ data: inventory.slice((page-1)*2, page*2), meta: { total: 3 } }), 2), inventory);
  await assert.rejects(collectPages(async () => ({ success: false, data: [] })), /Invalid/);
  await assert.rejects(collectPages(async () => ({ data: [{ _id: "a" }], meta: { total: 2 } })), /did not advance/);
  await assert.rejects(collectPages(async () => { throw new Error("API unavailable"); }), /unavailable/);
});
test("collection metadata and structured data use matching page and product canonicals", () => {
  const path = listingUrl("/marketplace", 2);
  const meta = pageMetadata({ title: "Maps — Page 2", description: "Compare maps", path });
  assert.equal(meta.alternates.canonical, path);
  assert.equal(meta.openGraph.url, path);
  assert.equal(meta.title.absolute, "Maps — Page 2 | UEFNMAP");
  const graph = collectionStructuredData("Maps", path, [{ _id: "copy", title: "Map", canonicalPath: "/marketplace/original" }], "https://uefnmap.com", 2);
  assert.equal(graph.mainEntity.itemListElement[0].url, "https://uefnmap.com/marketplace/original");
  assert.equal(graph.mainEntity.itemListElement[0].position, 13);
  assert.equal(pageMetadata({ title: "Search", description: "Results", path, noindex: true }).robots.index, false);
});
test("legal HTML retains readable formatting and removes executable content", () => {
  const html = sanitizeContent('<h1>Policy</h1><p class="ql-align-center">Read <strong>carefully</strong>.</p><script>alert(1)</script><img src="https://example.com/x.png" onerror="alert(1)"><a href="javascript:alert(1)" target="_blank">Bad</a><iframe src="https://evil.example"></iframe><p style="background:url(javascript:alert(1))">Hello</p>');
  assert.match(html, /<h2>Policy<\/h2>/);
  assert.match(html, /<strong>carefully<\/strong>/);
  assert.match(html, /class="ql-align-center"/);
  assert.doesNotMatch(html, /script|onerror|iframe|javascript:|style=/i);
  assert.doesNotMatch(sanitizeContent('<img src="//evil.example/x"><img src="data:image/svg+xml,bad">'), /src=/);
});
