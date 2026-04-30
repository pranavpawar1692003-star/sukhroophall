import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (heroSlides.length > 0 && editingId) {
      const slide = heroSlides.find((s) => s.id === editingId);
      if (slide) {
        setEditingData(slide);
      }
    }
  }, [heroSlides, editingId]);

  const handleAdd = async () => {
    if (!newSlide.title || !newSlide.description || !newSlide.image) {
      alert("⚠️ Please fill in Image URL, Title and Description");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "heroSlides"), {
        ...newSlide,
        order: heroSlides.length,
        createdAt: serverTimestamp(),
      });
      
      alert("✅ Slide Added Successfully!");
      setNewSlide({ image: "", subtitle: "", title: "", description: "", order: heroSlides.length + 1 });
      refreshData();
    } catch (error: any) {
      console.error("Error adding slide:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.title || !editingData?.description || !editingData?.image) return;
    setLoading(true);

    try {
      const slideRef = doc(db, "heroSlides", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(slideRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      
      alert("✅ Slide Updated Successfully!");
      setEditingId(null);
      refreshData();
    } catch (error: any) {
      console.error("Error updating slide:", error);
      alert("❌ Error: " + error.message);
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
      {/* Seed Data Button */}
      {(heroSlides.length === 0 || !heroSlides[0]?.id) && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">Save this to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const slide of heroSlides) {
                  const { id, ...dataToSave } = slide;
                  await addDoc(collection(db, "heroSlides"), {
                    ...dataToSave,
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
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Image URL</label>
            <input
              type="text"
              value={newSlide.image}
              onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white focus:ring-2 focus:ring-gold/50 outline-none transition-all"
            />
            {newSlide.image && (
              <div className="mt-4 relative w-40 h-24 rounded-lg overflow-hidden border border-gold/30 shadow-lg">
                <img src={newSlide.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Subtitle</label>
            <input
              type="text"
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              placeholder="Welcome to"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Title</label>
            <input
              type="text"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              placeholder="Sukhrup Garden"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Description</label>
            <textarea
              value={newSlide.description}
              onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
              rows={3}
              placeholder="Experience the grandeur..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-gold/10"
            >
              {loading ? "Adding..." : "Add Hero Slide"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Slides */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Hero Slides</h3>
        <div className="grid grid-cols-1 gap-4">
          {heroSlides.map((slide, i) => (
            <div key={slide.id || `fallback-${i}`} className="bg-white/5 border border-gold/20 rounded-xl p-4 hover:bg-white/10 transition-all group">
              {editingId === slide.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Image URL</label>
                      <input
                        type="text"
                        value={editingData?.image || ""}
                        onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                      {editingData.image && (
                         <img src={editingData.image} className="mt-2 w-32 h-16 object-cover rounded border border-gold/20" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Title</label>
                      <input
                        type="text"
                        value={editingData?.title || ""}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Subtitle</label>
                      <input
                        type="text"
                        value={editingData?.subtitle || ""}
                        onChange={(e) => setEditingData({ ...editingData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Description</label>
                      <textarea
                        value={editingData?.description || ""}
                        onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                        rows={2}
                      />
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
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-lg border border-gold/20 shadow-md" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] uppercase tracking-tighter text-gold font-bold">{slide.subtitle}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-gold leading-none">{slide.title}</h4>
                    <p className="text-cream/60 text-xs mt-2 line-clamp-2 italic">"{slide.description}"</p>
                  </div>
                  <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(slide)} className="p-2.5 bg-white/10 text-cream rounded-lg hover:bg-gold/20 hover:text-gold transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(slide.id!)} disabled={!slide.id || loading} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">
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

export default AdminHero;
