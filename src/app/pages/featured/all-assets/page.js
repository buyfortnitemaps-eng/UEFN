import { notFound } from "next/navigation";
import AllAssetsClient from "./AllAssetsClient";
import { catalogRequest, publicListing } from "../../../lib/catalog-data";
import { pageMetadata, pageNumber, listingUrl, collectionStructuredData } from "../../../lib/catalog-seo.mjs";
import { SITE_ORIGIN } from "../../../lib/runtime-config";
import JsonLd from "../../../components/JsonLd";
export async function generateMetadata({ searchParams }) {
  const page = pageNumber((await searchParams).page); if (!page) notFound();
  return pageMetadata({ title: `All Featured UEFN Assets${page > 1 ? ` — Page ${page}` : ""}`, description: "Browse the complete featured UEFN asset collection. View Fortnite map templates, product previews and details for your next creative project.", path: listingUrl("/pages/featured/all-assets", page) });
}
export default async function Page({ searchParams }) {
  const page = pageNumber((await searchParams).page); if (!page) notFound();
  const result = await catalogRequest("products/featured", { page, limit: 12 });
  const totalPages = Math.max(1, result.meta?.totalPages || 1);
  if (page > totalPages) notFound();
  const products = await publicListing(result.data, true);
  return <>
    <JsonLd data={collectionStructuredData("Featured UEFN Assets", listingUrl("/pages/featured/all-assets", page), products, SITE_ORIGIN, page)} />
    <AllAssetsClient key={page} initialProducts={products} initialTotalPages={totalPages} currentPage={page} />
  </>;
}
