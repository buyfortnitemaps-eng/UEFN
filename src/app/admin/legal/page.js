/* eslint-disable react-hooks/immutability */
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Edit, Save, Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

const ManageLegals = () => {
  const [legals, setLegals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("FAQs");
  const [content, setContent] = useState("");

  const types = [
    "FAQs",
    "Terms of Service",
    "Privacy Policy",
    "Contact Support",
    "Refund Policy",
  ];

  useEffect(() => {
    fetchLegals();
  }, []);

  const fetchLegals = async () => {
    const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/legals");
    const data = await res.json();
    setLegals(data.data);
  };

  const handleSave = async () => {
    if (!content) return;

    setLoading(true);

    await fetch("https://uefn-maps-server.vercel.app/api/v1/legals/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: selectedType, content }),
    });

    await fetchLegals();
    setLoading(false);
    alert("Saved Successfully!");
  };

  const handleEdit = (item) => {
    setSelectedType(item.type);
    setContent(item.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-foreground min-h-screen mt-10">
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
      <h1 className="text-3xl font-black mb-8 text-purple-500 uppercase italic">
        Manage Legal Pages
      </h1>

      <div className="bg-background border border-white/5 p-8 rounded-[2.5rem] mb-12 shadow-2xl">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full bg-background border border-white/5 p-4 rounded-xl mb-6"
        >
          {types.map((t) => (
            <option key={t} value={t} className="bg-background">
              {t}
            </option>
          ))}
        </select>

        <div className="rounded-xl overflow-hidden border border-white/5">
  <style>{`
    .ql-editor {
      min-height: 300px;
    }
  `}</style>
  <ReactQuill
    theme="snow"
    value={content}
    onChange={setContent}
    modules={modules}
    formats={formats}
  />
</div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 bg-purple-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Update Content
        </button>
      </div>

      {/* Table */}
      <div className="bg-background border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full">
          <thead className="bg-background text-purple-400 uppercase text-xs">
            <tr>
              <th className="p-6">Page Type</th>
              <th className="p-6">Last Updated</th>
              <th className="p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {legals.map((item) => (
              <tr key={item._id}>
                <td className="p-6 font-bold">{item.type}</td>
                <td className="p-6 text-gray-500 text-sm">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-6">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-foreground"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLegals;
