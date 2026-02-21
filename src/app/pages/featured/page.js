/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";

import { useCart } from "../../lib/CartContext";
import LoginAlertModal from "../../components/LoginAlertModal";
import { useAuth } from "../../context/AuthContext";

// --- Skeleton Card Component (Loading state design) ---
const ProductSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    {/* Image Placeholder */}
    <div className="h-56 bg-white/10 relative overflow-hidden">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>

    <div className="p-6">
      {/* Title Placeholder */}
      <div className="h-6 bg-white/10 rounded-md w-3/4 mb-4" />
      {/* Description Placeholder */}
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-white/10 rounded-md w-full" />
        <div className="h-3 bg-white/10 rounded-md w-5/6" />
      </div>

      {/* Price & Button Placeholder */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-md w-10" />
          <div className="h-6 bg-white/10 rounded-md w-16" />
        </div>
        <div className="h-12 w-12 bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);

const FeaturedSection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTag, setActiveTag] = useState("all");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
  };

  // Fetching Data
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(
          "https://uefn-maps-server.vercel.app/api/v1/products/featured",
        );
        const data = await res.json();
        setProducts(data.data || []);
        setFilteredProducts(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (activeTag === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.featureTag === activeTag));
    }
  }, [activeTag, products]);

  const tags = [
    { id: "all", label: "All Assets" },
    { id: "featured", label: "Featured" },
    { id: "premium", label: "Premium" },
    { id: "trending", label: "Trending" },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-500" />
            <h2 className="text-3xl font-bold text-white">Featured Releases</h2>
          </div>
          <p className="text-gray-500">
            The most downloaded UEFN templates this week.
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTag === tag.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Products Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          // Displaying 6 Skeleton Cards while loading
          [...Array(6)].map((_, index) => <ProductSkeleton key={index} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, 6).map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product._id}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="h-56 relative overflow-hidden bg-gray-900">
                  <img
                    src={product.image?.url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />

                  {/* Dynamic Tag */}
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border backdrop-blur-md ${
                      product.featureTag === "premium"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : product.featureTag === "trending"
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {product.featureTag}
                  </span>

                  <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-purple-400 border border-purple-500/30 tracking-widest uppercase">
                    UEFN
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="text-gray-500 text-[10px] uppercase font-semibold">
                        Price
                      </p>
                      <span className="text-2xl font-bold text-white">
                        ${product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`p-4 rounded-xl transition-all shadow-lg active:scale-95 ${
                        cart.find((i) => i._id === product._id)
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                      }`}
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

      {showLoginModal && (
        <LoginAlertModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* View All Button */}
      {!loading && filteredProducts.length > 3 && (
        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all hover:bg-purple-500/10 text-white">
            View All {activeTag !== "all" ? activeTag : "Featured"} Assets →
          </button>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
