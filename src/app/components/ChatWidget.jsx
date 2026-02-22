"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ChatWidget = () => {
  const { user } = useAuth();

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // CONNECT SOCKET
  useEffect(() => {
    socketRef.current = io("https://magriluefn.vercel.app/", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    let myId = user?.uid || localStorage.getItem("guest_id");

    if (!myId) {
      myId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("guest_id", myId);
    }

    // নিজের room এ join
    socket.emit("join_chat", myId);

    // Admin reply receive
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // AUTO SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // SEND MESSAGE
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const socket = socketRef.current;
    if (!socket) return;

    const myId = user?.uid || localStorage.getItem("guest_id");

    const data = {
      senderId: myId,
      text: input,
      receiverId: "ADMIN",
      isAdmin: false,
      isLogged: !!user,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-9999">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="mb-4 w-[320px] h-125 bg-[#121214] rounded-3xl flex flex-col border border-white/10"
          >
            {/* Header */}
            <div className="p-4 bg-purple-600 flex justify-between items-center rounded-t-3xl">
              <span className="font-semibold text-white">Live Support</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.isAdmin ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${
                      m.isAdmin
                        ? "bg-gray-700 text-white"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none text-white"
                placeholder="Write a message..."
              />
              <button className="bg-purple-600 p-2 rounded-xl">
                <Send className="text-white" size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 bg-purple-600 rounded-full text-white shadow-xl"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;