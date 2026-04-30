import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Edit2, Check, X, Save, Star } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminTestimonials = () => {
  const { testimonials, refreshData } = useData();
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    event: "",
    comment: "",
    rating: 5,
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonials.length > 0 && editingId) {
      const testimonial = testimonials.find((t) => t.id === editingId);
      if (testimonial) {
        setEditingData(testimonial);
      }
    }
  }, [testimonials, editingId]);

  const handleAdd = async () => {
    if (!newTestimonial.name || !newTestimonial.comment) {
      alert("⚠️ Please fill in Name and Comment");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "testimonials"), {
        ...newTestimonial,
        order: testimonials.length,
        createdAt: serverTimestamp(),
      });
      
      alert("✅ Testimonial Added Successfully!");
      setNewTestimonial({ name: "", event: "", comment: "", rating: 5, order: testimonials.length + 1 });
      refreshData();
    } catch (error: any) {
      console.error("Error adding testimonial:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.name || !editingData?.comment) return;
    setLoading(true);

    try {
      const testimonialRef = doc(db, "testimonials", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(testimonialRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      
      alert("✅ Testimonial Updated Successfully!");
      setEditingId(null);
      refreshData();
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "testimonials", id));
      refreshData();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setEditingData({ ...testimonial });
  };

  return (
    <div className="space-y-6">
      {/* Seed Data Button */}
      {(testimonials.length === 0 || !testimonials[0]?.id) && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">Save this to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const t of testimonials) {
                  const { id, ...dataToSave } = t;
                  await addDoc(collection(db, "testimonials"), {
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
            className="px-6 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
          >
            {loading ? "Seeding..." : "Save to DB"}
          </button>
        </div>
      )}

      {/* Add New Testimonial */}
      <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
        <h3 className="font-display text-xl font-bold text-gold mb-4">Add New Testimonial</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Client Name</label>
            <input
              type="text"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Event Type</label>
            <input
              type="text"
              value={newTestimonial.event}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, event: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white"
              placeholder="e.g., Industrial Supply, Steel Delivery"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Star Rating</label>
            <select
              value={newTestimonial.rating}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
              <option value={3}>⭐⭐⭐ (3 Stars)</option>
              <option value={2}>⭐⭐ (2 Stars)</option>
              <option value={1}>⭐ (1 Star)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Client Feedback</label>
            <textarea
              value={newTestimonial.comment}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white"
              rows={3}
              placeholder="Write the testimonial here..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-gold/10"
            >
              {loading ? "Adding..." : "Publish Testimonial"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Testimonials */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Testimonials</h3>
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial, i) => (
            <div key={testimonial.id || `fallback-${i}`} className="bg-white/5 border border-gold/20 rounded-xl p-6 hover:bg-white/10 transition-all group">
              {editingId === testimonial.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Name</label>
                      <input
                        type="text"
                        value={editingData?.name || ""}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Event</label>
                      <input
                        type="text"
                        value={editingData?.event || ""}
                        onChange={(e) => setEditingData({ ...editingData, event: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Rating</label>
                      <select
                        value={editingData?.rating || 5}
                        onChange={(e) => setEditingData({ ...editingData, rating: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Comment</label>
                      <textarea
                        value={editingData?.comment || ""}
                        onChange={(e) => setEditingData({ ...editingData, comment: e.target.value })}
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
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-display text-lg font-bold text-gold">{testimonial.name}</h4>
                      <div className="flex text-gold/40 text-[10px]">
                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                      </div>
                    </div>
                    <p className="text-gold/60 text-[10px] uppercase tracking-widest font-bold mb-2">{testimonial.event}</p>
                    <p className="text-cream/60 text-sm italic leading-relaxed">"{testimonial.comment}"</p>
                  </div>
                  <div className="flex w-full sm:w-auto justify-end gap-2 mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(testimonial)} className="p-2.5 bg-white/10 text-cream rounded-lg hover:bg-gold/20 hover:text-gold transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(testimonial.id!)} disabled={!testimonial.id || loading} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">
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

export default AdminTestimonials;
