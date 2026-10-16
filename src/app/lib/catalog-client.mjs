// Public reads use the same-origin, read-only catalog endpoint. Authenticated
// requests and mutations continue to use their existing backend helpers.
export function publicCatalogUrl(endpoint, query = {}) {
  if (typeof endpoint !== "string" || !/^(?:products\/client|products\/featured(?:\/[a-f\d]{24})?|products\/[a-f\d]{24}|products\/by-gametype\/[a-f\d]{24}|categories|game-types|legals|portfolios)$/i.test(endpoint)) {
    throw new Error("Unknown public catalog endpoint.");
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== null) params.set(key, String(value));
  return `/api/catalog/${endpoint}${params.size ? `?${params}` : ""}`;
}
