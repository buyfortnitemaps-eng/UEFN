import { cache } from "react";
import { notFound } from "next/navigation";
import ShopeClient from "./ShopeClient";
import { catalogRequest, publicListing } from "../lib/catalog-data";
import { pageMetadata, pageNumber, listingUrl, collectionStructuredData } from "../lib/catalog-seo.mjs";
import { SITE_ORIGIN } from "../lib/runtime-config";
import JsonLd from "../components/JsonLd";

function readQuery(search) {
  const page = pageNumber(search.page);
  if (!page) notFound();
  const category = typeof search.category === "string" && /^[a-f\d]{24}$/i.test(search.category) ? search.category : "All";
  const query = { category, search: typeof search.search === "string" ? search.search.trim().slice(0, 100) : "", sort: ["lowToHigh", "highToLow"].includes(search.sort) ? search.sort : "newest" };
  return { page, query };
}
const getData = cache(async (page, category, search, sort) => {
  const [result, categories] = await Promise.all([
    catalogRequest("products/client", { page, limit: 12, category, search, sort }), catalogRequest("categories"),
  ]);
  const total = result.meta?.total ?? result.data.length;
  if (page > Math.max(1, Math.ceil(total / 12))) notFound();
  return { products: await publicListing(result.data), total, categories: categories.data.map(({ _id, name }) => ({ _id, name })) };
});
export async function generateMetadata({ searchParams }) {
  const { page, query } = readQuery(await searchParams);
  return pageMetadata({ title: `UEFN Map Templates & Fortnite Assets${page > 1 ? ` — Page ${page}` : ""}`, description: "Browse Fortnite UEFN map templates, Verse scripts and creative assets. Compare screenshots, previews and product details for your next island.", path: listingUrl("/marketplace", page, query), noindex: !!query.search || query.category !== "All" || query.sort !== "newest" });
}
export default async function Page({ searchParams }) {
  const { page, query } = readQuery(await searchParams);
  const data = await getData(page, query.category, query.search, query.sort);
  return <>
    <JsonLd data={collectionStructuredData("UEFN Marketplace", listingUrl("/marketplace", page, query), data.products, SITE_ORIGIN, page)} />
    <ShopeClient key={listingUrl("/marketplace", page, query)} initialProducts={data.products} initialTotal={data.total} initialCategories={data.categories} query={query} currentPage={page} />
  </>;
}
