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
  const isAudioUnlocked = useRef(false);
  const isOpenRef = useRef(false);

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

  // 🔊 AUDIO UNLOCK FUNCTION (MOST IMPORTANT PART)
  const unlockAudio = () => {
    if (isAudioUnlocked.current) return;

    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 1;

    audioRef.current
      .play()
      .then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isAudioUnlocked.current = true;
        console.log("Audio unlocked 🔓");
      })
      .catch(() => { });
  };

  // User interaction listener
  useEffect(() => {
    const unlock = () => unlockAudio();

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Socket Setup
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", getMyId());
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, isSeen: true }]);

      // 🔊 PLAY SOUND (NOW ALWAYS WORKS)
      if (!isOpenRef.current && isAudioUnlocked.current && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
        setUnreadCount((prev) => prev + 1);
      }

      // Browser Notification
      if (document.hidden && Notification.permission === "granted") {
        new Notification("Support Team", {
          body: data.text,
          icon: "/p5.jpg",
        });
      }
    });

    // Load history
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API}/${getMyId()}`);
        const data = await res.json();
        setMessages(data);
      } catch { }
    };
    loadHistory();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
      socketRef.current?.emit("mark_seen", getMyId());
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

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
      timestamp: new Date(),
    };

    socketRef.current.emit("send_message", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-9999"
      onMouseMove={() => {
        // ব্রাউজার অডিও পলিসি আনলক করার জন্য
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().then(() => audioRef.current.pause()).catch(() => { });
        }
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-87.5 h-125 bg-[#121214] rounded-4xl flex flex-col border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-purple-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-white text-sm italic">Live Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-white">
                <X size={20} />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0B]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] shadow-lg ${m.isAdmin ? "bg-[#27272A] text-white rounded-tl-none border border-white/5" : "bg-purple-600 text-white rounded-tr-none"}`}>
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
                placeholder="Ask us anything..."
                className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm outline-none text-white focus:ring-1 ring-purple-500/50 transition-all"
              />
              <button type="submit" className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 text-white shadow-lg active:scale-95 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-5 bg-purple-600 rounded-full text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] border border-white/20"
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