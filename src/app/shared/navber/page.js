"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Gamepad2 } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    // { name: 'UEFN Assets', href: '/assets' },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
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
          <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <ShoppingBag size={20} />
          </button>
          <Link
            href="/auth/login"
          >
            <button className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-bold transition-all">
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden flex items-center gap-4">
          <button className="text-gray-400">
            <ShoppingBag size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {/* Toggle Icon with simple transition */}
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Animated Slide Down) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0b] border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-semibold text-gray-400 hover:text-purple-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              <button className="w-full bg-purple-600 py-4 rounded-xl font-bold text-lg">
                Login / Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
