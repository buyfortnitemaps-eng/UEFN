"use client";
import DiscordButton from "../../../components/DiscordButton";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductSkeleton from "../../../components/productSclekton";
import SeoPagination from "../../../components/SeoPagination";
import Image from "next/image";

export default function AllAssetsClient({ initialProducts: products, initialTotalPages: totalPages, currentPage }) {
  const [activeTag, setActiveTag] = useState("all");
  const filteredProducts = activeTag === "all" ? products : products.filter(product => product.featureTag === activeTag);
  const loading = false;


  const tags = [
    { id: "all", label: "All Assets" },
    { id: "featured", label: "Featured" },
    { id: "premium", label: "Premium" },
    { id: "bundle", label: "Bundle" },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
      {/* Background Dots & Glows */}
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          {/* Title Section */}
          <div className="w-full md:w-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-foreground mb-2 md:mb-4 tracking-tighter italic">
              All <span className="text-purple-500">Featured Assets</span>
            </h1>
          </div>

          {/* Filter Tabs Container */}
          <div className="w-full md:w-auto overflow-hidden">
            <div className="flex bg-card-bg/40 p-1 rounded-2xl border border-border-color w-full md:w-fit backdrop-blur-md overflow-x-auto no-scrollbar shadow-sm scroll-smooth">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setActiveTag(tag.id);
                  }}
                  className={`flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                    activeTag === tag.id
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product._id}
                  className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-300 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] hover:-translate-y-2"
                >
                  <Link
                    href={product.canonicalPath}
                    className="block h-60 relative overflow-hidden bg-gray-900"
                  >
                    <Image width={1280} height={720} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      src={product.image?.url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[10px] uppercase text-white tracking-widest">
                      View Details
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col grow">
                    <Link href={product.canonicalPath}>
                      <h3 className="text-xl font-black text-foreground group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase tracking-tighter">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-forground text-xs mb-6 h-12 leading-relaxed opacity-70">
                      {product.description?.length > 120
                        ? `${product.description.slice(0, 120)}...`
                        : product.description}
                    </p>
                    <div className="border-t border-border-color pt-5 mt-auto">
                      <DiscordButton productName={product.title} className="w-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <SeoPagination path="/pages/featured/all-assets" page={currentPage} totalPages={totalPages} />
      </div>

    </div>
  );
}