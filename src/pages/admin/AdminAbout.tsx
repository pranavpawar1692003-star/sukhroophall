import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Save, X, Edit2 } from "lucide-react";
import { db, collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from "../../lib/firebase";

const AdminAbout = () => {
  const { aboutContent, refreshData } = useData();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stats: [
      { icon: "Calendar", value: 24, suffix: " years", label: "of Excellence" },
      { icon: "Heart", value: 1000, suffix: "+", label: "Happy Celebrations" },
      { icon: "Users", value: 500, suffix: " to 2000", label: "Capacity" },
    ],
  });

  useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || "",
        description: aboutContent.description || "",
        stats: aboutContent.stats || formData.stats,
      });
    }
  }, [aboutContent]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (aboutContent?.id) {
        // Update existing
        const aboutRef = doc(db, "aboutContent", aboutContent.id);
        await updateDoc(aboutRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new (if none exists in DB)
        await addDoc(collection(db, "aboutContent"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      refreshData();
      setEditing(false);
    } catch (error) {
      console.error("Error saving about content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { icon: "Award", value: 0, suffix: "", label: "" }],
    });
  };

  const handleRemoveStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  const handleStatChange = (index: number, field: keyof typeof formData.stats[0], value: any) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl font-bold text-gold">About Section</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {!editing && aboutContent ? (
        <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
          <h4 className="font-display text-2xl font-bold text-gold mb-4">{aboutContent.title}</h4>
          <p className="text-cream/70 leading-relaxed">{aboutContent.description}</p>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aboutContent.stats.map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                <div className="font-display text-3xl font-bold text-gold mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs uppercase tracking-wider text-cream/60">{stat.label}</div>
              </div>
            ))}
          </div>
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
            <label className="block text-sm text-cream/70 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              rows={6}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm text-cream/70">Stats</label>
              <button
                onClick={handleAddStat}
                className="flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-lg text-sm hover:bg-gold/30"
              >
                <Plus className="w-4 h-4" />
                Add Stat
              </button>
            </div>

            <div className="space-y-3">
              {formData.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 bg-white/5 p-3 rounded-lg">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={stat.icon}
                      onChange={(e) => handleStatChange(i, "icon", e.target.value)}
                      placeholder="Icon"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(i, "value", parseInt(e.target.value))}
                      placeholder="Value"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
                      placeholder="Suffix"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(i, "label", e.target.value)}
                      placeholder="Label"
                      className="w-full px-2 py-1 bg-white/10 border border-gold/30 rounded text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveStat(i)}
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
      {aboutContent && !aboutContent.id && (
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

export default AdminAbout;
