/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { Edit3, Trash2, Filter } from "lucide-react";
import { auth } from "../../../../firebase";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { useAuth } from "../../context/AuthContext";
import EditProductModal from "../../components/admin/EditProductModal";

const AllProducts = () => {
  const { user, mongoUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/products");
    const data = await res.json();
    setProducts(data.data);
    setFilteredProducts(data.data);
  };

  const fetchCategories = async () => {
    const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/categories");
    const data = await res.json();
    setCategories(data.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ক্যাটাগরি ফিল্টার লজিক
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category._id === selectedCategory),
      );
    }
  }, [selectedCategory, products]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? Image will also be deleted!")) return;
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(`https://uefn-maps-server.vercel.app/api/v1/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchProducts();
  };

  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">
          Manage <span className="text-purple-500">Assets</span>
        </h2>

        {/* Filter Section */}
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <Filter size={18} className="ml-3 text-purple-500" />
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent outline-none p-2 text-sm font-bold uppercase tracking-widest cursor-pointer"
          >
            <option value="all" className="bg-[#0d0d0f]">
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[#0d0d0f]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Asset
              </th>
              <th className="p-6 text-xs font-black uppercase text-gray-400">
                Category
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
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="p-6 flex items-center gap-4">
                  <img
                    src={product.image.url}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    alt=""
                  />
                  <span className="font-bold text-gray-200">
                    {product.title}
                  </span>
                </td>
                <td className="p-6">
                  <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                    {product.category.name}
                  </span>
                </td>
                <td className="p-6 font-mono text-purple-400 font-bold">
                  ${product.price}
                </td>
                <td className="p-6 text-right space-x-2">
                  <button
                    onClick={() => {
                      setCurrentProduct(product);
                      setIsModalOpen(true);
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

      {/* Update Modal (Simplified logic) */}
      {/* Update Modal */}
      {isModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          refresh={fetchProducts}
          categories={categories} // এই লাইনটি যোগ করুন
        />
      )}
    </div>
  );
};

export default AllProducts;
