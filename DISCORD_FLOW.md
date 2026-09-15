# Discord contact flow

As of 15 September 2026, public product actions open the existing uefnmap Discord invite: https://discord.gg/Wv7GhuKTG3.

Every product CTA uses `DiscordButton` and `DISCORD_INVITE_URL` from `src/app/lib/community.mjs`. Links work without website authentication and open a new tab. The site does not join the server or send a Discord message on a visitor's behalf. Existing Discord members can open the server; other visitors may need to sign in or accept its invite.

Public prices, discounts, price-sort controls, cart icons, add-to-cart buttons, checkout UI and payment-provider promotional text were removed. The Paddle SDK, cart provider and unused purchase modals were removed from the frontend. Existing accounts, downloads and historical orders remain available; their database records were not modified.

Legacy `/cart` and `/checkout` routes return HTTP 307 redirects to the same invite through route handlers, before any page rendering. These redirects intentionally discard incoming query parameters instead of forwarding them to Discord. Public catalog URLs, metadata, canonicals, structured data and sitemap behavior remain in place.

The old commerce event helpers are dormant; only the existing catalog view tracking can still be called. Google Analytics remains disabled. This file supersedes earlier documentation describing an active on-site cart or checkout.

Validation: run `npm test`, TypeScript and lint checks, then verify a Vercel preview. After publishing, run `npm run seo:audit` and `npm run discord:audit` to check the public catalog and redirects. Update the single invite constant if the Discord invite changes.
