import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";
import { db, collection, addDoc, updateDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminContact = () => {
  const { contactInfo, refreshData } = useData();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    mapUrl: "",
    socialMedia: [{ platform: "facebook", url: "" }],
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        phone: contactInfo.phone || "",
        email: contactInfo.email || "",
        address: contactInfo.address || "",
        mapUrl: contactInfo.mapUrl || "",
        socialMedia: contactInfo.socialMedia || [{ platform: "facebook", url: "" }],
      });
    }
  }, [contactInfo]);

  const handleAddSocial = () => {
    setFormData({
      ...formData,
      socialMedia: [...formData.socialMedia, { platform: "instagram", url: "" }],
    });
  };

  const handleRemoveSocial = (index: number) => {
    setFormData({
      ...formData,
      socialMedia: formData.socialMedia.filter((_, i) => i !== index),
    });
  };

  const handleSocialChange = (index: number, field: string, value: string) => {
    const newSocial = [...formData.socialMedia];
    newSocial[index] = { ...newSocial[index], [field]: value };
    setFormData({ ...formData, socialMedia: newSocial });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (contactInfo?.id) {
        const contactRef = doc(db, "contactInfo", contactInfo.id);
        await updateDoc(contactRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "contactInfo"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      refreshData();
      setEditing(false);
    } catch (error) {
      console.error("Error saving contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl font-bold text-gold">Contact Information</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {!editing && contactInfo ? (
        <div className="bg-white/5 border border-gold/20 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm text-cream/70 mb-1">Phone</label>
            <p className="text-cream/90">{contactInfo.phone}</p>
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-1">Email</label>
            <p className="text-cream/90">{contactInfo.email}</p>
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-1">Address</label>
            <p className="text-cream/90">{contactInfo.address}</p>
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-1">Map URL</label>
            <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline break-all">
              {contactInfo.mapUrl}
            </a>
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Social Media</label>
            <div className="space-y-2">
              {contactInfo.socialMedia.map((social: any, i: number) => (
                <div key={i} className="flex gap-2">
                  <span className="text-cream/60 w-20 capitalize">{social.platform}:</span>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    {social.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-cream/70 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">Map URL</label>
            <input
              type="text"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="https://maps.google.com/..."
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm text-cream/70">Social Media</label>
              <button
                onClick={handleAddSocial}
                className="flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold/30"
              >
                <Plus className="w-4 h-4" />
                Add Social
              </button>
            </div>
            <div className="space-y-3">
              {formData.socialMedia.map((social, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 bg-white/5 p-3 rounded-lg">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={social.platform}
                      onChange={(e) => handleSocialChange(i, "platform", e.target.value)}
                      placeholder="Platform"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm text-white"
                    />
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => handleSocialChange(i, "url", e.target.value)}
                      placeholder="URL"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveSocial(i)}
                    className="col-span-1 flex items-center justify-center text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
      {contactInfo && !contactInfo.id && (
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

export default AdminContact;
