/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { Download, Package, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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
          `https://uefn-maps-server.vercel.app/api/v1/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        console.log(data)
        if (data.success) {
          // পপুলেটেড ডাটা থেকে প্রোডাক্টগুলোকে বের করে আনা
          const allAssets = data.data.flatMap((order) =>
            order.products
              .filter((item) => item.productId) // যদি কোনো প্রোডাক্ট ডাটাবেস থেকে ডিলিট হয়ে যায়
              .map((item) => ({
                ...item.productId, // টাইটেল, ইমেজ, সাক্কি এখানে আছে
                orderDate: order.createdAt,
              })),
          );
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
      const user = auth.currentUser;
      if (!user) return alert("Please login first");

      const token = await user.getIdToken();
      const response = await fetch(
        `https://uefn-maps-server.vercel.app/api/v1/products/download-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            s3Key: asset.s3Key,
            productId: asset._id,
          }),
        },
      );

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        const link = document.createElement("a");
        link.href = data.downloadUrl;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.message || "Download failed");
      }
    } catch (error) {
      console.error("Critical Download Error:", error);
      alert("Check server logs or connection.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={40} />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
          Accessing your vault...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-250 h-full bg-purple-600/20 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic">
              My <span className="text-purple-500">Assets</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-2 uppercase tracking-widest italic">
              Owned Blueprints • {assets.length} items
            </p>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="text-center py-28 bg-white/2 rounded-[2.5rem] border border-dashed border-border-color backdrop-blur-md">
            <Package
              size={46}
              className="mx-auto mb-4 text-purple-500 opacity-30"
            />
            <h2 className="text-xl font-black text-foreground uppercase italic">
              Vault Empty
            </h2>
            <p className="text-muted-foreground mt-2 text-sm italic">
              You don't own any assets yet. Visit the marketplace to start
              building.
            </p>
            <Link
              href="/marketplace"
              className="mt-6 inline-block bg-purple-600 px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-purple-500 transition-all"
            >
              Go Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Desktop View */}
            <div className="hidden md:block glass-card rounded-4xl overflow-hidden border border-border-color bg-white/2">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="p-6">Asset</th>
                    <th className="p-6">Title</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Order ID</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assets.map((asset, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/2 transition-colors"
                    >
                      <td className="p-6">
                        <img
                          src={asset.image?.url}
                          className="w-12 h-12 rounded-xl object-cover border border-white/5"
                          alt=""
                        />
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-black uppercase italic text-foreground">
                          {asset.title}
                        </span>
                      </td>
                      <td className="p-6 font-black text-purple-500 italic">
                        ${asset.price}
                      </td>
                      <td className="p-6 font-black text-purple-400 text-sm italic">
                        {asset._id}
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDownload(asset)}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-purple-600/20 active:scale-95"
                        >
                          <Download size={14} /> Download
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden grid gap-4">
              {assets.map((asset, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/3 border border-border-color p-4 rounded-3xl flex items-center gap-4"
                >
                  <img
                    src={asset.image?.url}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/5"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black uppercase italic text-sm truncate">
                      {asset.title}
                    </h3>
                    <p className="text-[10px] text-purple-500 font-bold">
                      ${asset.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(asset)}
                    className="p-3 rounded-xl bg-purple-600 text-white transition-all active:scale-90"
                  >
                    <Download size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
