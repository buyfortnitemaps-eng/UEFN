"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-card-bg text-sm mb-6"
          >
            <Sparkles size={16} className="text-purple-500" />
            Build for Fortnite UEFN Creators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Create Better Maps <br />
            <span className="text-purple-500">10x Faster</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Premium UEFN map templates and assets with instant delivery.
          </motion.p>

          <div className="flex gap-4">
            <Link href="/marketplace">
              <button className="px-8 py-4 bg-purple-600 text-white rounded-xl flex items-center gap-2">
                <ShoppingCart size={20} />
                Browse Shop
              </button>
            </Link>

            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck size={18} className="text-green-500" />
              Secure Payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}