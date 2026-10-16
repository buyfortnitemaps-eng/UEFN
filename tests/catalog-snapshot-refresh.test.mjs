import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  collectCatalogSnapshot,
  refreshCatalogSnapshot,
} from "../scripts/refresh-catalog-snapshot.mjs";

const baseline = JSON.parse(readFileSync(new URL("../src/app/lib/catalog-snapshot.json", import.meta.url)));
const endpointCollections = {
  "products/client": "products", "products/featured": "featured",
  categories: "categories", "game-types": "gameTypes", legals: "legals", portfolios: "portfolios",
};

function catalogFetch({ source = baseline, mutate = () => {}, calls = [] } = {}) {
  return async (input, options) => {
    const url = new URL(input);
    const endpoint = url.pathname.replace("/api/v1/", "");
    calls.push(endpoint);
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, undefined);
    const collection = endpointCollections[endpoint];
    assert.ok(collection, `Unexpected endpoint ${endpoint}`);
    const items = structuredClone(source[collection]);
    const payload = { success: true, data: items };
    if (url.searchParams.has("page")) {
      const page = Number(url.searchParams.get("page"));
      const limit = Number(url.searchParams.get("limit"));
      payload.data = items.slice((page - 1) * limit, page * limit);
      payload.meta = {
        page, limit, total: items.length,
        hasMore: page * limit < items.length,
        totalPages: Math.max(1, Math.ceil(items.length / limit)),
      };
    }
    const replacement = mutate(payload, endpoint);
    return replacement || Response.json(payload);
  };
}

test("snapshot refresh collects complete pages and strips nested private fields", async () => {
  const source = structuredClone(baseline);
  const sample = source.products[0];
  source.products = Array.from({ length: 1001 }, (_, index) => ({
    ...sample,
    _id: (index + 1).toString(16).padStart(24, "0"),
    s3Key: "private-download-location",
    seller: { ...sample.seller, email: "private@example.invalid", uid: "private-user-id" },
    category: { ...sample.category, createdBy: "private-admin-id" },
    image: { ...sample.image, publicId: "private-image-reference" },
  }));
  const calls = [];
  const snapshot = await collectCatalogSnapshot({ fetchImpl: catalogFetch({ source, calls }) });
  assert.equal(snapshot.products.length, 1001);
  assert.equal(calls.filter((endpoint) => endpoint === "products/client").length, 2);
  assert.deepEqual(Object.keys(snapshot.products[0].seller), ["name"]);
  assert.equal(snapshot.products[0].s3Key, undefined);
  assert.equal(snapshot.products[0].category.createdBy, undefined);
  assert.equal(snapshot.products[0].image.publicId, undefined);
  assert.equal(snapshot.products[0].updatedAt, sample.updatedAt);
  assert.equal(snapshot.featured[0].originalProductId, baseline.featured[0].originalProductId);
  for (const collection of Object.values(endpointCollections)) assert.ok(snapshot.capturedDates[collection]);
});

test("snapshot refresh rejects truncated pages, duplicate records, and incomplete collections", async (t) => {
  const cases = [
    ["partial page", (payload, endpoint) => {
      if (endpoint === "products/client") {
        payload.meta.total += 1;
        payload.meta.hasMore = true;
      }
    }],
    ["duplicate record", (payload, endpoint) => {
      if (endpoint === "products/client") payload.data[1] = payload.data[0];
    }],
    ["incomplete taxonomy", (payload, endpoint) => {
      if (endpoint === "categories") payload.meta = { total: payload.data.length + 1 };
    }],
    ["success false", (payload, endpoint) => {
      if (endpoint === "legals") payload.success = false;
    }],
    ["invalid record", (payload, endpoint) => {
      if (endpoint === "products/client") payload.data[0]._id = "invalid";
    }],
    ["unconfirmed count", (payload, endpoint) => {
      if (endpoint === "products/client") delete payload.meta;
    }],
  ];
  for (const [name, mutate] of cases) {
    await t.test(name, async () => {
      await assert.rejects(collectCatalogSnapshot({ fetchImpl: catalogFetch({ mutate }) }));
    });
  }
});

test("snapshot refresh preserves the existing file when a later endpoint fails", async () => {
  const directory = await mkdtemp(join(tmpdir(), "uefn-catalog-refresh-"));
  const outputPath = join(directory, "catalog-snapshot.json");
  const existing = "existing-known-good-snapshot\n";
  await writeFile(outputPath, existing);
  try {
    await assert.rejects(refreshCatalogSnapshot({
      outputPath,
      fetchImpl: catalogFetch({ mutate: (_payload, endpoint) => endpoint === "legals"
        ? new Response("Service unavailable", { status: 503 }) : undefined }),
    }), /HTTP 503/);
    assert.equal(await readFile(outputPath, "utf8"), existing);
    const replacement = await refreshCatalogSnapshot({ outputPath, fetchImpl: catalogFetch() });
    assert.deepEqual(JSON.parse(await readFile(outputPath, "utf8")), replacement);
  } finally {
    await unlink(outputPath);
    await rmdir(directory);
  }
});

test("snapshot refresh refuses a non-HTTPS or credential-bearing API origin", async () => {
  for (const origin of ["http://example.invalid", "https://user:secret@example.invalid", "https://example.invalid/api"]) {
    await assert.rejects(collectCatalogSnapshot({ origin, fetchImpl: () => { throw new Error("Fetch must not run"); } }), /plain HTTPS origin/);
  }
});
