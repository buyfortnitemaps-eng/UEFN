/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  ExternalLink,
  ShieldCheck,
  Zap,
  HeartHandshake,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "https://uefn-maps-server.onrender.com/api/v1/portfolios",
        );
        const data = await res.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-purple-500 font-black uppercase tracking-[0.4em] animate-pulse">
          Loading Studio...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 relative overflow-hidden">
      {/* --- Fixed Background Decor --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/15 blur-[180px] rounded-full" />
      </div>

      {/* --- Header Section (Replacement 1) --- */}
      <header className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-purple-500 font-black tracking-[0.4em] uppercase text-xs mb-4 block">
            About Us
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none italic">
            Building High-Quality <br />{" "}
            <span className="text-purple-500">UEFN Experiences</span>
          </h1>
          <p className="text-gray-500 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed italic">
            We design production-ready UEFN maps, premium templates, and Verse
            systems for creators who want to ship polished experiences faster.
            From environment design to gameplay logic and optimization, we focus
            on clean projects that are easy to customize and publish.
          </p>
        </motion.div>

        {/* --- Why Us Row (Optional Upgrade 1) --- */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          {[
            {
              icon: <ShieldCheck className="text-purple-500" />,
              title: "Production-Ready Files",
              desc: "Clean projects tested for publish",
            },
            {
              icon: <Zap className="text-purple-500" />,
              title: "Creator-Focused",
              desc: "Built to be easy to customize",
            },
            {
              icon: <HeartHandshake className="text-purple-500" />,
              title: "Support Included",
              desc: "Help with setup and bug fixes",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-black uppercase italic mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* --- Main Studio Story (Optional Upgrade 2) --- */}
      <section className="max-w-4xl mx-auto text-center mb-32 relative z-10 border-y border-white/5 py-16">
        <p className="text-gray-400 text-xl leading-relaxed font-medium italic">
          "We started this studio to help UEFN creators skip repetitive setup
          and focus on building great gameplay. Every project we ship is
          structured, optimized, and designed to be easy to extend—so you can
          move faster without cutting corners."
        </p>
      </section>

      {/* --- Projects Showcase (Replacements 2 & 3) --- */}
      <main className="max-w-7xl mx-auto space-y-32 relative z-10">
        {projects.map((project, idx) => (
          <motion.section
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${idx % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 items-center`}
          >
            {/* Left Side: UEFN Map Development (Replacement 2) */}
            <div className="w-full lg:w-3/5 group relative">
              <div className="relative h-75 md:h-125 w-full bg-gray-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass-card p-4">
                <div className="relative h-full w-full rounded-4xl overflow-hidden">
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                  {/* Overlay Text (UEFN Map Development) */}
                  <div className="absolute bottom-10 left-10 max-w-sm">
                    <h3 className="text-3xl font-black uppercase italic text-white mb-4">
                      UEFN Map Development
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      Custom maps, premium templates, and Verse systems built
                      for performance, clarity, and fast iteration.
                    </p>
                    <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest">
                      Environment design · Gameplay logic · Optimization
                    </p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setActiveVideo(project.youtubeId)}
                      className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play fill="black" size={30} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Featured Project Content (Replacement 3) */}
            <div className="w-full lg:w-2/5 space-y-8">
              <div>
                <span className="text-purple-500 font-black text-[10px] uppercase tracking-widest block mb-2">
                  Project Showcase
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-foreground leading-none italic uppercase">
                  Featured Project: <br /> {project.title}
                </h2>
              </div>

              <p className="text-gray-400 leading-relaxed text-lg">
                {project.description}
              </p>

              {/* Belief-based Stats Boxes */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-purple-500/30 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Use Case
                  </span>
                  <p className="text-lg font-black text-foreground italic uppercase">
                    Competitive / Zone Wars
                  </p>
                </div>

                <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Includes
                  </span>
                  <p className="text-lg font-black text-foreground italic uppercase tracking-tighter">
                    UEFN Project + Verse Logic
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href={"/marketplace"}>
                  <button className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-purple-600 hover:text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 group uppercase italic">
                    <ExternalLink
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                    View Project
                  </button>
                </Link>
              </div>
            </div>
          </motion.section>
        ))}
      </main>

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

      {/* --- YouTube Video Modal (unchanged) --- */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video bg-background rounded-3xl overflow-hidden border border-white/5"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-background/50 text-white rounded-full"
              >
                <X size={24} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutUs;
