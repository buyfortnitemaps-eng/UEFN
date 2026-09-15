export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || "https://uefnmap.com").replace(/\/+$/, "");
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_ORIGIN || "https://uefn-maps-server.vercel.app").replace(/\/+$/, "");
export function apiUrl(path = "", query) {
  const url = new URL(`${API_ORIGIN}/api/v1/${path.replace(/^\/+/, "")}`);
  if (query) for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));
  return url.href;
}
