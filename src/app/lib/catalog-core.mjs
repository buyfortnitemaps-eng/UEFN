import { getEntityId } from "./entity-utils.mjs";

const ID = /^[a-f\d]{24}$/i;
const COLLECTIONS = ["products", "featured", "categories", "gameTypes", "legals", "portfolios"];
const record = value => !!value && typeof value === "object" && !Array.isArray(value);
const string = (value, limit = 1000) => typeof value === "string" ? value.slice(0, limit) : "";
const id = value => { const result = getEntityId(value); return ID.test(result) ? result.toLowerCase() : ""; };
const finiteNumber = value => typeof value === "number" && Number.isFinite(value) && value >= 0;
const date = value => {
  const raw = record(value) ? value.$date : value;
  return typeof raw === "string" && Number.isFinite(Date.parse(raw)) ? new Date(raw).toISOString() : undefined;
};

function image(value) {
  try {
    const url = new URL(value?.url);
    return url.protocol === "https:" && !url.username && !url.password ? { url: url.href } : null;
  } catch { return null; }
}

function taxonomy(value) {
  const entityId = id(value);
  if (!entityId) return null;
  if (!record(value) || !value.name) return entityId;
  return { _id: entityId, name: string(value.name, 300) };
}

function timestamps(value) {
  return Object.fromEntries(["createdAt", "updatedAt"].flatMap(key => date(value[key]) ? [[key, date(value[key])]] : []));
}

// Explicit allowlists apply equally to saved data and live upstream responses.
export function sanitizeProduct(value) {
  if (!record(value) || !id(value) || !string(value.title, 300).trim()) return null;
  const result = {
    _id: id(value), title: string(value.title, 300), description: string(value.description, 200000),
    seller: { name: string(value.seller?.name, 300) }, ...timestamps(value),
  };
  for (const key of ["price", "discountPrice"]) if (finiteNumber(value[key])) result[key] = value[key];
  if (typeof value.isDiscount === "boolean") result.isDiscount = value.isDiscount;
  for (const key of ["youtubeId", "featureTag", "paddlePriceId", "paddleProductId"]) {
    if (typeof value[key] === "string") result[key] = string(value[key], 300);
  }
  if (id(value.originalProductId)) result.originalProductId = id(value.originalProductId);
  for (const key of ["category", "gameType"]) if (taxonomy(value[key])) result[key] = taxonomy(value[key]);
  if (image(value.image)) result.image = image(value.image);
  result.gallery = Array.isArray(value.gallery) ? value.gallery.slice(0, 100).map(image).filter(Boolean) : [];
  result.faqs = Array.isArray(value.faqs) ? value.faqs.slice(0, 100).filter(record).map(item => ({
    question: string(item.question, 5000), answer: string(item.answer, 20000),
  })) : [];
  return result;
}

export function sanitizeCatalogItem(collection, value) {
  if (collection === "products" || collection === "featured") return sanitizeProduct(value);
  if (!record(value) || !id(value)) return null;
  const result = { _id: id(value), ...timestamps(value) };
  if (collection === "categories" || collection === "gameTypes") {
    if (!string(value.name, 300).trim()) return null;
    result.name = string(value.name, 300);
    if (typeof value.slug === "string") result.slug = string(value.slug, 300);
    if (finiteNumber(value.totalProduct)) result.totalProduct = value.totalProduct;
  } else if (collection === "legals") {
    if (!string(value.type, 300).trim() || typeof value.content !== "string") return null;
    result.type = string(value.type, 300);
    result.content = string(value.content, 500000);
  } else if (collection === "portfolios") {
    if (!string(value.title, 300).trim()) return null;
    for (const key of ["title", "type", "youtubeId"]) result[key] = string(value[key], 300);
    result.description = string(value.description, 200000);
    if (image(value.image)) result.image = image(value.image);
    result.tags = Array.isArray(value.tags) ? value.tags.filter(item => typeof item === "string").slice(0, 100).map(item => string(item, 300)) : [];
    result.stats = Object.fromEntries(["players", "rating"].flatMap(key => {
      const stat = value.stats?.[key];
      return typeof stat === "string" || finiteNumber(stat) ? [[key, typeof stat === "string" ? string(stat, 100) : stat]] : [];
    }));
  } else return null;
  return result;
}

export class CatalogRequestError extends Error {
  constructor(message = "Invalid catalog request.") { super(message); this.name = "CatalogRequestError"; this.status = 400; }
}
export class CatalogUpstreamError extends Error {
  constructor(message = "Catalog temporarily unavailable.", { retryable = false, paused = false } = {}) {
    super(message); this.name = "CatalogUpstreamError"; this.retryable = retryable; this.paused = paused;
  }
}

