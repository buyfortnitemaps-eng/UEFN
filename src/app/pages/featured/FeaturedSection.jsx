/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../lib/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginAlertModal from "../../components/LoginAlertModal";
import CartSuccessModal from "../../components/CartSuccessModal";

export default function ClientFeaturedContent({ initialProducts }) {
  const [activeTag, setActiveTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

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
    let result = initialProducts;
    if (activeTag !== "all") {
      result = result.filter((p) => p.featureTag === activeTag);
    }
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [activeTag, searchQuery, initialProducts]);

  const tags = [
    { id: "all", label: "All Assets" },
    { id: "featured", label: "Featured" },
    { id: "premium", label: "Premium" },
    { id: "trending", label: "Trending" },
  ];

  return (
    <>
      {/* Search & Filter UI */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 gap-8 px-2 relative z-10">

        {/* Left Side: Title & Info Text */}
        <div className="max-w-xl w-full lg:w-auto text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
            <Sparkles size={20} className="text-yellow-500 shrink-0" />
            <h2 className="text-xl md:text-2xl font-black text-foreground leading-tight italic uppercase tracking-tighter">
              The most downloaded UEFN templates this week{" "}
              <span className="text-purple-500">WITH</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-[10px] md:text-xs font-black tracking-[0.2em] uppercase opacity-70">
            PURCHASE MAP • VERSE • 3D ASSET • THUMBNAIL
          </p>
        </div>

        {/* Right Side Column: Search Bar (Top) & Filters (Bottom) */}
        <div className="flex flex-col gap-4 w-full lg:w-auto items-center lg:items-end">

          {/* Search Bar */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" size={16} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card-bg border border-border-color rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:border-purple-500 outline-none text-foreground shadow-sm transition-all"
            />
          </div>

          {/* Tags/Filters */}
          <div className="flex bg-card-bg p-1.5 rounded-2xl border border-border-color backdrop-blur-md gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto justify-center lg:justify-end">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeTag === tag.id
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredProducts.slice(0, 12).map((product) => (
            <motion.div
              layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              key={product._id}
              className="glass-card rounded-[2.5rem] overflow-hidden group border border-border-color hover:border-purple-500/50 transition-all duration-500 flex flex-col hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] hover:-translate-y-2"
            >
              <Link href={`/pages/featured/${product._id}`} className="block h-56 relative overflow-hidden bg-gray-900">
                <img src={product.image?.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-[10px] uppercase text-white">View Details</div>
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase border backdrop-blur-md bg-white/10 text-foreground">{product.featureTag}</span>
              </Link>
              <div className="p-6">
                <Link href={`/pages/featured/${product._id}`}>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase">{product.title}</h3>
                </Link>
                <p className="text-forground text-xs mb-6 h-12 leading-relaxed">
                  {product.description?.length > 120 ? `${product.description.slice(0, 120)}...` : product.description}
                </p>
                <div className="flex items-center justify-between border-t border-border-color pt-4">
                  <div>
                    <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">Price</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-foreground">
                        ${product.isDiscount ? product.discountPrice : product.price}
                      </span>

                      {product.isDiscount && (
                        <span className="text-sm text-gray-500 line-through font-medium">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(product)} className={`p-4 rounded-2xl transition-all ${cart.find(i => i._id === product._id) ? "bg-green-600 shadow-green-600/20" : "bg-purple-600 shadow-purple-600/20"}`}>
                    <ShoppingCart size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CartSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} productName={lastAddedItem} />
      {showLoginModal && <LoginAlertModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}