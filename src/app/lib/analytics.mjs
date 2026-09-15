// Collection stays off unless an owner supplies a GA4 ID and the visitor opts in.
export const ANALYTICS_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "")
  ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : "";
export const CONSENT_KEY = "uefnmap_analytics_choice";
const commerceEvents = new Set(["view_item", "add_to_cart", "remove_from_cart", "begin_checkout"]);
const diagnosticEvents = new Set(["checkout_error", "download_started", "download_link_ready", "download_failure"]);

export function publicPath(path = "/") {
  const clean = String(path).split(/[?#]/)[0];
  return /^\/(admin|auth)(\/|$)/.test(clean) ? null : clean;
}

export function analyticsItems(products) {
  return (Array.isArray(products) ? products : []).slice(0, 200).flatMap(product => {
    const id = product?._id?.$oid || product?._id || product?.id;
    if (typeof id !== "string" || !/^[a-z\d_-]{1,100}$/i.test(id)) return [];
    // Public catalog fields only: never pass the full product, storage keys, or seller contact.
    return [{ item_id: id, item_name: String(product.title || "UEFN asset").slice(0,100), quantity: 1 }];
  });
}

export function canCollect() {
  if (typeof window === "undefined" || !ANALYTICS_ID || !publicPath(window.location.pathname)) return false;
  try { return localStorage.getItem(CONSENT_KEY) === "accepted" && typeof window.gtag === "function"; }
  catch { return false; }
}

function send(name, params) {
  if (!canCollect()) return false;
  try { window.gtag("event", name, params); return true; } catch { return false; }
}

export function trackCommerce(name, products) {
  if (!commerceEvents.has(name)) return false;
  const items = analyticsItems(products);
  return items.length ? send(name, { items }) : false;
}

export function trackDiagnostic(name, { productId, reason, status } = {}) {
  if (!diagnosticEvents.has(name)) return false;
  const params = {};
  if (typeof productId === "string" && /^[a-z\d_-]{1,100}$/i.test(productId)) params.item_id = productId;
  if (["checkout_unavailable", "transaction_request", "order_confirmation", "download_link", "network"].includes(reason)) params.reason = reason;
  if (Number.isInteger(status) && status >= 100 && status <= 599) params.http_status = status;
  return send(name, params);
}

export function purchaseDetails(payment, products, { environment, confirmed } = {}) {
  // A sandbox payment, checkout click, or unconfirmed order is never revenue.
  if (environment !== "production" || confirmed !== true) return null;
  const transactionId = payment?.transaction_id || payment?.id;
  if (typeof transactionId !== "string" || !/^txn_[a-z\d]+$/i.test(transactionId)) return null;
  const items = analyticsItems(products);
  if (!items.length) return null;
  return { transaction_id: transactionId, items };
}

export function trackPurchase(payment, products, context) {
  const details = purchaseDetails(payment, products, context);
  if (!details || !canCollect()) return false;
  const key = `uefnmap_tracked_${details.transaction_id}`;
  try {
    if (sessionStorage.getItem(key)) return false;
    if (!send("purchase", details)) return false;
    sessionStorage.setItem(key, "1");
    return true;
  } catch { return false; }
}

export function trackPageView(path) {
  const safePath = publicPath(path);
  if (!safePath || typeof window === "undefined") return false;
  return send("page_view", { page_location: `${window.location.origin}${safePath}`, page_referrer: "" });
}

export function trackWebVital(metric) {
  if (!["LCP", "CLS", "INP", "FCP", "TTFB"].includes(metric?.name) || !Number.isFinite(metric.value)) return false;
  return send("web_vital", { metric_name: metric.name, metric_value: Math.round(metric.value * 1000) / 1000,
    metric_rating: ["good", "needs-improvement", "poor"].includes(metric.rating) ? metric.rating : "unknown" });
}
