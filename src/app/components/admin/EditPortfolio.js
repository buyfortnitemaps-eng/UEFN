/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { X, Loader2, Save, ImageIcon } from "lucide-react";
import { uploadImageToCloudinary } from "../../middleware/upload";

const EditPortfolioModal = ({ project, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(project.image.url);
  const [formData, setFormData] = useState({
    title: project.title,
    type: project.type,
    description: project.description,
    players: project.stats.players,
    rating: project.stats.rating,
    youtubeId: project.youtubeId,
    tags: project.tags.join(", "), // Array-কে String-এ রূপান্তর
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageData = project.image;

      // যদি নতুন ইমেজ আপলোড করা হয়
      if (formData.image) {
        finalImageData = await uploadImageToCloudinary(formData.image);
      }

      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        stats: { players: formData.players, rating: formData.rating },
        youtubeId: formData.youtubeId,
        tags: formData.tags.split(",").map((t) => t.trim()), // String-কে Array-তে রূপান্তর
        image: finalImageData,
      };

      const res = await fetch(
        `https://uefn-maps-server.onrender.com/api/v1/portfolios/${project._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        alert("Portfolio Updated! ✨");
        refresh();
        onClose();
      }
    } catch (err) {
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
      <div className="bg-card-bg border border-white/5 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase italic">
            Edit <span className="text-purple-500">Project</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <input
              className="w-full bg-background border border-white/5 p-4 rounded-xl outline-none focus:border-purple-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
            />
            <input
              className="w-full bg-background border border-white/5 p-4 rounded-xl outline-none focus:border-purple-500"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="Type"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="bg-background border border-white/5 p-4 rounded-xl"
                value={formData.players}
                onChange={(e) =>
                  setFormData({ ...formData, players: e.target.value })
                }
                placeholder="Players"
              />
              <input
                className="bg-background border border-white/5 p-4 rounded-xl"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                placeholder="Rating"
              />
            </div>
            <input
              className="w-full bg-background border border-white/5 p-4 rounded-xl"
              value={formData.youtubeId}
              onChange={(e) =>
                setFormData({ ...formData, youtubeId: e.target.value })
              }
              placeholder="YouTube ID"
            />
          </div>

          <div className="space-y-4">
            <div className="relative h-40 rounded-xl overflow-hidden border-2 border-dashed border-border-color">
              <img src={preview} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon />
              </div>
            </div>
            <textarea
              rows={4}
              className="w-full bg-background border border-white/5 p-4 rounded-xl"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-purple-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-500 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> Update Portfolio
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolioModal;
