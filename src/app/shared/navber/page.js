/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Gamepad2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../lib/CartContext"; // কার্ট হুক ইমপোর্ট করুন
import { logOut } from "../../lib/firebaseActions"; // সরাসরি ফায়ারবেস অ্যাকশন নিন

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, mongoUser } = useAuth();
  const { cart, setCart } = useCart(); // কার্ট স্টেট নিন

  // সাইন-আউট হ্যান্ডলার সরাসরি এখানেই লিখুন যাতে হুক এরর না হয়
const handleNavbarSignOut = async () => {
    try {
      // ১. প্রথমে ফায়ারবেস থেকে লগআউট করা
      await logOut();

      // ২. লোকাল স্টোরেজ থেকে কার্ট ডাটা রিমুভ করা
      localStorage.removeItem("uefn_cart");

      // ৩. কার্ট স্টেটটি খালি করা (setCart অবশ্যই useCart হুক থেকে আসতে হবে)
      if (setCart) {
        setCart([]);
      }

      // ৪. ইউজারকে লগইন পেজে পাঠিয়ে দেওয়া
      router.push("/auth/login");
      
      // ৫. অপশনাল: পেজটি একবার রিফ্রেশ করা যাতে সব স্টেট রিসেট হয়
      // window.location.reload(); 
      
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            MAGRIL<span className="text-purple-500">UEFN</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <Link
              href="/my-assets"
              className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              My Assets
            </Link>
          )}

          {user && mongoUser?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}

          {/* --- Shopping Cart Badge --- */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors group"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0b] group-hover:scale-110 transition-transform">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/50 overflow-hidden ring-2 ring-purple-500/10">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleNavbarSignOut}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all text-white shadow-lg shadow-purple-500/20 active:scale-95">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-gray-400">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {cart.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-bold text-gray-400 hover:text-purple-500"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="border-white/5" />

              {user ? (
                <button
                  onClick={handleNavbarSignOut}
                  className="w-full bg-red-600/10 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest border border-red-500/20"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg shadow-purple-500/30">
                    Get Started
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
