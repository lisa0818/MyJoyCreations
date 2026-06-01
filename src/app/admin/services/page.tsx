"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Briefcase,
  Check,
  X,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  active: boolean;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Weddings");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setServices(data);
    setLoading(false);
  }

  const openAddModal = () => {
    setEditingService(null);
    setName("");
    setCategory("Weddings");
    setPrice("");
    setDescription("");
    setActive(true);
    setShowForm(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setPrice(service.price);
    setDescription(service.description || "");
    setActive(service.active);
    setShowForm(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, category, price, description, active };

    if (editingService) {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", editingService.id);
      if (!error) fetchServices();
    } else {
      const { error } = await supabase
        .from("services")
        .insert([payload]);
      if (!error) fetchServices();
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (!error) setServices(services.filter(s => s.id !== id));
    }
  };

  const toggleStatus = async (service: Service) => {
    const { error } = await supabase
      .from("services")
      .update({ active: !service.active })
      .eq("id", service.id);
    
    if (!error) {
      setServices(services.map(s => s.id === service.id ? { ...s, active: !s.active } : s));
    }
  };

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl mb-1">Services Management</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Manage your service offerings and pricing</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 cinematic-shadow mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl cinematic-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted-foreground)] font-medium pb-4 px-6 pt-4">Service</th>
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted-foreground)] font-medium pb-4 px-4 pt-4">Category</th>
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted-foreground)] font-medium pb-4 px-4 pt-4">Price</th>
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted-foreground)] font-medium pb-4 px-4 pt-4">Status</th>
                  <th className="text-right text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted-foreground)] font-medium pb-4 px-6 pt-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr key={service.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-[var(--color-brand)]" />
                        </div>
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[var(--color-muted-foreground)]">{service.category}</td>
                    <td className="py-4 px-4 text-sm font-medium">{service.price}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(service)}
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${
                          service.active
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                        }`}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-brand)] hover:text-white transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveService} className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl">{editingService ? "Edit Service" : "Add New Service"}</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
                  placeholder="Enter service name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
                  >
                    <option>Weddings</option>
                    <option>Birthdays</option>
                    <option>Lighting</option>
                    <option>Floral</option>
                    <option>Themed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Price Range</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
                    placeholder="From $3,500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm resize-none"
                  placeholder="Service description..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
              >
                <Check className="w-4 h-4" />
                {editingService ? "Update Service" : "Save Service"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}