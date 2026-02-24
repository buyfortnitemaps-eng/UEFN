"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Gamepad2, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function GameTypes() {
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://uefn-maps-server.onrender.com/api/v1/game-types")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = (data.data || []).reverse(); 
        setGameTypes(sortedData);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-[300px] flex items-center justify-center text-foreground italic uppercase font-black animate-pulse tracking-widest text-xs">
        Loading Assets...
      </div>
    );

  return (
    <div className="bg-transparent py-16 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground italic leading-none">
            Browse by <span className="text-purple-500">Game Type</span>
          </h2>
          <p className="text-muted-foreground mt-3 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] opacity-60">
            Find the perfect UEFN templates categorized by game mechanics
          </p>
        </div>

        {/* Game Types Grid - Compact Version */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {gameTypes.map((type) => (
            <Link
              key={type._id}
              href={`/pages/game-modes/${type._id}?name=${type.name}`}
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="group bg-card-bg border border-border-color p-5 md:p-6 rounded-[2rem] hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden shadow-sm"
              >
                {/* Subtle Background Icon */}
                <div className="absolute -top-2 -right-2 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
                  <Gamepad2 size={60} className="text-foreground" />
                </div>

                <div className="relative z-10">
                  {/* Smaller Icon Container */}
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <Layers size={18} />
                  </div>

                  {/* Title - Smaller Font */}
                  <h3 className="text-lg md:text-xl font-black uppercase italic text-foreground mb-1 tracking-tight group-hover:text-purple-500 transition-colors line-clamp-1">
                    {type.name}
                  </h3>

                  {/* Asset Count - Compact */}
                  <div className="flex items-center justify-between border-t border-border-color pt-4 mt-2">
                    <p className="text-muted-foreground font-bold text-[8px] md:text-[9px] uppercase tracking-widest">
                      <span className="text-purple-500">{type.totalProduct || 0}</span> Assets
                    </p>
                    <ArrowRight size={12} className="text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
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