// /* eslint-disable @next/next/no-img-element */
// "use client";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ShoppingCart, Sparkles, ArrowRight, Search } from "lucide-react";
// import Link from "next/link";

// import { useCart } from "../../lib/CartContext";
// import LoginAlertModal from "../../components/LoginAlertModal";
// import CartSuccessModal from "../../components/CartSuccessModal";
// import { useAuth } from "../../context/AuthContext";
// import ProductSkeleton from "../../components/productSclekton";

// const FeaturedSection = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [activeTag, setActiveTag] = useState("all");
//   const [searchQuery, setSearchQuery] = useState(""); // সার্চ স্টেট
//   const [loading, setLoading] = useState(true);

//   const { user } = useAuth();
//   const { addToCart, cart } = useCart();

//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [lastAddedItem, setLastAddedItem] = useState("");

//   const handleAddToCart = (product) => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }
//     addToCart(product);
//     setLastAddedItem(product.title);
//     setShowSuccessModal(true);
//   };

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       try {
//         const res = await fetch(
//           "https://uefn-maps-server.vercel.app/api/v1/products/featured",
//         );
//         const data = await res.json();
//         const sortedData = (data.data || []).reverse();
//         setProducts(sortedData);
//         setFilteredProducts(data.data || []);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeatured();
//   }, []);

//   // সার্চ এবং ট্যাগ ফিল্টারিং লজিক
//   useEffect(() => {
//     let result = products;

//     // ট্যাগ অনুযায়ী ফিল্টার
//     if (activeTag !== "all") {
//       result = result.filter((p) => p.featureTag === activeTag);
//     }

//     // সার্চ কুয়েরি অনুযায়ী ফিল্টার
//     if (searchQuery) {
//       result = result.filter((p) =>
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//     }

//     setFilteredProducts(result);
//   }, [activeTag, searchQuery, products]);

//   const tags = [
//     { id: "all", label: "All Assets" },
//     { id: "featured", label: "Featured" },
//     { id: "premium", label: "Premium" },
//     { id: "trending", label: "Trending" },
//   ];

//   return (
//     <section className="py-20 px-6 max-w-7xl mx-auto relative">
//       {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         {/* 1. DOT GRID BACKGROUND */}
//         <div
//           className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
//           style={{
//             backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
//             backgroundSize: "28px 28px",
//           }}
//         />

//         {/* 2. TOP GLOW LIGHT */}
//         <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />

//         {/* 3. BOTTOM GLOW LIGHT */}
//         <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
//       </div>
//       {/* Header & Filter Tabs */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 px-2">
//         {/* Left Side: Title & Info Text */}
//         <div className="max-w-xl">
//           <div className="flex items-center gap-2 mb-3">
//             <Sparkles size={20} className="text-yellow-500 shrink-0" />
//             <h2 className="text-xl md:text-2xl font-black text-foreground leading-tight italic uppercase tracking-tighter">
//               The most downloaded UEFN templates this week{" "}
//               <span className="text-purple-500">WITH</span>
//             </h2>
//           </div>
//           {/* আগের টেক্সটটি এখানে ফিরিয়ে আনা হয়েছে */}
//           <p className="text-muted-foreground text-[10px] md:text-xs font-black tracking-[0.2em] uppercase opacity-70">
//             PURCHASE MAP • VERSE • 3D ASSET • THUMBNAIL
//           </p>
//         </div>

//         {/* Right Side: Search Bar & Tags Filter */}
//         <div className="w-full lg:w-auto flex flex-col gap-4 lg:items-end lg:-translate-y-2">
//           {/* সার্চ বার এখন ট্যাগ ফিল্টারের ওপরে */}
//           <div className="relative w-full max-w-sm lg:max-w-70">
//             <Search
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="Search assets..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-card-bg border border-border-color rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:border-purple-500 outline-none transition-all text-foreground shadow-sm"
//             />
//           </div>

//           {/* Tags Filter */}
//           <div className="w-full lg:w-auto overflow-hidden">
//             <div className="flex bg-card-bg p-1.5 rounded-2xl border border-border-color backdrop-blur-md overflow-x-auto scrollbar-hide gap-1 shadow-sm">
//               {tags.map((tag) => (
//                 <button
//                   key={tag.id}
//                   onClick={() => setActiveTag(tag.id)}
//                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap active:scale-95 ${
//                     activeTag === tag.id
//                       ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
//                       : "text-muted-foreground hover:text-foreground hover:bg-white/5"
//                   }`}
//                 >
//                   {tag.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {loading ? (
//           [...Array(6)].map((_, index) => <ProductSkeleton key={index} />)
//         ) : (
//           <AnimatePresence mode="popLayout">
//             {filteredProducts.slice(0, 12).map((product) => (
//               <motion.div
//                 layout
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 key={product._id}
//                 className="glass-card rounded-[2.5rem] overflow-hidden group 
//                    border border-border-color hover:border-purple-500/50 
//                    transition-all duration-500 flex flex-col 
//                    hover:shadow-[0_20px_50px_-15px_rgba(147,51,234,0.3)] 
//                    hover:-translate-y-2 "
//               >
//                 {/* Image Section */}
//                 <Link
//                   href={`/pages/featured/${product._id}`}
//                   className="block h-56 relative overflow-hidden bg-gray-900"
//                 >
//                   <img
//                     src={product.image?.url}
//                     alt={product.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                     <span className="bg-white text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter">
//                       View Details
//                     </span>
//                   </div>
//                   <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase border backdrop-blur-md bg-white/10 text-foreground">
//                     {product.featureTag}
//                   </span>
//                 </Link>

//                 <div className="p-6">
//                   <Link href={`/pages/featured/${product._id}`}>
//                     <h3 className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors mb-2 line-clamp-1 italic uppercase tracking-tighter">
//                       {product.title}
//                     </h3>
//                   </Link>
//                   <p className="text-forground text-xs mb-6 h-12 leading-relaxed">
//                     {product.description?.length > 120
//                       ? `${product.description.slice(0, 120)}...`
//                       : product.description}
//                   </p>

//                   <div className="flex items-center justify-between border-t border-border-color pt-4">
//                     <div>
//                       <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">
//                         Price
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-black text-foreground">
//                           $
//                           {product.isDiscount
//                             ? product.discountPrice
//                             : product.price}
//                         </span>
//                         {product.isDiscount && (
//                           <span className="text-sm text-gray-500 line-through font-bold">
//                             ${product.price}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className={`p-4 rounded-2xl transition-all active:scale-90 ${
//                         cart.find((i) => i._id === product._id)
//                           ? "bg-green-600 shadow-lg shadow-green-600/20"
//                           : "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/20"
//                       }`}
//                     >
//                       <ShoppingCart size={20} className="text-foreground" />
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* Empty State */}
//       {!loading && filteredProducts.length === 0 && (
//         <div className="text-center py-20">
//           <p className="text-muted-foreground italic text-lg">
//             No assets found matching your search.
//           </p>
//         </div>
//       )}

