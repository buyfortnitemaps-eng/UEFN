"use client";

import Link from "next/link";
import { Gamepad2, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function GameTypesClient({ gameTypes }) {
  return (
    <div className="relative pt-32 pb-24 px-6 transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-125 bg-purple-600/20 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-100 bg-purple-600/15 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground italic leading-none">
            Browse by <span className="text-purple-500">Game Type</span>
          </h2>
          <p className="text-muted-foreground mt-3 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] opacity-60">
            Find the perfect UEFN templates categorized by game mechanics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {gameTypes.map((type) => (
            <Link
              key={type._id}
              href={`/pages/game-modes/${type._id}?name=${type.name}`}
              className="block cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group glass-card p-5 md:p-6 rounded-4xl hover:border-purple-500/50 hover:shadow-[0_20px_40px_-15px_rgba(147,51,234,0.2)] transition-all duration-300 relative overflow-hidden h-full"
              >
                <div className="absolute -top-2 -right-2 p-4 opacity-[0.1] dark:opacity-[0.05] group-hover:opacity-20 transition-opacity">
                  <Gamepad2 size={60} className="text-foreground" />
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <Layers size={18} />
                  </div>

                  <h3 className="text-lg md:text-xl font-black uppercase italic text-foreground mb-1 tracking-tight group-hover:text-purple-500 transition-colors line-clamp-1">
                    {type.name}
                  </h3>

                  <div className="flex items-center justify-between border-t border-border-color pt-4 mt-2">
                    <p className="text-muted-foreground font-bold text-[8px] md:text-[9px] uppercase tracking-widest">
                      <span className="text-purple-500">
                        {type.totalProduct || 0}
                      </span>{" "}
                      Assets
                    </p>
                    <ArrowRight
                      size={12}
                      className="text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
