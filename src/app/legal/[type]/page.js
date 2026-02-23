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
        const res = await fetch(`http://localhost:5000/api/v1/legals`);
        const result = await res.json();

        const currentData = result.data.find(
          (item) =>
            item.type.toLowerCase().replace(/\s+/g, "-") ===
            decodeURIComponent(type)
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
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold italic uppercase">
          404 | Content not found
        </h1>
      </div>
    );

  const cleanHTML = DOMPurify.sanitize(data.content);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-32 pb-20 px-4 md:px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-block p-4 bg-white/5 rounded-3xl mb-6 border border-white/10">
            {getIcon(data.type)}
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
            {data.type}
          </h1>

          <p className="text-gray-500 font-medium">
            Last Updated: {new Date(data.updatedAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="legal-content bg-[#0d0d0f] border border-white/10 p-6 md:p-14 rounded-[3rem] shadow-2xl"
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