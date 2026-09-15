import test from "node:test";
import assert from "node:assert/strict";
import { classifyProductResponse } from "../src/app/lib/product-response.mjs";
import { canonicalProductPath, productDescription, productMetadata, productStructuredData,
  publicProduct, serializeJsonLd, uniqueFeaturedProducts } from "../src/app/lib/seo-utils.mjs";

test("featured copies prefer an existing original, but featured-only products keep their route", () => {
  const featured = { _id: "copy", originalProductId: { $oid: "original" } };
  assert.equal(canonicalProductPath(featured, { _id: "original" }, "featured"), "/marketplace/original");
  assert.equal(canonicalProductPath(featured, null, "featured"), "/pages/featured/copy");
  assert.equal(canonicalProductPath(featured, { _id: "unrelated" }, "featured"), "/pages/featured/copy");
  assert.deepEqual(uniqueFeaturedProducts([{ _id: "original" }], [featured, { _id: "only" }]), [{ _id: "only" }]);
});

test("descriptions remove markup and decode entities without retaining script content", () => {
  assert.equal(productDescription({ description: '<p>Maps &amp; scripts&#33;</p><script>bad()</script>' }), "Maps & scripts!");
  assert.ok(productDescription({ description: "Long product details ".repeat(30) }).length <= 160);
  assert.match(productDescription({ title: "Demo", description: "" }), /Demo/);
});

test("metadata and structured data share the canonical and exclude unsafe images and invented claims", () => {
  const product = { _id: "demo", title: "Demo Map", description: "Editable map", image: { url: "javascript:alert(1)" } };
  const metadata = productMetadata(product, "/marketplace/demo");
  const graph = productStructuredData(product, "/marketplace/demo", "https://uefnmap.com")["@graph"];
  assert.equal(metadata.alternates.canonical, "/marketplace/demo");
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.deepEqual(metadata.openGraph.images, []);
  assert.equal(graph[0].url, "https://uefnmap.com/marketplace/demo");
  assert.equal(graph[0].image, undefined);
  assert.equal(graph[0].offers, undefined);
  assert.equal(graph[0].aggregateRating, undefined);
  assert.equal(graph[1].itemListElement[2].item, graph[0].url);
});

test("JSON-LD cannot terminate its script element", () => {
  const data = { name: '</script><script>alert("x")</script>' };
  const encoded = serializeJsonLd(data);
  assert.equal(encoded.includes("<"), false);
  assert.deepEqual(JSON.parse(encoded), data);
});

test("server product props exclude download keys and seller contact details", () => {
  const result = publicProduct({ _id: "demo", title: "Demo", s3Key: "private/key", downloadUrl: "private/url",
    seller: { name: "Creator", email: "private@example.com" }, price: 25 });
  assert.equal(result.s3Key, undefined);
  assert.equal(result.downloadUrl, undefined);
  assert.deepEqual(result.seller, { name: "Creator" });
  assert.equal(result.price, 25);
});

test("known missing products are distinguished from API outages", () => {
  assert.deepEqual(classifyProductResponse(500, { success: false, message: "Product not found" }, "demo"), { available: true, product: null });
  assert.deepEqual(classifyProductResponse(404, null, "demo"), { available: true, product: null });
  assert.deepEqual(classifyProductResponse(500, { success: false, message: "Database unavailable" }, "demo"), { available: false, product: null });
  assert.deepEqual(classifyProductResponse(200, { success: true, data: { _id: "other" } }, "demo"), { available: false, product: null });
});
