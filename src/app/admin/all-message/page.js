/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import { Trash2, User, Clock, Mail } from "lucide-react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("https://uefn-maps-server.onrender.com/api/v1/contacts/all-messages")
      .then(res => res.json())
      .then(data => setMessages(data.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`https://uefn-maps-server.onrender.com/api/v1/contacts/delete/${id}`, { method: "DELETE" });
    setMessages(messages.filter(m => m._id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-10 pt-28">
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-10 uppercase tracking-widest border-l-4 border-purple-500 pl-4">
          Inbox <span className="text-gray-500 text-lg">({messages.length})</span>
        </h1>

        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-background border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row justify-between gap-6 hover:border-purple-500/30 transition-all">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-xs font-bold">
                    <User size={14} /> {msg.name}
                  </div>
                  <div className="text-gray-500 text-xs flex items-center gap-2 italic">
                    <Mail size={14} /> {msg.email}
                  </div>
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    <Clock size={14} /> {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed bg-background/20 p-4 rounded-2xl border border-white/5 italic">
                  "{msg.message}"
                </p>
                <p className="text-purple-400 text-xs font-bold">Phone: {msg.phone}</p>
              </div>
              <button 
                onClick={() => handleDelete(msg._id)}
                className="p-4 h-fit bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground rounded-2xl transition-all self-end md:self-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;