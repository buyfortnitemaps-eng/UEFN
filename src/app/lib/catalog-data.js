import { cache } from "react";
import { readPublicCatalog } from "./catalog-service";
import { getEntityId } from "./entity-utils.mjs";
import { getProduct } from "./product-data";
import { canonicalProductPath, originalProductId, publicProduct } from "./seo-utils.mjs";

export async function catalogRequest(endpoint, query = {}, revalidate = 300) {
  // The reader owns a one-minute live cache; retain the existing call signature.
  void revalidate;
  const { status, payload } = await readPublicCatalog(endpoint, query);
  if (status !== 200 || !payload.success || !Array.isArray(payload.data)) {
    throw new Error("Catalog temporarily unavailable");
  }
  return payload;
}

export const getGameTypes = cache(async () => {
  const result = await catalogRequest("game-types");
  return result.data.map(item => ({ _id: getEntityId(item), name: item.name, totalProduct: item.totalProduct, updatedAt: item.updatedAt, catalog: result.catalog }));
});
export const getGameType = cache(async id => {
  const result = await catalogRequest("game-types");
  const item = result.data.find(item => item._id === id);
  if (!item && result.catalog?.source === "saved") throw new Error("Game type temporarily unavailable");
  return item ? { ...item, catalog: result.catalog } : null;
});
export const getLegals = cache(async () => {
  const result = await catalogRequest("legals");
  return result.data.map(item => ({ ...item, catalog: result.catalog }));
});
export const getLegal = cache(async slug => {
  const result = await catalogRequest("legals");
  const item = result.data.find(item => item.type.toLowerCase().replace(/\s+/g, "-") === slug);
  if (!item && result.catalog?.source === "saved") throw new Error("Legal content temporarily unavailable");
  return item ? { ...item, catalog: result.catalog } : null;
});

export async function publicListing(products, featured = false) {
  return Promise.all(products.map(async product => {
    const original = featured ? await getProduct(originalProductId(product)) : { product };
    return { ...publicProduct(product), canonicalPath: canonicalProductPath(product, original.product, featured ? "featured" : "marketplace") };
  }));
}
