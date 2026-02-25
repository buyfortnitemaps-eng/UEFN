/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "../../middleware/upload";
import EditPortfolioModal from "../../components/admin/EditPortfolio";

const ManagePortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    players: "",
    rating: "",
    youtubeId: "",
    tags: "",
    image: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    const res = await fetch("https://uefn-maps-server.onrender.com/api/v1/portfolios");
    const data = await res.json();
    setPortfolios(data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imgRes = await uploadImageToCloudinary(formData.image);
      const payload = {
        ...formData,
        stats: { players: formData.players, rating: formData.rating },
        tags: formData.tags.split(",").map((t) => t.trim()),
        image: imgRes,
      };

      const res = await fetch("https://uefn-maps-server.onrender.com/api/v1/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Portfolio Added!");
        fetchPortfolios();
      }
    } catch (err) {
      alert("Error adding portfolio");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this portfolio project?"))
      return;

    try {
      const res = await fetch(
        `https://uefn-maps-server.onrender.com/api/v1/portfolios/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        alert("Portfolio deleted successfully!");
        fetchPortfolios(); // লিস্ট রিফ্রেশ করার জন্য
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-foreground bg-background mt-10">
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
      <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter text-purple-500">
        Add New Portfolio
      </h2>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background p-8 rounded-[2.5rem] border border-white/5 mb-20"
      >
        <input
          type="text"
          placeholder="Title"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type (e.g. Full Game Map)"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="bg-background border border-white/5 p-4 rounded-2xl md:col-span-2"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Players (e.g. 50k+)"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) =>
            setFormData({ ...formData, players: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Rating"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />
        <input
          type="text"
          placeholder="YouTube Video ID"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) =>
            setFormData({ ...formData, youtubeId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
        <input
          type="file"
          className="bg-background border border-white/5 p-4 rounded-2xl"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />

        <button
          disabled={loading}
          className="md:col-span-2 bg-purple-600 py-4 rounded-2xl font-black hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Plus /> Publish Portfolio
            </>
          )}
        </button>
      </form>

      {/* Table Section */}
      <div className="bg-background border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10 text-purple-400 uppercase text-xs">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Type</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((p) => (
              <tr
                key={p._id}
                className="border-t border-border-color hover:bg-background"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={p.image.url}
                    className="w-10 h-10 rounded-lg object-cover"
                  />{" "}
                  {p.title}
                </td>
                <td className="p-4">{p.type}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentProject(p);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-foreground transition-all"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-foreground transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <EditPortfolioModal
            project={currentProject}
            onClose={() => setIsModalOpen(false)}
            refresh={fetchPortfolios}
          />
        )}
      </div>
    </div>
  );
};

export default ManagePortfolio;
