export function validateImageFile(file) {
  if (!file || typeof file.type !== "string" || !file.type.startsWith("image/") || !Number.isFinite(file.size) || file.size <= 0) {
    throw new Error("Choose a valid image file before saving.");
  }
}

export function validateUploadedImage(value, label = "Image") {
  let url;
  try { url = new URL(value?.url); } catch { /* Report a useful upload error below. */ }
  if (!url || url.protocol !== "https:" || url.hostname !== "res.cloudinary.com" || url.username || url.password ||
      typeof value?.publicId !== "string" || !value.publicId.trim()) {
    throw new Error(`${label} upload did not return a valid image. Please try again.`);
  }
  return { url: url.href, publicId: value.publicId };
}

export async function uploadCatalogImage(file, { compress, fetchImpl = fetch, uploadUrl, uploadPreset } = {}) {
  validateImageFile(file);
  let compressed;
  let compressionTimeout;
  try {
    compressed = await Promise.race([
      compress(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true }),
      new Promise((_, reject) => {
        compressionTimeout = setTimeout(() => reject(new Error("Image preparation timed out. Please try a smaller image.")), 30000);
      }),
    ]);
  } finally { clearTimeout(compressionTimeout); }
  const body = new FormData();
  body.append("file", compressed);
  body.append("upload_preset", uploadPreset);
  let response;
  try {
    response = await fetchImpl(uploadUrl, { method: "POST", body, signal: AbortSignal.timeout(45000) });
  } catch {
    throw new Error("Image upload could not finish. Check your connection and try again.");
  }
  let payload;
  try { payload = await response.json(); } catch {
    throw new Error(`Image upload failed (HTTP ${response.status}). Please try again.`);
  }
  if (!response.ok || payload?.error) {
    const detail = typeof payload?.error?.message === "string" ? ` ${payload.error.message.slice(0, 250)}` : "";
    throw new Error(`Image upload failed (HTTP ${response.status}).${detail}`);
  }
  return validateUploadedImage({ url: payload?.secure_url, publicId: payload?.public_id });
}

export async function uploadCatalogImages(files, uploadImage) {
  if (!Array.isArray(files)) throw new Error("Choose valid gallery images.");
  // Propagate any failed upload; a partial gallery is not a successful upload.
  return Promise.all(files.map(async file => validateUploadedImage(await uploadImage(file), "Gallery image")));
}
