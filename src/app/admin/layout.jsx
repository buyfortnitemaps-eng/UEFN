/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080809] text-white flex">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Topbar setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-10 overflow-y-auto">
          {children} 
        </main>
      </div>
    </div>
  );
}