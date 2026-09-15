import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./lib/runtime-config";
import { getEntityId } from "./lib/entity-utils.mjs";
import { uniqueFeaturedProducts } from "./lib/seo-utils.mjs";
import { collectPages, listingUrl } from "./lib/catalog-seo.mjs";
import { catalogRequest, getGameTypes, getLegals } from "./lib/catalog-data";

type Item = Record<string, unknown>;
function lastModified(item: Item): Date | undefined {
  const value = typeof item.updatedAt === "object" && item.updatedAt !== null
    ? (item.updatedAt as Record<string, unknown>).$date : item.updatedAt;
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) || date.getTime() > Date.now() ? undefined : date;
}
function entry(path: string, item: Item = {}): MetadataRoute.Sitemap[number] {
  const modified = lastModified(item);
  return { url: new URL(path, SITE_ORIGIN).href, ...(modified ? { lastModified: modified } : {}) };
}
function pages(path: string, count: number): MetadataRoute.Sitemap {
  return Array.from({ length: Math.ceil(count / 12) }, (_, index) => entry(listingUrl(path, index + 1)));
}
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, featured, modes, legals] = await Promise.all([
    collectPages((page: number, limit: number) => catalogRequest("products/client", { page, limit, category: "All", sort: "newest" }, 3600)),
    collectPages((page: number, limit: number) => catalogRequest("products/featured", { page, limit }, 3600)),
    getGameTypes(), getLegals(),
  ]);
  const modeEntries = await Promise.all(modes.map(async (mode: { _id: string }) => {
    const result = await catalogRequest(`products/by-gametype/${mode._id}`, { page: 1, limit: 12 });
    if (!result.data.length) return [];
    const totalPages = Math.max(1, result.meta?.totalPages || 1);
    return Array.from({ length: totalPages }, (_, index) => entry(listingUrl(`/pages/game-modes/${mode._id}`, index + 1), mode));
  }));
  const entries = [
    ...["/", "/marketplace", "/pages/featured", "/pages/featured/all-assets", "/pages/game-modes", "/portfolio", "/pages/contact"].map(path => entry(path)),
    ...legals.map((item: { type: string }) => entry(`/legal/${encodeURIComponent(item.type.toLowerCase().replace(/\s+/g, "-"))}`, item)),
    ...products.map((item: Item) => entry(`/marketplace/${getEntityId(item)}`, item)),
    ...uniqueFeaturedProducts(products, featured).map((item: Item) => entry(`/pages/featured/${getEntityId(item)}`, item)),
    ...pages("/marketplace", products.length), ...pages("/pages/featured/all-assets", featured.length),
    ...modeEntries.flat(),
  ];
  return [...new Map(entries.map(item => [item.url, item])).values()];
}
