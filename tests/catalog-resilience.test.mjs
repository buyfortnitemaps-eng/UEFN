import test from "node:test";
import assert from "node:assert/strict";
import {
  fetchLiveCatalog, normalizeCatalogRequest, readCatalogWithFallback,
  sanitizeProduct, validateLivePayload, validateSnapshot,
} from "../src/app/lib/catalog-core.mjs";
import { publicCatalogUrl } from "../src/app/lib/catalog-client.mjs";

const ID_A = "111111111111111111111111", ID_B = "222222222222222222222222";
const CATEGORY = "cccccccccccccccccccccccc", MODE = "dddddddddddddddddddddddd";
const secret = "PRIVATE_FIELD_MUST_NOT_ESCAPE";
const product = (overrides = {}) => ({
  _id: ID_A, title: "Arena Map", description: "An editable battle arena", price: 40,
  createdAt: "2026-09-01T00:00:00Z", updatedAt: "2026-09-10T00:00:00Z",
  category: { _id: CATEGORY, name: "Maps", token: secret },
  gameType: { _id: MODE, name: "Arena", createdBy: secret },
  image: { url: "https://res.cloudinary.com/demo/map.png", storageKey: secret },
  gallery: [{ url: "https://res.cloudinary.com/demo/gallery.png", internal: secret }],
  seller: { name: "Creator", email: secret }, faqs: [{ question: "Editable?", answer: "Yes", token: secret }],
  s3Key: secret, downloadUrl: secret, ...overrides,
});
const seed = (overrides = {}) => validateSnapshot({
  version: 1, capturedAt: "2026-09-15T00:00:00Z", sourceOrigin: "https://uefn-maps-server.vercel.app",
  products: [product(), product({ _id: ID_B, title: "Racing Map", price: 10, createdAt: "2026-09-02T00:00:00Z" })],
  featured: [product({ originalProductId: ID_A })],
  categories: [{ _id: CATEGORY, name: "Maps", private: secret }],
  gameTypes: [{ _id: MODE, name: "Arena", createdBy: secret }],
  legals: [{ _id: CATEGORY, type: "Privacy Policy", content: "Policy body", internal: secret }],
  ...overrides,
});
const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", ...headers } });
function reader(fetchImpl, snapshot = seed(), timeoutMs = 50) {
  return (endpoint, query = {}) => readCatalogWithFallback(endpoint, query, {
    snapshot,
    loadLive: request => fetchLiveCatalog(request, { origin: "https://catalog.example", fetchImpl, timeoutMs }),
  });
}

test("catalog live successes win and recursively exclude private fields", async () => {
  let options;
  const read = reader(async (_url, opts) => { options = opts; return json({ success: true, data: product({ title: "Live Arena" }), token: secret }); });
  const result = await read(`products/${ID_A}`);
  assert.equal(result.status, 200);
  assert.equal(result.payload.catalog.source, "live");
  assert.equal(result.payload.data.title, "Live Arena");
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
  assert.equal(options.cache, "no-store");
  assert.equal(options.redirect, "error");
  assert.deepEqual(options.headers, { Accept: "application/json" });
  assert.equal(sanitizeProduct(product()).updatedAt, "2026-09-10T00:00:00.000Z");
});

test("paused 503 uses real saved records, without retrying the paused deployment", async () => {
  let calls = 0;
  const read = reader(async () => { calls++; return new Response("Deployment paused", { status: 503, headers: { "X-Vercel-Error": "DEPLOYMENT_PAUSED" } }); });
  const result = await read("products/client");
  assert.equal(calls, 1);
  assert.equal(result.status, 200);
  assert.equal(result.payload.data.length, 2);
  assert.equal(result.payload.catalog.source, "saved");
  assert.equal(result.payload.catalog.capturedAt, "2026-09-15T00:00:00.000Z");
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});

test("one bounded retry recovers a transient upstream error", async () => {
  let calls = 0;
  const result = await reader(async () => ++calls === 1 ? json({ success: false }, 502) : json({ success: true, data: product() }))(`products/${ID_A}`);
  assert.equal(calls, 2);
  assert.equal(result.payload.catalog.source, "live");
});

test("timeouts abort both attempts before falling back to saved content", async () => {
  let calls = 0;
  const read = reader((_url, { signal }) => new Promise((_resolve, reject) => {
    calls++;
    const handle = setTimeout(() => reject(new Error("Test timeout was not bounded")), 500);
    signal.addEventListener("abort", () => { clearTimeout(handle); reject(signal.reason); }, { once: true });
  }), seed(), 5);
  const result = await read(`products/${ID_A}`);
  assert.equal(calls, 2);
  assert.equal(result.payload.catalog.source, "saved");
});

