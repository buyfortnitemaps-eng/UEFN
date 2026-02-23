"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Gamepad2, Loader2 } from "lucide-react";
import { auth } from "../../../../firebase";
import AdminOnly from "../../components/admin/OnlyAdmin";
import { useAuth } from "@/app/context/AuthContext";

const AddGameType = () => {
  const { user, mongoUser, loading: authLoading } = useAuth();
  const [typeName, setTypeName] = useState("");
  const [gameTypes, setGameTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. Fetch all game types
  const fetchGameTypes = async () => {
    try {
      // Adjusted endpoint for game types
      const res = await fetch("https://uefn-maps-server.onrender.com/api/v1/game-types");
      const data = await res.json();
      setGameTypes(data.data || []);
    } catch (error) {
      console.error("Error fetching game types:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchGameTypes();
  }, []);

  // 2. Handle Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeName) return;
    setLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const url = isEditing
        ? `https://uefn-maps-server.onrender.com/api/v1/game-types/${editId}`
        : "https://uefn-maps-server.onrender.com/api/v1/game-types/create-game-type";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: typeName }),
      });

      if (res.ok) {
        setTypeName("");
        setIsEditing(false);
        setEditId(null);
        fetchGameTypes();
      }
    } catch (error) {
      console.error("Error submitting game type:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Game Type
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this game type?")) return;
    try {
      const token = await auth.currentUser.getIdToken();

      await fetch(`https://uefn-maps-server.onrender.com/api/v1/game-types/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchGameTypes();
    } catch (error) {
      console.error("Error deleting game type:", error);
    }
  };

  const handleEditClick = (type) => {
    setIsEditing(true);
    setEditId(type._id);
    setTypeName(type.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  if (!user || mongoUser?.role !== "admin") {
    return <AdminOnly />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* --- Add Game Type Form --- */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {isEditing ? "Edit" : "Add New"} <span className="text-purple-500">Game Type</span>
          </h2>
          <p className="text-gray-500 text-xs italic">
            Define the logic type for your maps (e.g., 1v1, Open World, Horror).
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 bg-white/2 p-6 rounded-4xl border border-white/5 backdrop-blur-md"
        >
          <div className="relative flex-1 group">
            <Gamepad2
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500"
              size={18}
            />
            <input
              required
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Enter Game Type (e.g. 1v1, Hide and Seek)"
              className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-purple-500/50 transition-all font-medium text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 min-w-40"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isEditing ? <Edit3 size={20} /> : <Plus size={20} />} 
                {isEditing ? "Update" : "Add"}
              </>
            )}
          </button>
        </form>
      </section>

      {/* --- Game Type Table List --- */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-purple-500">
            Existing Game Types ({gameTypes.length})
          </h3>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-4xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest">
                    Game Type Name
                  </th>
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest">
                    Maps Count
                  </th>
                  <th className="p-5 text-xs font-black uppercase text-gray-500 tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchLoading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-10 text-center text-gray-600 animate-pulse font-bold uppercase italic"
                    >
                      Loading database...
                    </td>
                  </tr>
                ) : gameTypes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-10 text-center text-gray-600 italic"
                    >
                      No game types found. Create one above!
                    </td>
                  </tr>
                ) : (
                  gameTypes.map((type) => (
                    <tr
                      key={type._id}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors group"
                    >
                      <td className="p-5 font-bold text-sm text-white">
                        {type.name}
                      </td>
                      <td className="p-5 text-xs text-gray-500">
                        {type?.totalProduct || 0} Maps
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(type)} 
                          className="p-2.5 bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-500 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(type._id)}
                          className="p-2.5 bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddGameType;