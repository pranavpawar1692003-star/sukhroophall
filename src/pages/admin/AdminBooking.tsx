import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Save, X, Edit2 } from "lucide-react";
import { db, collection, addDoc, updateDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminBooking = () => {
  const { bookingInfo, refreshData } = useData();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingInfo) {
      setFormData({
        title: bookingInfo.title || "",
        subtitle: bookingInfo.subtitle || "",
        ctaText: bookingInfo.ctaText || "",
        ctaLink: bookingInfo.ctaLink || "",
      });
    }
  }, [bookingInfo]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (bookingInfo?.id) {
        const bookingRef = doc(db, "bookingInfo", bookingInfo.id);
        await updateDoc(bookingRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "bookingInfo"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      refreshData();
      setEditing(false);
    } catch (error) {
      console.error("Error saving booking info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl font-bold text-gold">Booking Banner</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all font-bold"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {!editing && bookingInfo ? (
        <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
          <h4 className="font-display text-2xl font-bold text-gold mb-2">{bookingInfo.title}</h4>
          <p className="text-cream/70 mb-4">{bookingInfo.subtitle}</p>
          <div className="inline-block px-6 py-2 bg-gold text-royal font-bold rounded-lg">
            {bookingInfo.ctaText}
          </div>
          <p className="text-xs text-gold/50 mt-2">Link: {bookingInfo.ctaLink}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-cream/70 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">CTA Text</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">CTA Link</label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="/contact"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Template Data Notice */}
      {bookingInfo && !bookingInfo.id && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">The information shown is default template info. Save it to your database to make it persistent.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
          >
            {loading ? "Seeding..." : "Save to DB"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBooking;
