/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Gamepad2, LogOut, LayoutDashboard, Wallet, Home, Store, UserCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../lib/CartContext";
import { logOut } from "../../lib/firebaseActions";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, mongoUser } = useAuth();
  const { cart, setCart } = useCart();

  // ইউআরএল চেঞ্জ হলে মোবাইল মেনু অটো বন্ধ হবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleNavbarSignOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("uefn_cart");
      if (setCart) setCart([]);
      setIsOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Marketplace", href: "/marketplace", icon: <Store size={20} /> },
    { name: "Portfolio", href: "/portfolio", icon: <UserCircle size={20} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-100 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group shrink-0 relative z-130">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            FORTNITE<span className="text-purple-500">UEFN</span>
          </span>
        </Link>

        {/* Desktop Menu (Visible on PC) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}

          {user && (
            <>
              <Link href="/my-assets" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                My Assets
              </Link>
              {mongoUser?.role === "admin" && (
                <Link href="/admin/dashboard" className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-6">
            <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all group">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0b]">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-purple-500/50 overflow-hidden">
                  <img src={user.photoURL || "/profile.jpg"} alt="User" className="w-full h-full object-cover" />
                </div>
                <button onClick={handleNavbarSignOut} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-500/5 rounded-lg transition-all">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Icons Area */}
        <div className="md:hidden flex items-center gap-4 relative z-130">
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
            className="text-white p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-110 md:hidden"
            />
            
            {/* Sidebar with Solid Dark Background */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-[80%] max-w-75 h-screen bg-[#0a0a0b] z-120 md:hidden border-l border-white/10 shadow-3xl flex flex-col pt-24"
            >
              <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                
                {/* User Info Section */}
                {user && (
                  <div className="mb-8 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <img src={user.photoURL || "/profile.jpg"} alt="User" className="w-12 h-12 rounded-full border-2 border-purple-500" />
                    <div className="overflow-hidden">
                      <p className="text-white font-bold truncate text-sm">{user.displayName || "Gamer"}</p>
                      <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest">{mongoUser?.role || "Member"}</p>
                    </div>
                  </div>
                )}

                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2 mb-4">Explorer</p>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className="flex items-center justify-between p-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 group transition-all"
                    >
                      <div className="flex items-center gap-4 font-bold text-sm">
                        <span className="text-gray-500 group-hover:text-purple-500">{link.icon}</span>
                        {link.name}
                      </div>
                      <ChevronRight size={16} className="text-gray-700" />
                    </Link>
                  ))}
                </div>

                <hr className="border-white/5 my-6" />

                {/* Account Links Section */}
                {user && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-2 mb-4">Workspace</p>
                    <Link href="/my-assets" className="flex items-center gap-4 p-4 rounded-xl text-purple-400 hover:bg-purple-500/5 font-bold text-sm group">
                      <Wallet size={20} /> My Assets
                    </Link>
                    {mongoUser?.role === "admin" && (
                      <Link href="/admin/dashboard" className="flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/5 font-bold text-sm">
                        <LayoutDashboard size={20} /> Admin Dashboard
                      </Link>
                    )}
                  </div>
                )}

                {/* Bottom Sign Out/Login Button */}
                <div className="mt-auto">
                  {user ? (
                    <button 
                      onClick={handleNavbarSignOut} 
                      className="w-full flex items-center justify-center gap-3 bg-red-600/10 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest border border-red-500/20 active:scale-95 transition-all text-xs"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  ) : (
                    <Link href="/auth/login" className="block">
                      <button className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all text-sm">
                        Login / Sign Up
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;