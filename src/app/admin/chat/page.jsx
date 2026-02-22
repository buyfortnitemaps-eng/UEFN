"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const AdminChat = () => {
  const socketRef = useRef(null);

  const [activeChats, setActiveChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    socketRef.current = io("https://magriluefn.vercel.app/", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    // ADMIN ROOM JOIN
    socket.emit("join_chat", "ADMIN");

    // user message receive
    socket.on("admin_receive", (data) => {
      setActiveChats((prev) => {
        if (!prev.find((u) => u.id === data.senderId)) {
          return [...prev, { id: data.senderId, name: data.isLogged ? "User" : "Guest" }];
        }
        return prev;
      });

      if (selectedUser && selectedUser.id === data.senderId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.disconnect();
  }, [selectedUser]);

  const sendReply = () => {
    if (!reply.trim() || !selectedUser) return;

    const data = {
      senderId: "ADMIN",
      text: reply,
      receiverId: selectedUser.id,
      isAdmin: true,
      isLogged: true,
    };

    socketRef.current.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setReply("");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* User list */}
      <div className="w-1/3 border-r border-white/10 p-4">
        {activeChats.map((u) => (
          <div
            key={u.id}
            onClick={() => {
              setSelectedUser(u);
              setMessages([]);
            }}
            className="p-3 cursor-pointer hover:bg-white/10"
          >
            {u.name} ({u.id.slice(0, 6)})
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.isAdmin ? "text-right" : "text-left"}>
                  <span className="bg-gray-700 px-3 py-2 rounded-xl inline-block">
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 bg-white/5 px-3 py-2 rounded-xl"
              />
              <button onClick={sendReply} className="bg-purple-600 px-4 rounded-xl">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="m-auto text-gray-400">Select a user</div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;