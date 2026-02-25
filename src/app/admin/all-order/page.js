/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Search,
  DollarSign,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { auth } from "../../../../firebase";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `https://uefn-maps-server.vercel.app/api/v1/orders/get-all-order?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
        setTotalPages(data.meta.totalPages || 1);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // সার্চ লজিক আপডেট: এখন ID এবং User Name উভয় দিয়েই ফিল্টার হবে
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderId = (order._id?.$oid || order._id).toString().toLowerCase();
    const userName = order.userId?.name?.toLowerCase() || "";
    const userEmail = order.userId?.email?.toLowerCase() || "";

    return (
      orderId.includes(searchLower) ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-5 border border-border-color">
            <div className="w-14 h-14 bg-white/5 rounded-2xl" />
            <div className="space-y-2">
              <div className="w-16 h-2 bg-white/5 rounded" />
              <div className="w-24 h-6 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton (Desktop) */}
      <div className="hidden lg:block glass-card rounded-[2.5rem] overflow-hidden border border-border-color">
        <div className="p-6 border-b border-border-color bg-white/5 flex justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-20 h-3 bg-white/10 rounded" />
          ))}
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="w-24 h-4 bg-white/5 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-white/10 rounded" />
                  <div className="w-28 h-2 bg-white/5 rounded" />
                </div>
              </div>
              <div className="flex -space-x-3">
                {[1, 2].map((j) => (
                  <div key={j} className="w-10 h-10 rounded-xl bg-white/5 border-2 border-background" />
                ))}
              </div>
              <div className="w-16 h-6 bg-white/10 rounded-full" />
              <div className="w-20 h-4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Card Skeleton (Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-[2rem] p-6 border border-border-color space-y-5">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-white/10 rounded" />
                  <div className="w-12 h-2 bg-white/5 rounded" />
                </div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="w-12 h-12 rounded-xl bg-white/5" />
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between">
              <div className="w-16 h-4 bg-white/10 rounded" />
              <div className="w-20 h-3 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  }

  return (
    <div className="space-y-6 mt-10 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-foreground">
            Order <span className="text-purple-500">History</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm italic">
            Track and manage all customer transactions with ease.
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Name, Email or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card-bg border border-border-color rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-sm text-foreground shadow-xl backdrop-blur-md"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border border-border-color">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500">
            <Package size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Total Sales
            </p>
            <h4 className="text-2xl font-black text-foreground">
              {orders.length}
            </h4>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border border-border-color">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-500">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Net Revenue
            </p>
            <h4 className="text-2xl font-black text-foreground">
              $
              {orders
                .reduce((acc, curr) => acc + curr.totalAmount, 0)
                .toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block glass-card rounded-[2.5rem] overflow-hidden border border-border-color shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-border-color">
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Order / ID
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Customer Info
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Items
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right text-nowrap">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center text-muted-foreground italic font-bold uppercase text-xs"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id?.$oid || order._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <span className="text-xs font-black text-purple-400 font-mono">
                        #{(order._id?.$oid || order._id).slice(-8)}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center overflow-hidden shrink-0">
                          {order.userId?.photoURL ? (
                            <img
                              src={order.userId.photoURL}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-purple-500" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-foreground truncate uppercase italic">
                            {order.userId?.name || "Anonymous"}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate opacity-70">
                            {order.userId?.email || order.userId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex -space-x-3">
                        {order.products.map((prod, idx) => (
                          <div
                            key={idx}
                            className="relative group/tool shrink-0"
                          >
                            <img
                              src={prod.image.url}
                              alt=""
                              className="w-10 h-10 rounded-xl border-2 border-background object-cover shadow-lg"
                              title={prod.title}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-lg font-black text-foreground italic">
                        ${order.totalAmount}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase border ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase border ${order.status === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-foreground/90">
                          {new Date(
                            order.createdAt?.$date || order.createdAt,
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground italic">
                          {new Date(
                            order.createdAt?.$date || order.createdAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden relative z-10">
        {filteredOrders.map((order) => (
          <div
            key={order._id?.$oid || order._id}
            className="glass-card rounded-4xl p-6 border border-border-color space-y-5"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <User size={18} className="text-purple-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground uppercase italic">
                    {order.userId?.name || "Guest"}
                  </h4>
                  <p className="text-[10px] font-mono text-purple-400">
                    #{(order._id?.$oid || order._id).slice(-8)}
                  </p>
                </div>
              </div>
              <span className="text-xl font-black text-foreground italic">
                ${order.totalAmount}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {order.products.map((prod, idx) => (
                <img
                  key={idx}
                  src={prod.image.url}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground">
                {new Date(
                  order.createdAt?.$date || order.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-3 relative z-20">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-xl bg-card-bg border border-border-color disabled:opacity-20 hover:bg-purple-600/10 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-card-bg border border-border-color text-muted-foreground hover:border-purple-500/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl bg-card-bg border border-border-color disabled:opacity-20 hover:bg-purple-600/10 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
