import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Edit2, Check, X, Save, Image as ImageIcon } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, ref, uploadBytes, getDownloadURL, storage } from "../../lib/firebase";

const AdminHero = () => {
  const { heroSlides, refreshData } = useData();
  const [newSlide, setNewSlide] = useState({
    image: "",
    subtitle: "",
    title: "",
    description: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (heroSlides.length > 0 && editingId) {
      const slide = heroSlides.find((s) => s.id === editingId);
      if (slide) {
        setEditingData(slide);
      }
    }
  }, [heroSlides, editingId]);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    try {
      const storageRef = ref(storage, `hero/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAdd = async () => {
    if (!newSlide.title || !newSlide.description) return;
    setLoading(true);

    try {
      let imageUrl = newSlide.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80";
      if (imageFile) {
        imageUrl = await handleImageUpload() || imageUrl;
      }

      await addDoc(collection(db, "heroSlides"), {
        ...newSlide,
        image: imageUrl,
        order: heroSlides.length,
        createdAt: serverTimestamp(),
      });
      setNewSlide({ image: "", subtitle: "", title: "", description: "", order: heroSlides.length + 1 });
      setImageFile(null);
      refreshData();
    } catch (error) {
      console.error("Error adding slide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.title || !editingData?.description) return;
    setLoading(true);

    try {
      const slideRef = doc(db, "heroSlides", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(slideRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
      refreshData();
    } catch (error) {
      console.error("Error updating slide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "heroSlides", id));
      refreshData();
    } catch (error) {
      console.error("Error deleting slide:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (slide: any) => {
    setEditingId(slide.id);
    setEditingData({ ...slide });
  };

  return (
    <div className="space-y-6">
      {/* Seed Data Button (Only show if using fallback data) */}
      {heroSlides.length > 0 && !heroSlides[0].id && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">The information shown is default template info. Save it to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const slide of heroSlides) {
                  await addDoc(collection(db, "heroSlides"), {
                    ...slide,
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
            className="px-6 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all font-display uppercase tracking-wider"
          >
            {loading ? "Seeding..." : "Push to DB"}
          </button>
        </div>
      )}

      {/* Add New Slide */}
      <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
        <h3 className="font-display text-xl font-bold text-gold mb-4">Add New Hero Slide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-cream/70 mb-2">Upload Slide Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-royal hover:file:bg-gold/90"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">OR Image URL</label>
            <input
              type="text"
              value={newSlide.image}
              onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
              placeholder="https://example.com/slide.jpg"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Subtitle</label>
            <input
              type="text"
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              placeholder="e.g., Welcome to"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Title</label>
            <input
              type="text"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              placeholder="e.g., Sukhrup Garden"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2">Description</label>
            <textarea
              value={newSlide.description}
              onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Hero Slide"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Slides */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Hero Slides</h3>
        s        {heroSlides.map((slide) => (
          <div key={slide.id || slide.title} className="bg-white/5 border border-gold/20 rounded-lg p-4">
            {editingId === slide.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingData?.image || ""}
                      onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingData?.title || ""}
                      onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/70 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingData?.subtitle || ""}
                      onChange={(e) => setEditingData({ ...editingData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Description</label>
                    <textarea
                      value={editingData?.description || ""}
                      onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                      rows={3}
                    />
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
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-24 h-40 sm:h-16 flex-shrink-0">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg font-bold text-gold">{slide.title}</h4>
                  <p className="text-cream/70 text-sm mt-1 line-clamp-2">{slide.description}</p>
                </div>
                <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleStartEdit(slide)}
                    className="flex-1 sm:flex-none p-2.5 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-5 h-5 mr-2 sm:mr-0" />
                    <span className="sm:hidden text-sm upperca se font-bold">Edit</span>
                  </button>z
                  <button
                    onClick={() => handleDelete(slide.id!)}
                    disabled={!slide.id || loading}
                    className="flex-1 sm:flex-none p-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 disabled:opacity-30 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5 mr-2 sm:mr-0" />
                    <span className="sm:hidden text-sm uppercase font-bold">Delete</span>
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

export default AdminHero;
