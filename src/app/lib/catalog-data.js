import { cache } from "react";
import { apiUrl } from "./runtime-config";
import { getEntityId } from "./entity-utils.mjs";
import { getProduct } from "./product-data";
import { canonicalProductPath, originalProductId, publicProduct } from "./seo-utils.mjs";

export async function catalogRequest(endpoint, query = {}, revalidate = 300) {
  const response = await fetch(apiUrl(endpoint, query), {
    next: { revalidate }, signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Catalog temporarily unavailable (${response.status})`);
  const result = await response.json();
  if (!Array.isArray(result?.data) || result.success === false) throw new Error("Invalid catalog response");
  return result;
}

export const getGameTypes = cache(async () => {
  const result = await catalogRequest("game-types");
  return result.data.map(item => ({ _id: getEntityId(item), name: item.name, totalProduct: item.totalProduct, updatedAt: item.updatedAt }));
});
export const getGameType = cache(async id => (await getGameTypes()).find(item => item._id === id) || null);
export const getLegals = cache(async () => (await catalogRequest("legals")).data);
export const getLegal = cache(async slug => (await getLegals()).find(item => item.type.toLowerCase().replace(/\s+/g, "-") === slug) || null);

export async function publicListing(products, featured = false) {
  return Promise.all(products.map(async product => {
    const original = featured ? await getProduct(originalProductId(product)) : { product };
    return { ...publicProduct(product), canonicalPath: canonicalProductPath(product, original.product, featured ? "featured" : "marketplace") };
  }));
}
