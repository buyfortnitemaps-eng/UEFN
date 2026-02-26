/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Download,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-bg-gradient text-foreground selection:bg-purple-500">
      

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
              Optimized for Publishing
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

      {/* --- CTA Section (Replacement 4) --- */}
      <section className="py-40 max-w-7xl mx-auto text-center relative z-20">
        {" "}
        {/* z-20 নিশ্চিত করা হয়েছে */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card border border-white/5 p-12 md:p-24 rounded-[4rem] relative overflow-hidden group shadow-2xl"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-none uppercase italic relative z-10">
            Have a Vision for a <br />{" "}
            <span className="text-purple-500">UEFN Map?</span>
          </h2>
          <p className="text-gray-400 mb-12 text-xl max-w-2xl mx-auto leading-relaxed font-medium relative z-10">
            We’re available for custom map creation, bug fixing, Verse
            programming, and long-term creator collaborations.
          </p>

          {/* বাটন লজিক আপডেট */}
          <div className="relative z-30">
            {" "}
            {/* বাটনকে সবার উপরে রাখার জন্য z-30 */}
            <Link href="/pages/contact" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-16 py-6 rounded-2xl font-black text-xl hover:bg-purple-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all cursor-pointer uppercase tracking-widest italic"
              >
                👉 Get in Touch
              </motion.button>
            </Link>
          </div>
        </motion.div>
        {/* --- Legal Disclaimer --- */}
        <p className="mt-12 text-[10px] font-bold text-gray-600 uppercase tracking-widest max-w-xl mx-auto opacity-50 relative z-10">
          Not affiliated with Epic Games or Fortnite. UEFN and Fortnite are
          trademarks of Epic Games.
        </p>
      </section>

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
