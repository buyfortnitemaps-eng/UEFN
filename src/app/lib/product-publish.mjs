import { getEntityId } from "./entity-utils.mjs";
import { validateImageFile, validateUploadedImage } from "./image-upload.mjs";
import { validateAccountProfile } from "./admin-api.mjs";

const ID = /^[a-f\d]{24}$/i;
const requiredText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
};
async function currentToken(getToken) {
  let timeout;
  try {
    const token = await Promise.race([getToken(), new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error("Session verification timed out. Please try again.")), 15000);
    })]);
    if (typeof token !== "string" || !token) throw new Error("Your session has expired. Sign in again before saving.");
    return token;
  } finally { clearTimeout(timeout); }
}

export async function verifyPublishingAdmin({ token, uid, endpoint, fetchImpl = fetch }) {
  let response;
  try {
    response = await fetchImpl(endpoint, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(15000) });
  } catch { throw new Error("Admin verification could not finish. Your entries have been kept. Please try again."); }
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success !== true) throw new Error("Your admin profile could not be verified. Please try again or sign in again.");
  const profile = validateAccountProfile(payload.data, uid);
  if (profile.role !== "admin") throw new Error("Sign in with your admin account before saving.");
  // This read checks the current DB role. The product POST independently verifies
  // the Firebase token and admin role before accepting the write.
  return profile;
}
function price(value, label) {
  const input = String(value ?? "").trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(input) || !Number.isFinite(Number(input)) || !Number.isSafeInteger(Math.round(Number(input) * 100))) {
    throw new Error(`${label} must be zero or more, with no more than two decimal places.`);
  }
  return Number(input);
}

export function prepareProductInput(form) {
  const title = requiredText(form.title, "Asset title");
  const description = requiredText(form.description, "Asset description");
  const s3Key = requiredText(form.s3Key, "S3 file key");
  if (!ID.test(form.category || "")) throw new Error("Select a category.");
  if (!ID.test(form.gameType || "")) throw new Error("Select a game type.");
  const amount = price(form.price, "Price");
  const discounted = form.isDiscount ? price(form.discountPrice, "Discounted price") : 0;
  if (form.isDiscount && discounted >= amount) throw new Error("Discounted price must be lower than the original price.");
  validateImageFile(form.thumbnail);
  if (!Array.isArray(form.galleryImages)) throw new Error("Choose valid gallery images.");
  form.galleryImages.forEach(validateImageFile);
  if (!Array.isArray(form.faqs)) throw new Error("Enter valid product FAQs.");
  const faqs = form.faqs.flatMap(item => {
    const question = typeof item?.question === "string" ? item.question.trim() : "";
    const answer = typeof item?.answer === "string" ? item.answer.trim() : "";
    if (!question && !answer) return [];
    if (!question || !answer) throw new Error("Complete both the question and answer for each FAQ.");
    return [{ question, answer }];
  });
  return { title, description, s3Key, category: form.category, gameType: form.gameType,
    price: amount, isDiscount: !!form.isDiscount, discountPrice: discounted,
    youtubeId: typeof form.youtubeId === "string" ? form.youtubeId.trim() : "", faqs };
}

export async function readProductWriteResponse(response) {
  let result;
  try { result = await response.json(); } catch {
    if (response.ok) throw new Error("The server response did not confirm a saved asset. Check Manage Assets before trying again.");
    throw new Error(`The asset could not be saved (HTTP ${response.status}). Check Manage Assets before trying again.`);
  }
  const message = typeof result?.message === "string" ? result.message.trim().slice(0, 350) : "";
  if (!response.ok || result?.success === false) {
    throw new Error(`${message || `The asset could not be saved (HTTP ${response.status}).`} Check Manage Assets before trying again.`);
  }
  const productId = getEntityId(result?.data);
  if (result?.success !== true || !ID.test(productId)) {
    throw new Error("The server did not confirm the saved asset ID. Check Manage Assets before trying again.");
  }
  return { productId, product: result.data };
}

export async function publishProductAsset({ form, session, getToken, verifyAdmin, uploadImage, uploadGallery, endpoint, fetchImpl = fetch, onProgress = () => {} }) {
  const input = prepareProductInput(form);
  if (!session?.uid || session.role !== "admin") throw new Error("Sign in with your admin account before saving.");
  onProgress("Checking admin access…");
  let token = await currentToken(getToken);
  // A verified backend preflight can be supplied without inventing a new API.
  if (verifyAdmin) await verifyAdmin(token, session.uid);
  onProgress("Uploading thumbnail…");
  const image = validateUploadedImage(await uploadImage(form.thumbnail), "Thumbnail");
  let gallery = [];
  if (form.galleryImages.length) {
    onProgress("Uploading gallery images…");
    gallery = await uploadGallery(form.galleryImages);
    if (!Array.isArray(gallery) || gallery.length !== form.galleryImages.length) throw new Error("The gallery upload was incomplete. Your entries have been kept.");
    gallery = gallery.map(item => validateUploadedImage(item, "Gallery image"));
  }
  const body = { ...input, image, gallery, seller: { name: session.name || "Admin", email: session.email, uid: session.uid } };
  onProgress("Saving asset…");
  // Uploads can take time. The caller rechecks the same signed-in account before
  // obtaining a current token, so a sign-out/account switch cannot submit it.
  token = await currentToken(getToken);
  let response;
  try {
    // Never retry writes automatically: the server may already have saved them.
    response = await fetchImpl(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  } catch {
    throw new Error("The connection ended before the save could be confirmed. Your entries have been kept. Check Manage Assets before trying again.");
  }
  return readProductWriteResponse(response);
}
