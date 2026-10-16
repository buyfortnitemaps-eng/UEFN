import assert from "node:assert/strict";
import test from "node:test";
import { adminApiUrl, validateAccountProfile } from "../src/app/lib/admin-api.mjs";

test("admin credential destination stays on the original trusted API host", () => {
  assert.equal(adminApiUrl("products/create-product"), "https://uefn-maps-server.onrender.com/api/v1/products/create-product");
  assert.equal(new URL(adminApiUrl("//attacker.example/path")).origin, "https://uefn-maps-server.onrender.com");
  assert.throws(() => adminApiUrl("../../elsewhere"), /Invalid admin API path/);
  assert.throws(() => adminApiUrl("%2e%2e/%2e%2e/elsewhere"), /Invalid admin API path/);
});

test("profile must belong to the signed-in Firebase user before showing admin access", () => {
  const admin = { firebaseUid: "signed-in-user", role: "admin" };
  assert.equal(validateAccountProfile(admin, "signed-in-user"), admin);
  assert.throws(() => validateAccountProfile(admin, "another-user"), /could not be verified/);
  assert.throws(() => validateAccountProfile({ role: "admin" }, "signed-in-user"), /could not be verified/);
  assert.throws(() => validateAccountProfile({ ...admin, role: "owner" }, "signed-in-user"), /could not be verified/);
  assert.equal(validateAccountProfile({ ...admin, role: "user" }, "signed-in-user").role, "user");
});
