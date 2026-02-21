/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { X, ArrowDownCircle, Loader2 } from "lucide-react";
import { auth } from "../../../../firebase";

const DowngradeToProductModal = ({ product, onClose, refresh, categories }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?._id || "");

  const handleDowngrade = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`https://uefn-maps-server.vercel.app/api/v1/products/backgrade/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryId: selectedCategory }),
      });

      if (res.ok) {
        alert("Asset moved back to main collection!");
        refresh();
        onClose();
      }
    } catch (err) {
      alert("Failed to move asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0d0d0f] border border-white/10 w-full max-w-sm rounded-4xl p-8">
        <h2 className="text-lg font-black uppercase mb-6 italic">Restore to Normal</h2>
        <label className="text-[10px] font-black uppercase text-gray-500">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-2 outline-none mb-6"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id} className="bg-[#0d0d0f]">{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 font-bold uppercase text-[10px] border border-white/10 rounded-xl">Cancel</button>
          <button onClick={handleDowngrade} disabled={loading} className="flex-1 bg-white text-black py-3 font-bold uppercase text-[10px] rounded-xl flex justify-center items-center">
             {loading ? <Loader2 className="animate-spin" size={14} /> : "Confirm Move"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default DowngradeToProductModal;