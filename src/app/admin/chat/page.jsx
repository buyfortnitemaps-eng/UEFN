"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://uefn-maps-server.onrender.com";
const API = "https://uefn-maps-server.onrender.com/api/v1/chat";

const AdminChat = () => {
  const socketRef = useRef(null);

  // sidebar users
  const [users, setUsers] = useState([]);

  // all conversations { userId: [messages] }
  const [conversations, setConversations] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- SOCKET CONNECT ----------------
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

    // realtime user message
    socket.on("admin_receive", (data) => {
      const userId = data.senderId;

      // add user to sidebar
      setUsers((prev) => {
        if (!prev.includes(userId)) return [userId, ...prev];
        return prev;
      });

      // add message to conversation
      setConversations((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), data],
      }));
    });

    return () => socket.disconnect();


  }, []);

  // ---------------- LOAD USERS (FROM DB) ----------------
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${API}/users`);
        const data = await res.json();
        const userIds = data.map((u) => u._id);
        setUsers(userIds);
      } catch (err) {
        console.log("User load failed");
      }
    };

    loadUsers();


  }, []);

  // ---------------- LOAD HISTORY WHEN USER SELECT ----------------
  useEffect(() => {
    if (!selectedUser) return;


    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/${selectedUser}`);
        const data = await res.json();

        setConversations((prev) => ({
          ...prev,
          [selectedUser]: data,
        }));

        // mark messages as seen
        await fetch(`${API}/seen/${selectedUser}`, {
          method: "PATCH",
        });
      } catch {
        console.log("History load failed");
      }
      setLoading(false);
    };

    loadMessages();


  }, [selectedUser]);

  // ---------------- SEND REPLY ----------------
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

    // instant UI update
    setConversations((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), message],
    }));

    setReply("");
  };

  const messages = selectedUser ? conversations[selectedUser] || [] : [];

  return (<div className="flex h-screen bg-black text-white">

    {/* SIDEBAR */}
    <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
      <h2 className="mb-4 font-bold text-lg">Active Users</h2>

      {users.length === 0 && (
        <div className="text-gray-400">No conversations yet</div>
      )}

      {users.map((id) => (
        <div
          key={id}
          onClick={() => setSelectedUser(id)}
          className={`p-3 cursor-pointer rounded-xl mb-2 transition
        ${selectedUser === id
              ? "bg-purple-600"
              : "hover:bg-white/10"
            }`}
        >
          Guest ({id.slice(0, 6)})
        </div>
      ))}
    </div>

    {/* CHAT AREA */}
    <div className="flex-1 flex flex-col">

      {!selectedUser ? (
        <div className="m-auto text-gray-400 text-lg">
          Select a user to start chatting
        </div>
      ) : (
        <>
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {loading && <div className="text-gray-400">Loading chat...</div>}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.isAdmin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm
                ${m.isAdmin
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-white"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* REPLY BOX */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type reply..."
              className="flex-1 bg-white/5 px-3 py-2 rounded-xl outline-none text-white"
              onKeyDown={(e) => e.key === "Enter" && sendReply()}
            />

            <button
              onClick={sendReply}
              className="bg-purple-600 px-5 rounded-xl hover:bg-purple-500"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  </div>

  );
};

export default AdminChat;
