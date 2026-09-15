import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DISCORD_INVITE_URL } from "../src/app/lib/community.mjs";

const file = new URL("../src/app/components/DiscordButton.jsx", import.meta.url);
const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const componentModule = { exports: {} };
new vm.Script(`(function(require, module, exports) { ${compiled}\n})`).runInThisContext()(createRequire(file), componentModule, componentModule.exports);
const DiscordButton = componentModule.exports.default;

test("Discord action renders without authentication, cart state, or JavaScript click handlers", () => {
  const html = renderToStaticMarkup(React.createElement(DiscordButton, { productName: "The Pit Fortnite Map" }));
  assert.match(html, new RegExp(`href="${DISCORD_INVITE_URL}"`));
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /Get The Pit Fortnite Map on Discord/);
  assert.match(html, /Get on Discord/);
  assert.doesNotMatch(html, /<button|href="\/(cart|checkout)|onclick=/);
});
test("Product text is escaped and cannot change the Discord destination", () => {
  const html = renderToStaticMarkup(React.createElement(DiscordButton, { productName: '\"><script>alert(1)</script>' }));
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.equal((html.match(/href=/g) || []).length, 1);
  assert.ok(html.includes(`href="${DISCORD_INVITE_URL}"`));
});
