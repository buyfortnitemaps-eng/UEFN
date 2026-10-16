import assert from "node:assert/strict";
import { prepareProductInput, publishProductAsset, readProductWriteResponse, verifyPublishingAdmin } from "../src/app/lib/product-publish.mjs";
import { uploadCatalogImage, uploadCatalogImages } from "../src/app/lib/image-upload.mjs";

const id = "111111111111111111111111";
const thumbnail = new Blob(["image bytes"], { type: "image/png" });
const image = { url: "https://res.cloudinary.com/example/image/upload/asset.png", publicId: "asset" };
const session = { uid: "admin-uid", role: "admin", name: "Admin", email: "admin@example.test" };
const form = () => ({ title: " Asset ", description: " Description ", price: "49.99", category: id, gameType: id,
  s3Key: " maps/asset.zip ", youtubeId: " video ", thumbnail, galleryImages: [], isDiscount: false, discountPrice: "", faqs: [] });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const response = () => json({ success: true, data: { _id: id } }, 201);
function setup(overrides = {}) {
  const calls = [];
  const options = { form: form(), session, endpoint: "https://example.test/products/create-product",
    getToken: async () => { calls.push("auth"); return "fake-test-token"; },
    verifyAdmin: async () => { calls.push("profile"); },
    uploadImage: async () => { calls.push("thumbnail"); return image; },
    uploadGallery: async files => { calls.push("gallery"); return files.map(() => image); },
    fetchImpl: async (_url, init) => { calls.push("write"); options.written = JSON.parse(init.body); options.headers = init.headers; return response(); },
    ...overrides };
  return { calls, options };
}
let passed = 0;
async function check(name, test) { await test(); ++passed; process.stdout.write(`ok - product publish: ${name}\n`); }

