/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";

const AdminOverview = () => {
  const stats = [
    { label: "Total Sales", val: "$12,450", trend: "+12%" },
    { label: "Active Users", val: "1,240", trend: "+5%" },
    { label: "Products", val: "48", trend: "0%" },
    { label: "Pending Orders", val: "12", trend: "-2%" }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Dashboard <span className="text-purple-500">Overview</span>
        </h2>
        <p className="text-gray-500 text-sm italic">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/2 border border-white/5 p-6 rounded-3xl hover:border-purple-500/30 transition-all">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black">{stat.val}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="bg-white/2 border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center border-dashed">
         <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
         </div>
         <p className="text-gray-500 font-medium">Recent Activity Data Coming Soon...</p>
      </div>
    </div>
  );
};

export default AdminOverview;