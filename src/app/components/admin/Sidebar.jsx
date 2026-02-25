"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import SidebarContent from "./SidebarContent"; // ইম্পোর্ট করুন

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex flex-col w-68 border-r border-border-color bg-background sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    
      {/* Mobile Sidebar (Drawer) */}
      <motion.aside 
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-72 bg-background z-70 flex flex-col lg:hidden border-r border-border-color shadow-2xl"
      >
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 p-2 bg-background rounded-xl text-gray-400 z-50"
        >
          <X size={20} />
        </button>
        <SidebarContent setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </motion.aside>
    </>
  );
};

export default Sidebar;