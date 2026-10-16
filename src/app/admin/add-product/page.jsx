/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ImageIcon, Loader2, Tag, Percent, X, Youtube, Images, Plus, MessageCircle } from "lucide-react";
import { uploadImageToCloudinary, uploadMultipleImagesToCloudinary } from "../../middleware/upload";
import { useAuth } from "../../context/AuthContext";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { auth } from "../../../../firebase";
import { publicCatalogUrl } from "../../lib/catalog-client.mjs";
import { adminApiUrl } from "../../lib/runtime-config";
import { publishProductAsset, verifyPublishingAdmin } from "../../lib/product-publish.mjs";

const emptyForm = () => ({
  title: "", description: "", price: "", category: "", gameType: "",
  youtubeId: "", s3Key: "", thumbnail: null, galleryImages: [],
  isDiscount: false, discountPrice: "", faqs: []
});

const AddProduct = () => {
  const { user, mongoUser, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [optionsAttempt, setOptionsAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);
  const submitting = useRef(false);
  const formRef = useRef(null);
  const statusPanelRef = useRef(null);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (saveStatus?.type === "error" || saveStatus?.type === "success") {
      statusPanelRef.current?.focus({ preventScroll: true });
      statusPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [saveStatus?.type]);

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
    const controller = new AbortController();
    const timeoutController = new AbortController();
    const timeout = setTimeout(() => timeoutController.abort(), 15000);
    const readOptions = async endpoint => {
      const response = await fetch(publicCatalogUrl(endpoint), { signal: AbortSignal.any([controller.signal, timeoutController.signal]) });
      const payload = await response.json();
      if (!response.ok || payload?.success !== true || !Array.isArray(payload.data)) {
        throw new Error("Categories and game types could not load. Please retry before saving.");
      }
      return payload.data;
    };
    Promise.all([readOptions("categories"), readOptions("game-types")])
      .then(([nextCategories, nextGameTypes]) => {
        if (controller.signal.aborted) return;
        setCategories(nextCategories);
        setGameTypes(nextGameTypes);
      })
      .catch(() => {
        if (!controller.signal.aborted) setOptionsError("Categories and game types could not load. Please retry before saving.");
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!controller.signal.aborted) setOptionsLoading(false);
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [optionsAttempt]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // গ্যালারি ইমেজ হ্যান্ডলিং
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    // ফাইলগুলো মূল স্টেটে যোগ করা
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...files]
    }));

    // প্রিভিউ জেনারেট করা
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryPreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  // গ্যালারি ইমেজ রিমুভ করার ফাংশন
  const removeGalleryImage = (index) => {
    const updatedImages = formData.galleryImages.filter((_, i) => i !== index);
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);

    setFormData({ ...formData, galleryImages: updatedImages });
    setGalleryPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current || saveStatus?.productId) return;
    if (optionsLoading || optionsError) return;
    submitting.current = true;
    setLoading(true);
    setSaveStatus({ type: "pending", message: "Checking asset details…" });
    try {
      const saved = await publishProductAsset({
        form: { ...formData, galleryImages: [...formData.galleryImages], faqs: formData.faqs.map(faq => ({ ...faq })) },
        session: { uid: user?.uid, role: mongoUser?.role, name: mongoUser?.name, email: mongoUser?.email },
        getToken: async () => {
          if (!auth.currentUser || auth.currentUser.uid !== user?.uid) {
            throw new Error("Your session has expired. Sign in again before saving.");
          }
          const token = await auth.currentUser.getIdToken();
          if (auth.currentUser?.uid !== user?.uid) throw new Error("Your signed-in account changed. Sign in again before saving.");
          return token;
        },
        verifyAdmin: (token, uid) => verifyPublishingAdmin({ token, uid, endpoint: adminApiUrl(`users/${encodeURIComponent(uid)}`) }),
        endpoint: adminApiUrl("products/create-product"),
        uploadImage: uploadImageToCloudinary,
        uploadGallery: uploadMultipleImagesToCloudinary,
        onProgress: message => setSaveStatus({ type: "pending", message })
      });
      setSaveStatus({ type: "success", message: "Asset saved successfully. The public catalog may take up to a minute to refresh.", productId: saved.productId });
    } catch (err) {
      setSaveStatus({ type: "error", message: err?.message || "The asset could not be saved. Your entries have been kept." });
    } finally {
      setLoading(false);
      submitting.current = false;
    }
  };

  const addAnotherAsset = () => {
    formRef.current?.reset();
    setFormData(emptyForm());
    setThumbnailPreview(null);
    setGalleryPreviews([]);
    setSaveStatus(null);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading Auth...</div>;
  if (!user || mongoUser?.role !== "admin") return <AdminOnly />;

  const inputClasses = "w-full bg-background border-2 border-border-color rounded-2xl py-4 px-5 mt-2 focus:border-purple-500 outline-none transition-all text-foreground font-medium shadow-lg";

  return (
    <div className="max-w-6xl mx-auto p-6 text-foreground mt-10 pb-20">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" style={{ backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-full max-w-200 h-full bg-purple-600/15 blur-[150px] rounded-full" />
      </div>

      <h2 className="text-4xl font-black uppercase mb-10 tracking-tighter italic">
        Add New <span className="text-purple-500 font-black">Asset</span>
      </h2>

      {optionsLoading && <p role="status" className="mb-6">Loading categories and game types…</p>}
      {optionsError && (
        <div role="alert" className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
          <p>{optionsError}</p>
          <button type="button" className="mt-3 underline font-bold" onClick={() => { setOptionsLoading(true); setOptionsError(""); setOptionsAttempt(value => value + 1); }}>Retry loading options</button>
        </div>
      )}
      {saveStatus && (
        <div ref={statusPanelRef} tabIndex={-1} role={saveStatus.type === "error" ? "alert" : "status"} className={`mb-6 rounded-2xl border p-5 ${saveStatus.type === "error" ? "border-red-500/40 bg-red-500/10" : "border-purple-500/40 bg-purple-500/10"}`}>
          <p>{saveStatus.message}</p>
          {saveStatus.type === "error" && <p className="mt-2 text-sm">Your form and selected images have been kept.</p>}
          <div className="mt-3 flex flex-wrap gap-5 font-bold">
            {saveStatus.productId && <Link className="underline" href={`/marketplace/${saveStatus.productId}`}>View asset</Link>}
            {saveStatus.type !== "pending" && <Link className="underline" href="/admin/all-product">Manage Assets</Link>}
            {saveStatus.productId && <button type="button" className="underline" onClick={addAnotherAsset}>Add another asset</button>}
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <fieldset disabled={loading || !!saveStatus?.productId} className="contents">
        {/* Left Side: Logic & Info */}
        <div className="space-y-6 bg-background p-8 rounded-[2.5rem] border border-white/5 shadow-2xl h-fit">
          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Title</label>
            <input required type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Category</label>
              <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputClasses}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-card-bg">{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Game Type</label>
              <select required value={formData.gameType} onChange={e => setFormData({ ...formData, gameType: e.target.value })} className={inputClasses}>
                <option value="">Select Type</option>
                {gameTypes.map(type => <option key={type._id} value={type._id} className="bg-card-bg">{type.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14} /> Price ($)</label>
              <input required type="number" min="0" step="0.01" placeholder="49.99" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">S3 File Key</label>
              <input required type="text" placeholder="maps/file.zip" value={formData.s3Key} onChange={e => setFormData({ ...formData, s3Key: e.target.value })} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Youtube size={14} /> YouTube ID</label>
            <input type="text" placeholder="Video ID only" value={formData.youtubeId} onChange={e => setFormData({ ...formData, youtubeId: e.target.value })} className={inputClasses} />
          </div>

          <div className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/20">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-purple-500" checked={formData.isDiscount} onChange={e => setFormData({ ...formData, isDiscount: e.target.checked })} />
              <span className="text-sm font-bold uppercase">Apply Discount?</span>
            </label>
            {formData.isDiscount && (
              <div className="mt-4">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Percent size={12} /> Discounted Price</label>
                <input required type="number" min="0" step="0.01" placeholder="Discount Price" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} className={inputClasses} />
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
                  <p className="text-xs text-forground font-bold uppercase italic">Upload Thumbnail</p>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500 shadow-xl">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={() => { setThumbnailPreview(null); setFormData({ ...formData, thumbnail: null }) }} className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white"><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Gallery Images</label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                <div className="relative border-2 border-dashed border-white/20 rounded-2xl h-20 flex items-center justify-center bg-card-bg/50 hover:bg-card-bg transition-all">
                  <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Images className="text-gray-500" size={24} />
                </div>
                {galleryPreviews.map((src, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden h-20 border border-white/5 group">
                    <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                    {/* Gallery Image Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Asset Description</label>
              <textarea required rows={4} placeholder="Description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " resize-none"} />
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
                    className="w-full bg-background placeholder:text-foreground border border-blue-600 rounded-xl py-2 px-4 text-xs outline-none focus:border-purple-500 text-forground h-20 resize-none"
                  />
                </div>
              ))}
              {formData.faqs.length === 0 && (
                <p className="text-[10px] text-gray-600 font-bold uppercase text-center italic py-4">No FAQs added yet.</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading || optionsLoading || !!optionsError || !!saveStatus?.productId} className="w-full bg-linear-to-r from-purple-600 to-indigo-600 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-white">
            {loading ? <><Loader2 className="animate-spin" size={24} /> Saving asset…</> : saveStatus?.productId ? "ASSET SAVED" : "PUBLISH ASSET"}
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddProduct;
