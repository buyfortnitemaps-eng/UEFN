/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  Search,
  Loader2,
  DollarSign,
  User,
} from "lucide-react";
import { auth } from "../../../../firebase";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        "https://uefn-maps-server.onrender.com/api/v1/orders/get-all-order",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      const sortedOrders = (data.data || []).sort((a, b) => {
        return (
          new Date(b.createdAt.$date || b.createdAt) -
          new Date(a.createdAt.$date || a.createdAt)
        );
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-10 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-white">
            Order <span className="text-purple-500">History</span>
          </h2>
          <p className="text-gray-500 text-xs md:text-sm italic">
            Track and manage all customer transactions.
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Order or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 outline-none focus:border-purple-500 transition-all text-sm text-white"
          />
        </div>
      </div>

      {/* Stats Grid - Responsive Column Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500">
              Total Orders
            </p>
            <h4 className="text-xl md:text-2xl font-bold text-white">
              {orders.length}
            </h4>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-3xl backdrop-blur-md flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500">
              Total Revenue
            </p>
            <h4 className="text-xl md:text-2xl font-bold text-white">
              $
              {orders
                .reduce((acc, curr) => acc + curr.totalAmount, 0)
                .toFixed(2)}
            </h4>
          </div>
        </div>
       
      </div>

      {/* Mobile & Tablet Card View (Hidden on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order._id.$oid || order._id}
            className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase font-mono">
                  #{order._id.$oid?.slice(-8) || order._id.slice(-8)}
                </p>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <User size={12} />
                  <span className="text-[10px] truncate w-32">
                    {order.userId}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white italic">
                  ${order.totalAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {order.products.map((prod, idx) => (
                <img
                  key={idx}
                  src={prod.image.url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                >
                  {order.paymentStatus}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${order.status === "completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold">
                {new Date(
                  order.createdAt.$date || order.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:block bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Order Info
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Products
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Amount
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-gray-500 italic uppercase font-bold text-xs"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id.$oid || order._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-purple-400 mb-1 font-mono">
                          #{order._id.$oid?.slice(-8) || order._id.slice(-8)}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate w-32">
                          User: {order.userId}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex -space-x-3">
                        {order.products.map((prod, idx) => (
                          <div key={idx} className="relative group/tool">
                            <img
                              src={prod.image.url}
                              alt={prod.title}
                              className="w-10 h-10 rounded-xl border-2 border-[#0d0d0f] object-cover"
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tool:block bg-black text-white text-[8px] px-2 py-1 rounded-md whitespace-nowrap z-50">
                              {prod.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-6 text-lg font-black text-white italic">
                      ${order.totalAmount}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.paymentStatus === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span
                          className={`w-fit px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.status === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-300">
                          {new Date(
                            order.createdAt.$date || order.createdAt,
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-600 italic">
                          {new Date(
                            order.createdAt.$date || order.createdAt,
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
    </div>
  );
};

export default AdminOrders;
