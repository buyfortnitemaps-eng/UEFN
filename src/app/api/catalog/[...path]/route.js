import { readPublicCatalog } from "../../../lib/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { path } = await params;
  const result = await readPublicCatalog(Array.isArray(path) ? path.join("/") : "", new URL(request.url).searchParams);
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (result.status === 503) headers["Retry-After"] = "60";
  return Response.json(result.payload, { status: result.status, headers });
}
