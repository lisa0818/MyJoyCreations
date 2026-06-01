export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";

// 1. Define the interface to fix TypeScript errors
interface Asset {
  image_key: string;
  public_url: string;
}

const baseMetadata = [
  { id: 1, key: "gallery_1", title: "The Grand Ballroom", category: "Weddings", size: "large" },
  { id: 2, key: "gallery_2", title: "Champagne Tower Gala", category: "Birthdays", size: "tall" },
  { id: 3, key: "gallery_3", title: "Garden of Light", category: "Outdoor", size: "tall" },
  { id: 4, key: "gallery_4", title: "Misty Elegance", category: "Themed", size: "tall" },
  { id: 5, key: "gallery_5", title: "Golden Celebration", category: "Birthdays", size: "wide" },
  { id: 6, key: "gallery_6", title: "Floral Entrance", category: "Weddings", size: "tall" },
  { id: 7, key: "gallery_1", title: "Crystal Dreams", category: "Weddings", size: "wide" },
  { id: 8, key: "gallery_3", title: "Twilight Terrace", category: "Outdoor", size: "tall" },
  { id: 9, key: "gallery_4", title: "Enchanted Forest", category: "Themed", size: "wide" },
  { id: 10, key: "gallery_2", title: "Midnight Gala", category: "Birthdays", size: "tall" },
  { id: 11, key: "gallery_5", title: "Summer Soiree", category: "Outdoor", size: "wide" },
  { id: 12, key: "gallery_6", title: "Royal Affair", category: "Weddings", size: "tall" },
];

export default async function PortfolioPage() {
  // 2. Fetch assets correctly (removed invalid cacheControl)
  const { data, error } = await supabase
    .from("homepage_assets")
    .select("*");

  if (error) {
    console.error("Supabase data fetch error in Portfolio:", error.message);
  }

  // 3. Apply the Asset interface to the fetched data
  const assets = (data as Asset[]) || [];

  const findAsset = (key: string): string => {
    return assets.find((a: Asset) => a.image_key === key)?.public_url || "";
  };

  // 4. Resolve URLs dynamically
  const heroMainUrl = findAsset("hero_main");

  const galleryItems = baseMetadata.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    size: item.size,
    image: findAsset(item.key),
  }));

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar />

      {/* Hero Section */}
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

      {/* Dynamic Interactive Gallery Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <PortfolioGallery initialItems={galleryItems} />
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}