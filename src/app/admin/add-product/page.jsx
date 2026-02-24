/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { ImageIcon, Loader2, Tag, Percent, X, Youtube, Images, Plus, MessageCircle } from "lucide-react";
import { uploadImageToCloudinary, uploadMultipleImagesToCloudinary } from "../../middleware/upload";
import { useAuth } from "../../context/AuthContext";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { auth } from "../../../../firebase";

const AddProduct = () => {
  const { user, mongoUser, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    gameType: "",
    youtubeId: "",
    s3Key: "",
    thumbnail: null,
    galleryImages: [],
    isDiscount: false,
    discountPrice: "",
    faqs: [] // FAQ এর জন্য নতুন স্টেট
  });

  // FAQ হ্যান্ডলিং ফাংশন
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }]
    });
  };

  const removeFaq = (index) => {
    const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  useEffect(() => {
    fetch("https://uefn-maps-server.onrender.com/api/v1/categories")
      .then(res => res.json())
      .then(data => setCategories(data.data));

    fetch("https://uefn-maps-server.onrender.com/api/v1/game-types")
      .then(res => res.json())
      .then(data => setGameTypes(data.data));
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, galleryImages: [...formData.galleryImages, ...files] });
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryPreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.isDiscount && Number(formData.discountPrice) >= Number(formData.price)) {
      return alert("Discount price must be lower than original!");
    }

    setLoading(true);
    try {
      const thumbData = await uploadImageToCloudinary(formData.thumbnail);
      let galleryData = [];
      if (formData.galleryImages.length > 0) {
        galleryData = await uploadMultipleImagesToCloudinary(formData.galleryImages);
      }

      const token = await auth.currentUser.getIdToken();

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        gameType: formData.gameType,
        youtubeId: formData.youtubeId,
        s3Key: formData.s3Key,
        isDiscount: formData.isDiscount,
        discountPrice: formData.isDiscount ? Number(formData.discountPrice) : 0,
        image: thumbData,
        gallery: galleryData,
        faqs: formData.faqs, // পে-লোডে FAQ পাঠানো হচ্ছে
        seller: {
          name: mongoUser?.name || "Admin",
          email: mongoUser?.email,
          uid: user?.uid
        }
      };

      const res = await fetch("https://uefn-maps-server.onrender.com/api/v1/products/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Asset Published Successfully! 🚀");
        window.location.reload(); // সফল হলে পেজ রিলোড
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading Auth...</div>;
  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  const inputClasses = "w-full bg-background border-2 border-border-color rounded-2xl py-4 px-5 mt-2 focus:border-purple-500 outline-none transition-all text-foreground font-medium shadow-lg";

  return (
    <div className="max-w-6xl mx-auto p-6 text-foreground mt-10 pb-20">
      <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter italic">
        Add New <span className="text-purple-500 font-black">Asset</span>
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Logic & Info */}
        <div className="space-y-6 bg-background p-8 rounded-[2.5rem] border border-white/5 shadow-2xl h-fit">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Title</label>
            <input required type="text" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Category</label>
              <select required onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClasses}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-card-bg">{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Game Type</label>
              <select required onChange={e => setFormData({ ...formData, gameType: e.target.value })} className={inputClasses}>
                <option value="">Select Type</option>
                {gameTypes.map(type => <option key={type._id} value={type._id} className="bg-card-bg">{type.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14} /> Price ($)</label>
              <input required type="number" placeholder="49.99" onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">S3 File Key</label>
              <input required type="text" placeholder="maps/file.zip" onChange={e => setFormData({ ...formData, s3Key: e.target.value })} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Youtube size={14} /> YouTube ID</label>
            <input type="text" placeholder="Video ID only" onChange={e => setFormData({ ...formData, youtubeId: e.target.value })} className={inputClasses} />
          </div>

          <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/20">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-purple-500" onChange={e => setFormData({ ...formData, isDiscount: e.target.checked })} />
              <span className="text-sm font-bold uppercase">Apply Discount?</span>
            </label>
            {formData.isDiscount && (
              <div className="mt-4">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Percent size={12} /> Discounted Price</label>
                <input required type="number" placeholder="Discount Price" onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} className={inputClasses} />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Media & FAQ */}
        <div className="space-y-6">
          <div className="bg-background p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Main Thumbnail</label>
            <div className="mt-2 relative">
              {!thumbnailPreview ? (
                <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center bg-card-bg/50">
                  <input type="file" required accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <ImageIcon className="mx-auto text-gray-500 mb-2" size={40} />
                  <p className="text-xs text-gray-400 font-bold uppercase italic">Upload Thumbnail</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500 shadow-xl">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={() => setThumbnailPreview(null)} className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white"><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Gallery Images</label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                <div className="relative border-2 border-dashed border-white/20 rounded-2xl h-20 flex items-center justify-center bg-card-bg/50">
                  <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Images className="text-gray-500" size={24} />
                </div>
                {galleryPreviews.map((src, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden h-20 border border-white/5">
                    <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Description</label>
              <textarea rows={4} placeholder="Description..." onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " resize-none"} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-background p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <MessageCircle size={16} /> Product FAQ's
              </label>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1 bg-purple-600/10 text-purple-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-purple-600 hover:text-white transition-all"
              >
                <Plus size={14} /> Add FAQ
              </button>
            </div>

            <div className="space-y-4 max-h-100 overflow-y-auto pr-2 no-scrollbar">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="relative p-5 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg"
                  >
                    <X size={14} />
                  </button>
                  <input
                    type="text"
                    placeholder="Question (e.g. Is it updated?)"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                    className="w-full bg-background border placeholder:text-foreground border-blue-600 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-purple-500 text-white"
                  />
                  <textarea
                    placeholder="Answer..."
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                    className="w-full bg-background placeholder:text-foreground border border-blue-600 rounded-xl py-2 px-4 text-xs outline-none focus:border-purple-500 text-gray-400 h-20 resize-none"
                  />
                </div>
              ))}
              {formData.faqs.length === 0 && (
                <p className="text-[10px] text-gray-600 font-bold uppercase text-center italic py-4">No FAQs added yet.</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-purple-600 to-indigo-600 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-white">
            {loading ? <Loader2 className="animate-spin" size={24} /> : "PUBLISH ASSET"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;