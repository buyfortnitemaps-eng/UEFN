import { getEntityId } from "./entity-utils.mjs";

export function plainText(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return String(value || "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (!entity.startsWith("#")) return entities[entity.toLowerCase()] || match;
      const hex = entity.slice(0, 2).toLowerCase() === "#x";
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : " ";
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function productDescription(product) {
  const text = plainText(product.description) ||
    `Explore ${plainText(product.title) || "this UEFN asset"} on UEFNMAP. View product details and previews.`;
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 100 ? cut.slice(0, lastSpace) : cut}…`;
}

export function publicImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function productPath(id, kind = "marketplace") {
  return `${kind === "featured" ? "/pages/featured" : "/marketplace"}/${encodeURIComponent(id)}`;
}

export function originalProductId(product) {
  return getEntityId(product.originalProductId) || getEntityId(product);
}

export function canonicalProductPath(product, marketplaceProduct, kind = "marketplace") {
  const originalId = originalProductId(product);
  if (kind === "featured" && marketplaceProduct && getEntityId(marketplaceProduct) === originalId) {
    return productPath(originalId);
  }
  return productPath(getEntityId(product), kind);
}

export function uniqueFeaturedProducts(products, featuredProducts) {
  const marketplaceIds = new Set(products.map(getEntityId).filter(Boolean));
  return featuredProducts.filter(product => !marketplaceIds.has(originalProductId(product)));
}

export function productMetadata(product, canonical) {
  const title = plainText(product.title) || "UEFN Asset";
  const description = productDescription(product);
  const image = publicImageUrl(product.image?.url);
  return {
    title: { absolute: `${title} | UEFNMAP` },
    description,
    alternates: { canonical },
    openGraph: {
      title, description, type: "website", url: canonical,
      siteName: "UEFNMAP",
      images: image ? [{ url: image, alt: title }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title, description, images: image ? [image] : [],
    },
  };
}

export function productStructuredData(product, canonical, origin) {
  const url = new URL(canonical, origin).href;
  const name = plainText(product.title) || "UEFN Asset";
  const images = [...new Set([product.image, ...(product.gallery || [])]
    .map(image => publicImageUrl(image?.url)).filter(Boolean))];
  // Currency, availability, license and ratings require verified catalog data.
  // Do not invent an Offer or reviews to qualify for a search enhancement.
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product", "@id": `${url}#product`, name, url,
        description: plainText(product.description) || productDescription(product),
        ...(images.length ? { image: images } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", origin).href },
          { "@type": "ListItem", position: 2, name: "UEFN Marketplace", item: new URL("/marketplace", origin).href },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function publicProduct(product) {
  if (!product) return null;
  // Do not embed storage keys or other backend-only fields in server HTML.
  const keys = ["_id", "id", "title", "description", "image", "gallery", "price",
    "isDiscount", "discountPrice", "category", "gameType", "youtubeId", "faqs",
    "createdAt", "featureTag", "paddlePriceId", "paddleProductId"];
  return {
    ...Object.fromEntries(keys.filter(key => key in product).map(key => [key, product[key]])),
    seller: { name: product.seller?.name || "" },
  };
}
