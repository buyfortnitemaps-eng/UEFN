import { permanentRedirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import CatalogNotice from "../../../components/CatalogNotice";
import JsonLd from "../../../components/JsonLd";
import { getProductPageData } from "../../../lib/product-data";
import { productStructuredData, publicProduct } from "../../../lib/seo-utils.mjs";
import { SITE_ORIGIN } from "../../../lib/runtime-config";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { product, canonical, catalog, available } = await getProductPageData(id, "featured");
  if (product && canonical.startsWith("/marketplace/")) permanentRedirect(canonical);
  if (!available) throw new Error("Product catalog temporarily unavailable");
  return (
    <>
      {product && <JsonLd data={productStructuredData(product, canonical, SITE_ORIGIN)} />}
      <CatalogNotice catalog={catalog} className="relative z-10 mt-24 mx-6" />
      <ProductDetailClient key={id} initialProduct={publicProduct(product)} />
    </>
  );
}
