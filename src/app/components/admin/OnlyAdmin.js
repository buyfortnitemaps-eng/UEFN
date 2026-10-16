"use client";
import React from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const AdminOnly = () => {
  const { user, loading, profileLoading, profileError, refreshProfile } = useAuth();
  const verifying = loading || (user && profileLoading);
  const title = verifying ? "Checking account" : profileError ? "Account unavailable" : "Admin access required";
  const message = verifying
    ? "Checking your administrator account. Please wait."
    : profileError
      ? "We could not load your account permissions. Your access has not been changed. Please retry."
      : "Sign in with an administrator account to manage products.";
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6 bg-background border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
          <ShieldAlert className="text-red-500" size={40} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground">{title}</h1>
          <p className="text-forground text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          {profileError && !verifying && (
            <button type="button" onClick={() => refreshProfile({ forceTokenRefresh: true }).catch(() => {})}
              className="bg-purple-600 text-white py-4 rounded-2xl font-bold">
              Retry account check
            </button>
          )}
          <Link href="/" className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-purple-600 hover:text-foreground transition-all">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors">
            <Lock size={14} /> Switch Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOnly;