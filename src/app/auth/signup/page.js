"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6 py-20 relative overflow-hidden text-white font-sans">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/2 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Create <span className="text-purple-500">Account</span></h1>
            <p className="text-gray-500 mt-3 font-medium">Join the elite community of UEFN creators.</p>
          </div>

          <form className="space-y-6">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Create Password" 
                className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-3 px-2">
               <ShieldCheck size={18} className="text-green-500" />
               <p className="text-xs text-gray-600 font-medium">I agree to the <Link href="#" className="text-purple-400 hover:underline">Terms of Service</Link> and Privacy Policy.</p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20"
            >
              Get Started
            </motion.button>
          </form>

          <p className="text-center mt-10 text-gray-500 text-sm">
            Already a member? <Link href="/auth/login" className="text-white font-black hover:text-purple-500 transition-colors">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;