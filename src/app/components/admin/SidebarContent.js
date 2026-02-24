"use client";
import {
  LayoutDashboard,
  Layers,
  PlusSquare,
  ShoppingBag,
  Star,
  Mail,
  MessageCircleCode,
  Gamepad2,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarContent = ({ setIsMobileMenuOpen }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/dashboard",
    },
    {
      name: "All Order",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/all-order",
    },
    {
      name: "Add Category",
      icon: <Layers size={20} />,
      href: "/admin/add-category",
    },
    {
      name: "Add Game Type",
      icon: <Gamepad2 size={20} />,
      href: "/admin/add-game-type",
    },
    {
      name: "Add Product",
      icon: <PlusSquare size={20} />,
      href: "/admin/add-product",
    },
    {
      name: "All Products",
      icon: <ShoppingBag size={20} />, // প্রোডাক্টের জন্য শপিং ব্যাগ আইকন বেশি মানানসই
      href: "/admin/all-product",
    },
    {
      name: "All Featured Products",
      icon: <Star size={20} />, // Featured বা বিশেষ পণ্যের জন্য স্টার আইকন
      href: "/admin/all-features-product",
    },
    {
      name: "Portfolios",
      icon: <Layers size={20} />, // Portfolios এর জন্য লেয়ার আইকন
      href: "/admin/add-portfolio",
    },
    {
      name: "All Messages",
      icon: <Mail size={20} />, // সাধারণ ইনবক্স বা মেইল মেসেজের জন্য
      href: "/admin/all-message",
    },
    {
      name: "Chat",
      icon: <MessageCircleCode size={20} />, // লাইভ চ্যাটের জন্য বাবল আইকন
      href: "/admin/chat",
    },
    {
      name: "Legal Pages",
      icon: <Scale size={20} />,
      href: "/admin/legal",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <Gamepad2 className="text-purple-500 shrink-0" size={28} />
        <span className="ml-3 font-black tracking-tighter text-xl uppercase italic text-foreground">
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
                  ? "bg-purple-600 text-foreground shadow-lg shadow-purple-900/40"
                  : "text-gray-500 hover:bg-background hover:text-foreground"
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
    </div>
  );
};

export default SidebarContent;
