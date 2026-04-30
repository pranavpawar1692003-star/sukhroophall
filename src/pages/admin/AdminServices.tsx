import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Trash2, Edit2, X, Image as ImageIcon } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "../../lib/firebase";

const AdminServices = () => {
  const { services, refreshData } = useData();
  const [newService, setNewService] = useState({
    image: "",
    title: "",
    desc: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (services.length > 0 && editingId) {
      const service = services.find((s) => s.id === editingId);
      if (service) {
        setEditingData(service);
      }
    }
  }, [services, editingId]);

  const handleAdd = async () => {
    if (!newService.title || !newService.desc || !newService.image) {
      alert("⚠️ Please fill in Image URL, Title and Description");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "services"), {
        ...newService,
        order: services.length,
        createdAt: serverTimestamp(),
      });

      alert("✅ Service Added Successfully!");
      setNewService({ image: "", title: "", desc: "", order: services.length + 1 });
      refreshData();
    } catch (error: any) {
      console.error("Error adding service:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.title || !editingData?.desc || !editingData?.image) return;
    setLoading(true);

    try {
      const serviceRef = doc(db, "services", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(serviceRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      
      alert("✅ Service Updated Successfully!");
      setEditingId(null);
      refreshData();
    } catch (error: any) {
      console.error("Error updating service:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "services", id));
      refreshData();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (service: any) => {
    setEditingId(service.id);
    setEditingData({ ...service });
  };

  return (
    <div className="space-y-6">
      {/* Seed Data Button */}
      {(services.length === 0 || !services[0]?.id) && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">Save this to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const s of services) {
                  const { id, ...dataToSave } = s;
                  await addDoc(collection(db, "services"), {
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

      {/* Add New Service */}
      <div className="bg-white/5 border border-gold/20 rounded-lg p-6">
        <h3 className="font-display text-xl font-bold text-gold mb-4">Add New Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Image URL</label>
            <input
              type="text"
              value={newService.image}
              onChange={(e) => setNewService({ ...newService, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-white outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
            {newService.image && (
               <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gold/30 shadow-lg">
                  <img src={newService.image} className="w-full h-full object-cover" />
               </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Title</label>
            <input
              type="text"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
              placeholder="Service Title"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2 font-bold uppercase tracking-widest text-[10px]">Description</label>
            <textarea
              value={newService.desc}
              onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white"
              rows={3}
              placeholder="Brief description..."
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-3 bg-gold text-royal font-bold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 shadow-lg shadow-gold/10"
            >
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Services */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Services</h3>
        <div className="grid grid-cols-1 gap-4">
          {services.map((service, i) => (
            <div key={service.id || `fallback-${i}`} className="bg-white/5 border border-gold/20 rounded-xl p-4 hover:bg-white/10 transition-all group">
              {editingId === service.id ? (
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
                         <img src={editingData.image} className="mt-2 w-24 h-24 object-cover rounded border border-gold/20" />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Title</label>
                      <input
                        type="text"
                        value={editingData?.title || ""}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-gold/30 rounded text-white text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-cream/70 mb-1 font-bold uppercase tracking-widest text-[10px]">Description</label>
                      <textarea
                        value={editingData?.desc || ""}
                        onChange={(e) => setEditingData({ ...editingData, desc: e.target.value })}
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
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover rounded-lg border border-gold/20 shadow-md" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-bold text-gold">{service.title}</h4>
                    <p className="text-cream/60 text-xs mt-1 line-clamp-2 italic">"{service.desc}"</p>
                  </div>
                  <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(service)} className="p-2.5 bg-white/10 text-cream rounded-lg hover:bg-gold/20 hover:text-gold transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(service.id!)} disabled={!service.id || loading} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-30">
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

export default AdminServices;
