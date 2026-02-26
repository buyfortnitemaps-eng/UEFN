/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Wallet,
  Home,
  Store,
  UserCircle,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../lib/CartContext";
import { logOut } from "../../lib/firebaseActions";
import ThemeToggle from "../../utils/them-toggle";
import { HiMiniShoppingBag } from "react-icons/hi2";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const { user, mongoUser } = useAuth();
  const { cart, setCart } = useCart();

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 0) {
        setIsSearching(true);
        try {
          const res = await fetch(
            `https://uefn-maps-server.vercel.app/api/v1/products/search-product?search=${searchQuery}`,
          );
          const data = await res.json();
          setSearchResults(data.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchQuery("");
  }, [pathname]);

  const handleNavbarSignOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("uefn_cart");
      if (setCart) setCart([]);
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "Shop", href: "/marketplace", icon: <Store size={20} /> },
    { name: "About", href: "/portfolio", icon: <UserCircle size={20} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-100 bg-bg-gradiend backdrop-blur-xl border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 relative z-130"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
            <HiMiniShoppingBag className="text-white" size={22} />
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter text-foreground ">
            UEFN<span className="text-purple-500">MAP</span>
          </span>
        </Link>

        {/* --- Global Search Bar --- */}
        <div className="relative flex-1 max-w-md group">
          {/* সার্চ ইনপুট কন্টেইনার */}
          <div className="relative flex items-center h-10 w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/50 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <Search
              className="absolute left-3 text-white/40 group-focus-within:text-purple-400 transition-colors"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."   className="w-full h-full pl-10 pr-4 text-sm text-white placeholder:text-forground outline-none transition-all border border-border-color rounded-2xl"
            />
          </div>

          {/* সার্চ রেজাল্ট ড্রপডাউন */}
          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }} className="fixed md:absolute top-17.5 md:top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-3 w-[calc(100vw-2rem)] md:w-112.5 bg-linear-to-b from-[#1e1b4b] via-[#1e1b4b] to-[#0f172a] border border-white/10 backdrop-blur-3xl rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-999"
              >
                <div className="max-h-[65vh] md:max-h-125 overflow-y-auto custom-scrollbar p-2 md:p-3">
                  {isSearching ? (
                    <div className="p-12 flex flex-col items-center gap-4">
                      <Loader2
                        className="animate-spin text-purple-400"
                        size={32}
                      />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300/60">
                        Searching Database...
                      </p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid gap-1.5 w-full">
                      {searchResults.map((item) => (
                        <Link
                          key={item._id}
                          onClick={() => setSearchQuery("")} // ক্লিক করলে ড্রপডাউন বন্ধ হবে
                          href={
                            item.featureTag
                              ? `/pages/featured/${item._id}`
                              : `/marketplace/${item._id}`
                          }
                          className="flex items-center gap-4 p-3 hover:bg-white/10 border border-white/5 md:border-transparent md:hover:border-white/10 rounded-xl transition-all group w-full"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5 shadow-lg">
                            <img
                              src={item.image?.url}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={item.title}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm md:text-base font-bold text-white truncate uppercase italic tracking-wide group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs md:text-sm text-purple-400 font-black">
                                ${item.price}
                              </span>
                              {item.featureTag && (
                                <span className="text-[9px] py-0.5 px-2 bg-purple-600 text-white rounded-md uppercase font-black shadow-lg">
                                  {item.featureTag}
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight
                            className="text-white/20 group-hover:text-purple-400 transition-colors"
                            size={18}
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest">
                        No matching results.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Right Side Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-muted-foreground hover:text-purple-500 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}

            {/* Desktop Admin & My Assets Logics */}
            {user && (
              <>
                <Link
                  href="/my-assets"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
                >
                  My Assets
                </Link>
                {mongoUser?.role === "admin" && (
                  <Link
                    href="/admin/all-order"
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4 border-l border-border-color pl-6">
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground"
            >
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-purple-500/50 overflow-hidden shrink-0">
                  <img
                    src={user.photoURL || "/profile.jpg"}
                    className="w-full h-full object-cover"
                    alt="User"
                  />
                </div>
                <button
                  onClick={handleNavbarSignOut}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login">
                <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2 relative z-130">
          <Link href="/cart" className="relative p-2 text-muted-foreground">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full text-[9px] flex items-center justify-center text-white font-black">
                {cart.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground bg-card-bg rounded-lg border border-border-color"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/90 backdrop-blur-md z-110 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 w-[80%] max-w-xs h-screen bg-background z-120 md:hidden border-l border-border-color shadow-2xl flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-6 pt-24 space-y-8">
                {user && (
                  <div className="flex items-center gap-4 p-4 bg-card-bg rounded-2xl border border-border-color">
                    <img
                      src={user.photoURL || "/profile.jpg"}
                      className="w-12 h-12 rounded-full border-2 border-purple-500"
                      alt=""
                    />
                    <div className="overflow-hidden">
                      <p className="text-foreground font-bold truncate text-sm">
                        {user.displayName || "Gamer"}
                      </p>
                      <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest">
                        {mongoUser?.role || "Member"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                    Explorer
                  </p>
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center justify-between p-4 rounded-xl text-foreground/70 hover:text-purple-500 hover:bg-purple-500/5 group transition-all"
                      >
                        <div className="flex items-center gap-4 font-bold text-sm">
                          <span className="opacity-50 group-hover:opacity-100">
                            {link.icon}
                          </span>
                          {link.name}
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                    ))}
                  </div>
                </div>

                {user && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                      Workspace
                    </p>
                    <div className="space-y-1">
                      <Link
                        href="/my-assets"
                        className="flex items-center gap-4 p-4 rounded-xl text-purple-400 hover:bg-purple-500/5 font-bold text-sm"
                      >
                        <Wallet size={20} /> My Assets
                      </Link>
                      {mongoUser?.role === "admin" && (
                        <Link
                          href="/admin/all-order"
                          className="flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/5 font-bold text-sm"
                        >
                          <LayoutDashboard size={20} /> Admin Panel
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className="pt-4">
                  <ThemeToggle />
                </div>
              </div>

              <div className="p-6 mt-auto border-t border-border-color/50">
                {user ? (
                  <button
                    onClick={handleNavbarSignOut}
                    className="w-full flex items-center justify-center gap-3 bg-red-600/10 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest border border-red-500/20 active:scale-95 transition-all text-xs"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                ) : (
                  <Link href="/auth/login" className="block">
                    <button className="w-full bg-purple-600 py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg text-sm">
                      Login / Sign Up
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
