"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Layers, Loader2 } from "lucide-react";
import { auth } from "../../../../firebase";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { useAuth } from "@/app/context/AuthContext";

const AddCategory = () => {
  const { user, mongoUser, loading: authLoading } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  // ১. ক্যাটাগরি ফেচ করা (Fetch all categories)
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/categories");
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ২. ক্যাটাগরি সাবমিট করা (Add Category)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!categoryName) return;
  //   setLoading(true);
  //   try {
  //     // ফ্রন্টএন্ডে রিকোয়েস্ট পাঠানোর সময়
  //     const token = await auth.currentUser.getIdToken(); // Firebase থেকে টোকেন নেওয়া

  //     const res = await fetch(
  //       "https://uefn-maps-server.vercel.app/api/v1/categories/create-category",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // এখানে টোকেনটি দিতে হবে
  //         },
  //         body: JSON.stringify({ name: categoryName }),
  //       },
  //     );
  //     if (res.ok) {
  //       setCategoryName("");
  //       fetchCategories(); // লিস্ট রিফ্রেশ করা
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ৩. ক্যাটাগরি ডিলিট করা (Delete Category)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = await auth.currentUser.getIdToken(); // Firebase থেকে টোকেন নেওয়া

      await fetch(`https://uefn-maps-server.vercel.app/api/v1/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // এখানে টোকেনটি দিতে হবে
        },
      });
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditId(category._id);
    setCategoryName(category.name); // ইনপুটে নাম সেট হবে
    window.scrollTo({ top: 0, behavior: 'smooth' }); // স্ক্রল করে উপরে নিয়ে যাবে
  };

  // handleSubmit ফাংশনটি আপডেট করুন
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const url = isEditing
        ? `https://uefn-maps-server.vercel.app/api/v1/categories/${editId}`
        : "https://uefn-maps-server.vercel.app/api/v1/categories/create-category";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (res.ok) {
        setCategoryName("");
        setIsEditing(false);
        setEditId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  // যদি ইউজার লগইন না থাকে অথবা ইউজার অ্যাডমিন না হয়
  if (!user || mongoUser?.role !== "admin") {
    return <AdminOnly />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
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
      {/* --- Add Category Form --- */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Add New <span className="text-purple-500">Category</span>
          </h2>
          <p className="text-gray-500 text-xs italic">
            Create a new category for your UEFN assets.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 bg-white/2 p-6 rounded-4xl border border-white/5 backdrop-blur-md"
        >
          <div className="relative flex-1 group">
            <Layers
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500"
              size={18}
            />
            <input
              required
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter Category Name (e.g. Box Fight, Tycoon)"
              className="w-full bg-card-bg border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 min-w-40"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Plus size={20} /> Add
              </>
            )}
          </button>
        </form>
      </section>

      {/* --- Category Table List --- */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-purple-500">
            Existing Categories ({categories.length})
          </h3>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-4xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-white/5">
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest">
                    Category Name
                  </th>
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest">
                    Products
                  </th>
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-10 text-center text-gray-600 animate-pulse font-bold uppercase italic"
                    >
                      Loading database...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-10 text-center text-gray-600 italic"
                    >
                      No categories found. Create one above!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                    >
                      <td className="p-5 font-bold text-sm text-foreground">
                        {cat.name}
                      </td>
                      <td className="p-5 text-xs text-gray-500">{cat?.totalProduct} Products</td>
                      <td className="p-5 text-right space-x-2">
                        <button onClick={() => handleEditClick(cat)} className="p-2.5 bg-background hover:bg-blue-600/20 text-gray-400 hover:text-blue-500 rounded-xl transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2.5 bg-background hover:bg-red-600/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddCategory;
