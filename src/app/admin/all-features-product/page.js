/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit3, StarOff, Zap } from "lucide-react";
import { auth } from "../../../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminOnly from "../../components/admin/OnlyAdmin";
import EditFeaturedProductModal from "../../components/admin/EditFeaturedProductModal"; // Modal Import
import DowngradeToProductModal from "../../components/admin/DowngradeToProductModal"; // Modal Import

const FeaturedProducts = () => {
  const { user, mongoUser } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchFeatured = async () => {
    const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/products/featured");
    const data = await res.json();
    setFeaturedProducts(data.data);
  };

  const fetchCategories = async () => {
    const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/categories");
    const data = await res.json();
    setCategories(data.data);
  };

  useEffect(() => {
    fetchFeatured();
    fetchCategories();
  }, []);

  // Delete Function
 const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will permanently delete the featured asset!")) return;

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `https://uefn-maps-server.vercel.app/api/v1/products/featured/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        // ১. স্টেট থেকে ডিলিট হওয়া প্রোডাক্টটি সাথে সাথে ফিল্টার করে বাদ দিন (অটো আপডেট হবে)
        setFeaturedProducts((prevProducts) => 
          prevProducts.filter((product) => product._id !== id)
        );
        
        // ২. চাইলে ব্যাকগ্রাউন্ডে একবার রিফেচ করতে পারেন (ঐচ্ছিক)
        // fetchFeatured(); 

        alert("Featured asset deleted successfully! ✅");
      } else {
        alert(`Error: ${data.message || "Failed to delete asset"}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong. Please check your internet connection.");
    }
  };

  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Featured <span className="text-yellow-500">Spotlight</span>
        </h2>
        <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20 flex items-center gap-2">
          <Zap size={16} fill="currentColor" />
          <span className="text-xs font-black uppercase tracking-widest">
            Featured Assets
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
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
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    alt=""
                  />
                  <span className="font-bold text-gray-200">
                    {product.title}
                  </span>
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      product.featureTag === "premium"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : product.featureTag === "trending"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    {product.featureTag}
                  </span>
                </td>
                <td className="p-6 font-mono text-yellow-500 font-bold">
                  ${product.price}
                </td>
                <td className="p-6 text-right space-x-2">
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsDowngradeModalOpen(true);
                    }}
                    className="p-3 bg-white/5 hover:bg-orange-600/20 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                    title="Move to Normal Product"
                  >
                    <StarOff size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsEditModalOpen(true);
                    }}
                    className="p-3 bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-500 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-3 bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* // Modal Rendering: */}
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

export default FeaturedProducts;
