"use client";
import React from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const AdminOnly = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
          <ShieldAlert className="text-red-500" size={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Access Denied</h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            This area is restricted to administrators only. You do not have the necessary permissions to view this page.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link href="/" className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-purple-600 hover:text-white transition-all">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
            <Lock size={14} /> Switch Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOnly;