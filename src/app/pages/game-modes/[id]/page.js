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

  // কার্ট স্টেট এবং হুকসমূহ
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState("");

  // কার্টে অ্যাড করার ফাংশন
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
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-card-bg border border-border-color rounded-[2.5rem] overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
              >
                <Link
                  href={
                    product.featureTag
                      ? `/pages/featured/${product._id}`
                      : `/marketplace/${product._id}`
                  }
                  className="block h-60 overflow-hidden relative"
                >
                  <img
                    src={product.image?.url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.title}
                  />
                </Link>

                <div className="p-7">
                  <Link
                    href={
                      product.featureTag
                        ? `/pages/featured/${product._id}`
                        : `/marketplace/${product._id}`
                    }
                    className="block h-60 overflow-hidden relative"
                  >
                    <h3 className="text-xl font-black uppercase italic text-foreground mb-4 line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex justify-between items-center border-t border-border-color pt-5 mt-2">
                    <span className="text-2xl font-black text-foreground">
                      ${product.price}
                    </span>

                    {/* onClick হ্যান্ডলার যোগ করা হয়েছে */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`p-4 rounded-2xl transition-all active:scale-90 ${
                        cart.find((i) => i._id === product._id)
                          ? "bg-green-600 shadow-lg shadow-green-600/20"
                          : "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20"
                      }`}
                    >
                      <ShoppingCart size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-card-bg border-2 border-dashed border-border-color rounded-[3rem]">
              <Ghost
                size={60}
                className="text-muted-foreground mb-4 opacity-20"
              />
              <p className="text-muted-foreground font-black uppercase italic tracking-[0.3em]">
                No assets found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* মোডালগুলো নিচে অ্যাড করা হলো */}
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
