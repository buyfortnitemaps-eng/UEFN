import fs from "node:fs";
import { DISCORD_INVITE_URL } from "../src/app/lib/community.mjs";
import { plainText } from "../src/app/lib/seo-utils.mjs";

const base = (process.argv[2] || "https://uefnmap.com").replace(/\/$/, "");
const failures = [], results = [];
function check(ok, message) { if (!ok) failures.push(message); }
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), plainText(m[2] ?? m[3])]));
}
async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
}
const sitemap = await get("/sitemap.xml");
if (sitemap.response.status !== 200) throw new Error("Sitemap unavailable");
const paths = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(plainText(m[1])).pathname);
const queue = [...paths];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const path = queue.shift();
    try {
      const { response, html } = await get(path);
      check(response.status === 200, `${path}: HTTP ${response.status}`);
      const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m => ({ ...attributes(m[1]), text: plainText(m[2]) }));
      const controls = [...html.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => plainText(m[2]));
      const discord = links.filter(link => link["data-discord-cta"] === "true");
      check(!links.some(link => /^\/(cart|checkout)(\/|\?|$)/.test(link.href || "")), `${path}: old purchase link remains`);
      check(!controls.some(text => /add to cart|already in cart|buy now|proceed to checkout|pay now|go to checkout/i.test(text)), `${path}: old purchase control remains`);
      check(!html.includes("Payments secured by Paddle") && !html.includes("Paddle Secured"), `${path}: old payment badge remains`);
      check(!/<script[^>]*src="[^"]*(?:paddle\.com|paddle-js)/i.test(html), `${path}: payment SDK is loaded`);
      check(links.some(link => link.href === DISCORD_INVITE_URL), `${path}: community link missing`);
      for (const link of discord) {
        check(link.href === DISCORD_INVITE_URL && link.target === "_blank" && link.rel?.includes("noopener") && link.rel?.includes("noreferrer"), `${path}: incorrect Discord action`);
      }
      const isCatalog = path === "/" || path === "/marketplace" || path === "/pages/featured" || path === "/pages/featured/all-assets" || /^\/marketplace\//.test(path) || /^\/pages\/game-modes\/.+/.test(path);
      if (isCatalog) check(discord.length > 0, `${path}: product Discord action missing`);
      results.push({ path, status: response.status, productDiscordLinks: discord.length });
    } catch (error) { failures.push(`${path}: ${error.message}`); }
  }
}));
for (const path of ["/cart", "/cart/old", "/checkout", "/checkout/old", "/cart?item=test&returnTo=%2Fmy-assets", "/checkout?item=test"]) {
  const { response } = await get(path);
  check(response.status === 307 && response.headers.get("location") === DISCORD_INVITE_URL, `${path}: expected redirect to exact invite with no forwarded query`);
}
const report = { checkedAt: new Date().toISOString(), base, pages: results.length, discordInvite: DISCORD_INVITE_URL, failures, results };
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: results.length, failures, result: failures.length ? "FAIL" : "PASS" }, null, 2));
if (failures.length) process.exitCode = 1;
