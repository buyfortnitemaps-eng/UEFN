import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readCatalogWithFallback, validateSnapshot } from "../src/app/lib/catalog-core.mjs";

const snapshot = validateSnapshot(JSON.parse(await readFile(new URL("../src/app/lib/catalog-snapshot.json", import.meta.url), "utf8")));
const loadLive = async () => { throw new Error("offline"); };
test("out-of-range saved pages and unfamiliar categories remain temporarily unavailable", async () => {
  const options = { snapshot, loadLive };
  assert.equal((await readCatalogWithFallback("products/client", { page: 2, limit: 1000 }, options)).status, 503);
  assert.equal((await readCatalogWithFallback("products/featured", { page: 2, limit: 1000 }, options)).status, 503);
  assert.equal((await readCatalogWithFallback("products/client", { category: "000000000000000000000000" }, options)).status, 503);
  const emptySearch = await readCatalogWithFallback("products/client", { search: "no-matching-saved-title-123456" }, options);
  assert.equal(emptySearch.status, 200);
  assert.deepEqual(emptySearch.payload.data, []);
  assert.equal(emptySearch.payload.catalog.source, "saved");
});
