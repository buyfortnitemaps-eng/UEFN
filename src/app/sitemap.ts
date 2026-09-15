import type { MetadataRoute } from "next";
import { apiUrl, SITE_ORIGIN } from "./lib/runtime-config";
import { getEntityId } from "./lib/entity-utils.mjs";
import { uniqueFeaturedProducts } from "./lib/seo-utils.mjs";

type ApiItem = Record<string, unknown>;

function isRecord(value: unknown): value is ApiItem {
  return typeof value === "object" && value !== null;
}

async function fetchItems(url: string): Promise<ApiItem[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return [];
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data.filter(isRecord);
  } catch {
    return [];
  }
}

function getLastModified(item: ApiItem): Date | undefined {
  const value = isRecord(item.updatedAt)
    ? item.updatedAt.$date
    : item.updatedAt;

  if (typeof value !== "string") {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function dynamicEntries(
  items: ApiItem[],
  route: string,
  priority: number,
): MetadataRoute.Sitemap {
  return items.flatMap((item) => {
    const id = getEntityId(item);
    if (!id) {
      return [];
    }

    const lastModified = getLastModified(item);

    return [
      {
        url: `${SITE_ORIGIN}${route}/${encodeURIComponent(id)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority,
      },
    ];
  });
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, featuredProducts, gameTypes] = await Promise.all([
    fetchItems(
      apiUrl("products/client", {
        page: 1,
        limit: 1000,
        category: "All",
        sort: "newest",
      }),
    ),
    fetchItems(apiUrl("products/featured", { page: 1, limit: 1000 })),
    fetchItems(apiUrl("game-types")),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/`, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_ORIGIN}/marketplace`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_ORIGIN}/pages/featured`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_ORIGIN}/pages/featured/all-assets`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_ORIGIN}/pages/game-modes`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_ORIGIN}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_ORIGIN}/pages/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_ORIGIN}/legal/terms-of-service`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_ORIGIN}/legal/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_ORIGIN}/legal/refund-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_ORIGIN}/legal/faqs`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_ORIGIN}/legal/contact-support`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    ...staticEntries,
    ...dynamicEntries(products, "/marketplace", 0.7),
    ...dynamicEntries(uniqueFeaturedProducts(products, featuredProducts), "/pages/featured", 0.7),
    ...dynamicEntries(gameTypes, "/pages/game-modes", 0.6),
  ];
}
