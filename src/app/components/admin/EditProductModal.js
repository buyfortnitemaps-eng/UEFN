/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { X, ImageIcon, Loader2, Save } from "lucide-react";
import { uploadImageToCloudinary } from "../../middleware/upload";
import { auth } from "../../../../firebase"

const EditProductModal = ({ product, onClose, refresh, categories }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(product.image.url);
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category._id || product.category,
    s3Key: product.s3Key,
    image: null, // নতুন ইমেজ সিলেক্ট করলে এখানে আসবে
    isDiscount: product.isDiscount || false,
    discountPrice: product.discountPrice || "",
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
    if (
      formData.isDiscount &&
      Number(formData.discountPrice) >= Number(formData.price)
    ) {
      return alert("Discount price must be lower than original price!");
    }

    setLoading(true);
    try {
      let finalImageData = product.image; // ডিফল্টভাবে আগের ইমেজ ডাটা

      // যদি ইউজার নতুন ইমেজ সিলেক্ট করে
      if (formData.image) {
        const uploaded = await uploadImageToCloudinary(formData.image);
        if (uploaded) {
          finalImageData = uploaded; // { url, publicId }
        }
      }

      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `https://uefn-maps-server.onrender.com/api/v1/products/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, image: finalImageData }),
        },
      );

      if (res.ok) {
        alert("Product Updated Successfully! ✨");
        refresh(); // টেবিল রিফ্রেশ করা
        onClose(); // মোডাল বন্ধ করা
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0d0d0f] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0d0d0f]/80 backdrop-blur-md p-6 border-b border-white/5 flex justify-between items-center z-10">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Edit <span className="text-purple-500">Asset</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-500">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500"
              >
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-[#0d0d0f]"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500">
                  S3 Key
                </label>
                <input
                  type="text"
                  value={formData.s3Key}
                  onChange={(e) =>
                    setFormData({ ...formData, s3Key: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                checked={formData.isDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, isDiscount: e.target.checked })
                }
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-xs font-bold uppercase">
                Apply Discount?
              </span>
            </div>

            {formData.isDiscount && (
              <input
                type="number"
                placeholder="Discount Price"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-purple-500"
              />
            )}
          </div>

          {/* Image & Description */}
          <div className="space-y-5">
            <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-white/10 h-48 bg-white/2">
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="text-white" size={32} />
                <span className="ml-2 text-xs font-bold uppercase">
                  Change Image
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-500">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 mt-1 outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} /> Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
