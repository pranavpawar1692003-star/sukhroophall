import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Save, X, Edit2, Image as ImageIcon } from "lucide-react";
import {
  db,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "../../lib/firebase";

const AdminAbout = () => {
  const { aboutContent, refreshData } = useData();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
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
        imageUrl: aboutContent.imageUrl || "",
        stats: aboutContent.stats || formData.stats,
      });
    }
  }, [aboutContent]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (aboutContent?.id) {
        const aboutRef = doc(db, "aboutContent", aboutContent.id);
        await updateDoc(aboutRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "aboutContent"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      alert("✅ About Content Updated Successfully!");
      refreshData();
      setEditing(false);
    } catch (error) {
      console.error("Error saving about content:", error);
      alert("❌ Error: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStat = () => {
    setFormData({
      ...formData,
      stats: [
        ...formData.stats,
        { icon: "Award", value: 0, suffix: "", label: "" },
      ],
    });
  };

  const handleRemoveStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  const handleStatChange = (
    index: number,
    field: keyof (typeof formData.stats)[0],
    value: any,
  ) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setFormData({ ...formData, stats: newStats });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl font-bold text-gold">
          About Section
        </h3>
        <button
          onClick={() => setEditing(!editing)}
          className="px-6 py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all font-display uppercase tracking-wider"
        >
          {editing ? "Cancel" : "Edit Details"}
        </button>
      </div>

      {!editing && aboutContent ? (
        <div className="bg-white/5 border border-gold/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {aboutContent.imageUrl && (
              <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden border border-gold/20 shadow-lg shrink-0">
                <img
                  src={aboutContent.imageUrl}
                  className="w-full h-full object-cover"
                  alt="About"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-display text-2xl font-bold text-gold mb-4">
                {aboutContent.title}
              </h4>
              <p className="text-cream/70 leading-relaxed italic">
                "{aboutContent.description}"
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {aboutContent.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-gold/10 rounded-lg p-4 text-center group hover:bg-gold/5 transition-colors"
              >
                <div className="font-display text-3xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-cream/50 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2">
                Featured Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white focus:ring-2 focus:ring-gold/50 outline-none transition-all"
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  className="mt-4 w-32 h-20 object-cover rounded border border-gold/20"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white"
                placeholder="Our Legacy..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white"
                rows={4}
                placeholder="Tell your story..."
              />
            </div>
          </div>

          <div className="bg-white/5 border border-gold/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">
                Performance Statistics
              </label>
              <button
                onClick={handleAddStat}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold text-royal font-bold rounded-lg text-xs hover:bg-gold/90 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Stat
              </button>
            </div>

            <div className="space-y-4">
              {formData.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 bg-white/5 p-4 rounded-xl border border-gold/10 relative"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                    <div>
                      <p className="text-[10px] text-gold/60 font-bold uppercase mb-1">
                        Icon
                      </p>
                      <input
                        type="text"
                        value={stat.icon}
                        onChange={(e) =>
                          handleStatChange(i, "icon", e.target.value)
                        }
                        placeholder="Calendar"
                        className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gold/60 font-bold uppercase mb-1">
                        Value
                      </p>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) =>
                          handleStatChange(i, "value", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gold/60 font-bold uppercase mb-1">
                        Suffix
                      </p>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) =>
                          handleStatChange(i, "suffix", e.target.value)
                        }
                        placeholder="+"
                        className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gold/60 font-bold uppercase mb-1">
                        Label
                      </p>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) =>
                          handleStatChange(i, "label", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-sm text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStat(i)}
                    className="flex items-center justify-center p-2 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all"
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
            className="w-full py-4 bg-gold text-royal font-bold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 shadow-xl shadow-gold/10 text-lg uppercase tracking-widest"
          >
            {loading ? "Syncing Data..." : "Apply All Changes"}
          </button>
        </div>
      )}

      {/* Template Data Notice */}
      {aboutContent && !aboutContent.id && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">
              Live Database Setup
            </h3>
            <p className="text-sm text-cream/70 italic">
              Synchronize the default content to your database to enable
              real-time editing.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
          >
            {loading ? "Initializing..." : "Seed Database"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
