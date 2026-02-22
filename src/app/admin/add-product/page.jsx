/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { ImageIcon, Loader2, Tag, Percent, X } from "lucide-react";
import { uploadImageToCloudinary } from "../../middleware/upload";
import { useAuth } from "../../context/AuthContext";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { auth } from "../../../../firebase";

const AddProduct = () => {
  const { user, mongoUser, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    s3Key: "",
    image: null,
    isDiscount: false,
    discountPrice: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/categories")
      .then(res => res.json())
      .then(data => setCategories(data.data));
  }, []);

  // ইমেজ প্রিভিউ লজিক
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ডিসকাউন্ট ভ্যালিডেশন
    if (formData.isDiscount && Number(formData.discountPrice) >= Number(formData.price)) {
      return alert("Discount price must be lower than the original price!");
    }

    setLoading(true);
    try {
      const imageData = await uploadImageToCloudinary(formData.image);
      if (!imageData) throw new Error("Image upload failed");

      const token = await auth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/api/v1/products/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, image: imageData }),
      });

      if (res.ok) {
        alert("Product Added Successfully! 🚀");
        setPreview(null);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white font-bold">Checking Auth...</div>;
  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  const inputClasses = "w-full bg-[#121214] border-2 border-white/10 rounded-2xl py-4 px-5 mt-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white font-medium placeholder-gray-500 shadow-lg";

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter">
        Add New <span className="text-purple-500">Asset</span>
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side: Product Info */}
        <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Title</label>
            <input required type="text" placeholder="Enter Asset Name" onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClasses} />
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Category</label>
            <select required onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClasses}>
              <option value="" className="bg-[#0d0d0f]">Select Category</option>
              {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-[#0d0d0f]">{cat.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14} /> Price ($)</label>
              <input required type="number" placeholder="49.99" onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">S3 File Key</label>
              <input required type="text" placeholder="maps/city_v1.zip" onChange={e => setFormData({ ...formData, s3Key: e.target.value })} className={inputClasses} />
            </div>
          </div>

          {/* Discount Section */}
          <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/20">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 accent-purple-500" onChange={e => setFormData({ ...formData, isDiscount: e.target.checked })} />
              <span className="text-sm font-bold uppercase tracking-tight group-hover:text-purple-400 transition-colors">Apply Discount?</span>
            </label>

            {formData.isDiscount && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Percent size={12} /> Discounted Price</label>
                <input required type="number" placeholder="Lower than original price" onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} className={inputClasses} />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Media & Details */}
        <div className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Thumbnail</label>
            <div className="mt-2 relative group">
              {!preview ? (
                <div className="border-2 border-dashed border-white/20 rounded-3xl p-12 text-center group-hover:border-purple-500/50 transition-all bg-[#0d0d0f]/50">
                  <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <ImageIcon className="mx-auto text-gray-500 mb-3 group-hover:scale-110 transition-transform" size={48} />
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Click to Upload Image</p>
                  <p className="text-[10px] text-gray-600 mt-2 italic">Recommended: 1280x720px</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500 shadow-2xl shadow-purple-500/10">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <button onClick={() => { setPreview(null); setFormData({ ...formData, image: null }) }} className="absolute top-4 right-4 bg-red-600 p-2 rounded-full hover:bg-red-500 transition-colors shadow-lg">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Description</label>
            <textarea rows={5} placeholder="Describe your asset features..." onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " resize-none"} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-purple-600/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={24} /> : "PUBLISH ASSET"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;