/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import {
  X,
  ImageIcon,
  Loader2,
  Save,
  Youtube,
  Plus,
  Trash2,
  MessageCircle,
} from "lucide-react";
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
  const [thumbnailPreview, setThumbnailPreview] = useState(
    product.image?.url || "",
  );
  const [galleryItems, setGalleryItems] = useState(
    product.gallery?.map((img) => ({ ...img, isNew: false })) || [],
  );

  // FAQ State (লোড করা হচ্ছে বিদ্যমান প্রোডাক্ট থেকে)
  const [faqs, setFaqs] = useState(product.faqs || []);

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
          fetch("https://uefn-maps-server.vercel.app/api/v1/categories"),
          fetch("https://uefn-maps-server.vercel.app/api/v1/game-types"),
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

  // --- FAQ Functions ---
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

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
    if (
      formData.isDiscount &&
      Number(formData.discountPrice) >= Number(formData.price)
    ) {
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
      const existingGallery = galleryItems
        .filter((item) => !item.isNew)
        .map((item) => ({ url: item.url, publicId: item.publicId }));

      const filesToUpload = galleryItems
        .filter((item) => item.isNew)
        .map((item) => item.file);
      let newlyUploadedGallery = [];
      if (filesToUpload.length > 0) {
        newlyUploadedGallery =
          await uploadMultipleImagesToCloudinary(filesToUpload);
      }

      const finalGallery = [...existingGallery, ...newlyUploadedGallery];

      const updatePayload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.isDiscount ? Number(formData.discountPrice) : 0,
        image: finalThumbnail,
        gallery: finalGallery,
        faqs: faqs, // FAQ ডাটা পাঠানো হচ্ছে
      };

      const res = await fetch(
        `https://uefn-maps-server.vercel.app/api/v1/products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        },
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
    "w-full bg-background border border-white/5 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500 transition-all text-sm text-foreground";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
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
      <div className="bg-card-bg border border-white/5 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-card-bg p-6 border-b border-white/5 flex justify-between items-center z-20">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Update <span className="text-purple-500">Asset</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              ID: {product._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors text-forground hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                  Asset Title
                </label>
                <input
                  placeholder="Write your product title"
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={inputClasses}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        className="bg-card-bg"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                    Game Type
                  </label>
                  <select
                    value={formData.gameType}
                    onChange={(e) =>
                      setFormData({ ...formData, gameType: e.target.value })
                    }
                    className={inputClasses}
                  >
                    <option value="">Select Type</option>
                    {gameTypes.map((type) => (
                      <option
                        key={type._id}
                        value={type._id}
                        className="bg-card-bg"
                      >
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                    S3 Key
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.s3Key}
                    onChange={(e) =>
                      setFormData({ ...formData, s3Key: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1 flex items-center gap-1.5">
                  <Youtube size={12} /> YouTube ID
                </label>
                <input
                  type="text"
                  placeholder="dQw4w9WgXcQ"
                  value={formData.youtubeId}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeId: e.target.value })
                  }
                  className={inputClasses}
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.isDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, isDiscount: e.target.checked })
                    }
                    className="w-4 h-4 accent-purple-500"
                  />
                  <span className="text-xs font-bold uppercase text-white">
                    Apply Discount?
                  </span>
                </label>
                {formData.isDiscount && (
                  <input
                    type="number"
                    placeholder="New Discount Price"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value,
                      })
                    }
                    className={inputClasses}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Media */}
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                  Main Thumbnail
                </label>
                <div className="mt-2 relative group rounded-2xl overflow-hidden border-2 border-border-color h-44 bg-white/2">
                  <img
                    src={thumbnailPreview}
                    className="w-full h-full object-cover"
                    alt="Thumb"
                  />
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
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
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                  Gallery Preview ({galleryItems.length})
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  <div className="relative border-2 border-dashed border-border-color rounded-xl h-20 flex items-center justify-center bg-white/2 hover:border-purple-500/30 transition-all">
                    <input
                      type="file"
                      multiple
                      onChange={handleGalleryChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Plus size={20} className="text-gray-500" />
                  </div>
                  {galleryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative h-20 rounded-xl overflow-hidden border border-white/5"
                    >
                      <img
                        src={item.url}
                        className="w-full h-full object-cover"
                        alt="Gallery"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-purple-400 tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  placeholder="Write your product description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={inputClasses + " resize-none"}
                />
              </div>
            </div>
          </div>

          {/* FAQ SECTION (নতুন যোগ করা হয়েছে) */}
          <div className="border-t border-white/5 pt-8">
            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-black uppercase text-purple-500 flex items-center gap-2">
                <MessageCircle size={20} /> Edit Product FAQ's
              </label>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg shadow-purple-500/20"
              >
                <Plus size={16} /> Add FAQ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="relative p-5 rounded-3xl bg-white/2 border border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      placeholder="e.g. Is it updated?"
                      className="w-full bg-background placeholder:text-foreground border border-blue-600 rounded-xl py-2.5 px-4 text-xs font-bold outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      placeholder="Answer details..."
                      className="w-full bg-background placeholder:text-foreground border border-blue-600 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-purple-500 text-gray-300 h-20 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            {faqs.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-4xl">
                <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest italic">
                  No FAQs available for this asset.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} /> SAVE ALL CHANGES
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
