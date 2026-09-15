import { cache } from "react";
import { notFound } from "next/navigation";
import GameModeDetailClient from "./GameModeDetailClient";
import { getGameType, catalogRequest, publicListing } from "../../../lib/catalog-data";
import { pageNumber, pageMetadata, listingUrl, collectionStructuredData } from "../../../lib/catalog-seo.mjs";
import { SITE_ORIGIN } from "../../../lib/runtime-config";
import JsonLd from "../../../components/JsonLd";

const getData = cache(async (id, page) => {
  if (!page || !/^[a-f\d]{24}$/i.test(id)) notFound();
  const mode = await getGameType(id);
  if (!mode) notFound();
  const result = await catalogRequest(`products/by-gametype/${id}`, { page, limit: 12 });
  const totalPages = Math.max(1, result.meta?.totalPages || Math.ceil((result.meta?.total || result.data.length) / 12));
  if (page > totalPages) notFound();
  const products = await publicListing(result.data);
  return { mode, products, totalPages };
});
export async function generateMetadata({ params, searchParams }) {
  const { id } = await params; const page = pageNumber((await searchParams).page);
  const { mode, products } = await getData(id, page);
  return pageMetadata({ title: `${mode.name} UEFN Assets${page > 1 ? ` — Page ${page}` : ""}`, description: `Browse ${mode.name} templates and assets for Fortnite UEFN. Compare product descriptions, screenshots and previews for your next island.`, path: listingUrl(`/pages/game-modes/${id}`, page), noindex: products.length === 0 });
}
export default async function Page({ params, searchParams }) {
  const { id } = await params; const page = pageNumber((await searchParams).page);
  const { mode, products, totalPages } = await getData(id, page);
  return <>
    <JsonLd data={collectionStructuredData(`${mode.name} UEFN Assets`, listingUrl(`/pages/game-modes/${id}`, page), products, SITE_ORIGIN, page)} />
    <GameModeDetailClient id={id} modeName={mode.name} products={products} currentPage={page} totalPages={totalPages} />
  </>;
}
