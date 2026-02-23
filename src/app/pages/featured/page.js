/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link"; // লিঙ্ক যোগ করা হয়েছে

import { useCart } from "../../lib/CartContext";
import LoginAlertModal from "../../components/LoginAlertModal";
import CartSuccessModal from "../../components/CartSuccessModal";
import { useAuth } from "../../context/AuthContext";
import ProductSkeleton from "../../components/productSclekton";

// ... ProductSkeleton আগের মতই থাকবে ...

const FeaturedSection = () => {
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
        const res = await fetch(
          "https://uefn-maps-server.onrender.com/api/v1/products/featured",
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
    <section className="py-20 px-6 max-w-7xl mx-auto relative">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-yellow-500 shrink-0" />
            <h2 className="text-3xl font-bold text-white leading-tight italic uppercase tracking-tighter">
              Featured <span className="text-purple-500">Spotlight</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Hand-picked premium UEFN templates for creators.
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTag === tag.id
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, index) => <ProductSkeleton key={index} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, 12).map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product._id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group relative"
              >
                {/* Image Section - Dynamic Link */}
                <Link
                  href={`/product/${product._id}`}
                  className="block h-56 relative overflow-hidden bg-gray-900"
                >
                  <Link href={`/pages/featured/${product._id}`}>
                    <img
                      src={product.image?.url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter">
                        View Details
                      </span>
                    </div>
                  </Link>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase border backdrop-blur-md bg-white/10 text-white">
                    {product.featureTag}
                  </span>
                </Link>

                <div className="p-6">
                  {/* Title - Dynamic Link */}
                  <Link href={`/pages/featured/${product._id}`}>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase tracking-tighter">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-gray-400 text-xs mb-6 line-clamp-2 h-8">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest">
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

      {/* Success & Login Modals */}
      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={lastAddedItem}
      />
      {showLoginModal && (
        <LoginAlertModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* View All Button */}
      {!loading && (
        <div className="mt-16 text-center">
          <Link href="/pages/featured/all-assets">
            <button className="px-10 py-5 bg-white/5 border border-white/10 hover:border-purple-500/50 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-purple-500/10 text-white flex items-center gap-3 mx-auto group">
              Explore All Assets{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedSection;
