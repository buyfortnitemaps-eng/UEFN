> Update: Public purchases now use the Discord contact flow. See DISCORD_FLOW.md; earlier references to an active on-site cart or checkout are historical.

# SEO and performance release

This release starts from the currently deployed site and includes SEO, responsive images, and optional measurement hooks. The separate older login/payment/admin rewrite in the owner's Downloads folder is not included.

## Search

- Server-rendered product metadata and details, canonical URLs, Product/Breadcrumb JSON-LD.
- Dynamic sitemap at `/sitemap.xml`, crawler settings at `/robots.txt`, redirects from legacy product URLs.
- Public page titles and a clear homepage heading. Game-mode detail pages have their own canonical URL.
- Basic Product markup deliberately omits unverified currency, availability, ratings, and offers.

## Analytics status: OFF

The owner chose to continue without Google Analytics. No measurement ID is configured by this release; no analytics data is collected and no consent prompt or Google Analytics script is rendered in that state.

To enable later, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the owner's real GA4 web stream ID in Vercel and redeploy. Confirm account settings and privacy information before activation. Turn off automatically collected Enhanced Measurement events for this stream, particularly history page views and file downloads: the application sends explicit page views with query strings removed and custom download events without signed URLs. Advertising features are disabled in the application. Visitors can accept or refuse optional analytics and change their choice.

Events prepared:

| Event | Meaning |
|---|---|
| `view_item` | Product details viewed |
| `add_to_cart`, `remove_from_cart` | Product actually added or removed from local cart |
| `begin_checkout` | Checkout window opened successfully |
| `checkout_error` | Checkout unavailable, transaction request failure, or failed order confirmation |
| `purchase` | Production checkout completion with positive order API confirmation; deduplicated by transaction ID |
| `download_started` | Download link requested |
| `download_link_ready` | API returned a download URL; does not prove the file finished downloading |
| `download_failure` | Download-link request rejected or failed |
| `web_vital` | LCP, CLS, INP, FCP, TTFB samples from consenting visitors |

Only public product identity and fixed diagnostic reason/status fields are sent. No account emails, payment details, storage keys, signed download links, query strings, or private admin/auth page paths are included. Revenue values are omitted until currency and amounts are validated against the actual payment payload.

**Existing checkout is configured for Paddle sandbox.** This release preserves that environment. Sandbox payments never emit `purchase`. Production payment configuration and backend payment verification remain separate work; do not interpret event hooks as payment certification.

## Performance

Homepage and catalog images use responsive Next.js image delivery, and hero text is visible before JavaScript hydration. The mobile baseline is documented outside this source folder in the release audit. Laboratory scores vary and do not replace real-user Core Web Vitals.
