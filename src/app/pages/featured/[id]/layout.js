import { notFound } from "next/navigation";
import { getProductPageData, getProductPageMetadata } from "../../../lib/product-data";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return getProductPageMetadata(id, "featured");
}

export default async function ProductLayout({ children, params }) {
  const { id } = await params;
  const result = await getProductPageData(id, "featured");
  if (result.available && !result.product) notFound();
  return children;
}
