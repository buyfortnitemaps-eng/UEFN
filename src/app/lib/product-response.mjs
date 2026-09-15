import { getEntityId } from "./entity-utils.mjs";

export function classifyProductResponse(status, payload, requestedId) {
  // The current API reports a known missing product as 500 with this message.
  // Match only that explicit response; a general server failure is not deletion.
  const explicitlyMissing = payload?.success === false &&
    /^(?:featured )?product not found\.?$/i.test(String(payload.message || "").trim());
  if (status === 404 || explicitlyMissing) return { available: true, product: null };
  if (status < 200 || status >= 300 || payload?.success === false) {
    return { available: false, product: null };
  }
  const product = payload?.data;
  if (!product || getEntityId(product) !== requestedId) return { available: false, product: null };
  return { available: true, product };
}
