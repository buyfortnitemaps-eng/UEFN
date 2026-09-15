import Link from "next/link";
import { listingUrl } from "../lib/catalog-seo.mjs";

export default function SeoPagination({ path, page, totalPages, filters = {} }) {
  if (totalPages <= 1) return null;
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])].filter(n => n > 0 && n <= totalPages).sort((a, b) => a - b);
  const linkClass = "px-4 py-3 rounded-xl border border-purple-500/40 hover:bg-purple-600/20";
  return <nav aria-label="Pagination" className="mt-16 flex flex-wrap justify-center items-center gap-3">
    {page > 1 && <Link className={linkClass} href={listingUrl(path, page - 1, filters)} rel="prev">Previous</Link>}
    {pages.map((n, index) => <span key={n} className="flex items-center gap-3">
      {index > 0 && n - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
      <Link className={`${linkClass} ${n === page ? "bg-purple-600 text-white" : ""}`} aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`} href={listingUrl(path, n, filters)}>{n}</Link>
    </span>)}
    {page < totalPages && <Link className={linkClass} href={listingUrl(path, page + 1, filters)} rel="next">Next</Link>}
  </nav>;
}
