/* eslint-disable jsx-a11y/alt-text */
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
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-purple-500">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-[#07070a]">
        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[28px_28px]" />

        {/* GLOW LIGHT */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/25 blur-[180px] rounded-full" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 mb-6"
            >
              <Sparkles size={16} className="text-purple-400" />
              Built for Fortnite UEFN Creators
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6"
            >
              Create Better Maps <br />
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                10x Faster
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg md:text-xl max-w-xl mb-8"
            >
              Download professional UEFN maps, Verse systems, and optimized 3D
              assets. Instant delivery, secure files, and ready-to-use inside
              Unreal Editor for Fortnite.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Browse Marketplace
              </button>

              <button className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold transition-all">
                View Showcase
              </button>
            </motion.div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-400" size={18} />
                Secure Download
              </div>
              <div>5,000+ Creators</div>
              <div>200+ Assets</div>
              <div>Up to 5GB Files</div>
            </div>
          </div>

          {/* RIGHT SIDE PREVIEW */}
          {/* RIGHT SIDE MARKETPLACE PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            {/* Dashboard Frame */}
            <div className="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/10 to-white/2 backdrop-blur-2xl p-5 shadow-[0_40px_120px_-20px_rgba(168,85,247,0.35)]">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>

                <div className="text-xs text-gray-400">Marketplace Preview</div>
              </div>

              {/* Asset Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* CARD 1 - MAP */}
                <div className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden">
                  <img
                    src="/map.jfif"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-semibold">Cyber Arena</h4>
                    <p className="text-xs text-gray-400">UEFN Map • 1.8GB</p>
                  </div>
                </div>

                {/* CARD 2 - VERSE */}
                <div className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden">
                  <img
                    src="/props.jfif"
                    className="h-28 w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-semibold">Inventory System</h4>
                    <p className="text-xs text-gray-400">Verse Script</p>
                  </div>
                </div>

                {/* CARD 3 - PROPS */}
                <div className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden col-span-2">
                  <img
                    src="/verce.jfif"
                    className="h-32 w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold">
                        Sci-Fi Props Pack
                      </h4>
                      <p className="text-xs text-gray-400">
                        320 Optimized Meshes
                      </p>
                    </div>

                    <span className="px-3 py-1 text-xs rounded-lg bg-purple-500/20 text-purple-300">
                      Popular
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow Accent */}
            <div className="absolute -z-10 -right-10 top-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/30 blur-[120px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED SECTION --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Releases</h2>
            <p className="text-gray-500">
              The most downloaded UEFN templates this week.
            </p>
          </div>
          <button className="text-purple-400 hover:text-purple-300 font-medium">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="h-56 relative overflow-hidden bg-gray-900">
                <img
                  src={`https://cdn1.epicgames.com/offer/fn/032_1920x1080-9bee2710bfd29f1c5bb3da9cfc211cbe?resize=1&w=480&h=270&quality=medium`} // এখানে আপনার ইমেজের পাথ হবে
                  alt="UEFN Map Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />

                {/* Product Image Tag */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-purple-400 border border-purple-500/30 tracking-widest uppercase">
                  5GB ZIP
                </span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Cyberpunk City Map V2
                  </h3>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                  Full custom UEFN map with advanced Verse lighting scripts,
                  high-poly 3D models and optimized performance.
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">
                      Price
                    </p>
                    <span className="text-2xl font-bold text-white">
                      $49.99
                    </span>
                  </div>
                  <button className="p-4 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                    <ShoppingCart size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
            <h4 className="text-xl font-bold mb-2">Massive Storage</h4>
            <p className="text-gray-500">
              Powered by AWS S3 to handle files up to 5GB with ultra-fast speed.
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

      {/* count section */}
      <section className="py-20 border-y border-white/5 relative overflow-hidden bg-[#0a0a0b]">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {[
            {
              label: "Active Creators",
              value: "2,500+",
              color: "from-purple-400 to-purple-600",
            },
            {
              label: "Total Downloads",
              value: "15k+",
              color: "from-blue-400 to-blue-600",
            },
            {
              label: "Verified Assets",
              value: "450+",
              color: "from-green-400 to-green-600",
            },
            {
              label: "Average File Size",
              value: "2.5 GB",
              color: "from-pink-400 to-pink-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <h3
                className={`text-4xl md:text-5xl font-extrabold mb-2 bg-linear-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.value}
              </h3>
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* testimonial section */}
      <section className="py-24 px-6 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Loved by <span className="text-purple-500">UEFN</span> Creators
          </motion.h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Don't just take our word for it. Join thousands of satisfied
            developers building the future of Fortnite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[1, 2, 3].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl relative group overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="text-purple-500 mb-6 text-5xl font-serif opacity-50 italic">
                “
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed relative z-10 italic">
                "The map quality is insane! I was worried about the 5GB
                download, but the speed was super fast. Highly recommended for
                any serious dev."
              </p>

              <div className="flex items-center gap-4 relative z-10 border-t border-white/5 pt-6">
                <div className="w-12 h-12 bg-linear-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                  A{item}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Alex Gamer #{item}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, star) => (
                      <span key={star} className="text-yellow-500 text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* call to action */}
      <section className="py-24 px-6 bg-[#0a0a0b]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative group"
        >
          {/* Animated Background Aura */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />

          <div className="relative bg-[#0d0d0f] border border-white/10 rounded-4xl p-10 md:p-20 text-center overflow-hidden">
            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight leading-tight">
              Ready to Build Your <br />
              <span className="bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient-x">
                Dream Map?
              </span>
            </h2>

            <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Join 2,000+ creators who are using our assets to speed up their
              development and win more players.
            </p>

            <div className="flex flex-col sm:row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                Start Browsing Now
              </motion.button>
              <p className="text-gray-500 font-medium italic">
                No credit card required to browse
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
