/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Send, X, Check, CheckCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SOCKET_URL = "https://uefn-maps-server.onrender.com";
const API = "https://uefn-maps-server.onrender.com/api/v1/chat";

const ChatWidget = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);
  const isOpenRef = useRef(false); // বক্সের অবস্থা ট্র্যাক করার জন্য Ref

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getMyId = () => {
    let myId = user?.uid || localStorage.getItem("guest_id");
    if (!myId) {
      myId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("guest_id", myId);
    }
    return myId;
  };

  // ১. ইনিশিয়াল অডিও এবং নোটিফিকেশন পারমিশন
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ২. সকেট কানেকশন এবং লিসেনার (আপনার AdminChat-এর মতো একবারই রান হবে)
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", getMyId());
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, isSeen: true }]);

      // যদি বক্স বন্ধ থাকে (Ref থেকে চেক করা হচ্ছে)
      if (!isOpenRef.current) {
        // অডিও প্লে করা
        audioRef.current?.play().catch(() => console.log("Interaction required for audio"));
        
        setUnreadCount(prev => prev + 1);

        // ব্রাউজার নোটিফিকেশন (ট্যাব হিডেন থাকলে)
        if (document.hidden && Notification.permission === "granted") {
          new Notification("New Message from Support", {
            body: data.text,
            icon: "/p5.jpg" // আপনার প্রজেক্ট অনুযায়ী আইকন পাথ
          });
        }
      }
    });

    // শুরুতেই চ্যাট হিস্টোরি লোড করা
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API}/${getMyId()}`);
        const data = await res.json();
        setMessages(data);
      } catch { console.log("Initial load failed"); }
    };
    loadHistory();

    return () => {
      socket.disconnect();
    };
  }, []); 

  // ৩. বক্স ওপেন/ক্লোজ হ্যান্ডলার এবং Ref আপডেট
  useEffect(() => {
    isOpenRef.current = isOpen; // Ref আপডেট করা হচ্ছে
    if (isOpen) {
      setUnreadCount(0);
      socketRef.current?.emit("mark_seen", getMyId());
      
      // ওপেন হওয়ার পর স্ক্রল ফিক্স
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

  // ৪. নতুন মেসেজ আসলে অটো-স্ক্রল
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      senderId: getMyId(),
      text: input,
      receiverId: "ADMIN",
      isAdmin: false,
      isLogged: !!user,
      isSeen: false,
      timestamp: new Date()
    };

    socketRef.current.emit("send_message", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 h-[500px] bg-[#121214] rounded-[2rem] flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-purple-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-white text-sm italic">UEFN Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-white">
                <X size={20} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0B]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${m.isAdmin ? "bg-[#27272A] text-white rounded-tl-none border border-white/5" : "bg-purple-600 text-white rounded-tr-none"}`}>
                    {m.text}
                    {!m.isAdmin && (
                      <div className="flex justify-end mt-1 opacity-70">
                        {m.isSeen ? <CheckCheck size={12} /> : <Check size={12} />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 bg-[#121214] border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none text-white focus:ring-1 ring-purple-500/50"
              />
              <button type="submit" className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 text-white shadow-lg active:scale-90 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-5 bg-purple-600 rounded-full text-white shadow-3xl border border-white/20"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] animate-bounce">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;