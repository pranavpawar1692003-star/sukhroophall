import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Edit2, Check, X, Save, Star } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminTestimonials = () => {
  const { testimonials, refreshData } = useData();
  const [newTestimonial, setNewTestimonial] = useState({
    image: "",
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
    if (!newTestimonial.name || !newTestimonial.comment) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "testimonials"), {
        ...newTestimonial,
        order: testimonials.length,
        createdAt: serverTimestamp(),
      });
      setNewTestimonial({ image: "", name: "", event: "", comment: "", rating: 5, order: testimonials.length + 1 });
      refreshData();
    } catch (error) {
      console.error("Error adding testimonial:", error);
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
      setEditingId(null);
      refreshData();
    } catch (error) {
      console.error("Error updating testimonial:", error);
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
      {/* Seed Data Button (Only show if using fallback data) */}
      {testimonials.length > 0 && !testimonials[0].id && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">The information shown is default template info. Save it to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const t of testimonials) {
                  await addDoc(collection(db, "testimonials"), {
                    ...t,
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
            <label className="block text-sm text-cream/70 mb-2">Name</label>
            <input
              type="text"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Event Type</label>
            <input
              type="text"
              value={newTestimonial.event}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, event: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="e.g., Wedding, Reception"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2">Comment</label>
            <textarea
              value={newTestimonial.comment}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Rating</label>
            <select
              value={newTestimonial.rating}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Testimonial"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Testimonials */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Testimonials</h3>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id || testimonial.name} className="bg-white/5 border border-gold/20 rounded-lg p-4">
            {editingId === testimonial.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-cream/70 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingData?.name || ""}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/70 mb-1">Event</label>
                    <input
                      type="text"
                      value={editingData?.event || ""}
                      onChange={(e) => setEditingData({ ...editingData, event: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Comment</label>
                    <textarea
                      value={editingData?.comment || ""}
                      onChange={(e) => setEditingData({ ...editingData, comment: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cream/70 mb-1">Rating</label>
                    <select
                      value={editingData?.rating || 5}
                      onChange={(e) => setEditingData({ ...editingData, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
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
                <div className="flex-1">
                  <h4 className="font-display text-lg font-bold text-gold">{testimonial.name}</h4>
                  <p className="text-cream/70 text-sm">{testimonial.event}</p>
                  <p className="text-cream/60 text-sm mt-2 italic">"{testimonial.comment}"</p>
                  <div className="text-gold mt-2">
                    {"★".repeat(testimonial.rating)}
                    <span className="text-cream/30">{"★".repeat(5 - testimonial.rating)}</span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleStartEdit(testimonial)}
                    className="p-2 sm:p-2.5 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id!)}
                    disabled={!testimonial.id || loading}
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

export default AdminTestimonials;
