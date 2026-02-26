/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  User,
  Calendar,
  CheckCircle,
  PlayCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../lib/CartContext";

import LoginAlertModal from "../../components/LoginAlertModal";
import CartSuccessModal from "../../components/CartSuccessModal";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [openFaq, setOpenFaq] = useState(null); // FAQ ওপেন/ক্লোজ স্টেট

  const { user } = useAuth();
  const { addToCart, cart } = useCart();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://uefn-maps-server.vercel.app/api/v1/products/${id}`,
        );
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          setActiveImg(data.data.image?.url);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
    setLastAddedItem(product.title);
    setShowSuccessModal(true);
  };

  if (!product) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
        {/* Left Side: Media Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Image Placeholder */}
          <div className="rounded-4xl bg-white/5 border border-white/5 aspect-video relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Gallery Thumbnails Skeleton */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-30 h-20 rounded-2xl bg-white/5 border border-white/5 flex-shrink-0"
              />
            ))}
          </div>

          {/* Video Section Skeleton */}
          <div className="mt-10 space-y-4">
            <div className="w-32 h-4 bg-white/5 rounded-md" />
            <div className="rounded-4xl bg-white/5 border border-white/5 aspect-video" />
          </div>
        </div>

        {/* Right Side: Details Skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            {/* Category & Title */}
            <div className="w-24 h-6 bg-white/5 rounded-lg" />
            <div className="space-y-3">
              <div className="w-full h-12 bg-white/5 rounded-xl" />
              <div className="w-2/3 h-12 bg-white/5 rounded-xl" />
            </div>

            {/* Price Skeleton */}
            <div className="py-2 space-y-2">
              <div className="w-12 h-3 bg-white/5 rounded-md" />
              <div className="w-32 h-14 bg-white/10 rounded-xl" />
            </div>
          </div>

          {/* Description Box Skeleton */}
          <div className="p-6 bg-white/5 rounded-4xl border border-white/5 space-y-3">
            <div className="w-full h-3 bg-white/5 rounded-full" />
            <div className="w-full h-3 bg-white/5 rounded-full" />
            <div className="w-4/5 h-3 bg-white/5 rounded-full" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full" />
                <div className="space-y-2">
                  <div className="w-12 h-2 bg-white/5 rounded-md" />
                  <div className="w-20 h-4 bg-white/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Action Button Skeleton */}
          <div className="pt-6 space-y-4">
            <div className="w-full h-16 bg-white/10 rounded-2xl" />
            <div className="flex justify-center gap-6">
              <div className="w-24 h-3 bg-white/5 rounded-full" />
              <div className="w-24 h-3 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-4 md:px-10">
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
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Media (Gallery & YouTube) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Preview */}
            <div className="rounded-4xl overflow-hidden border border-white/5 bg-background aspect-video relative group">
              <img
                src={activeImg}
                className="w-full h-full object-cover transition-transform duration-700"
                alt="Product Preview"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-purple-600 text-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {product.featureTag}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setActiveImg(product.image?.url)}
                className={`min-w-30 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === product.image?.url ? "border-purple-500 scale-95" : "border-border-color"}`}
              >
                <img
                  src={product.image?.url}
                  className="w-full h-full object-cover"
                  alt="thumb"
                />
              </button>

              {product.gallery?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img.url)}
                  className={`min-w-30 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img.url ? "border-purple-500 scale-95" : "border-border-color"}`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                </button>
              ))}
            </div>

            {/* YouTube Section */}
            {product.youtubeId && (
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-widest text-sm">
                  <PlayCircle size={20} />
                  <span>Video Preview</span>
                </div>
                <div className="rounded-4xl overflow-hidden border border-white/5 bg-background aspect-video shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${product.youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="bg-background border border-white/5 text-forground px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                Category: {product.category?.name || "UEFN Asset"}
              </span>

              <h1 className="text-4xl md:text-5xl font-black uppercase italic leading-none tracking-tighter">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 py-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-foreground italic">
                      $
                      {product.isDiscount
                        ? product.discountPrice
                        : product.price}
                    </span>
                    {product.isDiscount && (
                      <span className="text-xl text-gray-500 line-through font-bold">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
                {product.isDiscount && (
                  <span className="bg-green-500 text-black px-3 py-1 rounded-md text-[10px] font-black uppercase animate-pulse">
                    Save ${product.price - product.discountPrice}
                  </span>
                )}
              </div>
            </div>

            <p className="text-forground text-sm md:text-base leading-relaxed bg-background p-6 rounded-3xl border border-white/5">
              {product.description}
            </p>

            {/* Seller & Info Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-2xl border border-white/5 flex items-center gap-3 shadow-lg">
                <User size={20} className="text-purple-500" />
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">
                    Seller
                  </p>
                  <p className="text-xs font-bold truncate">
                    {product.seller?.name}
                  </p>
                </div>
              </div>
              <div className="bg-background p-4 rounded-2xl border border-white/5 flex items-center gap-3 shadow-lg">
                <Calendar size={20} className="text-purple-500" />
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">
                    Released
                  </p>
                  <p className="text-xs font-bold">
                    {new Date(
                      product.createdAt?.$date || product.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              {cart.find((i) => i._id === product._id) ? (
                <button className="w-full bg-green-600 cursor-default py-5 rounded-2xl font-black text-xl italic tracking-tighter flex items-center justify-center gap-3 shadow-2xl shadow-green-500/20">
                  ALREADY IN CART
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-purple-600 hover:bg-purple-500 py-5 rounded-2xl font-black text-xl italic tracking-tighter transition-all shadow-2xl shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  ADD TO CART
                </button>
              )}

              <div className="flex items-center justify-center gap-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" /> Instant
                  Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" /> Verified
                  Files
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mt-24 max-w-4xl">
            <div className="flex items-center gap-3 mb-10">
              <MessageCircle className="text-purple-500" size={28} />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
                Frequently Asked{" "}
                <span className="text-purple-500">Questions</span>
              </h2>
            </div>

            <div className="space-y-4">
              {product.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center group outline-none"
                  >
                    <span className="font-bold text-lg md:text-xl text-foreground group-hover:text-purple-400 transition-colors">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp
                        className="text-purple-500 shrink-0"
                        size={24}
                      />
                    ) : (
                      <ChevronDown
                        className="text-gray-500 shrink-0"
                        size={24}
                      />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="border-t border-white/5 pt-4 text-forground text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
