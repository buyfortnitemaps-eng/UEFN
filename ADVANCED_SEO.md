> Update: Public purchases now use the Discord contact flow. See DISCORD_FLOW.md; earlier references to an active on-site cart or checkout are historical.

# Technical SEO maintenance

The public catalog, portfolio and policy pages render content on the server. Titles, descriptions, canonical URLs and social cards come from shared helpers. Confirmed featured copies redirect permanently to their marketplace product; standalone featured products retain their own URLs.

Marketplace and featured collection pages use `?page=2` URLs with distinct canonicals. Search, sort and category-filter variants are marked noindex. Empty game types remain useful to visitors but are noindex and excluded from the sitemap. Missing items use Next.js not-found responses. API outages throw errors instead of silently producing an empty sitemap or pretending products were deleted.

Cart, account and admin pages return `X-Robots-Tag: noindex, nofollow`. They are not blocked in robots.txt, so crawlers can read that instruction. Existing authentication and access controls are unchanged. Robots rules do not protect private data.

The sitemap follows API pagination, deduplicates canonical products, uses real update timestamps and rejects incomplete data. It refreshes hourly; catalog pages revalidate every five minutes. Google decides crawl timing and indexing separately. New products must contain accurate titles, useful original descriptions and relevant previews. No prices, currency, availability, reviews or ratings are invented for structured data.

Run `npm test`, `npx tsc --noEmit --incremental false`, and lint changed files before deployment. Validate a Vercel preview build, then run `npm run seo:audit -- https://uefnmap.com audit.json` after production deploys. The audit is read-only and checks sitemap pages, metadata, canonical consistency, server headings, structured data, private-route noindex, search results, redirects, error routes and the social image. Its example product/game-mode fixtures should be updated if those catalog entries are intentionally removed.

Policy HTML is sanitized on the server using sanitize-html before rendering. Executable HTML, unsafe URLs and inline styles are stripped; Quill classes and normal headings, lists and text are retained. Top-level policy headings become h2 below the page title.

Google Analytics remains disabled until the owner provides a measurement ID and completes the existing consent/configuration setup. No additional paid SEO service or recurring automation is installed.

References: [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google noindex requirements](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
