// The existing Render service supplies public catalog reads and chat.
// Keep this separate from authenticated API routing.
export const CATALOG_API_ORIGIN = (
  process.env.CATALOG_API_ORIGIN || "https://uefn-maps-server.onrender.com"
).replace(/\/+$/, "");