export function normalizeCatalogRequest(endpoint, query = {}) {
  if (typeof endpoint !== "string") throw new CatalogRequestError();
  let collection, kind = "list", entityId;
  if (endpoint === "products/client") collection = "products";
  else if (endpoint === "products/featured") collection = "featured";
  else if (["categories", "game-types", "legals", "portfolios"].includes(endpoint)) collection = endpoint === "game-types" ? "gameTypes" : endpoint;
  else {
    const match = /^(products\/featured|products\/by-gametype|products)\/([a-f\d]{24})$/i.exec(endpoint);
    if (!match) throw new CatalogRequestError("Unknown public catalog endpoint.");
    entityId = match[2].toLowerCase();
    kind = match[1] === "products/by-gametype" ? "byGameType" : "detail";
    collection = match[1] === "products/featured" ? "featured" : "products";
    endpoint = `${match[1]}/${entityId}`;
  }
  const paginated = kind !== "detail" && ["products", "featured"].includes(collection);
  const allowed = paginated ? ["page", "limit", ...(endpoint === "products/client" ? ["category", "search", "sort"] : [])] : [];
  if (!(query instanceof URLSearchParams) && !record(query)) throw new CatalogRequestError();
  const pairs = query instanceof URLSearchParams ? [...query.entries()] : Object.entries(query);
  const values = {}, seen = new Set();
  for (const [key, value] of pairs) {
    if (!allowed.includes(key) || seen.has(key) || !["string", "number"].includes(typeof value)) throw new CatalogRequestError();
    seen.add(key); values[key] = String(value);
  }
  const normalized = {};
  if (paginated) {
    for (const [key, fallback, maximum] of [["page", 1, 10000], ["limit", 12, 1000]]) {
      const value = values[key] ?? String(fallback);
      if (!/^[1-9]\d*$/.test(value) || Number(value) > maximum) throw new CatalogRequestError(`Invalid ${key}.`);
      normalized[key] = Number(value);
    }
  }
  if (endpoint === "products/client") {
    const category = values.category ?? "All", search = values.search ?? "", sort = values.sort ?? "newest";
    if (category !== "All" && !ID.test(category)) throw new CatalogRequestError("Invalid category.");
    if (search.length > 100 || [...search].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) throw new CatalogRequestError("Invalid search.");
    if (!["newest", "lowToHigh", "highToLow"].includes(sort)) throw new CatalogRequestError("Invalid sort.");
    normalized.category = category === "All" ? category : category.toLowerCase();
    normalized.search = search.trim(); normalized.sort = sort;
  }
  return { endpoint, collection, kind, id: entityId, query: normalized };
}

export function validateSnapshot(value) {
  if (!record(value) || value.version !== 1 || !date(value.capturedAt) || typeof value.sourceOrigin !== "string") return null;
  const result = { version: 1, capturedAt: date(value.capturedAt), sourceOrigin: value.sourceOrigin, capturedDates: {} };
  for (const collection of COLLECTIONS) {
    if (value[collection] === undefined && collection === "portfolios") continue;
    if (!Array.isArray(value[collection])) return null;
    const items = value[collection].map(item => sanitizeCatalogItem(collection, item));
    if (items.some(item => !item) || new Set(items.map(item => item._id)).size !== items.length) return null;
    result[collection] = items;
    result.capturedDates[collection] = date(value.capturedDates?.[collection]) || result.capturedAt;
  }
  return result;
}

export function validateLivePayload(request, payload) {
  if (!record(payload) || payload.success === false) throw new CatalogUpstreamError("Invalid catalog response.");
  if (request.kind === "detail") {
    const product = sanitizeProduct(payload.data);
    if (!product || product._id !== request.id) throw new CatalogUpstreamError("Invalid product response.");
    return { success: true, data: product };
  }
  if (!Array.isArray(payload.data)) throw new CatalogUpstreamError("Invalid catalog response.");
  const data = payload.data.map(item => sanitizeCatalogItem(request.collection, item));
  if (data.some(item => !item) || new Set(data.map(item => item._id)).size !== data.length) throw new CatalogUpstreamError("Invalid catalog records.");
  const result = { success: true, data };
  if (request.query.limit) {
    if (data.length > request.query.limit) throw new CatalogUpstreamError("Invalid catalog pagination.");
    const meta = { page: request.query.page, limit: request.query.limit };
    for (const key of ["total", "totalPages"]) {
      if (payload.meta?.[key] !== undefined) {
        if (!Number.isSafeInteger(payload.meta[key]) || payload.meta[key] < 0) throw new CatalogUpstreamError("Invalid catalog pagination.");
        meta[key] = payload.meta[key];
      }
    }
    if (meta.total !== undefined) {
      const expectedCount = Math.min(meta.limit, Math.max(0, meta.total - (meta.page - 1) * meta.limit));
      if (data.length !== expectedCount) throw new CatalogUpstreamError("Incomplete catalog page.");
      meta.totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
    }
    if (typeof payload.meta?.hasMore === "boolean") meta.hasMore = payload.meta.hasMore;
    result.meta = meta;
  }
  return result;
}

