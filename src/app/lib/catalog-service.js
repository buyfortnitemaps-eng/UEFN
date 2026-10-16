import "server-only";
import { unstable_cache } from "next/cache";
import snapshotData from "./catalog-snapshot.json";
import { API_ORIGIN } from "./runtime-config";
import { fetchLiveCatalog, readCatalogWithFallback, validateSnapshot } from "./catalog-core.mjs";

const snapshot = validateSnapshot(snapshotData);
const LIVE_CACHE_SECONDS = 60;
// Only validated live results enter Next's persistent data cache. A failed
// revalidation throws, preserving the previous successful result.
const readLive = unstable_cache(
  async request => {
    const result = await fetchLiveCatalog(request, { origin: API_ORIGIN });
    return {
      ...result,
      payload: {
        ...result.payload,
        catalog: { ...result.payload.catalog, verifiedAt: new Date().toISOString() },
      },
    };
  },
  ["public-catalog-v2", API_ORIGIN],
  { revalidate: LIVE_CACHE_SECONDS },
);

export async function readPublicCatalog(endpoint, query = {}) {
  const result = await readCatalogWithFallback(endpoint, query, { loadLive: readLive, snapshot });
  const catalog = result.payload.catalog;
  const verifiedAt = Date.parse(catalog?.verifiedAt);
  // Next can keep serving a successful cached response after revalidation fails.
  // Label that older response outside the cache without replacing its data or
  // mutating the stored result. Its last verification date is still meaningful.
  if (catalog?.source === "live" && Number.isFinite(verifiedAt) &&
      Date.now() - verifiedAt > LIVE_CACHE_SECONDS * 1000) {
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
