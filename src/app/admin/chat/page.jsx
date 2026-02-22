"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://uefn-maps-server.onrender.com";

const AdminChat = () => {
  const socketRef = useRef(null);

  // user list
  const [users, setUsers] = useState([]);

  // messages per user
  const [conversations, setConversations] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");

  // connect socket
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
      console.log("Admin connected:", socket.id);
      socket.emit("join_chat", "ADMIN");
    });

    // receive user message
    socket.on("admin_receive", (data) => {
      const userId = data.senderId;

      // add user to sidebar
      setUsers((prev) => {
        if (!prev.includes(userId)) return [...prev, userId];
        return prev;
      });

      // store message in that user's conversation
      setConversations((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), data],
      }));
    });

    return () => socket.disconnect();


  }, []);

  // send reply
  const sendReply = () => {
    if (!reply.trim() || !selectedUser) return;


    const message = {
      senderId: "ADMIN",
      text: reply,
      receiverId: selectedUser,
      isAdmin: true,
      isLogged: true,
    };

    socketRef.current.emit("send_message", message);

    // also show in admin UI instantly
    setConversations((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), message],
    }));

    setReply("");


  }

  const messages = selectedUser ? conversations[selectedUser] || [] : [];

  return (<div className="flex h-screen bg-black text-white">

    {/* LEFT SIDEBAR USERS */}
    <div className="w-1/3 border-r border-white/10 p-4">
      <h2 className="mb-4 font-bold text-lg">Active Users</h2>

      {users.map((id) => (
        <div
          key={id}
          onClick={() => setSelectedUser(id)}
          className={`p-3 cursor-pointer rounded-xl mb-2 
        ${selectedUser === id ? "bg-purple-600" : "hover:bg-white/10"}`}
        >
          Guest ({id.slice(0, 6)})
        </div>
      ))}
    </div>

    {/* RIGHT CHAT PANEL */}
    <div className="flex-1 flex flex-col">

      {selectedUser ? (
        <>
          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[70%]
                ${m.isAdmin ? "bg-purple-600" : "bg-gray-700"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* reply box */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type reply..."
              className="flex-1 bg-white/5 px-3 py-2 rounded-xl outline-none"
            />
            <button
              onClick={sendReply}
              className="bg-purple-600 px-4 rounded-xl"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="m-auto text-gray-400">
          Select a user to start chatting
        </div>
      )}
    </div>
  </div>


  );
};

export default AdminChat;
