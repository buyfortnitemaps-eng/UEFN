"use client";
import React from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  PlusSquare,
  Settings,
  LogOut,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdProductionQuantityLimits } from "react-icons/md";

const SidebarContent = ({ setIsMobileMenuOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/dashboard",
    },
    { name: "All Users", icon: <Users size={20} />, href: "/admin/users" },
    {
      name: "Add Category",
      icon: <Layers size={20} />,
      href: "/admin/add-category",
    },
    {
      name: "Add Product",
      icon: <PlusSquare size={20} />,
      href: "/admin/add-product",
    },
    {
      name: "All Products",
      icon: <MdProductionQuantityLimits size={20} />,
      href: "/admin/all-product",
    },
    {
      name: "All Featured Products",
      icon: <MdProductionQuantityLimits size={20} />,
      href: "/admin/all-features-product",
    },
    {
      name: "All Messages",
      icon: <MdProductionQuantityLimits size={20} />,
      href: "/admin/all-message",
    },
    {
      name: "Chat",
      icon: <MdProductionQuantityLimits size={20} />,
      href: "/admin/chat",
    },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <Gamepad2 className="text-purple-500 shrink-0" size={28} />
        <span className="ml-3 font-black tracking-tighter text-xl uppercase italic text-white">
          Admin<span className="text-purple-500">Panel</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <div
              className={`flex items-center p-3.5 rounded-2xl transition-all group ${
                pathname === item.href
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="ml-3 font-bold text-sm tracking-wide">
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/5 shrink-0">
        <button
          onClick={() => handleSignOut()}
          className="flex items-center w-full p-4 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span className="ml-3">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarContent;
