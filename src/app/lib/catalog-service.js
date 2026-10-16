import "server-only";
import { unstable_cache } from "next/cache";
import snapshotData from "./catalog-snapshot.json";
import { CATALOG_API_ORIGIN } from "./catalog-origin.mjs";
import { fetchPublicLiveCatalog } from "./catalog-live.mjs";
import { normalizeCatalogRequest, readCatalogWithFallback, validateSnapshot } from "./catalog-core.mjs";

const snapshot = validateSnapshot(snapshotData);
const LIVE_CACHE_SECONDS = 60;

async function fetchVerifiedCatalog(request) {
  const result = await fetchPublicLiveCatalog(request, { origin: CATALOG_API_ORIGIN });
  return {
    ...result,
    payload: {
      ...result.payload,
      catalog: { ...result.payload.catalog, verifiedAt: new Date().toISOString() },
    },
  };
}

// Only validated live results enter Next's persistent data cache. A failed
// revalidation throws, preserving the previous successful result.
const readLive = unstable_cache(
  fetchVerifiedCatalog,
  ["public-catalog-v3", CATALOG_API_ORIGIN],
  { revalidate: LIVE_CACHE_SECONDS },
);

export async function readPublicCatalog(endpoint, query = {}) {
  const result = await readCatalogWithFallback(endpoint, query, { loadLive: readLive, snapshot });
  const catalog = result.payload.catalog;
  const verifiedAt = Date.parse(catalog?.verifiedAt);
  // Next may return an expired entry while refreshing it in the background.
  // Verify synchronously before declaring that saved data is needed; a healthy
  // backend should not display an outage notice just because this entry aged.
  if (catalog?.source === "live" && Number.isFinite(verifiedAt) &&
      Date.now() - verifiedAt > LIVE_CACHE_SECONDS * 1000) {
    try {
      return await fetchVerifiedCatalog(normalizeCatalogRequest(endpoint, query));
    } catch {
      // Keep the newer cached content if this bounded live verification fails.
    }
    // An old missing-product response cannot prove the product is still absent.
    // Return temporary unavailability without reviving an older saved product.
    if (result.status === 404) {
      return { status: 503, payload: { success: false, message: "The catalog is temporarily unavailable. Please try again shortly." } };
    }
    return {
      ...result,
      payload: {
        ...result.payload,
        catalog: { ...catalog, source: "saved", reason: "cache", capturedAt: catalog.verifiedAt },
      },
    };
  }
  return result;
}
