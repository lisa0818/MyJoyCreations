"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  storage_path: string;
}

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Weddings");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setItems(data);
    setLoading(false);
  }

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image file first.");

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const storagePath = `portfolio/img-${Date.now()}.${fileExt}`;

    // 1. Upload file binary to target bucket
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, file);

    if (storageError) {
      alert(`Storage Upload Exception: ${storageError.message}`);
      setUploading(false);
      return;
    }

    // 2. Resolve final edge delivery address
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(storagePath);

    // 3. Complete database catalog declaration
    const { error: dbError } = await supabase.from("gallery").insert([
      {
        title,
        category,
        image_url: urlData.publicUrl,
        storage_path: storagePath
      }
    ]);

    setUploading(false);
    if (!dbError) {
      setShowModal(false);
      setTitle("");
      setFile(null);
      fetchGallery();
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this portfolio work permanently?")) return;

    // Remove from object store
    await supabase.storage.from("gallery").remove([item.storage_path]);
    // Remove ledger database mapping
    const { error } = await supabase.from("gallery").delete().eq("id", item.id);

    if (!error) setItems(items.filter(i => i.id !== item.id));
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl mb-1">Portfolio Gallery</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Manage showcases published to your public gallery</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)]"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden cinematic-shadow">
              <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10">
                <button
                  onClick={() => handleDelete(item)}
                  className="self-end w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-white">
                  <p className="text-xs uppercase tracking-wider opacity-70">{item.category}</p>
                  <h4 className="font-medium text-sm mt-0.5">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleUploadAndSave} className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">Upload Asset</h2>
              <button type="button" onClick={() => setShowModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-xl text-sm" placeholder="E.g., Grand Ball Decoration" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-xl text-sm">
                  <option>Weddings</option>
                  <option>Birthdays</option>
                  <option>Lighting</option>
                  <option>Floral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Image File</label>
                <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100" />
              </div>
              <button type="submit" disabled={uploading} className="w-full py-3 bg-[var(--color-brand)] text-white font-semibold rounded-full uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                {uploading ? "Uploading Bundle..." : "Publish To Gallery"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}