//       {/* Modals & Buttons */}
//       <CartSuccessModal
//         isOpen={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         productName={lastAddedItem}
//       />
//       {showLoginModal && (
//         <LoginAlertModal onClose={() => setShowLoginModal(false)} />
//       )}

//       {!loading && !searchQuery && (
//         <div className="mt-16 text-center">
//           <Link href="/pages/featured/all-assets">
//             <button className="px-10 py-5 bg-purple-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-purple-500/10 text-foreground flex items-center gap-3 mx-auto group">
//               Explore All Assets{" "}
//               <ArrowRight
//                 size={14}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </button>
//           </Link>
//         </div>
//       )}
//     </section>
//   );
// };

// export default FeaturedSection;


import {  ArrowRight } from "lucide-react";
import Link from "next/link";
import ClientFeaturedContent from "./FeaturedSection"; // আমরা লজিকটি আলাদা ফাইলে নিয়ে যাব

// এই ফাংশনটি সার্ভার সাইডে ডেটা ফেচ করবে (ISR)
async function getFeaturedProducts() {
  const res = await fetch(
    "https://uefn-maps-server.vercel.app/api/v1/products/featured",
    {
      next: { revalidate: 60 }, // প্রতি ৬০ সেকেন্ড পর পর ডেটা আপডেট হবে (ISR)
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return (data.data || []).reverse();
}

const FeaturedSection = async () => {
  const initialProducts = await getFeaturedProducts();

  return (
    <div className=" pt-32 pb-24 px-6 transition-colors duration-300 bg-background">
      
    <section className="max-w-7xl mx-auto relative z-10">
      {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>


      {/* Filtering, Searching এবং Grid-এর জন্য আমরা একটি ক্লায়েন্ট কম্পোনেন্ট ব্যবহার করব 
          যাতে ISR-এর ডেটা পাস করে দেওয়া হবে।
      */}
      <ClientFeaturedContent initialProducts={initialProducts} />

      <div className="mt-16 text-center relative z-10">
        <Link href="/pages/featured/all-assets">
          <button className="px-10 py-5 bg-purple-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-purple-500/10 text-foreground flex items-center gap-3 mx-auto group">
            Explore All Assets{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </Link>
      </div>
    </section>
    </div>
  );
};

export default FeaturedSection;