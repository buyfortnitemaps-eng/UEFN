/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Ghost } from "lucide-react";
import ProductSkeleton from "../../../components/productSclekton";

// কার্ট এবং অথেনটিকেশন হুক ইম্পোর্ট
import { useCart } from "../../../lib/CartContext";
import { useAuth } from "../../../context/AuthContext";
import CartSuccessModal from "../../../components/CartSuccessModal";
import LoginAlertModal from "../../../components/LoginAlertModal";

export default function GameModeDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const modeName = searchParams.get("name");

  const [products, setProducts] = useState([]);
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
    const fetchProductsByGameType = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://uefn-maps-server.onrender.com/api/v1/products/by-gametype/${id}`,
        );
        const data = await res.json();
        if (data.success) {
          setProducts((data.data || []).reverse());
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProductsByGameType();
  }, [id]);

  return (
    <div className="min-h-screen relative transition-colors duration-300">
      {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. DOT GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* 2. TOP GLOW LIGHT */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />

        {/* 3. BOTTOM GLOW LIGHT */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Link
              href="/"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  /* কার্ডে বর্ডার, শ্যাডো এবং হোভার ইফেক্ট যোগ করা হয়েছে */
                  className="glass-card rounded-[2.5rem] overflow-hidden group 
                   border border-border-color hover:border-purple-500/50 
                   transition-all duration-500 flex flex-col 
                   hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] 
                   hover:-translate-y-2 "
                >
                  <Link
                    href={
                      product.featureTag
                        ? `/pages/featured/${product._id}`
                        : `/marketplace/${product._id}`
                    }
                    className="block h-64 overflow-hidden relative bg-muted/20"
                  >
                    <img
                      src={product.image?.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={product.title}
                    />
                    {/* ইমেজ ওভারলে গ্লো */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 backdrop-blur-[2px]">
                      <span className="bg-white text-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                        View Details
                      </span>
                    </div>
                  </Link>

                  <div className="p-8 flex flex-col grow relative">
                    <Link
                      href={
                        product.featureTag
                          ? `/pages/featured/${product._id}`
                          : `/marketplace/${product._id}`
                      }
                    >
                      <h3 className="text-2xl font-black uppercase italic text-foreground mb-3 group-hover:text-purple-500 transition-colors line-clamp-1 tracking-tighter">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-muted-foreground text-xs mb-8 h-10 opacity-70 leading-relaxed line-clamp-2">
                      {product.description?.length > 80
                        ? `${product.description.slice(0, 80)}...`
                        : product.description ||
                          "Premium UEFN template optimized for professional creators."}
                    </p>

                    <div className="flex justify-between items-center border-t border-border-color/50 pt-6 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-500 mb-1">
                          Pricing
                        </span>
                        <div className="flex items-center gap-2">
                          {product.isDiscount ? (
                            <>
                              <span className="text-2xl font-black text-foreground">
                                ${product.discountPrice}
                              </span>
                              <span className="text-sm text-muted-foreground line-through font-bold opacity-40">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-black text-foreground">
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`p-4 rounded-2xl transition-all active:scale-90 shadow-lg ${
                          cart.find((i) => i._id === product._id)
                            ? "bg-green-600 shadow-green-600/20"
                            : "bg-purple-600 hover:bg-purple-500 shadow-purple-600/40 hover:rotate-3"
                        }`}
                      >
                        <ShoppingCart size={22} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="col-span-full py-32 flex flex-col items-center justify-center bg-card-bg/20 border-2 border-dashed border-border-color rounded-[3rem] backdrop-blur-sm">
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
        </div>
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
