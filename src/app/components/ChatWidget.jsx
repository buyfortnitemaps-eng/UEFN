/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Send, X, Check, CheckCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SOCKET_URL = "http://localhost:5000";
const API = "http://localhost:5000/api/v1/chat";

const ChatWidget = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const audioRef = useRef(null);

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

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  useEffect(() => {
    if (socketRef.current) return;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", getMyId());
    });

    socket.on("receive_message", (data) => {
      if (!isOpen) {
        audioRef.current?.play().catch(() => { });
        setUnreadCount(prev => prev + 1);
        if (Notification.permission === "granted") {
          new Notification("Support Team", { body: data.text });
        }
      }
      setMessages((prev) => [...prev, { ...data, isSeen: true }]);
    });

    return () => { socket.off("receive_message"); };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      socketRef.current?.emit("mark_seen", getMyId());
    }
  }, [isOpen]);

  useEffect(() => {
    const loadHistory = async () => {
      const myId = getMyId();
      try {
        const res = await fetch(`${API}/${myId}`);
        const data = await res.json();
        setMessages(data);
      } catch { console.log("History failed"); }
    };
    if (isOpen) loadHistory();
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

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
            className="mb-4 w-87.5 h-125 bg-[#121214] rounded-4xl flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-5 bg-purple-600 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-white text-sm">UEFN Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0B]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${m.isAdmin ? "bg-[#27272A] text-white rounded-tl-none" : "bg-purple-600 text-white rounded-tr-none"}`}>
                    {m.text}
                    {!m.isAdmin && (
                      <div className="flex justify-end mt-1">
                        {m.isSeen ? <CheckCheck size={12} /> : <Check size={12} />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-[#121214] border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none text-white focus:ring-1 ring-purple-500/50"
              />
              <button type="submit" className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 text-white shadow-lg">
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