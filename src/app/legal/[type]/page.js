"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import {
  Loader2,
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  RotateCcw,
} from "lucide-react";

const LegalPage = () => {
  const { type } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getIcon = (type) => {
    if (!type) return null;
    if (type.includes("Privacy"))
      return <ShieldCheck size={40} className="text-purple-500" />;
    if (type.includes("Terms"))
      return <FileText size={40} className="text-blue-500" />;
    if (type.includes("FAQ"))
      return <HelpCircle size={40} className="text-green-500" />;
    if (type.includes("Support"))
      return <Mail size={40} className="text-pink-500" />;
    return <RotateCcw size={40} className="text-orange-500" />;
  };

  useEffect(() => {
    const fetchLegalData = async () => {
      try {
        const res = await fetch(
          `https://uefn-maps-server.onrender.com/api/v1/legals`,
        );
        const result = await res.json();

        const currentData = result.data.find(
          (item) =>
            item.type.toLowerCase().replace(/\s+/g, "-") ===
            decodeURIComponent(type),
        );

        setData(currentData);
      } catch (error) {
        console.error("Legal data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLegalData();
  }, [type]);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <h1 className="text-2xl font-bold italic uppercase">
          404 | Content not found
        </h1>
      </div>
    );

  const cleanHTML = DOMPurify.sanitize(data.content);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-4 md:px-6 relative">
      {/* --- FIXED BACKGROUND ELEMENTS (SCROLL FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. DOT GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* 2. TOP GLOW LIGHT */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />

        {/* 3. BOTTOM GLOW LIGHT */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-block p-4 bg-background rounded-3xl mb-6 border border-white/5">
            {getIcon(data.type)}
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
            {data.type}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="legal-content bg-card-bg border border-white/5 p-6 md:p-14 rounded-[3rem] shadow-2xl"
        >
          <div
            className="ql-editor custom-legal"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;
