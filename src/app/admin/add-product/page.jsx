/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { ImageIcon, Loader2, Tag, Percent, X, Youtube, Images } from "lucide-react";
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
    galleryImages: [], // মাল্টিপল ফাইলের জন্য
    isDiscount: false,
    discountPrice: ""
  });

  useEffect(() => {
    // ফেচ ক্যাটাগরি
    fetch("https://uefn-maps-server.onrender.com/api/v1/categories")
      .then(res => res.json())
      .then(data => setCategories(data.data));

    // ফেচ গেম টাইপ
    fetch("https://uefn-maps-server.onrender.com/api/v1/game-types")
      .then(res => res.json())
      .then(data => setGameTypes(data.data));
  }, []);

  // থাম্বনেইল হ্যান্ডলার
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // গ্যালারি হ্যান্ডলার (মাল্টিপল)
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
      // ১. থাম্বনেইল আপলোড
      const thumbData = await uploadImageToCloudinary(formData.thumbnail);
      
      // ২. গ্যালারি আপলোড (যদি থাকে)
      let galleryData = [];
      if (formData.galleryImages.length > 0) {
        galleryData = await uploadMultipleImagesToCloudinary(formData.galleryImages);
      }

      const token = await auth.currentUser.getIdToken();

      // ৩. ইন্টারফেস অনুযায়ী পে-লোড তৈরি
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
        image: thumbData, // {url, publicId}
        gallery: galleryData, // [{url, publicId}, ...]
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
        // ফর্ম রিসেট লজিক এখানে দিতে পারেন
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Auth...</div>;
  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  const inputClasses = "w-full bg-[#121214] border-2 border-white/10 rounded-2xl py-4 px-5 mt-2 focus:border-purple-500 outline-none transition-all text-white font-medium shadow-lg";

  return (
    <div className="max-w-6xl mx-auto p-6 text-white mt-10">
      <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">
        Add New <span className="text-purple-500">Asset</span>
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Logic & Info */}
        <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Title</label>
            <input required type="text" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Category</label>
              <select required onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClasses}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-[#0d0d0f]">{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Game Type</label>
              <select required onChange={e => setFormData({ ...formData, gameType: e.target.value })} className={inputClasses}>
                <option value="">Select Type</option>
                {gameTypes.map(type => <option key={type._id} value={type._id} className="bg-[#0d0d0f]">{type.name}</option>)}
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
            <input type="text" placeholder="Video ID only (e.g. dQw4w9WgXcQ)" onChange={e => setFormData({ ...formData, youtubeId: e.target.value })} className={inputClasses} />
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

        {/* Right Side: Media */}
        <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Main Thumbnail</label>
            <div className="mt-2 relative">
              {!thumbnailPreview ? (
                <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center bg-[#0d0d0f]/50">
                  <input type="file" required accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <ImageIcon className="mx-auto text-gray-500 mb-2" size={40} />
                  <p className="text-xs text-gray-400 font-bold uppercase italic">Upload Thumbnail</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500 shadow-xl">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={() => setThumbnailPreview(null)} className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full"><X size={16}/></button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Gallery Images</label>
            <div className="mt-2 grid grid-cols-4 gap-3">
              <div className="relative border-2 border-dashed border-white/20 rounded-2xl h-20 flex items-center justify-center bg-[#0d0d0f]/50">
                <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Images className="text-gray-500" size={24} />
              </div>
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden h-20 border border-white/10">
                  <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Description</label>
            <textarea rows={4} placeholder="Description..." onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " resize-none"} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={24} /> : "PUBLISH ASSET"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;