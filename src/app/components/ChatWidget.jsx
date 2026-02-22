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
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* button click also unlocks audio */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          unlockAudio();
          setIsOpen(!isOpen);
        }}
        className="relative p-5 bg-purple-600 rounded-full text-white"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;