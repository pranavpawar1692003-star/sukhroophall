import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { Plus, Trash2, Edit2, Check, X, Save, Image as ImageIcon } from "lucide-react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, ref, uploadBytes, getDownloadURL, storage } from "../../lib/firebase";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (services.length > 0 && editingId) {
      const service = services.find((s) => s.id === editingId);
      if (service) {
        setEditingData(service);
      }
    }
  }, [services, editingId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `services/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert("❌ Upload Failed: " + error.message);
      return null;
    }
  };

  const handleAdd = async () => {
    if (!newService.title || !newService.desc) {
      alert("⚠️ Please fill in Title and Description");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = newService.image;

      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (!uploadedUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }
        imageUrl = uploadedUrl;
      }

      const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80";

      await addDoc(collection(db, "services"), {
        ...newService,
        image: finalImageUrl,
        order: services.length,
        createdAt: serverTimestamp(),
      });

      alert("✅ Service Added Successfully!");
      setNewService({ image: "", title: "", desc: "", order: services.length + 1 });
      setImageFile(null);
      setImagePreview(null);
      refreshData();
    } catch (error: any) {
      console.error("Error adding service:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editingData?.title || !editingData?.desc) return;
    setLoading(true);

    try {
      const serviceRef = doc(db, "services", editingId);
      const { id, ...dataToUpdate } = editingData;
      await updateDoc(serviceRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
      refreshData();
    } catch (error) {
      console.error("Error updating service:", error);
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
      {/* Seed Data Button (Only show if using fallback data) */}
      {services.length > 0 && !services[0].id && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-gold">Template Data Active</h3>
            <p className="text-sm text-cream/70">The information shown is default template info. Save it to your database to make it persistent.</p>
          </div>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                for (const s of services) {
                  await addDoc(collection(db, "services"), {
                    ...s,
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
          <div>
            <label className="block text-sm text-cream/70 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold file:text-royal hover:file:bg-gold/90"
            />
            {imagePreview && (
              <div className="mt-4 relative w-32 h-32 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border border-gold/30"
                />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-cream/70 mb-2">OR Image URL</label>
            <input
              type="text"
              value={newService.image}
              onChange={(e) => setNewService({ ...newService, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2">Title</label>
            <input
              type="text"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-gold/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-cream/70 mb-2">Description</label>
            <textarea
              value={newService.desc}
              onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
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
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Services */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-gold">Existing Services</h3>
        {services.map((service) => (
          <div key={service.id || service.title} className="bg-white/5 border border-gold/20 rounded-lg p-4">
            {editingId === service.id ? (
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
                  <div className="md:col-span-2">
                    <label className="block text-sm text-cream/70 mb-1">Description</label>
                    <textarea
                      value={editingData?.desc || ""}
                      onChange={(e) => setEditingData({ ...editingData, desc: e.target.value })}
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
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg font-bold text-gold">{service.title}</h4>
                  <p className="text-cream/70 text-sm mt-1 line-clamp-2 sm:line-clamp-none">{service.desc}</p>
                </div>
                <div className="flex w-full sm:w-auto justify-end gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleStartEdit(service)}
                    className="flex-1 sm:flex-none p-2.5 bg-white/10 text-cream rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-5 h-5 mr-2 sm:mr-0" />
                    <span className="sm:hidden text-sm uppercase font-bold">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id!)}
                    disabled={!service.id || loading}
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

export default AdminServices;
