/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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

const ShopeClient = ({
  initialProducts,
  initialHasMore,
  initialCategories,
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState([
    { name: "All", _id: "All" },
    ...initialCategories,
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const isInitialMount = useRef(true);

  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadMoreLoading(true);
        else setLoading(true);

        const currentPage = isLoadMore ? page + 1 : 1;
        const url = `https://uefn-maps-server.vercel.app/api/v1/products/client?page=${currentPage}&limit=12&category=${activeCategory}&search=${search}&sort=${sortBy}`;

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

  // ফিল্টার চেঞ্জ হলে API কল (প্রথমবার লোড বাদে)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchProducts();
  }, [activeCategory, search, sortBy]);

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
        {/* Header */}
        <section className="mb-12 flex flex-col md:row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid size={24} className="text-purple-500" />
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Shope
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
                onChange={(e) => setSortBy(e.target.value)}
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

            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                placeholder="Search assets..."
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
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
                    onClick={() => setActiveCategory(categoryId)}
                    className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-left transition-all duration-300 ${activeCategory === categoryId ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 translate-x-1" : "bg-background text-gray-500 hover:bg-white/10 hover:text-foreground"}`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {loading && !loadMoreLoading
                  ? [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
                  : products.map((product) => {
                      const pId = product._id?.$oid || product._id;
                      const isInCart = cart.some(
                        (i) => (i._id?.$oid || i._id) === pId,
                      );

                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={pId}
                          className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-500 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)]"
                        >
                          <div className="relative h-44 overflow-hidden bg-[#16161a]">
                            <Link
                              href={`marketplace/${product._id}`}
                              className="relative z-10 block w-full h-full"
                            >
                              <img
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
                            <Link href={`marketplace/${product._id}`}>
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
                                <span className="text-2xl font-black text-foreground">
                                  ${product.price}
                                </span>
                              </div>
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`p-4 rounded-2xl transition-all shadow-2xl active:scale-90 ${isInCart ? "bg-green-600 text-white shadow-green-500/20" : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30"}`}
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

            {hasMore && (
              <div className="mt-16 text-center">
                <button
                  onClick={() => fetchProducts(true)}
                  disabled={loadMoreLoading}
                  className="px-12 py-4 bg-background border border-white/5 rounded-2xl hover:border-purple-500 transition-all font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                  {loadMoreLoading ? "Fetching Data..." : "Load More Assets →"}
                </button>
              </div>
            )}
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
