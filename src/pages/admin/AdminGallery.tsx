import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Trash2, Video, Edit2 } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminGallery = () => {
  const { galleryItems, refreshData } = useData();
  const [newItem, setNewItem] = useState({
    image: "",
    type: "image" as "image" | "video",
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (galleryItems.length > 0 && editingId) {
      const item = galleryItems.find((g) => g.id === editingId);
      if (item) {
        setEditingData(item);
      }
    }
  }, [galleryItems, editingId]);

  const handleAdd = async () => {
    if (!newItem.image) {
      alert("⚠️ Please enter a Media URL");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "galleryItems"), {
        ...newItem,
        order: galleryItems.length,
        createdAt: serverTimestamp(),
      });
      
      alert("✅ Item Added Successfully!");
      setNewItem({ image: "", type: "image", order: galleryItems.length + 1 });
      refreshData();
    } catch (error: any) {
      console.error("Error adding gallery item:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.image) return;
    setLoading(true);

    try {
      const itemRef = doc(db, "galleryItems", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(itemRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      
      alert("✅ Item Updated Successfully!");
      setEditingId(null);
      refreshData();
    } catch (error: any) {
      console.error("Error updating gallery item:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "galleryItems", id));
      refreshData();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditingData({ ...item });
  };

  return (
    <div className="space-y-6">
      {/* Seed Data Button */}
      {(galleryItems.length === 0 || !galleryItems[0]?.id) && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">Save this to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const item of galleryItems) {
                  const { id, ...itemToSave } = item;
                  await addDoc(collection(db, "galleryItems"), {
                    ...itemToSave,
                    createdAt: serverTimestamp(),
                  });
                }
                refreshData();
              } catch (e) {
                console.error(e);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="px-6 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
          >
            {loading ? "Seeding..." : "Save to DB"}
          </button>
        </div>
      )}

      {/* Add New Gallery Item */}
      <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
        <h3 className="font-display text-xl font-bold text-gold mb-4">Add New Gallery Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Media URL (Image or Video)</label>
            <input
              type="text"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              placeholder="https://example.com/media.jpg"
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white outline-none focus:ring-2 focus:ring-gold/50"
            />
            {newItem.image && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border border-gold/30 bg-black/20">
                {newItem.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-gold" />
                  </div>
                ) : (
                  <img src={newItem.image} className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Type</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "image" | "video" })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full h-[42px] mt-7 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Gallery"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Gallery Items */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Gallery Items</h3>
        <div className="grid grid-cols-1 gap-4">
          {galleryItems.map((item, i) => (
            <div key={item.id || `fallback-${i}`} className="bg-white/5 border border-gold/20 rounded-xl p-4 hover:bg-white/10 transition-all group">
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Media URL</label>
                      <input
                        type="text"
                        value={editingData?.image || ""}
                        onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                      {editingData.image && (
                        <div className="mt-2 w-16 h-16 border border-gold/30 rounded overflow-hidden">
                           {editingData.type === "video" ? <Video className="w-full h-full p-4 text-gold" /> : <img src={editingData.image} className="w-full h-full object-cover" />}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Type</label>
                      <select
                        value={editingData?.type || "image"}
                        onChange={(e) => setEditingData({ ...editingData, type: e.target.value as "image" | "video" })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} disabled={loading} className="flex-1 py-2 bg-gold text-royal font-bold rounded-lg text-sm">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-white/10 text-cream rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-full sm:w-24 h-40 sm:h-16 flex-shrink-0">
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-gold/10 flex items-center justify-center rounded-lg border border-gold/20">
                        <Video className="w-6 h-6 text-gold" />
                      </div>
                    ) : (
                      <img src={item.image} alt="Gallery" className="w-full h-full object-cover rounded-lg border border-gold/20" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full">{item.type}</span>
                  </div>
                  <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(item)} className="p-2.5 bg-white/10 text-cream rounded-lg hover:bg-gold/20 hover:text-gold transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id!)} disabled={!item.id || loading} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
