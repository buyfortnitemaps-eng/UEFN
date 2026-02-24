/* eslint-disable react/no-unescaped-entities */
"use client";
import { Zap, Target, ShieldCheck, Rocket } from "lucide-react";

const AdminOverview = () => {
  const highlights = [
    {
      label: "Growth Strategy",
      title: "Scale Operations",
      desc: "Optimize infrastructure for next-gen performance.",
      icon: <Rocket size={20} className="text-purple-500" />,
    },
    {
      label: "Engagement Hub",
      title: "Active Community",
      desc: "Real-time interaction with global user segments.",
      icon: <Zap size={20} className="text-amber-500" />,
    },
    {
      label: "Market Reach",
      title: "Target Audience",
      desc: "Data-driven insights to capture new territories.",
      icon: <Target size={20} className="text-blue-500" />,
    },
    {
      label: "System Health",
      title: "Ironclad Security",
      desc: "Proactive monitoring and threat mitigation active.",
      icon: <ShieldCheck size={20} className="text-green-500" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          System <span className="text-purple-500">Status</span>
        </h2>
        <p className="text-gray-500 text-sm italic">
          Focusing on high-impact objectives today.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {highlights.map((item, i) => (
          <div
            key={i}
            className="bg-background border border-white/5 p-6 rounded-3xl hover:bg-white/[0.08] hover:border-purple-500/40 transition-all group"
          >
            <div className="mb-4 bg-background/40 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
              {item.label}
            </p>
            <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Strategic Board */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-transparent border border-white/5 rounded-[40px] p-12 flex flex-col items-center justify-center text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px]" />

        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping" />
        </div>

        <h4 className="text-xl font-bold text-foreground mb-3">
          Vision Control Center
        </h4>
        <p className="max-w-md text-gray-500 text-sm font-medium leading-loose">
          "The best way to predict the future is to create it. Your dashboard is
          now ready for high-level tactical deployment."
        </p>

        <div className="mt-8 flex gap-4">
          <div className="px-4 py-1.5 rounded-full border border-white/5 text-[10px] uppercase font-bold text-gray-400">
            Tactical Mode
          </div>
          <div className="px-4 py-1.5 rounded-full border border-purple-500/30 text-[10px] uppercase font-bold text-purple-400">
            Live Sync
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
