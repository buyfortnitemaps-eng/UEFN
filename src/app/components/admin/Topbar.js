/* eslint-disable @next/next/no-img-element */

"use client";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ setIsMobileMenuOpen }) => {
  const { user, mongoUser } = useAuth();

  return (
    <header className="h-20 bg-background/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* Search & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="lg:hidden p-2.5 bg-background rounded-xl text-gray-400 hover:text-foreground transition-colors"
        >
          <Menu size={22} />
        </button>
        
        <div className="hidden md:flex items-center bg-white/2 border border-white/5 px-4 py-2.5 rounded-2xl w-80 group focus-within:border-purple-500/50 transition-all">
          <Search size={18} className="text-gray-500 group-focus-within:text-purple-500" />
          <input 
            type="text" 
            placeholder="Search analytics, users..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-3 text-foreground placeholder:text-gray-600 font-medium" 
          />
        </div>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="hidden sm:flex p-2.5 bg-white/2 hover:bg-background border border-white/5 rounded-xl text-gray-400 relative transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0a0a0b]" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-border-color group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-foreground tracking-tight">{mongoUser?.name || "Admin"}</p>
            <p className="text-[10px] text-purple-500 font-black uppercase tracking-[0.2em] opacity-80">
              {mongoUser?.role || "Manager"}
            </p>
          </div>
          
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 p-0.5 shadow-lg shadow-purple-900/20 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-card-bg rounded-[14px] overflow-hidden">
                <img 
                  src={user?.photoURL || "/default-avatar.png"} 
                  alt="Admin" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a0b] rounded-full" />
          </div>
          <ChevronDown size={16} className="text-gray-500 hidden sm:block group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;