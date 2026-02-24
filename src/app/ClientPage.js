/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import ContactPage from "./pages/contact/page";
import GameModes from "./pages/game-modes/page"

import FeaturedSection from "./pages/featured/page";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500">
      {/* --- Hidden SEO Keywords for Search Engines --- */}
      <section className="sr-only">
        <h1>Premium Fortnite UEFN Maps and Creative 2.0 Store</h1>
        <h2>Custom Fortnite Map Creator and UEFN Shope</h2>

        {/* ক্লায়েন্টের দেওয়া ট্যাগগুলো এখানে গুছিয়ে দেওয়া হয়েছে */}
        <ul>
          <li>Buy Fortnite maps and UEFN map assets</li>
          <li>
            Pro Fortnite maps: Deathrun, Box fight, Zone wars, and 1v1 maps
          </li>
          <li>PvP maps, Red vs Blue, and Parkour maps for UEFN</li>
          <li>Custom game modes: Tycoon maps, Horror maps, and Escape rooms</li>
          <li>UEFN developer services for Creative map commissions</li>
          <li>Best Fortnite UEFN maps and Trending Fortnite islands</li>
        </ul>

        <p>
          Explore the best UEFN creator Shope for high-end UEFN templates,
          Verse scripts, and custom Fortnite map design services. Hire UEFN
          creators for viral Fortnite maps and popular UEFN islands.
        </p>
      </section>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-background transition-colors duration-300">
        {/* GRID BACKGROUND - Changed to be theme-aware */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07] bg-[radial-gradient(circle_at_center,var(--foreground)_1px,transparent_1px)] bg-size-[28px_28px]" />

        {/* GLOW LIGHT */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-255 h-125 bg-purple-600/20 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-card-bg text-sm text-muted-foreground mb-6"
            >
              <Sparkles size={16} className="text-purple-500" />
              Build for Fortnite UEFN Map Creators
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-foreground"
            >
              Create Better Maps <br />
              <span className="bg-linear-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                10x Faster
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
            >
              Premium UEFN map templates, prefabs, and custom builds for
              creators in Fortnite instant delivery, secure files, and
              ready-to-use inside Unreal Editor for Fortnite
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
                  Browse Shope
                </button>
              </Link>
              <Link href={"/portfolio"}>
                <button className="px-8 py-4 rounded-xl border border-white/5 bg-card-bg text-foreground hover:bg-white/10 dark:hover:bg-white/5 font-semibold transition-all active:scale-95">
                  Our Team
                </button>
              </Link>
            </motion.div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} />
                Secure PAYMENT
              </div>
              <div>2100+ Creators</div>
              <div>1000+ MAPS</div>
              <div>VERSE SUPPORT</div>
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
                  Shope Preview
                </div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* CARD 1 - MAP */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                  <img
                    src="/map.jfif"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                    alt="Cyber Arena"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-foreground">
                      Cyber Arena
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      UEFN Map • 1.8GB
                    </p>
                  </div>
                </div>

                {/* CARD 2 - VERSE */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden">
                  <img
                    src="/props.jfif"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                    alt="Inventory System"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-bold text-foreground">
                      Inventory System
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Verse Script
                    </p>
                  </div>
                </div>

                {/* CARD 3 - PROPS */}
                <div className="group rounded-xl border border-white/5 bg-background hover:bg-purple-500/5 transition-all overflow-hidden col-span-2">
                  <img
                    src="/verce.jfif"
                    className="h-32 w-full object-cover group-hover:scale-105 transition duration-500"
                    alt="Sci-Fi Props"
                  />
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Sci-Fi Props Pack
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        320 Optimized Meshes
                      </p>
                    </div>
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300">
                      Popular
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

      <GameModes />

      {/* --- FEATURED SECTION --- */}

      <FeaturedSection />

      {/* --- WHY US SECTION --- */}
      <section className="py-20 bg-white/2 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Instant Delivery</h4>
            <p className="text-gray-500">
              Get your download link on your dashboard immediately after
              checkout.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
              <Download size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">
              {" "}
              Optimized for Publishing with Optimized for Publishing
            </h4>
            <p className="text-gray-500">
              Powered by AWS S3 to handle files up to 5GB with ultra-fast speed.
              With Clean projects that are easy to customize and publish in UEFN
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Paddle Secured</h4>
            <p className="text-gray-500">
              International payments handled safely with full tax compliance.
            </p>
          </div>
        </div>
      </section>

      {/* testimonial section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          >
            Loved by <span className="text-purple-500">UEFN</span> Creators
          </motion.h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Don't just take our word for it. Join thousands of satisfied
            developers building the future of Fortnite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              name: "PlazuFN",
              comment:
                "Dropped the Arena template into UEFN and had a playable map in under an hour. Clean setup and easy to customize.",
              purchased: "Purchased: Arena Map Template",
              avatar: "P",
            },
            {
              name: "NovaBuilds",
              comment:
                "Bought a premium map and requested a small bug fix. Support was quick and the Verse logic worked out of the box.",
              purchased: "Service: Bug Fix + Verse Support",
              avatar: "N",
            },
            {
              name: "KairoMaps",
              comment:
                "The files are organized and publish-ready. Saved me days of setup and debugging.",
              purchased: "Purchased: Premium Map",
              avatar: "K",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-8 bg-card-bg border border-white/5 rounded-[2.5rem] relative group overflow-hidden transition-all duration-300 shadow-xl shadow-purple-500/5 hover:shadow-purple-500/10"
            >
              {/* Hover Glow Accent */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Quote Icon */}
              <div className="text-purple-500 mb-4 text-5xl font-serif opacity-30 italic leading-none">
                “
              </div>

              {/* Comment */}
              <p className="text-muted-foreground mb-8 leading-relaxed relative z-10 italic text-sm md:text-base">
                "{testimonial.comment}"
              </p>

              {/* User Info & Rating */}
              <div className="flex flex-col gap-4 relative z-10 border-t border-border-color pt-6 mt-auto">
                <div className="flex items-center gap-4">
                  {/* Avatar with Gradient */}
                  <div className="w-12 h-12 bg-linear-to-tr from-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-lg transform group-hover:rotate-6 transition-transform">
                    {testimonial.avatar}
                  </div>

                  <div className="text-left overflow-hidden">
                    <p className="font-black text-foreground truncate">
                      {testimonial.name}
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, star) => (
                        <span
                          key={star}
                          className="text-yellow-500 text-[10px]"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchased Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-purple-500/10">
                    {testimonial.purchased}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ContactPage />

      {/* call to action */}
      <section className="py-24 px-6 bg-transparent relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative group"
        >
          {/* Background Glow Aura - Dynamic based on theme */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-fuchsia-500 to-blue-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse" />

          <div className="relative bg-card-bg border border-border-color backdrop-blur-3xl rounded-[3rem] p-10 md:p-24 text-center overflow-hidden shadow-2xl shadow-purple-500/5">
            {/* Decorative Floating Gradients */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Badge Content */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              Get Started Today
            </div>

            <h2 className="text-4xl md:text-7xl font-black mb-8 text-foreground tracking-tighter leading-[1.1]">
              Ready to Build Your <br />
              <span className="bg-linear-to-r from-purple-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
                Dream Map?
              </span>
            </h2>

            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Join{" "}
              <span className="text-foreground font-black">
                2,100+ creators
              </span>{" "}
              who are using our premium UEFN assets to speed up their
              development and win more players.
            </p>

            <div className="flex flex-col items-center justify-center gap-6">
              <Link href={"/marketplace"}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-purple-600 text-white px-14 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-purple-600/30 overflow-hidden transition-all"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                  <span className="relative flex items-center gap-3">
                    Start Browsing Now <ChevronRight size={24} />
                  </span>
                </motion.button>
              </Link>

              <div className="flex items-center gap-3 text-muted-foreground font-bold text-xs uppercase tracking-widest opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                No credit card required to browse
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
