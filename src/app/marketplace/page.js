/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useCallback } from "react";
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

const Marketplace = () => {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ name: "All", _id: "All" }]);
  const [activeCategory, setActiveCategory] = useState("All"); // এটি এখন Category ID স্টোর করবে
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, lowToHigh, highToLow
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // --- Fetch Products Function ---
  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadMoreLoading(true);
        else setLoading(true);

        const currentPage = isLoadMore ? page + 1 : 1;

        // API URL with Pagination, Filter, Search, and Sort
        const url = `https://uefn-maps-server.onrender.com/api/v1/products/client?page=${currentPage}&limit=12&category=${activeCategory}&search=${search}&sort=${sortBy}`;

        const res = await fetch(url);
        const data = await res.json();

        if (isLoadMore) {
          setProducts((prev) => [...prev, ...data.data]);
          setPage(currentPage);
        } else {
          setProducts(data.data || []);
          setPage(1);
        }
        setHasMore(data.meta?.hasMore || false);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
        setLoadMoreLoading(false);
      }
    },
    [activeCategory, search, page, sortBy],
  );

  // --- Initial Fetch: Categories ---
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(
          `https://uefn-maps-server.onrender.com/api/v1/categories`,
        );
        const data = await res.json();
        if (data.success) {
          setCategories([{ name: "All", _id: "All" }, ...data.data]);
        }
      } catch (error) {
        console.error("Category Fetch Error:", error);
      }
    };
    fetchCats();
  }, []);

  // --- Fetch products on filter/search/sort change ---
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, search, sortBy]);

  const handleAddToCart = (item) => {
    if (!user) return setShowLoginModal(true);
    addToCart(item);
    setLastAddedItem(item.title);
    setShowSuccessModal(true);
  };

  // --- Skeleton Component ---
  const ProductSkeleton = () => (
    <div className="bg-white/5 border border-white/10 rounded-3xl h-80 animate-pulse">
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
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-28 pb-20 px-6 font-sans">
      {/* --- Marketplace Hidden SEO --- */}
      <section className="sr-only">
        <h2>Premium UEFN Map Store and Creator Marketplace</h2>
        <p>
          Browse our extensive collection of Fortnite UEFN maps and Creative 2.0
          islands. Our store features pro Fortnite maps including Deathrun, Box
          fight, Zone wars, 1v1 maps, and competitive PvP maps.
        </p>
        <ul>
          <li>Buy optimized Red vs Blue and Parkour maps</li>
          <li>
            Explore high-quality Tycoon, Horror, and Escape room templates
          </li>
          <li>Download UEFN Verse scripts and custom game modes</li>
          <li>New and trending Fortnite islands updated daily</li>
        </ul>
      </section>

      {/* --- Top Header Section --- */}
      <section className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={24} className="text-purple-500" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Marketplace
            </h1>
          </div>
          <p className="text-gray-500 text-sm italic">
            High-end UEFN templates, scripts and more.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Sorting Dropdown */}
          <div className="relative group min-w-45">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 appearance-none focus:border-purple-500 outline-none transition-all cursor-pointer text-sm font-bold uppercase tracking-wider"
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

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
              placeholder="Search assets..."
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* --- Sidebar (Sticky) --- */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-28 h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Filter size={14} className="text-purple-500" /> Category
            </h3>
            {activeCategory !== "All" && (
              <button
                onClick={() => setActiveCategory("All")}
                className="text-[10px] text-purple-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => {
              const categoryId =
                cat._id === "All" ? "All" : cat._id?.$oid || cat._id;
              const isSelected = activeCategory === categoryId;

              return (
                <button
                  key={categoryId}
                  onClick={() => setActiveCategory(categoryId)}
                  className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-left transition-all duration-300 ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 translate-x-1"
                      : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </aside>

        {/* --- Product Grid --- */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {loading && !loadMoreLoading ? (
                [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => {
                  const pId = product._id?.$oid || product._id;
                  const isInCart = cart.some(
                    (i) => (i._id?.$oid || i._id) === pId,
                  );

                  return (
                    <motion.div
                      key={pId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -8 }}
                      className="flex flex-col bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-purple-500/40 transition-all duration-500 shadow-2xl h-full"
                    >
                      {/* --- Image Section: Fixed Height & Width --- */}
                      <div className="relative h-44 overflow-hidden bg-[#16161a]">
                        {product.image?.url ? (
                          <img
                            src={product.image.url}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-white/5">
                            <LayoutGrid size={32} className="mb-2 opacity-20" />
                            <span className="uppercase font-black text-[10px] tracking-widest">
                              No Asset Image
                            </span>
                          </div>
                        )}

                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0d0d0f] via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                        {/* Category Badge - Top Left */}
                        <div className="absolute top-5 left-5">
                          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest shadow-xl">
                            {product.category?.name || "UEFN Asset"}
                          </span>
                        </div>

                        {/* Price Tag Overlay - Top Right (Optional style) */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-lg">
                            NEW
                          </div>
                        </div>
                      </div>

                      {/* --- Content Section --- */}
                      <div className="p-8 flex flex-col grow">
                        <div className="mb-6 grow">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors duration-300">
                            {product.title}
                          </h3>
                          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                            {product.description ||
                              "Premium UEFN template designed for high-performance creative maps."}
                          </p>
                        </div>

                        {/* Bottom Action Area */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">
                              Price
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white leading-none tracking-tight">
                                ${product.price}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                USD
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`relative overflow-hidden p-4 rounded-2xl transition-all duration-500 shadow-2xl active:scale-90 group/btn ${
                              isInCart
                                ? "bg-green-600 text-white shadow-green-500/20"
                                : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30"
                            }`}
                          >
                            <div className="relative z-10 flex items-center justify-center">
                              {isInCart ? (
                                <CheckCircle2 size={22} />
                              ) : (
                                <ShoppingCart size={22} />
                              )}
                            </div>

                            {/* Button Hover Shine */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                    No assets found in this category.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Load More Section */}
          {hasMore && (
            <div className="mt-16 text-center">
              <button
                onClick={() => fetchProducts(true)}
                disabled={loadMoreLoading}
                className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500 hover:text-white transition-all duration-300 font-black uppercase text-[10px] tracking-[0.3em] disabled:opacity-50"
              >
                {loadMoreLoading ? "Fetching Data..." : "Load More Assets →"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* --- Global Modals --- */}
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

export default Marketplace;
