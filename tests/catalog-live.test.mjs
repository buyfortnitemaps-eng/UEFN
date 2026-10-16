import test from "node:test";
import assert from "node:assert/strict";
import { fetchPublicLiveCatalog } from "../src/app/lib/catalog-live.mjs";
import { normalizeCatalogRequest } from "../src/app/lib/catalog-core.mjs";

const MODE = "aaaaaaaaaaaaaaaaaaaaaaaa", OTHER_MODE = "bbbbbbbbbbbbbbbbbbbbbbbb";
const product = (index, gameType = MODE) => ({ _id: index.toString(16).padStart(24, "0"), title: `Product ${index}`, gameType, price: index });
const json = payload => new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } });
const request = (query = {}) => normalizeCatalogRequest(`products/by-gametype/${MODE}`, query);
function backend(inventory, { modes = [{ _id: MODE, name: "Arena" }], alterPage } = {}) {
  const calls = [];
  const options = { origin: "https://catalog.example", retries: 0, fetchImpl: async address => {
    const url = new URL(address); calls.push(url.pathname + url.search);
    if (url.pathname === "/api/v1/game-types") return json({ success: true, data: modes });
    if (url.pathname === "/api/v1/products/client") {
      const page = Number(url.searchParams.get("page")), limit = Number(url.searchParams.get("limit"));
      const payload = { success: true, data: inventory.slice((page - 1) * limit, page * limit), meta: { page, limit, total: inventory.length } };
      return json(alterPage ? alterPage(payload, page) : payload);
    }
    // This models the real backend's duplicate featured/original mode response.
    if (url.pathname.startsWith("/api/v1/products/by-gametype/")) return json({ success: true, data: [...inventory, ...inventory], meta: { total: inventory.length * 2 } });
    throw new Error(`Unexpected endpoint ${url.pathname}`);
  } };
  return { options, calls };
}

test("live mode listing avoids duplicate upstream aggregation and uses canonical originals", async () => {
  const { options, calls } = backend([product(1), product(2, OTHER_MODE), product(3)]);
  const result = await fetchPublicLiveCatalog(request(), options);
  assert.equal(result.status, 200);
  assert.deepEqual(result.payload.data.map(item => item._id), [product(1)._id, product(3)._id]);
  assert.deepEqual(result.payload.meta, { page: 1, limit: 12, total: 2, totalPages: 1 });
  assert.equal(result.payload.catalog.source, "live");
  assert.equal(calls.some(url => url.includes("by-gametype")), false);
});

test("live mode pagination filters the complete inventory before slicing", async () => {
  const inventory = Array.from({ length: 1003 }, (_, index) => product(index + 1, index % 2 ? OTHER_MODE : MODE));
  const { options, calls } = backend(inventory);
  const result = await fetchPublicLiveCatalog(request({ page: 2, limit: 500 }), options);
  assert.deepEqual(result.payload.data.map(item => item._id), [product(1001)._id, product(1003)._id]);
  assert.deepEqual(result.payload.meta, { page: 2, limit: 500, total: 502, totalPages: 2 });
  assert.equal(calls.filter(url => url.includes("products/client")).length, 2);
});

test("known empty modes return live empty results, confirmed unknown modes return live 404", async () => {
  const known = backend([product(1, OTHER_MODE)]);
  const empty = await fetchPublicLiveCatalog(request(), known.options);
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.payload.data, []);
  assert.equal(empty.payload.meta.total, 0);
  assert.equal(empty.payload.catalog.source, "live");
  const unknown = backend([product(1)], { modes: [{ _id: OTHER_MODE, name: "Racing" }] });
  const missing = await fetchPublicLiveCatalog(request(), unknown.options);
  assert.equal(missing.status, 404);
  assert.equal(missing.payload.catalog.source, "live");
  assert.equal(missing.payload.data, undefined);
  assert.equal(unknown.calls.length, 1);
});

test("live mode collection rejects changing totals, incomplete pages and duplicate identities across pages", async () => {
  const inventory = Array.from({ length: 1001 }, (_, index) => product(index + 1));
  const alterations = [
    (payload, page) => page === 2 ? { ...payload, meta: { ...payload.meta, total: 1002 }, data: [product(1001), product(1002)] } : payload,
    (payload, page) => page === 1 ? { ...payload, data: payload.data.slice(0, 999) } : payload,
    (payload, page) => page === 2 ? { ...payload, data: [product(1)] } : payload,
    payload => ({ ...payload, meta: {} }),
  ];
  for (const alterPage of alterations) {
    const { options } = backend(inventory, { alterPage });
    await assert.rejects(fetchPublicLiveCatalog(request(), options), /Incomplete|Duplicate/);
  }
});

test("upstream mode or inventory failure throws so the caller can select a genuine saved fallback", async () => {
  for (const failedPath of ["/api/v1/game-types", "/api/v1/products/client"]) {
    const { options } = backend([product(1)]), workingFetch = options.fetchImpl;
    options.fetchImpl = async (url, requestOptions) => new URL(url).pathname === failedPath
      ? new Response("Paused", { status: 503, headers: { "X-Vercel-Error": "DEPLOYMENT_PAUSED" } })
      : workingFetch(url, requestOptions);
    await assert.rejects(fetchPublicLiveCatalog(request(), options), /Catalog request failed/);
  }
});

test("ordinary public requests retain the validated live fetch contract", async () => {
  const { options, calls } = backend([product(1)]);
  const result = await fetchPublicLiveCatalog(normalizeCatalogRequest("products/client"), options);
  assert.equal(result.status, 200);
  assert.equal(result.payload.data[0]._id, product(1)._id);
  assert.equal(result.payload.catalog.source, "live");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].includes("game-types"), false);
});

test("literal public search escapes backend regex syntax without mutating fallback/cache queries", async () => {
  for (const [search, titles] of [
    ["SOLO CUP ZONE WARS [ENDGAME]", ["SOLO CUP ZONE WARS [ENDGAME]", "SOLO CUP ZONE WARS E"]],
    ["Map v1.0", ["Map v1.0", "Map v1x0"]],
  ]) {
    const original = normalizeCatalogRequest("products/client", { search });
    const before = JSON.stringify(original);
    Object.freeze(original.query); Object.freeze(original);
    let upstreamSearch;
    const result = await fetchPublicLiveCatalog(original, {
      origin: "https://catalog.example",
      fetchImpl: async address => {
        upstreamSearch = new URL(address).searchParams.get("search");
        const pattern = new RegExp(upstreamSearch, "i");
        const matches = titles.map((title, index) => ({ ...product(index + 1), title })).filter(item => pattern.test(item.title));
        return json({ success: true, data: matches, meta: { total: matches.length } });
      },
    });
    assert.equal(result.status, 200);
    assert.equal(result.payload.catalog.source, "live");
    assert.deepEqual(result.payload.data.map(item => item.title), [titles[0]]);
    assert.notEqual(upstreamSearch, search);
    assert.equal(JSON.stringify(original), before);
    assert.equal(original.query.search, search);
  }
});
