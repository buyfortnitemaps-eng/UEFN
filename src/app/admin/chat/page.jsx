/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Check, CheckCheck, User, Send, ChevronLeft } from "lucide-react";

const SOCKET_URL = "https://uefn-maps-server.onrender.com";
const API = "https://uefn-maps-server.onrender.com/api/v1/chat";

const AdminChat = () => {
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const audioRef = useRef(null); // অডিও রেফারেন্স

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // ১. সাউন্ড এবং পারমিশন সেটআপ
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [conversations, selectedUser]);

  useEffect(() => {
    if (socketRef.current) return;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", "ADMIN");
    });

    socket.on("admin_receive", (data) => {
      // সাউন্ড প্লে করা
      audioRef.current?.play().catch(() => console.log("Interaction required for audio"));

      // ব্রাউজার নোটিফিকেশন (ট্যাব হিডেন থাকলে)
      if (document.hidden && Notification.permission === "granted") {
        new Notification("New Message from Guest", {
          body: data.text,
          icon: "/p5.jpg"
        });
      }

      const userId = data.senderId;
      setUsers((prev) => (!prev.includes(userId) ? [userId, ...prev] : prev));
      setConversations((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), { ...data, isSeen: false }],
      }));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API}/users`);
        const data = await res.json();
        setUsers(data.map((u) => u._id));
      } catch (err) { console.log("User load failed"); }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/${selectedUser}`);
        const data = await res.json();
        setConversations((prev) => ({ ...prev, [selectedUser]: data }));
        await fetch(`${API}/seen/${selectedUser}`, { method: "PATCH" });
      } catch { console.log("History load failed"); }
      setLoading(false);
    };
    loadMessages();
  }, [selectedUser]);

  const sendReply = () => {
    if (!reply.trim() || !selectedUser) return;
    const message = {
      senderId: "ADMIN",
      text: reply,
      receiverId: selectedUser,
      isAdmin: true,
      isLogged: true,
      isSeen: false,
      timestamp: new Date()
    };

    socketRef.current.emit("send_message", message);
    setConversations((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), message],
    }));
    setReply("");
  };

  const messages = selectedUser ? conversations[selectedUser] || [] : [];

  return (
    <div className="w-full bg-background min-h-screen md:py-10 mt-10">
      <div className="hidden md:flex w-full max-w-5xl mx-auto h-150 bg-background text-foreground rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="w-72 border-r border-border-color bg-background flex flex-col">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-semibold text-lg tracking-tight text-purple-400">Live Support</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {users.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedUser(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedUser === id ? "bg-background text-purple-400 border border-purple-600/30" : "hover:bg-background text-gray-400"}`}
              >
                <div className="h-9 w-9 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-foreground shrink-0">
                  <User size={18} />
                </div>
                <p className="text-sm font-medium truncate text-left flex-1">Guest_{id.slice(-4)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-background">
          {!selectedUser ? (
            <div className="m-auto text-gray-500 italic">Select a conversation to start</div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-white/5 bg-background font-medium text-sm text-gray-300">
                User ID: <span className="text-purple-400 ml-1 uppercase">{selectedUser}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.isAdmin ? "bg-purple-600 text-foreground rounded-tr-none" : "bg-background text-foreground rounded-tl-none border border-white/5"}`}>
                      {m.text}
                      {m.isAdmin && (
                        <div className="flex justify-end mt-1">
                          {m.isSeen ? <CheckCheck size={14} className="text-foreground/80" /> : <Check size={14} className="text-foreground/60" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <div className="p-4 bg-background border-t border-border-color flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-background border border-white/5 px-4 py-2 rounded-xl outline-none text-sm focus:border-purple-600/50"
                />
                <button onClick={sendReply} className="bg-purple-600 p-2 rounded-xl hover:bg-purple-500 transition-colors"><Send size={18} /></button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile View logic remains same as per your design */}
    </div>
  );
};

export default AdminChat;