import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ClientFeaturedContent from "./FeaturedSection";
import { catalogRequest, publicListing } from "../../lib/catalog-data";
export default async function FeaturedServer({ standalone = false }) {
  const result = await catalogRequest("products/featured", { page: 1, limit: 12 });
  const initialProducts = await publicListing([...result.data].reverse(), true);
  return (
    <div className=" pt-32 pb-24 px-6 transition-colors duration-300 bg-background">
      
    <section className="max-w-7xl mx-auto relative z-10">
      {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>


      {/* Filtering, Searching এবং Grid-এর জন্য আমরা একটি ক্লায়েন্ট কম্পোনেন্ট ব্যবহার করব 
          যাতে ISR-এর ডেটা পাস করে দেওয়া হবে।
      */}
      <ClientFeaturedContent initialProducts={initialProducts} standalone={standalone} />

      <div className="mt-16 text-center relative z-10">
        <Link href="/pages/featured/all-assets">
          <span className="px-10 py-5 bg-purple-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-purple-500/10 text-foreground flex items-center gap-3 mx-auto group">
            Explore All Assets{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </span>
        </Link>
      </div>
    </section>
    </div>
  );
}
