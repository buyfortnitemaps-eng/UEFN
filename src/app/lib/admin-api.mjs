// This is the project's original API host. Keep credentialed admin requests
// independent of public-catalog and customer-checkout configuration.
export const ADMIN_API_ORIGIN = "https://uefn-maps-server.onrender.com";

export function adminApiUrl(path = "", query) {
  const url = new URL(`${ADMIN_API_ORIGIN}/api/v1/${path.replace(/^\/+/, "")}`);
  if (url.origin !== ADMIN_API_ORIGIN || !url.pathname.startsWith("/api/v1/")) {
    throw new Error("Invalid admin API path.");
  }
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.href;
}

export function validateAccountProfile(profile, firebaseUid) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)
      || !firebaseUid || profile.firebaseUid !== firebaseUid
      || !["admin", "user"].includes(profile.role)) {
    throw new Error("Your account profile could not be verified. Please sign in again.");
  }
  return profile;
}
