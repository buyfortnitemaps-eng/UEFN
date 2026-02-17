"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6 relative overflow-hidden text-white font-sans">
      
      {/* Background Animated Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] z-0" 
      />

      <div className="text-center relative z-10">
        {/* Floating Icon */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-8"
        >
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
            <Gamepad2 size={48} className="text-purple-500" />
          </div>
        </motion.div>

        {/* Error Code */}
        <h1 className="text-[12rem] font-black leading-none tracking-tighter text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-[-1]">
          404
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight">
            Map Not <span className="text-purple-500">Found</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-lg font-medium">
            The zone you are looking for has been vaulted or moved to a different coordinate.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 group">
              <Home size={20} /> Back to Lobby
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} /> Previous Zone
          </button>
        </motion.div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 left-10 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] rotate-90 origin-left hidden md:block">
        Error Log: 0x404_NOT_FOUND
      </div>
    </div>
  );
};

export default NotFound;