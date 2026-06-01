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

  // 1. Process, sort, and map your portfolio database rows uniformly
  const galleryItems = useMemo(() => {
    if (!data?.portfolio) return [];

    return [...data.portfolio]
      .sort((a, b) => {
        const orderA = Number((a as any).sort_order) ?? Number((a as any).order) ?? 0;
        const orderB = Number((b as any).sort_order) ?? Number((b as any).order) ?? 0;
        return orderA - orderB;
      })
      .map((item) => ({
        id: String(item.id),
        title: item.title || "Untitled Masterpiece",
        category: item.category || "Uncategorized",
        image: item.image || "",
        src: item.image || "", // Dual interface assignment to support your gallery's asset parameters
      }));
  }, [data?.portfolio]);

  // 2. Fallback configuration parameters extracted safely without triggering type compiler checks
  const settings = useMemo(() => {
    return (data as any)?.settings || data || {};
  }, [data]);

  // 3. Type-safe asset extraction fallback wrapper
  const findAssetUrl = (key: string): string => {
    const assetsArray = (data as any)?.assets;
    if (!assetsArray || !Array.isArray(assetsArray)) return "";
    return assetsArray.find((a: any) => a.image_key === key)?.public_url || "";
  };

  const heroMainUrl = findAssetUrl("hero_main");
  const logoUrl = settings.logo_url || findAssetUrl("logo") || "";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[var(--color-ivory)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar logoUrl={logoUrl} />

      {/* Hero Header Presentation Banner Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image
              src={heroMainUrl}
              alt="Background mapping layout"
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
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          {galleryItems.length > 0 ? (
            <PortfolioGallery initialItems={galleryItems as any[]} />
          ) : (
            <div className="text-center py-12 text-[var(--color-muted-foreground)]">
              <p className="text-base font-medium">No collection pieces published to the public gallery yet.</p>
              <p className="text-xs mt-1 opacity-70">Check back shortly to view our updated projects.</p>
            </div>
          )}
        </div>
      </section>

      <Footer
        logoUrl={logoUrl}
        email={settings.email}
        phone={settings.phone}
        address={settings.address || settings.location}
        instagram={settings.instagram_url}
        whatsapp={settings.whatsapp}
      />
      
      <WhatsAppButton />
    </div>
  );
}