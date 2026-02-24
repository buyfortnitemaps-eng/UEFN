/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { Download, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function MyAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAssets = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const token = await currentUser.getIdToken();
        const response = await fetch(
          `https://uefn-maps-server.onrender.com/api/v1/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();

        if (data.success) {
          // অর্ডারের ভেতর থেকে সব প্রোডাক্টগুলোকে ফ্ল্যাট অ্যারেতে নেওয়া
          const allAssets = data.data.flatMap((order) => order.products);
          setAssets(allAssets);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, []);

const handleDownload = async (asset) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`https://uefn-maps-server.onrender.com/api/v1/products/download-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        s3Key: asset.s3Key,
        productId: asset._id,
      }),
    });

    const data = await response.json();
    console.log("Full Server Response:", data); // এখানে এখন ডাটা দেখতে পাবেন

    if (data.success && data.downloadUrl) {
      // সরাসরি উইন্ডো ওপেন করলে পপ-আপ ব্লকার আটকাতে পারে
      // তাই নিচের এই ট্রিকটি ব্যবহার করুন
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.setAttribute("download", ""); // ফাইল নেম অটোমেটিক নিবে
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error("Critical Download Error:", error);
    alert("Check server logs or connection.");
  }
};

  // বাটন ডিজাইন:

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-500 font-black tracking-widest animate-pulse">
        LOADING VAULT...
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
              My <span className="text-purple-500">Vault</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest">
              Owned Assets • {assets.length}
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {assets.length === 0 ? (
          <div className="text-center py-28 bg-white/4 rounded-3xl border border-dashed border-border-color">
            <Package size={46} className="mx-auto mb-4 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-300">Vault Empty</h2>
            <p className="text-gray-500 mt-2 text-sm">
              You don't own any assets yet.
            </p>
          </div>
        ) : (
          <>
            {/* ================== DESKTOP TABLE ================== */}
            <div className="hidden md:block bg-white/4 border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-background text-foreground text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-5 text-left">Asset</th>
                    <th className="p-5 text-left">Title</th>
                    <th className="p-5 text-left">Price</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {assets.map((asset, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-white/3 transition-colors"
                    >
                      {/* ASSET */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={asset.image?.url}
                            className="w-10 h-10 rounded-xl object-cover border border-white/5"
                            alt={asset.title}
                          />
                        </div>
                      </td>

                      {/* LICENSE */}
                      <td className="p-5">
                        <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/20">
                          {asset.title}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="p-5 font-mono text-purple-400 font-bold">
                        ${asset.price}
                      </td>

                      {/* DOWNLOAD */}
                      <td className="p-5 text-right">
                        {/* ডেক্সটপ ভিউতে টেবিলের ভেতরের বাটনটি এভাবে পরিবর্তন করুন */}
                        <button
                          onClick={() => handleDownload(asset)} // window.open এর বদলে ফাংশন কল করুন
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background hover:bg-background border border-white/5 hover:border-purple-500/30 text-foreground hover:text-purple-400 transition-all"
                        >
                          <Download size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Download
                          </span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================== MOBILE CARDS ================== */}
            <div className="grid md:hidden gap-4">
              {assets.map((asset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white/4 border border-white/5 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={asset.image?.url}
                    className="w-16 h-16 rounded-xl object-cover border border-white/5"
                    alt={asset.title}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{asset.title}</h3>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        ${asset.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(asset)}
                    className="p-3 rounded-xl bg-background hover:bg-purple-600 text-purple-400 hover:text-foreground transition group"
                  >
                    <Download
                      size={18}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
