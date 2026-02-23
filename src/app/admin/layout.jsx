"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      {/* মোবাইল বাটন - এটি নেভবারে হাত না দিয়ে আলাদাভাবে থাকবে */}
      <div className="lg:hidden fixed top-20 left-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-900/40 active:scale-95 transition-all border border-white/10"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Component */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1">
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Backdrop: মেনু ওপেন থাকলে বাইরে ক্লিক করলে বন্ধ হবে */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}