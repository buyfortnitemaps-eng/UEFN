import { serializeJsonLd } from "../lib/seo-utils.mjs";

export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
