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
  Loader2,
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
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
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
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // সার্চ ফিল্টার: ID, ইউজার নেম বা ইমেইল দিয়ে ফিল্টার
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderId = order._id?.toString().toLowerCase() || "";
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-purple-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-xs">
          Loading Vault Records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-10 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-foreground">
            Order <span className="text-purple-500">History</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm italic">
            Manage customer transactions and asset deployments.
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Order ID, Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card-bg border border-border-color rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-sm text-foreground shadow-xl backdrop-blur-md"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border border-border-color bg-white/5 backdrop-blur-xl">
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
        <div className="glass-card p-6 rounded-3xl flex items-center gap-5 border border-border-color bg-white/5 backdrop-blur-xl">
          <div className="p-4 bg-green-500/10 rounded-2xl text-green-500">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Revenue
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

      {/* Table Section */}
      <div className="hidden lg:block glass-card rounded-[2.5rem] overflow-hidden border border-border-color shadow-2xl relative z-10 bg-white/[0.02] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-border-color">
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  ID
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Customer
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Assets
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-20 text-center text-muted-foreground font-bold uppercase text-xs"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <span className="text-xs font-black text-purple-400 font-mono uppercase">
                        #{order._id.slice(-6)}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center overflow-hidden border border-purple-500/20">
                          {order.userId?.image ? (
                            <img
                              src={order.userId.image}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <User size={16} className="text-purple-500" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-foreground truncate uppercase italic">
                            {order.userId?.name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {order.userId?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex -space-x-3">
                        {order.products?.map((item, idx) => (
                          <div
                            key={idx}
                            className="relative group/img shrink-0"
                          >
                            <img
                              src={
                                item.productId?.image?.url || "/placeholder.png"
                              }
                              alt=""
                              className="w-10 h-10 rounded-xl border-2 border-background object-cover shadow-lg hover:scale-110 transition-transform"
                              title={item.productId?.title}
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
                      <div className="flex flex-col gap-1">
                        <span className="w-fit px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          {order.paymentStatus}
                        </span>
                        <span className="w-fit px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-foreground/90">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground italic">
                          {new Date(order.createdAt).toLocaleTimeString([], {
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

      {/* Pagination Controls */}
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
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-card-bg border border-border-color text-muted-foreground"}`}
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
