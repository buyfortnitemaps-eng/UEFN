import { randomUUID } from "node:crypto";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizeCatalogRequest,
  sanitizeCatalogItem,
  validateLivePayload,
  validateSnapshot,
} from "../src/app/lib/catalog-core.mjs";

// Run after the public backend is healthy: node scripts/refresh-catalog-snapshot.mjs
// A failed, incomplete, or malformed response leaves the existing snapshot intact.
const DEFAULT_ORIGIN = "https://uefn-maps-server.vercel.app";
const SNAPSHOT_PATH = fileURLToPath(
  new URL("../src/app/lib/catalog-snapshot.json", import.meta.url),
);
const PAGE_SIZE = 1000;
const MAX_PAGES = 1000;
const COLLECTIONS = [
  ["products", "products/client", true],
  ["featured", "products/featured", true],
  ["categories", "categories", false],
  ["gameTypes", "game-types", false],
  ["legals", "legals", false],
  ["portfolios", "portfolios", false],
];

function validateOrigin(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password ||
      url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
    throw new Error("The catalog API origin must be a plain HTTPS origin.");
  }
  return url.origin;
}

function integer(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function validateRows(collection, data) {
  if (!Array.isArray(data)) throw new Error(`${collection}: response data is not an array.`);
  return data.map((row) => {
    const sanitized = sanitizeCatalogItem(collection, row);
    if (!sanitized) throw new Error(`${collection}: an invalid record was returned.`);
    return sanitized;
  });
}

export async function collectCatalogSnapshot({
  origin = process.env.NEXT_PUBLIC_API_ORIGIN || DEFAULT_ORIGIN,
  fetchImpl = fetch,
} = {}) {
  const sourceOrigin = validateOrigin(origin);
  const capturedDates = {};
  const collections = {};

  // Each endpoint is fetched without cookies or authorization. No raw backend
  // payload is written to disk or included in errors.
  for (const [collection, endpoint, paginated] of COLLECTIONS) {
    const rows = [];
    const ids = new Set();
    let expectedTotal;
    let completed = false;
    for (let page = 1; page <= (paginated ? MAX_PAGES : 1); page += 1) {
      const query = paginated ? { page, limit: PAGE_SIZE } : {};
      if (collection === "products") Object.assign(query, { category: "All", sort: "newest" });
      const url = new URL(`/api/v1/${endpoint}`, sourceOrigin);
      for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
      const response = await fetchImpl(url, {
        cache: "no-store",
        headers: { Accept: "application/json", "Cache-Control": "no-cache" },
        redirect: "error",
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`${collection}: backend returned HTTP ${response.status}.`);
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error(`${collection}: backend returned invalid JSON.`);
      }
      if (payload?.success !== true) throw new Error(`${collection}: backend did not confirm success.`);
      const request = normalizeCatalogRequest(endpoint, query);
      const validated = validateLivePayload(request, payload);
      const batch = validateRows(collection, validated.data);
      const meta = payload.meta;

      if (paginated) {
        if (!meta || !integer(meta.total) || meta.page !== page ||
            (meta.limit !== undefined && meta.limit !== PAGE_SIZE)) {
          throw new Error(`${collection}: pagination metadata is missing or inconsistent.`);
        }
        if (expectedTotal === undefined) expectedTotal = meta.total;
        if (meta.total !== expectedTotal) throw new Error(`${collection}: total changed during pagination.`);
        if (batch.length > PAGE_SIZE) throw new Error(`${collection}: response exceeds its page size.`);
      } else if (meta && ((meta.total !== undefined && meta.total !== batch.length) ||
          meta.hasMore === true || (meta.totalPages !== undefined && meta.totalPages > 1))) {
        throw new Error(`${collection}: endpoint returned an incomplete collection.`);
      }

      for (const row of batch) {
        const id = row._id || row.id;
        if (!id || ids.has(id)) throw new Error(`${collection}: missing or duplicate record identity.`);
        ids.add(id);
        rows.push(row);
      }
      capturedDates[collection] = new Date().toISOString();
      if (!paginated) {
        completed = true;
        break;
      }
      if (rows.length > expectedTotal) throw new Error(`${collection}: returned more records than its total.`);
      const hasMore = rows.length < expectedTotal;
      if (meta.hasMore !== undefined && meta.hasMore !== hasMore) {
        throw new Error(`${collection}: hasMore conflicts with the total.`);
      }
      if (meta.totalPages !== undefined && meta.totalPages !== Math.max(1, Math.ceil(expectedTotal / PAGE_SIZE))) {
        throw new Error(`${collection}: totalPages conflicts with the total.`);
      }
      if (!hasMore) {
        completed = true;
        break;
      }
      if (batch.length !== PAGE_SIZE) throw new Error(`${collection}: a partial page omitted catalog records.`);
    }
    if (!completed) throw new Error(`${collection}: pagination did not finish within the page limit.`);
    collections[collection] = rows;
  }

  const snapshot = validateSnapshot({
    version: 1,
    capturedAt: new Date().toISOString(),
    sourceOrigin,
    capturedDates,
    ...collections,
  });
  if (!snapshot) throw new Error("The complete catalog failed snapshot validation.");
  return snapshot;
}

export async function refreshCatalogSnapshot({ outputPath = SNAPSHOT_PATH, ...options } = {}) {
  const snapshot = await collectCatalogSnapshot(options);
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: "wx" });
    // Replacing the target happens only after every collection has succeeded.
    await rename(temporaryPath, outputPath);
  } finally {
    await unlink(temporaryPath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
  return snapshot;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const snapshot = await refreshCatalogSnapshot();
    console.log(`Refreshed catalog snapshot at ${snapshot.capturedAt}: ${COLLECTIONS
      .map(([collection]) => `${snapshot[collection].length} ${collection}`).join(", ")}.`);
  } catch (error) {
    console.error(`Catalog snapshot unchanged: ${error.message}`);
    process.exitCode = 1;
  }
}
