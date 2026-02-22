/* eslint-disable react-hooks/set-state-in-effect */
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

  // ---------- GET USER ID ----------
  const getMyId = () => {
    let myId = user?.uid || localStorage.getItem("guest_id");


    if (!myId) {
      myId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("guest_id", myId);
    }

    return myId;


  };

  // ---------- MERGE GUEST → LOGIN ----------
  useEffect(() => {
    if (!user) return;


    const guestId = localStorage.getItem("guest_id");

    if (guestId && guestId !== user.uid) {
      fetch(`${API}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId,
          userId: user.uid,
        }),
      });

      localStorage.setItem("guest_id", user.uid);
      localStorage.removeItem("guest_messages");
    }


  }, [user]);

  // ---------- SOCKET CONNECT ----------
  useEffect(() => {
    if (socketRef.current) return;


    const socket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      const myId = getMyId();
      socket.emit("join_chat", myId);
    });

    // receive admin reply realtime
    socket.on("receive_message", (data) => {
      setMessages((prev) => {
        const updated = [...prev, { ...data, isSeen: true }];

        // guest → save locally
        if (!user) {
          localStorage.setItem("guest_messages", JSON.stringify(updated));
        }

        return updated;
      });
    });

    // cleanup (important for Next strict mode)
    return () => {
      socket.off("receive_message");
    };


  }, []);

  // ---------- MARK SEEN WHEN CHAT OPEN ----------
  useEffect(() => {
    if (!isOpen || !socketRef.current) return;


    const myId = getMyId();
    socketRef.current.emit("mark_seen", myId);


  }, [isOpen]);

  // ---------- LOAD HISTORY ----------
  useEffect(() => {
    const loadHistory = async () => {
      const myId = getMyId();


      // logged user → DB
      if (user) {
        try {
          const res = await fetch(`${API}/${myId}`);
          const data = await res.json();
          setMessages(data);
        } catch {
          console.log("DB history load failed");
        }
      }

      // guest → localStorage
      else {
        const saved = localStorage.getItem("guest_messages");
        if (saved) setMessages(JSON.parse(saved));
      }
    };

    if (isOpen) {
      setMessages([]); // prevent duplication
      loadHistory();
    }


  }, [isOpen, user]);

  // ---------- AUTO SCROLL ----------
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // ---------- SEND MESSAGE ----------
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;


    const socket = socketRef.current;
    if (!socket) return;

    const myId = getMyId();

    const newMsg = {
      senderId: myId,
      text: input,
      receiverId: "ADMIN",
      isAdmin: false,
      isLogged: !!user,
      isSeen: false,
    };

    socket.emit("send_message", newMsg);

    setMessages((prev) => {
      const updated = [...prev, newMsg];

      // guest → store locally
      if (!user) {
        localStorage.setItem("guest_messages", JSON.stringify(updated));
      }

      return updated;
    });

    setInput("");


  };

  // ---------- SEEN ICON ----------
  const SeenIcon = ({ seen }) =>
    seen ? (<CheckCheck size={14} className="text-blue-400 ml-1 inline" />
    ) : (<Check size={14} className="text-gray-400 ml-1 inline" />
    );

  return (<div className="fixed bottom-6 right-6 z-9999">


    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="mb-4 w-[320px] h-[500px] bg-[#121214] rounded-3xl flex flex-col border border-white/10"
        >
          {/* HEADER */}
          <div className="p-4 bg-purple-600 flex justify-between items-center rounded-t-3xl">
            <span className="font-semibold text-white">Live Support</span>
            <button onClick={() => setIsOpen(false)}>
              <X className="text-white" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[80%]
                ${m.isAdmin
                      ? "bg-gray-700 text-white"
                      : "bg-purple-600 text-white"
                    }`}
                >
                  {m.text}

                  {!m.isAdmin && (
                    <div className="text-right mt-1">
                      <SeenIcon seen={m.isSeen} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* INPUT */}
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

    {/* FLOAT BUTTON */}
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
