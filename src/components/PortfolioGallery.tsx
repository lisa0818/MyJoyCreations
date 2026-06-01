"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const filters = ["All", "Weddings", "Birthdays", "Lighting", "Outdoor", "Themed"];

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  category: string;
  size: string;
}

interface PortfolioGalleryProps {
  initialItems: GalleryItem[];
}

export function PortfolioGallery({ initialItems }: PortfolioGalleryProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeFilter === "All" 
    ? initialItems 
    : initialItems.filter((item) => item.category === activeFilter);

  return (
    <>
      <ScrollReveal>
        <div className="text-center mb-12">
          <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
            Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl mb-8">Moments We've Crafted</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
                  activeFilter === filter
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-brand)]/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* CSS Masonry Columns Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.05}>
            <div
              className="group relative break-inside-avoid cursor-pointer rounded-2xl overflow-hidden bg-[var(--color-surface)]"
              onClick={() => setLightbox(item.id)}
            >
              <div className={`relative w-full ${
                item.size === "tall" ? "aspect-[3/4]" : item.size === "wide" ? "aspect-[16/10]" : "aspect-[4/3]"
              }`}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] text-white/70 uppercase tracking-[0.2em]">{item.category}</span>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Lightbox Modal Window */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {(() => {
            const selectedItem = initialItems.find((i) => i.id === lightbox);
            return selectedItem?.image ? (
              <div className="relative max-w-full max-h-[90vh] w-[90vw] h-[80vh]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  fill
                  priority
                  className="object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : null;
          })()}
        </div>
      )}
    </>
  );
}