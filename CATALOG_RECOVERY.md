# Public catalog recovery

The catalog API returned `503 DEPLOYMENT_PAUSED` on 16 October 2026. The public website now reads through a shared server catalog service so known public content can remain readable during an upstream outage.

## Behavior

- Valid live data takes precedence. Requests time out after four seconds and retry at most once; a paused deployment is not retried.
- Only validated live responses enter the Next data cache. Previously successful data is retained if revalidation fails, and older cached content is labeled with its last verification date.
- Cold starts can use `src/app/lib/catalog-snapshot.json`. The recovery seed contains the complete 11-product inventory, 11 featured products, 12 categories, seven game types and five legal documents verified on 15 September 2026. One portfolio project was recovered from public HTML observed on 16 October.
- Saved data is explicitly labeled. It may not include changes made after capture. A confirmed live product deletion wins; an unfamiliar product/category/game type or page beyond the saved inventory remains temporarily unavailable rather than becoming a false 404.
- The public GET route `/api/catalog/...` only allows catalog endpoints and bounded query parameters. It forwards no cookies or authorization. Responses omit storage keys, user IDs, seller contact details and private nested fields. Errors and saved responses are not HTTP-cached.
- Authentication, administration, contact submissions, chat and payments keep their existing backend endpoints. This change does not resume the paused backend or restore its write operations.

## Refresh the recovery snapshot

Once the backend is healthy, run `node scripts/refresh-catalog-snapshot.mjs`. The script fetches and validates every public collection and all product pages, strips private fields, and replaces the snapshot atomically only when all collections succeed. Review and deploy the refreshed source. A failed refresh keeps the existing snapshot intact.

Never copy the original Next fetch-cache records into the repository: they include private storage and user fields.

## Checks

Run `npm test`, `npx tsc --noEmit --incremental false`, and `npm run build`. Tests exercise live success, 503, timeout, invalid JSON, malformed or incomplete responses, deletion, filtering, pagination, private-field projection and snapshot refresh failures. Verify rendered page content and streamed errors as well as HTTP status when checking a deployment.

The underlying Vercel project still needs its pause reason reviewed and service restored by its owner. Returning readable pages allows Google to recrawl; it does not immediately clear historical Search Console errors or guarantee indexing.
