/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// Lucide থেকে সরিয়ে Next.js Link ব্যবহার করা হয়েছে
import Link from "next/link"; 
import { ShoppingCart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductSkeleton from "../../../components/productSclekton";

import { useCart } from "../../../lib/CartContext";
import { useAuth } from "../../../context/AuthContext";
import CartSuccessModal from "../../../components/CartSuccessModal";
import LoginAlertModal from "../../../components/LoginAlertModal";

export default function AllAssets() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTag, setActiveTag] = useState("all");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart, cart } = useCart();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    setLastAddedItem(product.title);
    setShowSuccessModal(true);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("https://uefn-maps-server.onrender.com/api/v1/products/featured");
        const data = await res.json();
        setProducts(data.data || []);
        setFilteredProducts(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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
    <div className="min-h-screen bg-[#0a0a0b] pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">
            All <span className="text-purple-500">Featured Assets</span>
          </h1>
          
          {/* Tags / Filters */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit backdrop-blur-md overflow-x-auto no-scrollbar">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product._id}
                  className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  {/* Image Section - Link logic fixed */}
                  <Link href={`/pages/featured/${product._id}`} className="block h-60 relative overflow-hidden bg-gray-900">
                    <img
                      src={product.image?.url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                        View Details
                      </span>
                    </div>
                    {product.featureTag && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase border backdrop-blur-md bg-black/40 text-white border-white/20">
                        {product.featureTag}
                      </span>
                    )}
                  </Link>

                  <div className="p-6">
                    {/* Title Link logic fixed */}
                    <Link href={`/pages/featured/${product._id}`}>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase tracking-tighter">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-gray-400 text-xs mb-6 line-clamp-2 h-8 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-5">
                      <div>
                        <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">
                          Price
                        </p>
                        <div className="flex items-center gap-2">
                          {product.isDiscount ? (
                            <>
                              <span className="text-2xl font-black text-white">
                                ${product.discountPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through font-bold">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-black text-white">
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`p-4 rounded-2xl transition-all active:scale-90 ${
                          cart.find((i) => i._id === product._id)
                            ? "bg-green-600 shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                            : "bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
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
      </div>

      {/* Modals */}
      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={lastAddedItem}
      />
      {showLoginModal && <LoginAlertModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}