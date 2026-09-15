"use client";
import DiscordButton from "../../../components/DiscordButton";
import Link from "next/link";
import {
  ArrowLeft,
  Ghost,
} from "lucide-react";
import SeoPagination from "../../../components/SeoPagination";
import Image from "next/image";

export default function GameModeDetail({ id, modeName, products, currentPage, totalPages }) {


  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Link
              href="/pages/game-modes"
              className="flex items-center gap-2 text-muted-foreground hover:text-purple-500 transition-colors font-black uppercase text-[10px] tracking-widest mb-6 group w-fit"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to All Game Types
            </Link>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic text-foreground tracking-tighter">
              {modeName} <span className="text-purple-500">Assets</span>
            </h1>
            <p className="mt-4 text-muted-foreground">Explore {modeName} templates and assets for Fortnite UEFN. Open a product to compare its details and previews.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-500 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] hover:-translate-y-2"
                >
                  {/* Card Content (Same as before) */}
                  <Link
                    href={product.canonicalPath}
                    className="block h-64 overflow-hidden relative bg-muted/20"
                  >
                    <Image width={1280} height={720} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      src={product.image?.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={product.title}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 backdrop-blur-[2px]">
                      <span className="bg-white text-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                        View Details
                      </span>
                    </div>
                  </Link>

                  <div className="p-8 flex flex-col grow relative">
                    <h2 className="text-2xl font-black uppercase italic text-foreground mb-3 group-hover:text-purple-500 transition-colors line-clamp-1 tracking-tighter">
                      {product.title}
                    </h2>
                    <p className="text-muted-foreground text-xs mb-8 h-10 opacity-70 leading-relaxed line-clamp-2">
                      {product.description || "Premium UEFN template."}
                    </p>

                    <div className="border-t border-border-color/50 pt-6 mt-auto">
                      <DiscordButton productName={product.title} className="w-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-border-color rounded-[3rem]">
                <Ghost
                  size={60}
                  className="text-muted-foreground mb-4 opacity-10 animate-bounce"
                />
                <p className="text-muted-foreground font-black uppercase italic tracking-[0.3em] opacity-40">
                  No assets found.
                </p>
              </div>
            )}
          </div>

          <SeoPagination path={`/pages/game-modes/${id}`} page={currentPage} totalPages={totalPages} />
          <Link href="/marketplace" className="block mt-10 text-purple-400 underline">Browse all UEFN map templates</Link>
        </div>
      </div>

    </div>
  );
}