export function savedCatalogResponse(request, snapshot) {
  if (!snapshot || !Array.isArray(snapshot[request.collection])) return null;
  let data = snapshot[request.collection];
  const catalog = { source: "saved", capturedAt: snapshot.capturedDates?.[request.collection] || snapshot.capturedAt };
  if (request.kind === "detail") {
    const product = data.find(item => item._id === request.id);
    // A dated snapshot cannot establish that an unfamiliar product was deleted.
    return product ? { status: 200, payload: { success: true, data: product, catalog } } : null;
  }
  if (request.kind === "byGameType") {
    if (!snapshot.gameTypes?.some(item => item._id === request.id)) return null;
    data = data.filter(item => id(item.gameType) === request.id);
  }
  if (request.endpoint === "products/client") {
    const { category, search, sort } = request.query;
    if (category !== "All" && !snapshot.categories?.some(item => item._id === category)) return null;
    if (category !== "All") data = data.filter(item => id(item.category) === category);
    if (search) data = data.filter(item => `${item.title} ${item.description.replace(/<[^>]*>/g, " ")}`.toLowerCase().includes(search.toLowerCase()));
    data = [...data].sort((left, right) => sort === "lowToHigh" ? (left.price ?? 0) - (right.price ?? 0)
      : sort === "highToLow" ? (right.price ?? 0) - (left.price ?? 0)
      : (Date.parse(right.createdAt) || 0) - (Date.parse(left.createdAt) || 0));
  }
  const payload = { success: true, data, catalog };
  if (request.query.limit) {
    const { page, limit } = request.query;
    // A historical catalog cannot prove a newer page does not exist.
    if (page > Math.max(1, Math.ceil(data.length / limit))) return null;
    payload.meta = { page, limit, total: data.length, totalPages: Math.max(1, Math.ceil(data.length / limit)) };
    payload.data = data.slice((page - 1) * limit, page * limit);
  }
  return { status: 200, payload };
}

export async function fetchLiveCatalog(request, { origin, fetchImpl = fetch, timeoutMs = 4000, retries = 1 } = {}) {
  const url = new URL(`/api/v1/${request.endpoint}`, origin);
  for (const [key, value] of Object.entries(request.query)) url.searchParams.set(key, String(value));
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetchImpl(url.href, {
        method: "GET", cache: "no-store", redirect: "error", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs),
      });
      const paused = response.headers.get("x-vercel-error") === "DEPLOYMENT_PAUSED";
      if (request.kind === "detail" && response.status === 404) {
        return { status: 404, payload: { success: false, message: "Product not found.", catalog: { source: "live" } } };
      }
      let payload;
      try { payload = await response.json(); } catch {
        if (!response.ok) throw new CatalogUpstreamError("Catalog request failed.", { retryable: response.status >= 500 || response.status === 429, paused });
        throw new CatalogUpstreamError("Invalid catalog JSON.");
      }
      const explicitlyMissing = payload?.success === false && /^(?:featured )?product not found\.?$/i.test(String(payload.message || "").trim());
      if (request.kind === "detail" && explicitlyMissing) {
        return { status: 404, payload: { success: false, message: "Product not found.", catalog: { source: "live" } } };
      }
      if (!response.ok) throw new CatalogUpstreamError("Catalog request failed.", { retryable: response.status >= 500 || [408, 429].includes(response.status), paused });
      return { status: 200, payload: { ...validateLivePayload(request, payload), catalog: { source: "live" } } };
    } catch (error) {
      const failure = error instanceof CatalogUpstreamError ? error : new CatalogUpstreamError("Catalog request failed.", { retryable: true });
      if (failure.paused || !failure.retryable || attempt >= Math.min(1, retries)) throw failure;
    }
  }
}

export async function readCatalogWithFallback(endpoint, query, { loadLive, snapshot } = {}) {
  let request;
  try { request = normalizeCatalogRequest(endpoint, query); } catch (error) {
    return { status: 400, payload: { success: false, message: error.message } };
  }
  try { return await loadLive(request); } catch {
    return savedCatalogResponse(request, snapshot) || {
      status: 503, payload: { success: false, message: "The catalog is temporarily unavailable. Please try again shortly." },
    };
  }
}
