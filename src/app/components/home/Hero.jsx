/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Sparkles, Zap, Download, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-card-bg text-sm text-muted-foreground mb-6"
        >
          <Sparkles size={16} className="text-purple-500" />
          Trusted by 2,100+ Fortnite UEFN Map Creators
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground"
        >
          Premium UEFN Map Templates for Fortnite <br />

        </motion.h1>
      </div>



      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT CONTENT */}
        <div >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground"
          >
            <span className="bg-linear-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Build & Publish Maps 10x Faster
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
          >
            Download <strong>ready-to-use UEFN map templates</strong>, <strong>Fortnite Creative prefabs</strong>, and complete map systems designed for Unreal Editor for Fortnite.
            Get <strong>instant delivery</strong> of professionally-built maps with <strong>Verse scripts included</strong>, optimized performance, and full documentation.
            Join <strong>2,100+ Fortnite creators</strong> who save time and publish better maps faster.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Link href={"/marketplace"}>
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95">
                <ShoppingCart size={20} />
                Browse UEFN Map Templates
              </button>
            </Link>
            <Link href={"/portfolio"}>
              <button className="px-8 py-4 rounded-xl border border-white/5 bg-card-bg text-foreground hover:bg-white/10 dark:hover:bg-white/5 font-semibold transition-all active:scale-95 flex items-center gap-2">
                <Users size={20} />
                View Our Team
              </button>
            </Link>
          </motion.div>

          {/* TRUST BADGES - Improved with icons */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={18} />
              Secure Payment & 24/7 Support
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={18} />
              Instant Digital Delivery
            </div>
            <div className="flex items-center gap-2">
              <Download className="text-blue-500" size={18} />
              1,000+ UEFN Maps & Prefabs
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-500" size={18} />
              Includes Verse Code
            </div>
          </div>
        </div>

        {/* RIGHT SIDE Shope PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="relative hidden lg:block"
        >
          {/* Dashboard Frame */}
          <div className="relative rounded-3xl border border-white/5 bg-card-bg backdrop-blur-2xl p-5 shadow-[0_40px_120px_-20px_rgba(168,85,247,0.2)] dark:shadow-[0_40px_120px_-20px_rgba(168,85,247,0.35)]">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                UEFN Template Shop Preview
              </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* CARD 1 - MAP */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all ">
                <img
                  src="/uefn-map-template.png"
                  className="h-28 w-full group-hover:scale-105 transition duration-500"
                  alt="UEFN Map Template - Complete Fortnite Creative Map for Unreal Editor"
                />
                <div className="p-3">
                  <h4 className="text-sm font-bold text-foreground">
                    Publish Ready Template
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Complete UEFN Map • Ready to Publish
                  </p>
                </div>
              </div>

              {/* CARD 2 - VERSE */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                <img
                  src="/UEFN Maps.jpeg"
                  className="h-28 w-full group-hover:scale-105 transition duration-500"
                  alt="UEFN Verse System - Plug and Play Scripts for Fortnite Maps"
                />
                <div className="p-3">
                  <h4 className="text-sm font-bold text-foreground">
                    Verse System · Plug & Play
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Advanced Verse Scripts Included
                  </p>
                </div>
              </div>

              {/* CARD 3 - PROPS */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden col-span-2">
                <img
                  src="/fortnitetycoon.jpeg"
                  className="h-32 w-full group-hover:scale-105 transition duration-500"
                  alt="Custom Editable Fortnite Map - Tycoon Game Mode Template for UEFN"
                />
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Get Your Own Editable Map
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Fully Customizable Fortnite Tycoon Map
                    </p>
                  </div>
                  <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300">
                    Most Popular
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Glow Accent */}
          <div className="absolute -z-10 -right-10 top-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}