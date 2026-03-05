// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Zap,
  Download,
  Users,
} from "lucide-react";

const CREATOR_COUNT = "2,100+";

export default function Hero() {
  return (
    <section
      aria-label="Premium UEFN Map Templates"
      className="relative pt-32 pb-24 px-6 overflow-hidden bg-background transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-card-bg text-sm text-muted-foreground mb-6"
        >
          <Sparkles size={16} className="text-purple-500" aria-hidden="true" />
          Trusted by {CREATOR_COUNT} Fortnite UEFN Map Creators
        </motion.div>

        {/* ✅ Single h1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground"
        >
          Premium UEFN Map Templates for Fortnite
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT CONTENT */}
        <div>
          {/* ✅ Changed to h2 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground"
          >
            <span className="bg-linear-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Build &amp; Publish Maps 10x Faster
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
          >
            Download ready-to-use <strong>UEFN map templates</strong> and
            Fortnite Creative prefabs designed for Unreal Editor for Fortnite.
            Get instant delivery of professionally-built maps with{" "}
            <strong>Verse scripts included</strong>, optimized performance, and
            full documentation. Join {CREATOR_COUNT} creators who publish better
            maps faster.
          </motion.p>

          {/* ✅ Link without nested button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              Browse UEFN Map Templates
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-xl border border-white/5 bg-card-bg text-foreground hover:bg-white/10 dark:hover:bg-white/5 font-semibold transition-all active:scale-95 flex items-center gap-2"
            >
              <Users size={20} aria-hidden="true" />
              View Our Team
            </Link>
          </motion.div>

          {/* ✅ Trust badges as list */}
          <ul className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium list-none">
            <li className="flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={18} aria-hidden="true" />
              Secure Payment &amp; 24/7 Support
            </li>
            <li className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={18} aria-hidden="true" />
              Instant Digital Delivery
            </li>
            <li className="flex items-center gap-2">
              <Download className="text-blue-500" size={18} aria-hidden="true" />
              1,000+ UEFN Maps &amp; Prefabs
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="text-purple-500" size={18} aria-hidden="true" />
              Includes Verse Code
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-3xl border border-white/5 bg-card-bg backdrop-blur-2xl p-5 shadow-[0_40px_120px_-20px_rgba(168,85,247,0.2)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-2" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                UEFN Template Shop Preview
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* CARD 1 */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                {/* ✅ Using next/image */}
                <Image
                  src="/uefn-map-template.png"
                  alt="UEFN Map Template - Complete Fortnite Creative Map"
                  width={400}
                  height={112}
                  className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
                <div className="p-3">
                  {/* ✅ Changed h4 to h3 */}
                  <h3 className="text-sm font-bold text-foreground">
                    Publish Ready Template
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Complete UEFN Map • Ready to Publish
                  </p>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                <Image
                  src="/UEFN Maps.jpeg"
                  alt="UEFN Verse System - Plug and Play Scripts"
                  width={400}
                  height={112}
                  className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
                <div className="p-3">
                  <h3 className="text-sm font-bold text-foreground">
                    Verse System · Plug &amp; Play
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Advanced Verse Scripts Included
                  </p>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden col-span-2">
                <Image
                  src="/fortnitetycoon.jpeg"
                  alt="Custom Editable Fortnite Tycoon Map Template for UEFN"
                  width={800}
                  height={128}
                  className="h-32 w-full object-cover group-hover:scale-105 transition duration-500"
                  priority
                />
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Get Your Own Editable Map
                    </h3>
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

          <div
            className="absolute -z-10 -right-10 top-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}