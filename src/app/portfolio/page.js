"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, ExternalLink, Users, Star, X } from "lucide-react"; // X আইকন যোগ করা হয়েছে
import Image from "next/image";
import Link from "next/link";

const Portfolio = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  // Portfolio.js এর ভেতরে
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "https://uefn-maps-server.onrender.com/api/v1/portfolios",
        );
        const data = await res.json();
        setProjects(data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div className="text-center p-20 bg-background text-foreground min-h-screen">
        Loading Creative Works...
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 px-6 font-sans">
      {/* --- YouTube Video Modal (পপআপ) --- */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)} // বাইরে ক্লিক করলে বন্ধ হবে
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 bg-background/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // মডালের ভেতরে ক্লিক করলে বন্ধ হবে না
              className="relative w-full max-w-5xl aspect-video bg-background rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.3)] border border-white/5"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-background/50 hover:bg-white/10 text-foreground rounded-full transition-all border border-white/5"
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

      {/* --- Header Section --- */}
      <header className="max-w-7xl mx-auto text-center mb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <span className="text-purple-500 font-black tracking-[0.3em] uppercase text-xs mb-4 block">
            Selected Works
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            Creative <span className="text-purple-500">Portfolio</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg italic leading-relaxed">
            Transforming ideas into immersive Fortnite experiences. From complex
            Verse logic to breathtaking environment designs.
          </p>
        </motion.div>
      </header>

      {/* --- Projects Showcase --- */}
      <main className="max-w-7xl mx-auto space-y-32">
        {projects.map((project, idx) => (
          <motion.section
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${
              idx % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } gap-12 items-center`}
          >
            {/* Image/Video Preview Section */}
            <div className="w-full lg:w-3/5 group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000" />

              <div className="relative h-75 md:h-112.5 w-full bg-gray-900 rounded-4xl overflow-hidden border border-white/5 shadow-2xl">
                <Image
                  src={project.image.url}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveVideo(project.youtubeId)}
                    className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
                  >
                    <Play fill="black" size={36} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Project Content */}
            <div className="w-full lg:w-2/5 space-y-8">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-background border border-white/5 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest italic"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                {project.title}
              </h2>

              <p className="text-gray-400 leading-relaxed text-lg">
                {project.description}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/2 border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-2 text-purple-500 mb-2">
                    <Users size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Creators
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    {project.stats.players}
                  </p>
                </div>

                <div className="p-5 bg-white/2 border border-white/5 rounded-3xl group hover:border-yellow-500/30 transition-colors">
                  <div className="flex items-center gap-2 text-yellow-500 mb-2">
                    <Star size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Rating
                    </span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    {project.stats.rating}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href={"/marketplace"}>
                  <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black hover:bg-purple-600 hover:text-foreground px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 group">
                    <ExternalLink
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                    Launch Experience
                  </button>
                </Link>
              </div>
            </div>
          </motion.section>
        ))}
      </main>

      {/* --- Call to Action (Hire Me) --- */}
      <section className="py-40 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-linear-to-b from-white/5 to-transparent border border-white/5 p-12 md:p-24 rounded-[4rem] relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full" />

          <h2 className="text-5xl md:text-7xl font-black mb-8 relative z-10 leading-none">
            Have a vision for a <br />{" "}
            <span className="text-purple-500 underline decoration-purple-500/20 underline-offset-12">
              Fortnite Map?
            </span>
          </h2>
          <p className="text-gray-400 mb-12 text-xl max-w-xl mx-auto leading-relaxed relative z-10">
            We are available for custom projects, system design, and long-term
            collaborations.
          </p>
          <Link href="/pages/contact">
            <button className="relative z-10 bg-purple-600 text-foreground px-16 py-6 rounded-2xl font-black text-xl hover:bg-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all active:scale-95">
              Get in Touch
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Portfolio;
