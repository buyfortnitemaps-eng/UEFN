import { BsDiscord } from "react-icons/bs";
import { DISCORD_INVITE_URL } from "../lib/community.mjs";

export default function DiscordButton({ productName, children = "Get on Discord", className = "" }) {
  return (
    <a
      href={DISCORD_INVITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={productName ? `Get ${productName} on Discord (opens in a new tab)` : "Join our Discord community (opens in a new tab)"}
      data-discord-cta="true"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 ${className}`}
    >
      <BsDiscord size={21} aria-hidden="true" className="shrink-0" />
      {children}
    </a>
  );
}
