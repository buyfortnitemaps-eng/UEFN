# Public catalog recovery

The catalog API returned `503 DEPLOYMENT_PAUSED` on 16 October 2026. The public website now reads through a shared server catalog service so known public content can remain readable during an upstream outage.

## Current live source

The existing Render backend, `https://uefn-maps-server.onrender.com`, was verified on 16 October 2026 against the complete public catalog and all product detail records. Public reads now use this live source through `CATALOG_API_ORIGIN`; authentication and other write endpoints retain their existing routing. This is the original catalog backend and is still used by chat. The snapshot was refreshed from all six successfully validated live collections on 16 October.

Game-mode listings are derived from the complete live marketplace inventory because the backend game-mode endpoint duplicates featured and marketplace records. The adapter validates every page before filtering and computing unique pagination totals. Public search escapes the legacy backend's regular-expression syntax so literal product titles containing brackets or punctuation still match correctly.

When a cached response expires, a bounded synchronous live check prevents a healthy backend from showing a saved-data notice solely because the cache entry aged. Saved content is shown only when live retrieval fails.

## Behavior

- Valid live data takes precedence. Requests time out after four seconds and retry at most once; a paused deployment is not retried.
- Only validated live responses enter the Next data cache. Previously successful data is retained if revalidation fails, and older cached content is labeled with its last verification date.
- Cold starts can use `src/app/lib/catalog-snapshot.json` if live retrieval fails. The recovery seed contains the complete 11-product inventory, 11 featured products, 12 categories, seven game types, five legal documents and one portfolio project verified live on 16 October 2026.
- Saved data is explicitly labeled. It may not include changes made after capture. A confirmed live product deletion wins; an unfamiliar product/category/game type or page beyond the saved inventory remains temporarily unavailable rather than becoming a false 404.
- The public GET route `/api/catalog/...` only allows catalog endpoints and bounded query parameters. It forwards no cookies or authorization. Responses omit storage keys, user IDs, seller contact details and private nested fields. Errors and saved responses are not HTTP-cached.
- Authentication, administration, contact submissions, chat and payments keep their existing backend endpoints. This change does not resume the paused backend or restore its write operations.

## Refresh the recovery snapshot

To update the recovery seed, run `node scripts/refresh-catalog-snapshot.mjs`. The script fetches and validates every public collection and all product pages, strips private fields, and replaces the snapshot atomically only when all collections succeed. Review and deploy the refreshed source. A failed refresh keeps the existing snapshot intact.

Never copy the original Next fetch-cache records into the repository: they include private storage and user fields.

## Checks

Run `npm test`, `npx tsc --noEmit --incremental false`, and `npm run build`. Tests exercise live success, 503, timeout, invalid JSON, malformed or incomplete responses, deletion, filtering, pagination, private-field projection and snapshot refresh failures. Verify rendered page content and streamed errors as well as HTTP status when checking a deployment.

The paused Vercel backend still needs its pause reason reviewed and service restored by its owner for remaining features that depend on it. Public catalog reads now use the verified existing Render service. Returning readable pages allows Google to recrawl; it does not immediately clear historical Search Console errors or guarantee indexing.
