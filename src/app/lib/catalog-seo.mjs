import { getEntityId } from "./entity-utils.mjs";
import { plainText, productPath } from "./seo-utils.mjs";

export function pageNumber(value) {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= 10000 ? page : null;
}

export function listingUrl(path, page = 1, filters = {}) {
  const query = new URLSearchParams();
  if (page > 1) query.set("page", String(page));
  for (const [key, value] of Object.entries(filters)) {
    if (value && value !== "All" && value !== "newest") query.set(key, String(value));
  }
  return path + (query.size ? `?${query}` : "");
}

export function pageMetadata({ title, description, path, noindex = false }) {
  const fullTitle = `${plainText(title)} | UEFNMAP`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle, description, type: "website", url: path,
      siteName: "UEFNMAP", locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "UEFNMAP — Fortnite map templates and Verse scripts" }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/opengraph-image"] },
  };
}

export function collectionStructuredData(name, path, products, origin, page = 1) {
  const url = new URL(path, origin).href;
  return {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#collection`,
    name, url, isPartOf: { "@id": `${origin}/#website` },
    mainEntity: { "@type": "ItemList", itemListElement: products.map((product, index) => ({
      "@type": "ListItem", position: (page - 1) * 12 + index + 1,
      name: plainText(product.title), url: new URL(product.canonicalPath || productPath(getEntityId(product)), origin).href,
    })) },
  };
}

// Require valid complete responses: an API outage must not replace the sitemap with an empty catalog.
export async function collectPages(loadPage, limit = 100) {
  const items = [], ids = new Set();
  for (let page = 1; page <= 100; page++) {
    const payload = await loadPage(page, limit);
    if (!Array.isArray(payload?.data) || payload.success === false) throw new Error("Invalid catalog response");
    const batch = payload.data;
    let added = 0;
    for (const item of batch) {
      const id = getEntityId(item);
      if (!id) throw new Error("Catalog item has no ID");
      if (!ids.has(id)) { ids.add(id); items.push(item); added++; }
    }
    const meta = payload.meta || {};
    const hasMore = Number.isFinite(meta.total) ? items.length < meta.total
      : Number.isFinite(meta.totalPages) ? page < meta.totalPages
      : typeof meta.hasMore === "boolean" ? meta.hasMore : batch.length === limit;
    if (!hasMore) return items;
    if (!added) throw new Error("Catalog pagination did not advance");
  }
  throw new Error("Catalog exceeded sitemap page limit");
}
