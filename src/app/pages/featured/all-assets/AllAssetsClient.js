/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductSkeleton from "../../../components/productSclekton";
import { useCart } from "../../../lib/CartContext";
import { useAuth } from "../../../context/AuthContext";
import CartSuccessModal from "../../../components/CartSuccessModal";
import LoginAlertModal from "../../../components/LoginAlertModal";

export default function AllAssetsClient({
  initialProducts,
  initialTotalPages,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [activeTag, setActiveTag] = useState("all");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const limit = 12;

  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // পেজ বা ফিল্টার চেঞ্জ হলে ডেটা ফেচ করার ফাংশন
  const fetchPageData = async (page) => {
    // যদি ১নং পেজ এবং 'all' ট্যাগ থাকে, তবে সরাসরি ISR ডাটা ব্যবহার করব
    if (page === 1 && activeTag === "all") {
      setProducts(initialProducts);
      setTotalPages(initialTotalPages);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://uefn-maps-server.vercel.app/api/v1/products/featured?page=${page}&limit=${limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
        setTotalPages(data.meta.totalPages || 1);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // পেজ চেঞ্জ হ্যান্ডলার
  useEffect(() => {
    // শুধুমাত্র যখন ইউজার প্রথমবার পেজে আসে তখন ফেচ হবে না (ISR হ্যান্ডেল করবে)
    // কিন্তু এরপর যেকোনো পেজ চেঞ্জ বা ফিল্টার চেঞ্জে এটি কাজ করবে
    fetchPageData(currentPage);
  }, [currentPage]);

  // ট্যাগ ফিল্টারিং লজিক (Client Side)
  useEffect(() => {
    if (activeTag === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.featureTag === activeTag));
    }
  }, [activeTag, products]);

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    setLastAddedItem(product.title);
    setShowSuccessModal(true);
  };

  const tags = [
    { id: "all", label: "All Assets" },
    { id: "featured", label: "Featured" },
    { id: "premium", label: "Premium" },
    { id: "trending", label: "Trending" },
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-foreground mb-4 tracking-tighter italic">
            All <span className="text-purple-500">Featured Assets</span>
          </h1>

          {/* Filter Tabs */}
          <div className="flex bg-card-bg/40 p-1 rounded-2xl border border-border-color w-fit backdrop-blur-md overflow-x-auto no-scrollbar shadow-sm">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setActiveTag(tag.id);
                  setCurrentPage(1);
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTag === tag.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tag.label}
              </button>
            ))}
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product._id}
                  className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-300 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] hover:-translate-y-2"
                >
                  <Link
                    href={`/pages/featured/${product._id}`}
                    className="block h-60 relative overflow-hidden bg-gray-900"
                  >
                    <img
                      src={product.image?.url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[10px] uppercase text-white tracking-widest">
                      View Details
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col grow">
                    <Link href={`/pages/featured/${product._id}`}>
                      <h3 className="text-xl font-black text-foreground group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase tracking-tighter">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-xs mb-6 h-12 leading-relaxed opacity-70">
                      {product.description?.length > 120
                        ? `${product.description.slice(0, 120)}...`
                        : product.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-border-color pt-5 mt-auto">
                      <div>
                        <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">
                          Price
                        </p>
                        <span className="text-2xl font-black text-foreground">
                          $
                          {product.isDiscount
                            ? product.discountPrice
                            : product.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`p-4 rounded-2xl transition-all active:scale-90 ${cart.find((i) => i._id === product._id) ? "bg-green-600 shadow-green-600/20" : "bg-purple-600 hover:bg-purple-500 shadow-purple-600/20"}`}
                      >
                        <ShoppingCart size={20} className="text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* --- PAGINATION CONTROLS (FIXED PREVIOUS ISSUE) --- */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-4 rounded-2xl bg-card-bg/40 border border-border-color text-foreground disabled:opacity-20 hover:bg-purple-600/10 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "bg-card-bg/40 border border-border-color text-gray-500 hover:border-purple-500/50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-4 rounded-2xl bg-card-bg/40 border border-border-color text-foreground disabled:opacity-20 hover:bg-purple-600/10 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

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
}
