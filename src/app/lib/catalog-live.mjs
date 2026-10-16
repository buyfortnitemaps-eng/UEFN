import { getEntityId } from "./entity-utils.mjs";
import { CatalogUpstreamError, fetchLiveCatalog, normalizeCatalogRequest } from "./catalog-core.mjs";

const INVENTORY_PAGE_SIZE = 1000;
const MAX_INVENTORY_PAGES = 100;

async function completeLiveMarketplace(options) {
  const products = [], ids = new Set();
  let expectedTotal;
  for (let page = 1; page <= MAX_INVENTORY_PAGES; page++) {
    const response = await fetchLiveCatalog(normalizeCatalogRequest("products/client", {
      page, limit: INVENTORY_PAGE_SIZE, category: "All", sort: "newest",
    }), options);
    const { data, meta } = response.payload;
    if (!Number.isSafeInteger(meta?.total) || meta.total < 0 ||
        meta.total > INVENTORY_PAGE_SIZE * MAX_INVENTORY_PAGES ||
        (expectedTotal !== undefined && meta.total !== expectedTotal)) {
      throw new CatalogUpstreamError("Incomplete live marketplace inventory.");
    }
    expectedTotal = meta.total;
    const expectedCount = Math.min(INVENTORY_PAGE_SIZE, Math.max(0, expectedTotal - (page - 1) * INVENTORY_PAGE_SIZE));
    if (data.length !== expectedCount) throw new CatalogUpstreamError("Incomplete live marketplace page.");
    for (const product of data) {
      if (ids.has(product._id)) throw new CatalogUpstreamError("Duplicate live marketplace identity.");
      ids.add(product._id); products.push(product);
    }
    if (products.length === expectedTotal) return products;
  }
  throw new CatalogUpstreamError("Live marketplace exceeds the collection limit.");
}

export async function fetchPublicLiveCatalog(request, options) {
  if (request.kind !== "byGameType") {
    // This backend interprets search as a regular expression. The storefront
    // search is literal text, just like its saved-catalog fallback. Escape only
    // the upstream copy so cache keys and fallback matching keep the user's text.
    const upstreamRequest = request.endpoint === "products/client" && request.query.search
      ? { ...request, query: { ...request.query, search: request.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } }
      : request;
    return fetchLiveCatalog(upstreamRequest, options);
  }

  // The legacy game-type endpoint combines featured copies with their original
  // products and counts both. Filtering the complete canonical marketplace
  // inventory avoids duplicate cards and incorrect page totals.
  const modes = await fetchLiveCatalog(normalizeCatalogRequest("game-types"), options);
  if (!modes.payload.data.some(mode => mode._id === request.id)) {
    return { status: 404, payload: { success: false, message: "Game mode not found.", catalog: { source: "live" } } };
  }
  const inventory = await completeLiveMarketplace(options);
  const products = inventory.filter(product => getEntityId(product.gameType) === request.id);
  const { page, limit } = request.query;
  return {
    status: 200,
    payload: {
      success: true,
      data: products.slice((page - 1) * limit, page * limit),
      meta: { page, limit, total: products.length, totalPages: Math.max(1, Math.ceil(products.length / limit)) },
      catalog: { source: "live" },
    },
  };
}
