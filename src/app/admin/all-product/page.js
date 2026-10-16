/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Edit3, Trash2, Filter, Star } from "lucide-react";
import { auth } from "../../../../firebase";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { useAuth } from "../../context/AuthContext";
import EditProductModal from "../../components/admin/EditProductModal";
import { adminApiUrl } from "../../lib/runtime-config";
import { publicCatalogUrl } from "../../lib/catalog-client.mjs";

const AllProducts = () => {
  const { user, mongoUser, loading, profileLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsOwner, setProductsOwner] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [productToUpgrade, setProductToUpgrade] = useState(null);
  const [featureTag, setFeatureTag] = useState("featured");

const handleUpgrade = async () => {
    const token = await auth.currentUser.getIdToken();
    try {
        const res = await fetch(
            `https://uefn-maps-server.vercel.app/api/v1/products/upgrade/${productToUpgrade._id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ tag: featureTag }),
            },
        );

        const data = await res.json(); // ব্যাকএন্ড থেকে রেসপন্স ডাটা নেয়া

        if (res.ok) {
            alert("Success! Product copied to Featured list.");
            setIsUpgradeModalOpen(false);
            fetchProducts();
        } else {
            // 🔥 ব্যাকএন্ড থেকে আসা সুনির্দিষ্ট এরর মেসেজ দেখানো (যেমন: Already Featured)
            alert(data.message || "Something went wrong. Please try again.");
        }
    } catch (error) {
        console.error("Upgrade failed", error);
        alert("Connection failed! Please check your internet or server.");
    }
};

  const fetchProducts = useCallback(() => {
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (loading || profileLoading || !user || mongoUser?.role !== "admin") return;

    const controller = new AbortController();
    let cancelled = false;
    let timedOut = false;
    const uid = user.uid;
    const isCurrentUser = () => !cancelled && auth.currentUser?.uid === uid;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 30000);

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");
      try {
        if (!isCurrentUser()) return;
        let rejectTokenOnAbort;
        const tokenAborted = new Promise((_, reject) => {
          rejectTokenOnAbort = () => reject(new Error("Asset loading was cancelled."));
          if (controller.signal.aborted) rejectTokenOnAbort();
          else controller.signal.addEventListener("abort", rejectTokenOnAbort, { once: true });
        });
        let token;
        try {
          token = await Promise.race([
            Promise.resolve().then(() => user.getIdToken()),
            tokenAborted,
          ]);
        } finally {
          controller.signal.removeEventListener("abort", rejectTokenOnAbort);
        }
        if (!isCurrentUser()) return;
        const res = await fetch(adminApiUrl("products/all-products"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error("Your session expired. Sign in again to load your assets.");
          if (res.status === 403) throw new Error("Your account does not have permission to load these assets.");
          throw new Error(`Could not load assets (HTTP ${res.status}). Please try again.`);
        }
        const data = await res.json().catch(() => null);
        if (data?.success !== true || !Array.isArray(data.data) ||
          data.data.some((product) => !product || typeof product._id !== "string")) {
          throw new Error("The server returned an invalid asset list. Please try again.");
        }
        if (!isCurrentUser()) return;
        setProducts([...data.data].reverse());
        setProductsOwner(uid);
      } catch (error) {
        if (!isCurrentUser()) return;
        setProductsError(timedOut
          ? "Loading assets timed out. Please try again."
          : error.message || "Could not load assets. Please try again.");
      } finally {
        clearTimeout(timeout);
        if (isCurrentUser()) setProductsLoading(false);
      }
    };
    loadProducts();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [user, mongoUser?.role, loading, profileLoading, refreshCount]);

  useEffect(() => {
    if (loading || profileLoading || !user || mongoUser?.role !== "admin") return;
    const controller = new AbortController();
    let cancelled = false;
    const timeout = setTimeout(() => controller.abort(), 15000);
    const loadCategories = async () => {
      setCategoriesError("");
      try {
        const res = await fetch(publicCatalogUrl("categories"), { signal: controller.signal });
        if (!res.ok) throw new Error("Category filters are temporarily unavailable.");
        const data = await res.json().catch(() => null);
        if (!Array.isArray(data?.data)) throw new Error("Category filters are temporarily unavailable.");
        if (!cancelled) setCategories(data.data);
      } catch {
        if (!cancelled) setCategoriesError("Category filters are temporarily unavailable. Refresh to try again.");
      } finally {
        clearTimeout(timeout);
      }
    };
    loadCategories();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [user, mongoUser?.role, loading, profileLoading, refreshCount]);

  const filteredProducts = useMemo(() => {
    if (productsOwner !== user?.uid) return [];
    return selectedCategory === "all"
      ? products
      : products.filter((product) => product.category?._id === selectedCategory);
  }, [products, productsOwner, user?.uid, selectedCategory]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? Image will also be deleted!")) return;
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(
      `https://uefn-maps-server.vercel.app/api/v1/products/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) fetchProducts();
  };

  if (loading || profileLoading || !user || mongoUser?.role !== "admin") return <AdminOnly />;

  return (
    <div className="max-w-7xl mt-10 mx-auto p-4 md:p-6 text-foreground min-h-screen">
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
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
          Manage <span className="text-purple-500">Assets</span>
        </h2>

        <div className="flex items-center w-full md:w-auto gap-3 bg-background p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
          <Filter size={18} className="ml-2 text-purple-500 shrink-0" />
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className=" outline-none p-2 text-xs md:text-sm font-bold uppercase tracking-widest cursor-pointer w-full"
          >
            <option value="all" className="bg-background">
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-background">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={fetchProducts}
          disabled={productsLoading}
          className="rounded-xl border border-purple-500/30 px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          {productsLoading ? "Loading assets..." : "Refresh assets"}
        </button>
        {productsLoading && <p role="status">Loading the latest saved assets...</p>}
        {productsError && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p>{productsError}</p>
            {productsOwner === user.uid && products.length > 0 && (
              <p className="mt-1 text-sm">The last loaded assets are shown below and may be out of date.</p>
            )}
            <button type="button" onClick={fetchProducts} className="mt-2 font-bold underline">Try again</button>
          </div>
        )}
        {categoriesError && <p role="status" className="text-sm">{categoriesError}</p>}
        {!productsLoading && !productsError && productsOwner === user.uid && filteredProducts.length === 0 && (
          <p role="status">{selectedCategory === "all" ? "No assets have been saved yet." : "No assets match this category."}</p>
        )}
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block border border-white/5 rounded-4xl overflow-hidden backdrop-blur-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="">
            <tr>
              <th className="p-6 text-xs font-black uppercase text-forground">
                Asset
              </th>
              <th className="p-6 text-xs font-black uppercase text-forground">
                Category
              </th>
              <th className="p-6 text-xs font-black uppercase text-forground">
                Price
              </th>
              <th className="p-6 text-xs font-black uppercase text-forground">
                Type
              </th>
              <th className="p-6 text-xs font-black uppercase text-forground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="p-6 flex items-center gap-4">
                  <img
                    src={product.image?.url}
                    className="w-12 h-12 rounded-xl object-cover border border-white/5"
                    alt=""
                  />
                  <span className="font-bold text-foreground">
                    {product.title}
                  </span>
                </td>
                <td className="p-6">
                  <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                    {product?.category?.name}
                  </span>
                </td>
                <td className="p-6 font-mono text-purple-400 font-bold">
                  ${product.price}
                </td>
                <td className="p-6 font-mono text-purple-400 font-bold">
                  {product.gameType?.name}
                </td>
                <td className="p-6 text-right space-x-2">
                  <ActionButton
                    icon={<Star size={18} />}
                    color="yellow"
                    onClick={() => {
                      setProductToUpgrade(product);
                      setIsUpgradeModalOpen(true);
                    }}
                    title="Upgrade"
                  />
                  <ActionButton
                    icon={<Edit3 size={18} />}
                    color="blue"
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsModalOpen(true);
                    }}
                  />
                  <ActionButton
                    icon={<Trash2 size={18} />}
                    color="red"
                    onClick={() => handleDelete(product._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Hidden on Desktop) */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className=" border border-white/5 rounded-3xl p-5 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={product.image?.url}
                className="w-16 h-16 rounded-2xl object-cover border border-white/5 shadow-lg"
                alt=""
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-foreground truncate">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest leading-none">
                    {product?.category?.name}
                  </span>
                  <span className="text-sm font-mono font-bold text-purple-400 leading-none">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MobileActionBtn
                icon={<Star size={16} />}
                label="Feature"
                color="yellow"
                onClick={() => {
                  setProductToUpgrade(product);
                  setIsUpgradeModalOpen(true);
                }}
              />
              <MobileActionBtn
                icon={<Edit3 size={16} />}
                label="Edit"
                color="blue"
                onClick={() => {
                  setCurrentProduct(product);
                  setIsModalOpen(true);
                }}
              />
              <MobileActionBtn
                icon={<Trash2 size={16} />}
                label="Delete"
                color="red"
                onClick={() => handleDelete(product._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {isModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          refresh={fetchProducts}
          categories={categories}
        />
      )}

      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-background border-t md:border border-white/5 p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-black uppercase mb-2 leading-none">
              Upgrade Asset
            </h3>
            <p className="text-forground text-sm mb-6 font-medium">
              Spotlight category for{" "}
              <span className="text-purple-400 italic">
                {productToUpgrade?.title}
              </span>
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                  Feature Type
                </label>
                <select
                  value={featureTag}
                  onChange={(e) => setFeatureTag(e.target.value)}
                  className="w-full bg-background border border-white/5 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all appearance-none font-bold text-sm"
                >
                  <option value="featured" className="bg-background">
                    Featured Asset
                  </option>
                  <option value="premium" className="bg-background">
                    Premium Selection
                  </option>
                  <option value="bundle" className="bg-background">
                    Bundle
                  </option>
                </select>
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-3 mt-4">
                <button
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-xs border border-white/5 hover:bg-background transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-xs bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-500/20 transition-all"
                >
                  Confirm Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components for Cleaner Code
const ActionButton = ({ icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-3 bg-background hover:bg-${color}-600/20 text-forground hover:text-${color}-500 rounded-xl transition-all`}
  >
    {icon}
  </button>
);

const MobileActionBtn = ({ icon, label, color, onClick }) => {
  const colors = {
    yellow: "hover:bg-yellow-600/20 text-yellow-500/80 border-yellow-500/10",
    blue: "hover:bg-blue-600/20 text-blue-500/80 border-blue-500/10",
    red: "hover:bg-red-600/20 text-red-500/80 border-red-500/10",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl bg-background border ${colors[color]} transition-all active:scale-95`}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </button>
  );
};

export default AllProducts;
