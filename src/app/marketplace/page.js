/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useMemo } from "react"; // useMemo অ্যাড করা হয়েছে পারফরম্যান্সের জন্য
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ShoppingCart, ChevronDown } from "lucide-react";
import Image from "next/image";

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First"); // শর্টিং এর জন্য স্টেট

  const categories = ["All", "Maps", "3D Models", "Scripts", "Templates", "VFX"];

  const products = [
    { id: 1, title: "Neon City Kit", price: 29.99, size: "1.2GB", category: "Maps", img: "/p1.jpg" },
    { id: 2, title: "Verse Pro Scripts", price: 15.0, size: "50MB", category: "Scripts", img: "/p2.jpg" },
    { id: 3, title: "Sci-Fi Weapon Pack", price: 45.0, size: "3.5GB", category: "3D Models", img: "/p3.jpg" },
    { id: 4, title: "Racing System v2", price: 59.0, size: "800MB", category: "Templates", img: "/p4.jpg" },
    { id: 5, title: "Atmospheric VFX", price: 19.99, size: "200MB", category: "VFX", img: "/p5.jpg" },
    { id: 6, title: "Medieval Village", price: 89.0, size: "5.0GB", category: "Maps", img: "/p1.jpg" },
  ];

  // --- Filter & Sort Logic Starts ---
  const filteredAndSortedProducts = useMemo(() => {
    // ১. প্রথমে ফিল্টার করা
    let result = activeCategory === "All" 
      ? [...products] 
      : products.filter((p) => p.category === activeCategory);

    // ২. তারপর শর্ট করা
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    }
    // "Newest First" এর জন্য ডিফল্ট অ্যারে (আইডি অনুযায়ী) রাখতে পারেন

    return result;
  }, [activeCategory, sortBy]); 
  // --- Filter & Sort Logic Ends ---

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-28 pb-20 px-6">
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter">
              The <span className="text-purple-500 underline decoration-purple-500/30 underline-offset-8">Market</span>place
            </h1>
            <p className="text-gray-500 italic">High-end assets for your UEFN projects.</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-300" />
            <div className="relative flex items-center bg-[#0d0d0f] rounded-xl px-4 py-1 border border-white/10 w-full md:w-100">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full py-3 px-3 text-white placeholder:text-gray-600"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="flex items-center gap-2 font-bold mb-6 text-sm uppercase text-gray-400">
              <Filter size={16} className="text-purple-500" /> Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-3 rounded-lg text-xs font-bold transition-all text-left uppercase tracking-wider ${
                    activeCategory === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                      : "bg-white/5 text-gray-500 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sorting Dropdown */}
          <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
            <h4 className="font-bold mb-4 text-[10px] uppercase text-gray-500 flex items-center justify-between tracking-[0.2em]">
              Sort By <ChevronDown size={14} />
            </h4>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0a0a0b] border border-white/10 rounded-lg w-full text-xs py-2 px-2 text-gray-400 focus:outline-none focus:border-purple-500 cursor-pointer uppercase font-bold"
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product, idx) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group bg-white/2 border border-white/10 rounded-4xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 relative"
                >
                  <div className="h-56 relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-transparent to-transparent z-10 opacity-60" />
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-2 py-1 bg-purple-600/20 backdrop-blur-md border border-purple-500/30 text-purple-400 text-[10px] font-bold rounded uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 relative z-20">
                    <h3 className="text-lg font-bold text-white mb-6 group-hover:text-purple-400 transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
                          Price
                        </span>
                        <span className="text-2xl font-black text-white">
                          ${product.price}
                        </span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        className="bg-white text-black p-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-white/5 hover:shadow-purple-500/20"
                      >
                        <ShoppingCart size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;