import { permanentRedirect } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "../../../components/JsonLd";
import { getProductPageData } from "../../../lib/product-data";
import { productStructuredData, publicProduct } from "../../../lib/seo-utils.mjs";
import { SITE_ORIGIN } from "../../../lib/runtime-config";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const { product, canonical } = await getProductPageData(id, "featured");
  if (product && canonical.startsWith("/marketplace/")) permanentRedirect(canonical);
  return (
    <>
      {product && <JsonLd data={productStructuredData(product, canonical, SITE_ORIGIN)} />}
      <ProductDetailClient key={id} initialProduct={publicProduct(product)} />
    </>
  );
}
