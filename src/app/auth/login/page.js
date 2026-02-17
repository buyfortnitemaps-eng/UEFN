/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from 'framer-motion';
import { Mail, Lock, Gamepad2 } from 'lucide-react';
import { FaGoogle } from "react-icons/fa6";
import Link from 'next/link';

const Login = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/2 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/20">
              <Gamepad2 className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium italic">Ready to level up your UEFN assets?</p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              />
            </div>

            <div className="text-right">
              <Link href="#" className="text-xs font-bold text-gray-600 hover:text-purple-400 transition-colors uppercase tracking-wider">Forgot Password?</Link>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-purple-600 hover:text-white transition-all shadow-xl active:shadow-inner"
            >
              Sign In
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Or continue with</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Social Logins */}
          <div className="grid gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl transition-all font-bold text-sm text-white">
              <FaGoogle className="text-white" size={18} /> Google
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center mt-10 text-gray-300 text-sm font-medium">
            Don't have an account? <Link href="/auth/signup" className="text-purple-500 font-bold hover:underline">Create for free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;