import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Image as ImageIcon, Video, Save, X, Edit2 } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, ref, uploadBytes, getDownloadURL, storage } from "../../lib/firebase";

const AdminGallery = () => {
  const { galleryItems, refreshData } = useData();
  const [newItem, setNewItem] = useState({
    image: "",
    type: "image" as "image" | "video",
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (galleryItems.length > 0 && editingId) {
      const item = galleryItems.find((g) => g.id === editingId);
      if (item) {
        setEditingData(item);
      }
    }
  }, [galleryItems, editingId]);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAdd = async () => {
    // Basic validation for image URL if file not selected
    if (!newItem.image && !imageFile) return;
    setLoading(true);

    try {
      let imageUrl = newItem.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80";
      if (imageFile) {
        imageUrl = await handleImageUpload() || imageUrl;
      }

      await addDoc(collection(db, "galleryItems"), {
        ...newItem,
        image: imageUrl,
        order: galleryItems.length,
        createdAt: serverTimestamp(),
      });
      setNewItem({ image: "", type: "image", order: galleryItems.length + 1 });
      setImageFile(null);
      refreshData();
    } catch (error) {
      console.error("Error adding gallery item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setLoading(true);

    try {
      const itemRef = doc(db, "galleryItems", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(itemRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
      refreshData();
    } catch (error) {
      console.error("Error updating gallery item:", error);
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
      {/* Seed Data Button (Only show if using fallback data) */}
      {galleryItems.length > 0 && !galleryItems[0].id && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">The information shown is default template info. Save it to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const item of galleryItems) {
                  await addDoc(collection(db, "galleryItems"), {
                    ...item,
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
          <div>
            <label className="block text-sm text-cream/70 mb-2">Upload Image/Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-royal hover:file:bg-gold/90"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">OR Media URL</label>
            <input
              type="text"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Type</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value as "image" | "video" })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
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
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Gallery Items */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Gallery Items</h3>
        {galleryItems.map((item) => (
          <div key={item.id || item.label} className="bg-white/5 border border-gold/20 rounded-lg p-4">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Media URL</label>
                    <input
                      type="text"
                      value={editingData?.image || ""}
                      onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/70 mb-1">Type</label>
                    <select
                      value={editingData?.type || "image"}
                      onChange={(e) => setEditingData({ ...editingData, type: e.target.value as "image" | "video" })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex-1 py-2 bg-gold text-royal font-bold rounded-lg"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-white/10 text-cream rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-start">
                <div className="w-24 h-16 flex-shrink-0">
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-wider text-cream/60">{item.type}</span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-2 sm:p-2.5 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    disabled={!item.id || loading}
                    className="p-2 sm:p-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