await check("accepts cents and trims valid fields without changing the draft", () => {
  const draft = form(); draft.faqs = [{ question: " Q ", answer: " A " }, { question: "", answer: "" }];
  const prepared = prepareProductInput(draft);
  assert.equal(prepared.price, 49.99); assert.equal(prepared.title, "Asset");
  assert.deepEqual(prepared.faqs, [{ question: "Q", answer: "A" }]);
  assert.equal(draft.title, " Asset "); assert.equal(draft.faqs[0].question, " Q ");
  assert.equal(prepareProductInput({ ...draft, price: "0" }).price, 0);
});
await check("rejects invalid prices and missing required values before any uploads", async () => {
  for (const price of ["", " ", "-1", "NaN", "1.234", "1e5", "Infinity"]) {
    const run = setup({ form: { ...form(), price } });
    await assert.rejects(publishProductAsset(run.options), /Price must/); assert.deepEqual(run.calls, []);
  }
  for (const [key, value] of [["title", " "], ["description", ""], ["s3Key", ""], ["category", "bad"], ["gameType", ""], ["thumbnail", null]]) {
    const run = setup({ form: { ...form(), [key]: value } });
    await assert.rejects(publishProductAsset(run.options)); assert.deepEqual(run.calls, []);
  }
  assert.throws(() => prepareProductInput({ ...form(), isDiscount: true, discountPrice: "49.99" }), /lower/);
  assert.throws(() => prepareProductInput({ ...form(), faqs: [{ question: "Only question" }] }), /both/);
});
await check("auth and current admin profile are checked before uploads and rechecked before writing", async () => {
  const run = setup({ form: { ...form(), galleryImages: [thumbnail] } });
  assert.equal((await publishProductAsset(run.options)).productId, id);
  assert.deepEqual(run.calls, ["auth", "profile", "thumbnail", "gallery", "auth", "write"]);
  assert.equal(run.options.written.price, 49.99); assert.equal(run.options.written.seller.uid, session.uid);
  assert.equal(run.options.headers.Authorization, "Bearer fake-test-token");
});
await check("expired auth and unavailable admin profile prevent every upload and write", async () => {
  for (const override of [
    { session: { ...session, role: "user" } },
    { getToken: async () => { throw new Error("Expired session"); } },
    { getToken: async () => "" },
    { verifyAdmin: async () => { throw new Error("Profile service unavailable"); } }
  ]) {
    const run = setup(override); await assert.rejects(publishProductAsset(run.options));
    assert.equal(run.calls.includes("thumbnail"), false); assert.equal(run.calls.includes("write"), false);
  }
});
await check("read-only preflight requires the exact current Firebase UID and admin role", async () => {
  const options = { uid: session.uid, token: "fake-token", endpoint: "https://example.test/users/admin-uid" };
  for (const res of [
    json({ success: true, data: { firebaseUid: "another-user", role: "admin" } }),
    json({ success: true, data: { firebaseUid: session.uid, role: "user" } }),
    json({ success: false }, 503), new Response("invalid response")
  ]) await assert.rejects(verifyPublishingAdmin({ ...options, fetchImpl: async () => res }));
  let request;
  const profile = await verifyPublishingAdmin({ ...options, fetchImpl: async (_url, init) => { request = init; return json({ success: true, data: { firebaseUid: session.uid, role: "admin" } }); } });
  assert.equal(profile.role, "admin"); assert.equal(request.method, undefined); assert.equal(request.body, undefined); assert.equal(request.cache, "no-store");
});
await check("account switch during image upload stops the write", async () => {
  let reads = 0;
  const run = setup({ getToken: async () => { if (++reads > 1) throw new Error("Session account changed"); return "test-token"; } });
  await assert.rejects(publishProductAsset(run.options), /account changed/);
  assert.equal(run.calls.includes("thumbnail"), true); assert.equal(run.calls.includes("write"), false);
});
await check("missing image data and incomplete galleries never create a product", async () => {
  for (const override of [
    { uploadImage: async () => null },
    { uploadImage: async () => ({ url: image.url }) },
    { uploadImage: async () => ({ ...image, url: "http://res.cloudinary.com/image.png" }) },
    { form: { ...form(), galleryImages: [thumbnail, thumbnail] }, uploadGallery: async () => [image] },
    { form: { ...form(), galleryImages: [thumbnail] }, uploadGallery: async () => [{ publicId: "broken" }] }
  ]) {
    const run = setup(override); await assert.rejects(publishProductAsset(run.options)); assert.equal(run.calls.includes("write"), false);
  }
});
await check("server errors stay visible with duplicate-save guidance", async () => {
  for (const res of [json({ success: false, message: "Payment provider unavailable" }, 500), json({ success: false, message: "Validation failed" }, 400), json({ success: false, message: "Rejected" }, 200), new Response("Paused", { status: 503 })]) {
    await assert.rejects(readProductWriteResponse(res), /Check Manage Assets/);
  }
  await assert.rejects(readProductWriteResponse(json({ success: false, message: "Payment provider unavailable" }, 500)), /Payment provider unavailable/);
});
await check("success requires the persisted product ID and a successful business response", async () => {
  for (const res of [json({ success: true }), json({ data: { _id: id } }), json({ success: true, data: { _id: "invalid" } }), new Response("invalid json")]) {
    await assert.rejects(readProductWriteResponse(res), /Check Manage Assets/);
  }
  assert.equal((await readProductWriteResponse(response())).productId, id);
});
await check("uncertain writes are not retried and the draft remains intact", async () => {
  const draft = form(); draft.galleryImages = [thumbnail]; draft.faqs = [{ question: "Question", answer: "Answer" }];
  const before = { ...draft, galleryImages: [...draft.galleryImages], faqs: draft.faqs.map(item => ({ ...item })) };
  let writes = 0;
  const run = setup({ form: draft, fetchImpl: async () => { ++writes; throw new Error("Connection reset after persistence"); } });
  await assert.rejects(publishProductAsset(run.options), /Check Manage Assets/);
  assert.equal(writes, 1); assert.deepEqual(draft, before);
});
await check("upload HTTP errors, business errors and malformed successes are surfaced", async () => {
  for (const res of [json({ error: { message: "Preset invalid" } }, 400), json({ error: { message: "Upload rejected" } }), json({ secure_url: image.url }), new Response("invalid")]) {
    await assert.rejects(uploadCatalogImage(thumbnail, { compress: async file => file, fetchImpl: async () => res, uploadUrl: "https://example.test/upload", uploadPreset: "test" }));
  }
  const result = await uploadCatalogImage(thumbnail, { compress: async file => file, fetchImpl: async () => json({ secure_url: image.url, public_id: image.publicId }), uploadUrl: "https://example.test/upload", uploadPreset: "test" });
  assert.deepEqual(result, image);
});
await check("one failed gallery image rejects the batch instead of returning a partial gallery", async () => {
  let count = 0;
  await assert.rejects(uploadCatalogImages([thumbnail, thumbnail], async () => { if (++count === 2) throw new Error("Gallery upload failed"); return image; }), /Gallery upload failed/);
});
process.stdout.write(`Product publishing: ${passed} checks passed.\n`);
