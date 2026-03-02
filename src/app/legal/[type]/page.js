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
    if (type.toLowerCase().includes("privacy"))
      return <ShieldCheck size={40} className="text-purple-500" />;
    if (type.toLowerCase().includes("terms"))
      return <FileText size={40} className="text-blue-500" />;
    if (type.toLowerCase().includes("faq"))
      return <HelpCircle size={40} className="text-green-500" />;
    if (type.toLowerCase().includes("support"))
      return <Mail size={40} className="text-pink-500" />;
    return <RotateCcw size={40} className="text-orange-500" />;
  };

  useEffect(() => {
    const fetchLegalData = async () => {
      try {
        const res = await fetch(
          `https://uefn-maps-server.vercel.app/api/v1/legals`,
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
        <h1 className="text-2xl font-bold italic uppercase tracking-tighter">
          404 | Content not found
        </h1>
      </div>
    );

  const cleanHTML = DOMPurify.sanitize(data.content);

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full bg-purple-600/20 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-block p-4 bg-card-bg/50 backdrop-blur-md rounded-3xl mb-6 border border-white/10 shadow-xl">
            {getIcon(data.type)}
          </div>

          <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
            {data.type}
          </h1>
          <div className="h-1 w-20 bg-purple-600 mx-auto rounded-full" />
        </motion.div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-5 md:p-14 rounded-4xl md:rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div
            className="ql-editor prose prose-invert prose-purple max-w-full wrap-break-word overflow-x-hidden custom-legal-styles"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
          />
        </motion.div>
      </div>

      {/* Internal CSS for Quill Content Reset */}
      <style jsx global>{`
        .custom-legal-styles {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
          font-size: 1rem;
        }
        .custom-legal-styles h1,
        .custom-legal-styles h2,
        .custom-legal-styles h3 {
          color: #fff;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 800;
          text-transform: uppercase;
        }
        .custom-legal-styles p {
          margin-bottom: 1.2em;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .custom-legal-styles img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
        }
        .custom-legal-styles a {
          color: #9333ea;
          text-decoration: underline;
          word-break: break-all;
        }
        .custom-legal-styles ul,
        .custom-legal-styles ol {
          padding-left: 1.5em;
          margin-bottom: 1.2em;
        }
        .custom-legal-styles blockquote {
          border-left: 4px solid #9333ea;
          padding-left: 1em;
          font-style: italic;
          background: rgba(147, 51, 234, 0.05);
          padding: 1rem;
          border-radius: 0 1rem 1rem 0;
        }
        /* মোবাইল স্ক্রিনের জন্য টেবিল ফিক্স */
        .custom-legal-styles table {
          display: block;
          width: 100%;
          overflow-x: auto;
          border-collapse: collapse;
        }
        @media (max-width: 768px) {
          .custom-legal-styles {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalPage;
