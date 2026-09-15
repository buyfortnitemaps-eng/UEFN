import { cache } from "react";
import { apiUrl } from "./runtime-config";
import { classifyProductResponse } from "./product-response.mjs";
import { canonicalProductPath, originalProductId, productMetadata, productPath } from "./seo-utils.mjs";

export const getProduct = cache(async (id, kind = "marketplace") => {
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
    return { available: true, product: null };
  }
  try {
    const endpoint = kind === "featured" ? `products/featured/${id}` : `products/${id}`;
    const response = await fetch(apiUrl(endpoint), {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => null);
    return classifyProductResponse(response.status, result, id);
  } catch {
    // A temporary API outage is not proof that a product has been deleted.
    return { available: false, product: null };
  }
});

export const getProductPageData = cache(async (id, kind = "marketplace") => {
  const result = await getProduct(id, kind);
  if (!result.product) return { ...result, canonical: productPath(id, kind) };
  const original = kind === "featured"
    ? await getProduct(originalProductId(result.product))
    : result;
  return {
    ...result,
    canonical: canonicalProductPath(result.product, original.product, kind),
  };
});

export async function getProductPageMetadata(id, kind = "marketplace") {
  const result = await getProductPageData(id, kind);
  if (!result.available) throw new Error("Product catalog temporarily unavailable");
  if (result.product) return productMetadata(result.product, result.canonical);
  return {
    title: kind === "featured" ? "Featured UEFN Asset" : "UEFN Marketplace Asset",
    alternates: { canonical: result.canonical },
    robots: result.available ? { index: false, follow: false } : undefined,
  };
}
