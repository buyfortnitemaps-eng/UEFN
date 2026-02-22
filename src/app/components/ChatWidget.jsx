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

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getMyId = () => {
    let myId = user?.uid || localStorage.getItem("guest_id");
    if (!myId) {
      myId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("guest_id", myId);
    }
    return myId;
  };

  useEffect(() => {
    if (socketRef.current) return;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", getMyId());
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const updated = [...prev, { ...data, isSeen: true }];
        if (!user) localStorage.setItem("guest_messages", JSON.stringify(updated));
        return updated;
      });
    });

    return () => { socket.off("receive_message"); };
  }, []);

  useEffect(() => {
    if (!isOpen || !socketRef.current) return;
    socketRef.current.emit("mark_seen", getMyId());
  }, [isOpen]);

  useEffect(() => {
    const loadHistory = async () => {
      const myId = getMyId();
      if (user) {
        try {
          const res = await fetch(`${API}/${myId}`);
          const data = await res.json();
          setMessages(data);
        } catch { console.log("DB history failed"); }
      } else {
        const saved = localStorage.getItem("guest_messages");
        if (saved) setMessages(JSON.parse(saved));
      }
    };
    if (isOpen) loadHistory();
  }, [isOpen, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const newMsg = {
      senderId: getMyId(),
      text: input,
      receiverId: "ADMIN",
      isAdmin: false,
      isLogged: !!user,
      isSeen: false,
    };

    socketRef.current.emit("send_message", newMsg);
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      if (!user) localStorage.setItem("guest_messages", JSON.stringify(updated));
      return updated;
    });
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[320px] h-[480px] bg-[#121214] rounded-2xl flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-purple-600 flex justify-between items-center">
              <span className="font-semibold text-white text-sm tracking-wide">Customer Support</span>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X className="text-white" size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0A0A0B]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${m.isAdmin ? "bg-[#27272A] text-white rounded-tl-none" : "bg-purple-600 text-white rounded-tr-none"
                    }`}>
                    {m.text}
                    {!m.isAdmin && (
                      <div className="flex justify-end mt-0.5">
                        {m.isSeen ? <CheckCheck size={13} className="text-white" /> : <Check size={13} className="text-white" />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 bg-[#121214] border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs outline-none text-white focus:bg-white/10 transition-colors"
              />
              <button type="submit" className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors text-white">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-purple-600 rounded-full text-white shadow-2xl border border-white/10"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;