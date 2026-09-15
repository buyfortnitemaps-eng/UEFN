import { notFound } from "next/navigation";
import LegalClient from "./LegalClient";
import { getLegal } from "../../lib/catalog-data";
import { pageMetadata } from "../../lib/catalog-seo.mjs";
import { sanitizeContent } from "../../lib/sanitize-content.mjs";

export async function generateMetadata({ params }) {
  const { type } = await params;
  const data = await getLegal(type);
  if (!data) notFound();
  return pageMetadata({ title: data.type, description: `Read UEFNMAP's ${data.type.toLowerCase()} for information about our Fortnite map templates, digital assets and services.`, path: `/legal/${type}` });
}
export default async function Page({ params }) {
  const { type } = await params;
  const data = await getLegal(type);
  if (!data) notFound();
  return <LegalClient data={{ type: data.type }} cleanHTML={sanitizeContent(data.content)} />;
}
