"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSite } from "@/lib/site-store";

// Named imports matching your components directory exports
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";

export default function PublicPortfolioPage() {
  const { data, loading } = useSite();

  // Use 'as any' to bypass strict type checking when accessing dynamic store properties
  const siteData = data as any;
  const settings = siteData?.settings || {};

  // Safeguard access to deep objects
  const heroMainUrl = siteData?.heroes?.portfolio || "";
  const logoUrl = settings?.logo || "";

  // 1. Process, sort, and map portfolio items
  const galleryItems = useMemo(() => {
    const portfolio = siteData?.portfolio || [];
    
    return [...portfolio]
      .sort((a, b) => {
        const orderA = Number(a.sort_order ?? a.order ?? 9999);
        const orderB = Number(b.sort_order ?? b.order ?? 9999);
        return orderA - orderB;
      })
      .map((item) => ({
        id: String(item.id),
        title: item.title || "Untitled Masterpiece",
        category: item.category || "Uncategorized",
        image: item.image || "",
        src: item.image || "",
      }));
  }, [siteData?.portfolio]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[var(--color-ivory)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] flex flex-col">
      <Navbar logoUrl={logoUrl} />

      {/* Hero Header Presentation Banner Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image
              src={heroMainUrl}
              alt="Hero background"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-[var(--color-ink)]/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <HeroFadeIn delay={0.2} className="text-white/70 text-xs uppercase tracking-[0.4em] mb-4">
            Our Work
          </HeroFadeIn>
          <HeroTitle delay={0.4} className="font-display text-5xl md:text-7xl text-white text-shadow-hero">
            The <span className="italic">Gallery</span>
          </HeroTitle>
        </div>
      </section>

      {/* Dynamic Interactive Sorted Gallery Grid Wrapper */}
      <main className="flex-grow py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {galleryItems.length > 0 ? (
            // Use 'as any' here to bypass potential interface mismatch with the component prop
            <PortfolioGallery initialItems={galleryItems as any} />
          ) : (
            <div className="text-center py-12 text-[var(--color-muted-foreground)]">
              <p className="text-base font-medium">No collection pieces published to the public gallery yet.</p>
              <p className="text-xs mt-1 opacity-70">Check back shortly to view our updated projects.</p>
            </div>
          )}
        </div>
      </main>

      <Footer
        logoUrl={logoUrl}
        email={settings.email}
        phone={settings.phone}
        // Fallback to location if address is missing
        address={settings.address || settings.location}
        // Fallback to empty string if missing
        instagram={settings.instagram_url || ""}
        whatsapp={settings.whatsapp}
      />
      
      <WhatsAppButton />
    </div>
  );
}