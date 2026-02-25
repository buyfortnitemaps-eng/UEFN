/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit3, StarOff, Zap } from "lucide-react";
import { auth } from "../../../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminOnly from "../../components/admin/OnlyAdmin";
import EditFeaturedProductModal from "../../components/admin/EditFeaturedProductModal";
import DowngradeToProductModal from "../../components/admin/DowngradeToProductModal";

const FeaturedProducts = () => {
  const { user, mongoUser } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchFeatured = async () => {
    const res = await fetch(
      "https://uefn-maps-server.onrender.com/api/v1/products/featured",
    );
    const data = await res.json();
    const sortedData = (data.data || []).reverse();
    setFeaturedProducts(sortedData);
  };

  const fetchCategories = async () => {
    const res = await fetch(
      "https://uefn-maps-server.onrender.com/api/v1/categories",
    );
    const data = await res.json();
    setCategories(data.data);
  };

  useEffect(() => {
    fetchFeatured();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm("Are you sure? This will permanently delete the featured asset!")
    )
      return;

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `https://uefn-maps-server.onrender.com/api/v1/products/featured/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setFeaturedProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id),
        );
        alert("Featured asset deleted successfully! ✅");
      } else {
        alert(`Error: ${data.message || "Failed to delete asset"}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong.");
    }
  };

  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 md:p-6 text-foreground min-h-screen">
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
          Featured <span className="text-yellow-500">Spotlight</span>
        </h2>
        <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20 flex items-center gap-2 self-start md:self-center">
          <Zap size={14} fill="currentColor" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
            Featured Assets: {featuredProducts.length}
          </span>
        </div>
      </div>

      {/* Desktop Table View (Visible only on md screens and up) */}
      <div className="hidden md:block  border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Asset
              </th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Tag Type
              </th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Price
              </th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Type
              </th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {featuredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-white/3 transition-colors group"
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
                  <TagBadge tag={product.featureTag} />
                </td>
                <td className="p-6 font-mono text-yellow-500 font-bold">
                  ${product.price}
                </td>
                <td className="p-6 font-mono text-yellow-500 font-bold">
                  {product.gameType?.name}
                </td>
                <td className="p-6 text-right space-x-2">
                  <ActionButton
                    icon={<StarOff size={18} />}
                    color="orange"
                    title="Downgrade"
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsDowngradeModalOpen(true);
                    }}
                  />
                  <ActionButton
                    icon={<Edit3 size={18} />}
                    color="blue"
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsEditModalOpen(true);
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

      {/* Mobile Card View (Visible only on small screens) */}
      <div className="md:hidden space-y-4">
        {featuredProducts.map((product) => (
          <div
            key={product._id}
            className=" border border-white/5 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden"
          >
            {/* Background Glow for Premium/Trending */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 pointer-events-none ${
                product.featureTag === "premium"
                  ? "bg-blue-500"
                  : product.featureTag === "trending"
                    ? "bg-orange-500"
                    : "bg-yellow-500"
              }`}
            />

            <div className="flex gap-4 items-center mb-5">
              <img
                src={product.image?.url}
                className="w-16 h-16 rounded-2xl object-cover border border-white/5"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate text-lg">
                  {product.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <TagBadge tag={product.featureTag} />
                  <span className="text-sm font-mono font-black text-yellow-500">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MobileActionBtn
                icon={<StarOff size={16} />}
                label="Downgrade"
                color="orange"
                onClick={() => {
                  setCurrentProduct(product);
                  setIsDowngradeModalOpen(true);
                }}
              />
              <MobileActionBtn
                icon={<Edit3 size={16} />}
                label="Edit"
                color="blue"
                onClick={() => {
                  setCurrentProduct(product);
                  setIsEditModalOpen(true);
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
      {isEditModalOpen && (
        <EditFeaturedProductModal
          product={currentProduct}
          onClose={() => setIsEditModalOpen(false)}
          refresh={fetchFeatured}
        />
      )}

      {isDowngradeModalOpen && (
        <DowngradeToProductModal
          product={currentProduct}
          onClose={() => setIsDowngradeModalOpen(false)}
          refresh={fetchFeatured}
          categories={categories}
        />
      )}
    </div>
  );
};

// --- Sub-components for better reusability ---

const TagBadge = ({ tag }) => {
  const styles = {
    premium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    trending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    default: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  const currentStyle = styles[tag] || styles.default;
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentStyle}`}
    >
      {tag}
    </span>
  );
};

const ActionButton = ({ icon, color, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-3  hover:bg-${color}-600/20 text-gray-400 hover:text-${color}-500 rounded-xl transition-all inline-flex items-center justify-center`}
  >
    {icon}
  </button>
);

const MobileActionBtn = ({ icon, label, color, onClick }) => {
  const colorStyles = {
    orange:
      "text-orange-500 border-orange-500/10 bg-orange-500/5 hover:bg-orange-500/10",
    blue: "text-blue-500 border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10",
    red: "text-red-500 border-red-500/10 bg-red-500/5 hover:bg-red-500/10",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all active:scale-95 ${colorStyles[color]}`}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </button>
  );
};

export default FeaturedProducts;
