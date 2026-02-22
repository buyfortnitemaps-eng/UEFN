/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Check, CheckCheck, User, Send } from "lucide-react"; // Suggested icons

const SOCKET_URL = "https://uefn-maps-server.onrender.com";
const API = "https://uefn-maps-server.onrender.com/api/v1/chat";

const AdminChat = () => {
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedUser]);

  useEffect(() => {
    if (socketRef.current) return;
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_chat", "ADMIN");
    });

    socket.on("admin_receive", (data) => {
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
      isSeen: false, // Initial state
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
    <div className="flex w-full max-w-5xl mx-auto h-[650px] bg-[#0F0F0F] text-gray-100 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">

      {/* SIDEBAR */}
      <div className="w-80 border-r border-white/5 bg-[#141414] flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h2 className="font-semibold text-lg tracking-tight">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {users.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center">No active chats</div>
          ) : (
            users.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedUser(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedUser === id ? "bg-purple-600/20 text-purple-400 border border-purple-600/30" : "hover:bg-white/5 text-gray-400"
                  }`}
              >
                <div className="h-10 w-10 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white">
                  <User size={20} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium truncate tracking-wide">Guest_{id.slice(-4)}</p>
                  <p className="text-xs opacity-60 truncate">Click to view chat</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#0A0A0A]">
        {!selectedUser ? (
          <div className="m-auto text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-500">Select a conversation to start</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#0F0F0F] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Guest_{selectedUser.slice(-4)}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading && <div className="text-center text-xs text-purple-400">Loading history...</div>}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}>
                  <div className={`group relative max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.isAdmin ? "bg-purple-600 text-white rounded-tr-none" : "bg-[#1E1E1E] text-gray-200 rounded-tl-none border border-white/5"
                    }`}>
                    {m.text}

                    {/* SEEN INDICATOR */}
                    {m.isAdmin && (
                      <div className="flex justify-end mt-1 opacity-70">
                        {m.isSeen ? (
                          <CheckCheck size={14} className="text-blue-300" />
                        ) : (
                          <Check size={14} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[#0F0F0F] border-t border-white/5">
              <div className="relative flex items-center">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Write a message..."
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 pr-12 rounded-xl outline-none focus:border-purple-500/50 transition-all text-sm"
                />
                <button
                  onClick={sendReply}
                  className="absolute right-2 p-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;