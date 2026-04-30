import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Save, 
  Snowflake, 
  Car, 
  UtensilsCrossed, 
  BedDouble, 
  Theater, 
  Zap, 
  Lock, 
  Coffee, 
  Users, 
  Utensils, 
  Star, 
  Info 
} from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

const iconMap: { [key: string]: any } = {
  Snowflake,
  Car,
  UtensilsCrossed,
  BedDouble,
  Theater,
  Zap,
  Lock,
  Coffee,
  Users,
  Utensils,
  Star,
  Info
};

const AdminFacilities = () => {
  const { facilities, facilityExtras, refreshData } = useData();
  const [newFacility, setNewFacility] = useState({
    icon: "Utensils",
    title: "",
    desc: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Extras state
  const [extrasEditing, setExtrasEditing] = useState(false);
  const [extrasData, setExtrasData] = useState({
    technicalExcellence: [] as { label: string; value: string }[],
    specifications: [] as string[],
  });

  useEffect(() => {
    if (facilities.length > 0 && editingId) {
      const facility = facilities.find((f) => f.id === editingId);
      if (facility) {
        setEditingData(facility);
      }
    }
  }, [facilities, editingId]);

  useEffect(() => {
    if (facilityExtras) {
      setExtrasData({
        technicalExcellence: facilityExtras.technicalExcellence || [],
        specifications: facilityExtras.specifications || [],
      });
    }
  }, [facilityExtras]);

  const handleAdd = async () => {
    if (!newFacility.title || !newFacility.desc) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "facilities"), {
        ...newFacility,
        order: (facilities.length > 0 && !!facilities[0].id) ? facilities.length : 0,
        createdAt: serverTimestamp(),
      });
      setNewFacility({ icon: "Utensils", title: "", desc: "", order: facilities.length + 1 });
      refreshData();
    } catch (error) {
      console.error("Error adding facility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.title || !editingData?.desc) return;
    setLoading(true);

    try {
      const facilityRef = doc(db, "facilities", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(facilityRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
      refreshData();
    } catch (error) {
      console.error("Error updating facility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "facilities", id));
      refreshData();
    } catch (error) {
      console.error("Error deleting facility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (facility: any) => {
    setEditingId(facility.id);
    setEditingData({ ...facility });
  };

  const handleExtrasSave = async () => {
    setLoading(true);
    try {
      if (facilityExtras?.id) {
        const extrasRef = doc(db, "facilityExtras", facilityExtras.id);
        await updateDoc(extrasRef, {
          ...extrasData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "facilityExtras"), {
          ...extrasData,
          createdAt: serverTimestamp(),
        });
      }
      refreshData();
      setExtrasEditing(false);
    } catch (error) {
      console.error("Error saving extras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Main Facilities List Section */}
      <div className="space-y-6">
        <h3 className="font-display text-2xl font-bold text-gold border-b border-gold/20 pb-2">Core Facilities</h3>
        
        {/* Seed Data Button (Show if using fallback data or empty) */}
        {(facilities.length === 0 || !facilities[0]?.id) && (
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
              <p className="text-sm text-cream/70">The items below are currently template info. Save them to DB to enable editing/deletion.</p>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  for (const f of facilities) {
                    await addDoc(collection(db, "facilities"), {
                      ...f,
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
              {loading ? "Saving..." : "Save Facilities to DB"}
            </button>
          </div>
        )}

        {/* Add New Facility */}
        <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
          <h3 className="font-display text-xl font-bold text-gold mb-4">Add New Facility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-cream/70 mb-2">Icon (e.g., Snowflake, Car, Star)</label>
              <input
                type="text"
                value={newFacility.icon}
                onChange={(e) => setNewFacility({ ...newFacility, icon: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                placeholder="Snowflake, Car, Utensils..."
              />
            </div>
            <div>
              <label className="block text-sm text-cream/70 mb-2">Title</label>
              <input
                type="text"
                value={newFacility.title}
                onChange={(e) => setNewFacility({ ...newFacility, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-cream/70 mb-2">Description</label>
              <textarea
                value={newFacility.desc}
                onChange={(e) => setNewFacility({ ...newFacility, desc: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={handleAdd}
                disabled={loading}
                className="w-full py-2 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
              >
                {loading ? "Adding..." : "Add Facility"}
              </button>
            </div>
          </div>
        </div>

        {/* List of facilities */}
        <div className="space-y-4">
          {facilities.map((facility, i) => {
            const IconComponent = iconMap[facility.icon] || Info;
            return (
              <div key={facility.id || `fallback-${i}`} className="bg-white/5 border border-gold/20 rounded-lg p-4">
                {editingId === facility.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingData?.icon || ""}
                        onChange={(e) => setEditingData({ ...editingData, icon: e.target.value })}
                        className="px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                        placeholder="Icon Name"
                      />
                      <input
                        type="text"
                        value={editingData?.title || ""}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                        placeholder="Title"
                      />
                      <textarea
                        value={editingData?.desc || ""}
                        onChange={(e) => setEditingData({ ...editingData, desc: e.target.value })}
                        className="md:col-span-2 px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleUpdate} className="flex-1 py-1 bg-gold text-royal font-bold rounded text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-1 bg-white/10 text-cream rounded text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 border border-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <IconComponent className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-gold text-sm sm:text-base">{facility.title}</h4>
                        <p className="text-cream/70 text-xs sm:text-sm line-clamp-1">{facility.desc}</p>
                      </div>
                    </div>
                    <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gold/10">
                      <button 
                        onClick={() => handleStartEdit(facility)} 
                        className="flex-1 sm:flex-none p-2.5 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center min-w-[44px]"
                        title="Edit Facility"
                      >
                        <Edit2 className="w-5 h-5 mr-2 sm:mr-0" />
                        <span className="sm:hidden text-xs uppercase font-bold">Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(facility.id!)} 
                        disabled={!facility.id || loading}
                        className="flex-1 sm:flex-none p-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 disabled:opacity-30 transition-colors flex items-center justify-center min-w-[44px]"
                        title="Delete Facility"
                      >
                        <Trash2 className="w-5 h-5 mr-2 sm:mr-0" />
                        <span className="sm:hidden text-xs uppercase font-bold">Delete</span>
                      </button>
                    </div>
                  </div>

                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Technical Excellence & Specifications Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gold/20 pb-2">
          <h3 className="font-display text-2xl font-bold text-gold">Technical Specs & Facts</h3>
          <button
            onClick={() => setExtrasEditing(!extrasEditing)}
            className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg hover:bg-gold/20 transition-all text-sm font-bold"
          >
            {extrasEditing ? "Cancel" : "Edit Specs"}
          </button>
        </div>

        {extrasEditing ? (
          <div className="bg-white/5 border border-gold/20 rounded-lg p-6 space-y-8">
            {/* Technical Excellence Editor */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-gold font-bold">Technical Excellence (Labeled Stats)</h4>
                <button
                  onClick={() => setExtrasData({ ...extrasData, technicalExcellence: [...extrasData.technicalExcellence, { label: "", value: "" }] })}
                  className="flex items-center gap-1 text-xs bg-gold/20 text-gold px-2 py-1 rounded hover:bg-gold/30"
                >
                  <Plus className="w-3 h-3" /> Add Stat
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {extrasData.technicalExcellence.map((tech, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-3 bg-white/5 p-4 rounded-xl border border-gold/10 relative group">
                    <div className="flex-1 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                      <div className="flex-1">
                        <p className="text-[10px] text-gold font-bold uppercase mb-1 sm:hidden">Label</p>
                        <input
                          type="text"
                          placeholder="e.g. Area"
                          value={tech.label}
                          onChange={(e) => {
                            const newTech = [...extrasData.technicalExcellence];
                            newTech[i].label = e.target.value;
                            setExtrasData({ ...extrasData, technicalExcellence: newTech });
                          }}
                          className="w-full bg-white/5 border border-gold/20 text-sm text-white p-2 rounded-lg focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gold font-bold uppercase mb-1 sm:hidden">Value</p>
                        <input
                          type="text"
                          placeholder="e.g. 5 Acres"
                          value={tech.value}
                          onChange={(e) => {
                            const newTech = [...extrasData.technicalExcellence];
                            newTech[i].value = e.target.value;
                            setExtrasData({ ...extrasData, technicalExcellence: newTech });
                          }}
                          className="w-full bg-white/5 border border-gold/20 text-sm text-gold p-2 rounded-lg focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setExtrasData({ ...extrasData, technicalExcellence: extrasData.technicalExcellence.filter((_, idx) => idx !== i) })}
                      className="absolute -top-2 -right-2 sm:static bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-full transition-colors border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Facts Editor */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-gold font-bold">Facility Quick Facts (Bullet Points)</h4>
                <button
                  onClick={() => setExtrasData({ ...extrasData, specifications: [...extrasData.specifications, ""] })}
                  className="flex items-center gap-1 text-xs bg-gold/20 text-gold px-2 py-1 rounded hover:bg-gold/30"
                >
                  <Plus className="w-3 h-3" /> Add Fact
                </button>
              </div>
              <div className="space-y-2">
                {extrasData.specifications.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => {
                        const newSpecs = [...extrasData.specifications];
                        newSpecs[i] = e.target.value;
                        setExtrasData({ ...extrasData, specifications: newSpecs });
                      }}
                      className="flex-1 bg-white/5 border border-gold/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-gold"
                    />
                    <button
                      onClick={() => setExtrasData({ ...extrasData, specifications: extrasData.specifications.filter((_, idx) => idx !== i) })}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleExtrasSave}
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all"
            >
              {loading ? "Saving..." : "Save Technical Specs"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-gold/10 rounded-lg p-6">
              <h4 className="text-gold font-bold mb-4 flex items-center gap-2"><Check className="w-4 h-4" /> Technical Excellence</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extrasData.technicalExcellence.map((tech, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-lg border border-gold/10 sm:border-0 sm:bg-transparent sm:border-l-2 sm:border-gold/50 sm:pl-3">
                    <p className="text-[10px] text-cream/50 uppercase">{tech.label}</p>
                    <p className="text-sm font-bold text-white">{tech.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-gold/10 rounded-lg p-6">
              <h4 className="text-gold font-bold mb-4 flex items-center gap-2"><Check className="w-4 h-4" /> Quick Facts</h4>
              <ul className="space-y-2">
                {extrasData.specifications.map((spec, i) => (
                  <li key={i} className="text-xs text-cream/70 flex gap-2">
                    <span className="text-gold">•</span> {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFacilities;
