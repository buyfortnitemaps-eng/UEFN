"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Sparkles, Zap, Download, Users } from "lucide-react";

// 🧠 THE ANIMATION BRAIN
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Each child waits 0.15s
      delayChildren: 0.2,    // Wait 0.2s before starting the wave
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94], // 🔥 THE "SILK" EASING
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, rotateY: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center relative z-10"
        >
          {/* LEFT CONTENT */}
          <motion.div variants={itemVariants}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-card-bg text-sm text-muted-foreground mb-6">
              <Sparkles size={16} className="text-purple-500" />
              Trusted by 2,100+ Fortnite UEFN Map Creators
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
              <span className="bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                Build & Publish Maps 10x Faster
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Download <strong>ready-to-use UEFN map templates</strong>,{" "}
              <strong>Fortnite Creative prefabs</strong>, and complete map systems. Get{" "}
              <strong>instant delivery</strong> with <strong>Verse scripts</strong>, optimized
              performance, and full documentation.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/marketplace"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingCart size={20} />
                Browse UEFN Map Templates
              </Link>
              
              <Link
                href="/portfolio"
                className="px-8 py-4 rounded-xl border border-white/5 bg-card-bg text-foreground hover:bg-white/10 dark:hover:bg-white/5 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Users size={20} />
                View Our Team
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
              {[
                { icon: ShieldCheck, color: "text-green-500", text: "Secure Payment & 24/7 Support" },
                { icon: Zap, color: "text-yellow-500", text: "Instant Digital Delivery" },
                { icon: Download, color: "text-blue-500", text: "1,000+ UEFN Maps & Prefabs" },
                { icon: Sparkles, color: "text-purple-500", text: "Includes Verse Code" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className={item.color} size={18} />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE - 3D FLOAT ANIMATION */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
            style={{ perspective: "1000px" }} // 👈 Enables 3D
          >
            <div className="relative rounded-3xl border border-white/5 bg-card-bg backdrop-blur-2xl p-5 shadow-[0_40px_120px_-20px_rgba(168,85,247,0.2)]">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  UEFN Template Shop
                </div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* CARD 1 */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                  <img
                    src="/uefn-map-template.png"
                    alt="UEFN Map Template Preview"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-foreground">Publish Ready Template</h4>
                    <p className="text-xs text-muted-foreground">Complete UEFN Map</p>
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                  <img
                    src="/UEFN Maps.jpeg"
                    alt="Verse Script System for Fortnite"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-foreground">Verse System · Plug & Play</h4>
                    <p className="text-xs text-muted-foreground">Advanced Verse Scripts</p>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden col-span-2">
                  <img
                    src="/fortnitetycoon.jpeg"
                    alt="Fortnite Tycoon Map Template"
                    className="h-32 w-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Editable Tycoon Map</h4>
                      <p className="text-xs text-muted-foreground">Fully Customizable</p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300">
                      Most Popular
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -z-10 -right-10 top-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}