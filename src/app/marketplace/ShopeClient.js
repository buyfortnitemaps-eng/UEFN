"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ShoppingCart,
  ChevronDown,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../context/AuthContext";
import LoginAlertModal from "../components/LoginAlertModal";
import CartSuccessModal from "../components/CartSuccessModal";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SeoPagination from "../components/SeoPagination";
import { listingUrl } from "../lib/catalog-seo.mjs";

const ShopeClient = ({ initialProducts: products, initialTotal: totalProducts, initialCategories, query, currentPage }) => {
  const categories = [{ name: "All", _id: "All" }, ...initialCategories];
  const activeCategory = query.category;
  const sortBy = query.sort;
  const [search, setSearch] = useState(query.search);
  const router = useRouter();
  const loading = false;
  const limit = 12;
  const setFilters = (changes) => router.push(listingUrl("/marketplace", 1, { ...query, ...changes }));
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  const totalPages = Math.ceil(totalProducts / limit);

  const handleAddToCart = (item) => {
    if (!user) return setShowLoginModal(true);
    addToCart(item);
    setLastAddedItem(item.title);
    setShowSuccessModal(true);
  };

  const ProductSkeleton = () => (
    <div className="bg-background border border-white/5 rounded-3xl h-80 animate-pulse">
      <div className="h-44 bg-white/10 rounded-t-3xl" />
      <div className="p-6 space-y-4">
        <div className="h-5 bg-white/10 rounded w-3/4" />
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-white/10 w-20 rounded" />
          <div className="h-10 bg-white/10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
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

      <main className="max-w-7xl mx-auto relative z-10">
        {/* Header Section (Same as before) */}
        <section className="grid grid-cols-1 md:grid-cols-2 my-3 items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid size={24} className="text-purple-500" />
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                UEFN Marketplace
              </h1>
            </div>
            <p className="text-gray-500 text-sm italic">
              High-end UEFN templates, scripts and more.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group min-w-45">
              <select
                value={sortBy}
                aria-label="Sort assets"
                onChange={(e) => setFilters({ sort: e.target.value })}
                className="w-full bg-background border border-white/5 rounded-xl py-3 px-4 appearance-none focus:border-purple-500 outline-none transition-all cursor-pointer text-sm font-bold uppercase tracking-wider"
              >
                <option value="newest">Newest First</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            <form className="relative w-full md:w-80" role="search" action="/marketplace" method="get" onSubmit={(event) => { event.preventDefault(); setFilters({ search }); }}>
              <input type="hidden" name="category" value={activeCategory} />
              <input type="hidden" name="sort" value={sortBy} />
              <Search
                className="absolute left-4 top-6 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="search"
                name="search"
                aria-label="Search assets"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="Search assets..."
              />
              <button type="submit" className="mt-2 text-sm text-purple-400 underline">Search</button>
            </form>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-10 mt-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 lg:sticky lg:top-28 h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter size={14} className="text-purple-500" /> Category
              </h3>
            </div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => {
                const categoryId =
                  cat._id === "All" ? "All" : cat._id?.$oid || cat._id;
                return (
                  <button
                    key={categoryId}
                    onClick={() => setFilters({ category: categoryId })}
                    className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-left transition-all duration-300 whitespace-nowrap shrink-0 ${
                      activeCategory === categoryId
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 translate-x-1"
                        : "bg-background text-gray-500 hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {loading
                  ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                  : products.map((product) => {
                      const pId = product._id?.$oid || product._id;
                      const isInCart = cart.some(
                        (i) => (i._id?.$oid || i._id) === pId,
                      );
                      return (
                        <motion.div
                          layout
                          initial={false}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={pId}
                          className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-500 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)]"
                        >
                          <div className="relative h-44 overflow-hidden bg-[#16161a]">
                            <Link
                              href={product.canonicalPath}
                              className="relative z-10 block w-full h-full"
                            >
                              <Image width={1280} height={720} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                src={product.image.url}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </Link>
                            <div className="absolute top-5 left-5 px-4 py-1.5 bg-background/60 backdrop-blur-xl border border-white/5 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
                              {product.category?.name || "UEFN Asset"}
                            </div>
                          </div>
                          <div className="p-8 flex flex-col grow">
                            <Link href={product.canonicalPath}>
                              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-6">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-border-color mt-auto">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                                  Price
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-black text-foreground">
                                    $
                                    {product.isDiscount
                                      ? product.discountPrice
                                      : product.price}
                                  </span>
                                  {product.isDiscount && (
                                    <span className="text-sm text-green-500 line-through">
                                      ${product.price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                aria-label={`Add ${product.title} to cart`}
                                onClick={() => handleAddToCart(product)}
                                className={`p-4 rounded-2xl transition-all active:scale-90 ${isInCart ? "bg-green-600 text-white shadow-green-500/20" : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30"}`}
                              >
                                {isInCart ? (
                                  <CheckCircle2 size={22} />
                                ) : (
                                  <ShoppingCart size={22} />
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
              </AnimatePresence>
            </div>

            {products.length === 0 && <p className="py-12 text-muted-foreground">No assets match these filters. Try another search or browse all categories.</p>}
            <SeoPagination path="/marketplace" page={currentPage} totalPages={totalPages} filters={query} />
            <Link className="block mt-10 text-purple-400 underline" href="/pages/game-modes">Browse templates by game type</Link>
          </div>
        </div>
      </main>

      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={lastAddedItem}
      />
      {showLoginModal && (
        <LoginAlertModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default ShopeClient;