test("invalid JSON and malformed successful payloads cannot become empty successful catalogs", async () => {
  for (const reply of [() => new Response("not JSON"), () => json({ success: true, data: null }), () => json({ success: false, data: [] })]) {
    const result = await reader(async () => reply())("products/client");
    assert.equal(result.payload.catalog.source, "saved");
    assert.equal(result.payload.data.length, 2);
    const unavailable = await reader(async () => reply(), null)("products/client");
    assert.equal(unavailable.status, 503);
    assert.equal(unavailable.payload.success, false);
    assert.equal(unavailable.payload.data, undefined);
  }
});

test("confirmed live deletion wins over saved records; an unknown outage ID is not a 404", async () => {
  for (const reply of [() => new Response("Not found", { status: 404 }), () => json({ success: false, message: "Product not found" }, 500)]) {
    const result = await reader(async () => reply())(`products/${ID_A}`);
    assert.equal(result.status, 404);
    assert.equal(result.payload.catalog.source, "live");
    assert.equal(result.payload.data, undefined);
  }
  const unknown = await reader(async () => json({ success: false }, 503))("products/999999999999999999999999");
  assert.equal(unknown.status, 503);
  assert.equal(unknown.payload.data, undefined);
  const unknownMode = await reader(async () => json({ success: false }, 503))("products/by-gametype/999999999999999999999999");
  assert.equal(unknownMode.status, 503);
});

test("saved filtering, sorting, pagination and game-mode selection respect each query", async () => {
  const read = reader(async () => { throw new Error("Offline"); });
  const second = await read("products/client", { page: 2, limit: 1, sort: "lowToHigh" });
  assert.equal(second.payload.data[0]._id, ID_A);
  assert.deepEqual(second.payload.meta, { page: 2, limit: 1, total: 2, totalPages: 2 });
  const search = await read("products/client", { search: "RACING", category: CATEGORY, sort: "highToLow" });
  assert.deepEqual(search.payload.data.map(item => item._id), [ID_B]);
  const newest = await read("products/client");
  assert.deepEqual(newest.payload.data.map(item => item._id), [ID_B, ID_A]);
  const mode = await read(`products/by-gametype/${MODE}`, { page: 1, limit: 1 });
  assert.equal(mode.payload.data.length, 1);
  assert.equal(mode.payload.meta.total, 2);
  const empty = await read("products/client", { search: "No saved match" });
  assert.equal(empty.status, 200);
  assert.equal(empty.payload.meta.total, 0);
  assert.equal(empty.payload.catalog.source, "saved");
});

test("absent optional snapshot collections stay unavailable and collection dates survive", async () => {
  const read = reader(async () => { throw new Error("Offline"); }, seed({ capturedDates: { products: "2026-09-12T00:00:00Z" } }));
  assert.equal((await read("portfolios")).status, 503);
  assert.equal((await read("products/client")).payload.catalog.capturedAt, "2026-09-12T00:00:00.000Z");
});

test("public endpoint and query validation reject mutations, arbitrary URLs, duplicate and oversized parameters", async () => {
  let calls = 0;
  const read = reader(async () => { calls++; throw new Error("Must not fetch"); });
  const cases = [
    ["users", {}], ["products/create-product", {}], ["https://evil.example", {}],
    ["../users", {}], ["products/client", { page: "02" }], ["products/client", { limit: 1001 }],
    ["products/client", { category: "bad" }], ["products/client", { search: "x".repeat(101) }],
    ["products/client", { sort: "random" }], ["products/client", { token: "secret" }],
    ["products/client", new URLSearchParams("page=1&page=2")], ["categories", { page: 1 }],
  ];
  for (const [endpoint, query] of cases) assert.equal((await read(endpoint, query)).status, 400);
  assert.equal(calls, 0);
  assert.equal(publicCatalogUrl("products/client", { search: "A & B" }), "/api/catalog/products/client?search=A+%26+B");
  assert.throws(() => publicCatalogUrl("users"));
});

test("snapshots and live lists reject invalid identities and preserve canonical product identity", () => {
  assert.equal(validateSnapshot({ ...seed(), products: [product(), product()] }), null);
  assert.equal(validateSnapshot({ ...seed(), gameTypes: [{ _id: "bad", name: "Arena" }] }), null);
  const request = normalizeCatalogRequest("products/client", { limit: 12 });
  assert.throws(() => validateLivePayload(request, { data: [product({ _id: "bad" })] }));
  assert.throws(() => validateLivePayload(request, { data: [product()], meta: { total: -1 } }));
  assert.throws(() => validateLivePayload(request, { data: [product()], meta: { total: 2 } }), /Incomplete/);
  assert.equal(seed().featured[0].originalProductId, ID_A);
  assert.equal(sanitizeProduct(product({ image: { url: "javascript:alert(1)" } })).image, undefined);
});
