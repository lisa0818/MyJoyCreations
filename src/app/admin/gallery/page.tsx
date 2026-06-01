"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Upload,
  Pencil,
  X,
  Check,
  ImageIcon,
  Loader2,
  ArrowLeft,
  Filter,
  Layers,
  GripVertical,
} from "lucide-react";
import { useSite } from "@/lib/site-store";

// Clean 2D multi-row grid sorting library imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AdminGalleryManager() {
  const {
    data,
    loading,
    addPortfolioItem,
    updatePortfolioItem,
    updatePortfolioList,
    deletePortfolioItem,
    uploadFileToStorage,
  } = useSite();

  // Core component states
  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadingState, setUploadingState] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  
  // Local state copy prevents any visual rollback/snapping lag
  const [localPortfolio, setLocalPortfolio] = useState<any[]>([]);

  // Synchronize internal layout tracking whenever store data hydrates/updates
  useEffect(() => {
    if (data?.portfolio) {
      setLocalPortfolio(data.portfolio);
    }
  }, [data?.portfolio]);

  // Avoid SSR layout hydration mismatches
  const [enabledDnD, setEnabledDnD] = useState(false);
  useEffect(() => {
    setEnabledDnD(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevents breaking click interactions on buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [newItem, setNewItem] = useState({
    title: "",
    category: "Weddings",
    customCategory: "",
    image: "",
  });
  
  const newImageRef = useRef<HTMLInputElement>(null);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  // Compile categories safely from our stable state pointer
  const availableCategories = useMemo(() => {
    const categories = new Set<string>(["Weddings", "Engagements", "Corporate", "Parties", "Birthdays", "Outdoor", "Themed", "Baptism"]);
    localPortfolio.forEach((item) => {
      if (item.category) categories.add(item.category.trim());
    });
    return Array.from(categories);
  }, [localPortfolio]);

  const finalNewCategory = newItem.category === "CUSTOM" 
    ? newItem.customCategory.trim() 
    : newItem.category;

  const handleNewItemImage = async (file: File) => {
    try {
      setUploadingState("newItem");
      const url = await uploadFileToStorage(file, "portfolio-items");
      setNewItem((n) => ({ ...n, image: url }));
    } catch (err) {
      console.error("Portfolio image upload failed:", err);
      alert("Failed to process asset upload.");
    } finally {
      setUploadingState(null);
    }
  };

  // Processed local tracking dataset sorted dynamically via safe numeric casting
  const processedPortfolioItems = useMemo(() => {
    return [...localPortfolio]
      .filter((item) => {
        if (activeCategoryFilter === "All") return true;
        return item.category?.toLowerCase() === activeCategoryFilter.toLowerCase();
      })
      .sort((a, b) => {
        const orderA = Number(a.sort_order ?? a.order ?? 0);
        const orderB = Number(b.sort_order ?? b.order ?? 0);
        return orderA - orderB; 
      });
  }, [localPortfolio, activeCategoryFilter]);

  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.image || !finalNewCategory) {
      alert("Please ensure your asset has a title, image, and category defined.");
      return;
    }
    
    let fallbackBottomOrder = 0;
    if (localPortfolio.length > 0) {
      const currentOrders = localPortfolio.map((item: any) => Number(item.sort_order ?? item.order ?? 0));
      fallbackBottomOrder = Math.max(...currentOrders) + 1000;
    }

    await addPortfolioItem({
      title: newItem.title.trim(),
      category: finalNewCategory,
      image: newItem.image,
      sort_order: fallbackBottomOrder,
      order: fallbackBottomOrder, 
    } as any);

    setNewItem({ title: "", category: "Weddings", customCategory: "", image: "" });
    if (newImageRef.current) newImageRef.current.value = "";
    setIsModalOpen(false);
    flashSaved();
  };

  const handleEditImage = async (id: string, file: File) => {
    try {
      setUploadingState(`edit-${id}`);
      const url = await uploadFileToStorage(file, "portfolio-items");
      await updatePortfolioItem(id, { image: url });
      flashSaved();
    } catch (err) {
      console.error("Image replacement failed:", err);
    } finally {
      setUploadingState(null);
    }
  };

  // High-performance Fractional Positioning Engine - completely stops visual rubberbanding
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = processedPortfolioItems.findIndex((item) => item.id === active.id);
    const newIndex = processedPortfolioItems.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // 1. Instantly perform the item move locally
    const reorderedItems = arrayMove(processedPortfolioItems, oldIndex, newIndex);

    // 2. Map safe fractional increments across the reordered structure to preserve context filters
    const updatedItemsWithOrders = reorderedItems.map((item, index) => {
      const targetOrder = index * 1000;
      return {
        ...item,
        sort_order: targetOrder,
        order: targetOrder,
      };
    });

    // 3. Merge cleanly back into our full master state matrix
    const newMasterPortfolioList = localPortfolio.map((originalItem) => {
      const matchingUpdatedItem = updatedItemsWithOrders.find((u) => u.id === originalItem.id);
      return matchingUpdatedItem ? matchingUpdatedItem : originalItem;
    });

    // Commit state changes instantly to completely block the snapback effect
    setLocalPortfolio(newMasterPortfolioList);
    flashSaved();

    // 4. Safely pipe updates upstream to the server background task runner
    try {
      // Persist the entire updated master list in one atomic operation to avoid
      // stale-closure overwrites and ensure the UI order sticks.
      await updatePortfolioList(newMasterPortfolioList as any);
    } catch (error) {
      console.error("Failed persisting layout order adjustments:", error);
      if (data?.portfolio) setLocalPortfolio(data.portfolio);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Dynamic Action Sticky Banner */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Site Manager
          </Link>
          
          <div className="flex items-center gap-4">
            {savedFlash && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" /> Ordering Synchronized
              </span>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Asset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Deck */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Displaying {processedPortfolioItems.length} items. Grab the handle icons to drag and drop elements fluidly in 2D space.
          </p>
        </div>

        {/* Category Segment Selectors */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Filter by Category Group</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategoryFilter("All")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategoryFilter === "All"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Assets ({localPortfolio.length})
            </button>
            {availableCategories.map((cat) => {
              const count = localPortfolio.filter(item => item.category?.toLowerCase() === cat.toLowerCase()).length || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    activeCategoryFilter.toLowerCase() === cat.toLowerCase()
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Fluid 2D Dnd Layout Grid */}
        {enabledDnD && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={processedPortfolioItems.map((item) => item.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {processedPortfolioItems.map((item) => (
                  <SortableGridCard
                    key={item.id}
                    item={item}
                    uploadingState={uploadingState}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    handleEditImage={handleEditImage}
                    deletePortfolioItem={deletePortfolioItem}
                    updatePortfolioItem={updatePortfolioItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Empty Collection Flag */}
        {processedPortfolioItems.length === 0 && (
          <div className="text-center text-slate-400 py-16 bg-white rounded-xl border border-dashed border-slate-200 max-w-xl mx-auto mt-6">
            <ImageIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No portfolio items found</p>
            <p className="text-xs text-slate-400 px-4 mt-1">
              There are no assets under the "{activeCategoryFilter}" filter group. Choose another segment or clear filters to view item records.
            </p>
          </div>
        )}
      </main>

      {/* Pop-up Overlay Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Portfolio Asset</h3>
                <p className="text-xs text-slate-400">Map an image file into live database rows</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label>Image Asset Data Source</Label>
                <label className="mt-2 flex items-center justify-center aspect-[16/10] w-40 mx-auto rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-900 cursor-pointer overflow-hidden bg-slate-50 relative group transition-all">
                  {uploadingState === "newItem" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-800" />
                  ) : newItem.image ? (
                    <img src={newItem.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400 text-center p-2">
                      <Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                      <span className="text-[9px] uppercase tracking-wider font-semibold">Choose File</span>
                    </div>
                  )}
                  <input
                    ref={newImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingState !== null}
                    onChange={(e) => e.target.files?.[0] && handleNewItemImage(e.target.files[0])}
                  />
                </label>
              </div>

              <Field
                label="Asset Title Label"
                value={newItem.title}
                onChange={(v) => setNewItem((n) => ({ ...n, title: v }))}
                placeholder="E.g. The Grand Ballroom"
              />

              <div className="space-y-1.5">
                <Label>Category Assignment</Label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((n) => ({ ...n, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="CUSTOM">+ Define a New Custom Category...</option>
                </select>

                {newItem.category === "CUSTOM" && (
                  <div className="pt-2">
                    <Field
                      label="New Category Title Name"
                      value={newItem.customCategory}
                      onChange={(v) => setNewItem((n) => ({ ...n, customCategory: v }))}
                      placeholder="Type new category name"
                    />
                  </div>
                )}
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.title.trim() || !newItem.image || !finalNewCategory || uploadingState !== null}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                Commit to Database
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Fixed grid sorting element
function SortableGridCard({
  item,
  uploadingState,
  editingId,
  setEditingId,
  handleEditImage,
  deletePortfolioItem,
  updatePortfolioItem,
}: {
  item: any;
  uploadingState: string | null;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  handleEditImage: (id: string, file: File) => void;
  deletePortfolioItem: (id: string) => void;
  updatePortfolioItem: (id: string, fields: any) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl overflow-hidden border shadow-sm group hover:shadow-md transition-shadow flex flex-col relative ${
        isDragging
          ? "border-slate-900 ring-4 ring-slate-900/10 z-50 select-none opacity-80 scale-[1.03]"
          : "border-slate-200"
      }`}
    >
      {/* Image Node Wrapper */}
      <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {uploadingState === `edit-${item.id}` ? (
          <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Hover Menu Overlay Layer */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
          <label
            className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-slate-900 hover:text-white cursor-pointer transition-colors shadow-sm"
            title="Replace item file image"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingState !== null}
              onChange={(e) => e.target.files?.[0] && handleEditImage(item.id, e.target.files[0])}
            />
          </label>
          <button
            onClick={() => setEditingId(editingId === item.id ? null : item.id)}
            className="w-9 h-9 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors shadow-sm"
          >
            {editingId === item.id ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to remove "${item.title}"?`)) {
                deletePortfolioItem(item.id);
              }
            }}
            className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Dedicated Handle Element - listens explicitly to layout actions */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-white/90 text-slate-700 hover:bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing z-30 transition-all hover:scale-105"
        >
          <GripVertical className="w-3.5 h-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Detail Labels Section */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        {editingId === item.id ? (
          <div className="space-y-3">
            <Field
              label="Asset Title"
              value={item.title}
              onChange={(v) => updatePortfolioItem(item.id, { title: v })}
            />
            <Field
              label="Category Group"
              value={item.category}
              onChange={(v) => updatePortfolioItem(item.id, { category: v })}
            />
            <button
              onClick={() => setEditingId(null)}
              className="w-full mt-1 inline-flex items-center justify-center py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold tracking-wide text-slate-700 transition-colors"
            >
              Finish Adjustments
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 leading-snug truncate" title={item.title}>
                {item.title}
              </h3>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5 inline-flex items-center gap-1">
                <Layers className="w-3 h-3" /> {item.category || "Uncategorized"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400">{children}</label>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm text-slate-900"
      />
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}