/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { X, ImageIcon, Loader2, Save, Youtube, Plus, Trash2 } from "lucide-react";
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
} from "../../middleware/upload";
import { auth } from "../../../../firebase";

const EditProductModal = ({ product, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);

  // Previews & Gallery State
  const [thumbnailPreview, setThumbnailPreview] = useState(product.image?.url || "");
  // Existing gallery and new selection tracking
  const [galleryItems, setGalleryItems] = useState(
    product.gallery?.map((img) => ({ ...img, isNew: false })) || []
  );

  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category?._id || product.category,
    gameType: product.gameType?._id || product.gameType,
    youtubeId: product.youtubeId || "",
    s3Key: product.s3Key,
    thumbnailFile: null,
    newGalleryFiles: [], 
    isDiscount: product.isDiscount || false,
    discountPrice: product.discountPrice || "",
  });

  // ১. ড্রপডাউনের জন্য ক্যাটাগরি এবং গেম টাইপ ফেচ করা
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, gameRes] = await Promise.all([
          fetch("https://uefn-maps-server.onrender.com/api/v1/categories"),
          fetch("https://uefn-maps-server.onrender.com/api/v1/game-types"),
        ]);
        const catData = await catRes.json();
        const gameData = await gameRes.json();
        setCategories(catData.data || []);
        setGameTypes(gameData.data || []);
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };
    fetchOptions();
  }, []);

  // Handle Thumbnail Change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnailFile: file });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle Gallery Selection
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
        isNew: true,
      }));
      setGalleryItems([...galleryItems, ...newItems]);
    }
  };

  // Remove Item from Preview
  const removeGalleryItem = (index) => {
    setGalleryItems(galleryItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.isDiscount && Number(formData.discountPrice) >= Number(formData.price)) {
      return alert("Discount price must be lower than original price!");
    }

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();

      // ১. থাম্বনেইল আপডেট লজিক
      let finalThumbnail = product.image;
      if (formData.thumbnailFile) {
        const uploaded = await uploadImageToCloudinary(formData.thumbnailFile);
        if (uploaded) finalThumbnail = uploaded;
      }

      // ২. গ্যালারি আপডেট লজিক
      // আগের ইমেজগুলো যা এখনো লিস্টে আছে
      const existingGallery = galleryItems
        .filter((item) => !item.isNew)
        .map((item) => ({ url: item.url, publicId: item.publicId }));

      // নতুন সিলেক্ট করা ফাইলগুলো আপলোড করা
      const filesToUpload = galleryItems.filter((item) => item.isNew).map((item) => item.file);
      let newlyUploadedGallery = [];
      if (filesToUpload.length > 0) {
        newlyUploadedGallery = await uploadMultipleImagesToCloudinary(filesToUpload);
      }

      const finalGallery = [...existingGallery, ...newlyUploadedGallery];

      const updatePayload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        gameType: formData.gameType,
        youtubeId: formData.youtubeId,
        s3Key: formData.s3Key,
        isDiscount: formData.isDiscount,
        discountPrice: formData.isDiscount ? Number(formData.discountPrice) : 0,
        image: finalThumbnail,
        gallery: finalGallery,
      };

      const res = await fetch(
        `https://uefn-maps-server.onrender.com/api/v1/products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (res.ok) {
        alert("Product Updated Successfully! ✨");
        refresh();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500 transition-all text-sm text-white";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#0d0d0f] border border-white/10 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#0d0d0f] p-6 border-b border-white/5 flex justify-between items-center z-20">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">
              Update <span className="text-purple-500">Asset</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              ID: {product._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                Asset Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClasses}
                >
                  <option className="bg-black text-white" value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-[#0d0d0f]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                  Game Type
                </label>
                <select
                  value={formData.gameType}
                  onChange={(e) => setFormData({ ...formData, gameType: e.target.value })}
                  className={inputClasses}
                >
                  <option className="bg-black text-white" value="">Select Type</option>
                  {gameTypes.map((type) => (
                    <option key={type._id} value={type._id} className="bg-[#0d0d0f]">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest flex items-center gap-1.5">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                  S3 Key
                </label>
                <input
                  required
                  type="text"
                  value={formData.s3Key}
                  onChange={(e) => setFormData({ ...formData, s3Key: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest flex items-center gap-1.5">
                <Youtube size={12} /> YouTube ID
              </label>
              <input
                type="text"
                placeholder="dQw4w9WgXcQ"
                value={formData.youtubeId}
                onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={formData.isDiscount}
                  onChange={(e) => setFormData({ ...formData, isDiscount: e.target.checked })}
                  className="w-4 h-4 accent-purple-500"
                />
                <span className="text-xs font-bold uppercase text-white">Apply Discount?</span>
              </label>
              {formData.isDiscount && (
                <input
                  type="number"
                  placeholder="New Discount Price"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className={inputClasses}
                />
              )}
            </div>
          </div>

          {/* Right Column: Media */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                Main Thumbnail
              </label>
              <div className="mt-2 relative group rounded-2xl overflow-hidden border-2 border-white/10 h-44 bg-white/2">
                <img
                  src={thumbnailPreview}
                  className="w-full h-full object-cover"
                  alt="Thumb"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="text-white" size={24} />
                  <span className="ml-2 text-[10px] font-black uppercase text-white">
                    Replace Cover
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                Gallery Preview ({galleryItems.length})
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div className="relative border-2 border-dashed border-white/10 rounded-xl h-20 flex items-center justify-center bg-white/2 hover:border-purple-500/30 transition-all">
                  <input
                    type="file"
                    multiple
                    onChange={handleGalleryChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Plus size={20} className="text-gray-500" />
                </div>
                {galleryItems.map((item, idx) => (
                  <div key={idx} className="group relative h-20 rounded-xl overflow-hidden border border-white/5">
                    <img src={item.url} className="w-full h-full object-cover" alt="Gallery" />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} className="text-white" />
                    </button>
                    {item.isNew && (
                      <div className="absolute bottom-0 left-0 right-0 bg-purple-500 text-[8px] text-white font-bold text-center">
                        NEW
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClasses + " resize-none"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "SAVE CHANGES"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;