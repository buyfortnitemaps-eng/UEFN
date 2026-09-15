import test from "node:test";
import assert from "node:assert/strict";

import {
  getEntityId,
  hasSameEntityId,
} from "../src/app/lib/entity-utils.mjs";

test("entity IDs normalize strings and Mongo extended JSON objects", () => {
  assert.equal(getEntityId("abc123"), "abc123");
  assert.equal(getEntityId({ _id: "abc123" }), "abc123");
  assert.equal(getEntityId({ _id: { $oid: "abc123" } }), "abc123");
  assert.equal(getEntityId({ $oid: "abc123" }), "abc123");
});

test("invalid entity IDs normalize to an empty string", () => {
  assert.equal(getEntityId(null), "");
  assert.equal(getEntityId({}), "");
  assert.equal(getEntityId({ _id: { $oid: 123 } }), "");
});

test("entity ID comparison is stable across API serialization formats", () => {
  assert.equal(
    hasSameEntityId({ _id: { $oid: "abc123" } }, { _id: "abc123" }),
    true,
  );
  assert.equal(hasSameEntityId({ _id: "abc123" }, { _id: "other" }), false);
  assert.equal(hasSameEntityId({}, {}), false);
});
