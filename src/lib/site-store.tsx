"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { StaticImageData } from "next/image";
import { supabase } from "@/lib/supabase";

// Fallback assets used if Supabase database is completely fresh and empty
import heroMain from "@/assets/hero-main.jpg";
import aboutTeam from "@/assets/about-team.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import logoImg from "@/assets/logo.png";

export type SiteSettings = {
  logo: string;
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address: string;
};

export type PageHeroes = {
  home: string;
  about: string;
  services: string;
  portfolio: string;
  contact: string;
};

export type PortfolioItem = {
  id: string;
  image: string;
  title: string;
  category: string;
};

export type SiteData = {
  settings: SiteSettings;
  heroes: PageHeroes;
  portfolio: PortfolioItem[];
};

// Extractor helper to turn imported local image objects into strings smoothly
const getSrc = (img: string | StaticImageData): string => {
  return typeof img === "string" ? img : img.src;
};

const DEFAULTS: SiteData = {
  settings: {
    logo: getSrc(logoImg),
    businessName: "MyJoy Creations",
    tagline: "The Art of Celebration",
    email: "hello@myjoycreations.com",
    phone: "+1 (234) 567-890",
    whatsapp: "1234567890",
    instagram: "https://instagram.com/myjoycreations",
    address: "123 Celebration Lane, London, UK",
  },
  heroes: {
    home: getSrc(heroMain),
    about: getSrc(aboutTeam),
    services: getSrc(heroMain),
    portfolio: getSrc(heroMain),
    contact: getSrc(heroMain),
  },
  portfolio: [
    { id: "1", image: getSrc(gallery1), title: "The Grand Ballroom", category: "Weddings" },
    { id: "2", image: getSrc(gallery2), title: "Champagne Tower Gala", category: "Birthdays" },
    { id: "3", image: getSrc(gallery3), title: "Garden of Light", category: "Outdoor" },
    { id: "4", image: getSrc(gallery4), title: "Misty Elegance", category: "Themed" },
    { id: "5", image: getSrc(gallery5), title: "Golden Celebration", category: "Birthdays" },
    { id: "6", image: getSrc(gallery6), title: "Floral Entrance", category: "Weddings" },
  ],
};

const ROW_ID = "production_config";

type Ctx = {
  data: SiteData;
  loading: boolean;
  setSettings: (s: Partial<SiteSettings>) => Promise<void>;
  setHero: (page: keyof PageHeroes, image: string) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => Promise<void>;
  updatePortfolioItem: (id: string, item: Partial<PortfolioItem>) => Promise<void>;
  updatePortfolioList: (items: PortfolioItem[]) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  uploadFileToStorage: (file: File, folder: string) => Promise<string>;
  resetAll: () => Promise<void>;
};

const SiteContext = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live production data from Supabase upon site mount
  useEffect(() => {
    async function loadSiteData() {
      try {
        const { data: row, error } = await supabase
          .from("site_data")
          .select("data")
          .eq("id", ROW_ID)
          .single();

        if (row && row.data) {
          const parsed = row.data as Partial<SiteData>;
          setData({
            settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
            heroes: { ...DEFAULTS.heroes, ...(parsed.heroes || {}) },
            portfolio: parsed.portfolio?.length ? parsed.portfolio : DEFAULTS.portfolio,
          });
        } else if (error && error.code === "PGRST116") {
          // Row does not exist yet, let's provision default values inside your table
          await supabase.from("site_data").insert([{ id: ROW_ID, data: DEFAULTS }]);
        }
      } catch (err) {
        console.error("Failed to sync layout parameters with Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSiteData();
  }, []);

  // Helper utility to write database entries securely up to Supabase
  const persistChanges = async (updatedData: SiteData) => {
    setData(updatedData);
    try {
      await supabase.from("site_data").upsert({ id: ROW_ID, data: updatedData });
    } catch (err) {
      console.error("Failed to commit updates online:", err);
    }
  };

  // 2. Asset Upload Helper: Sends images straight into a Supabase Storage bucket named "portfolio"
  const uploadFileToStorage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (uploadError) throw uploadError;

    // Retrieve and return the public content URL
    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const setSettings = useCallback(async (s: Partial<SiteSettings>) => {
    const updated = { ...data, settings: { ...data.settings, ...s } };
    await persistChanges(updated);
  }, [data]);

  const setHero = useCallback(async (page: keyof PageHeroes, image: string) => {
    const updated = { ...data, heroes: { ...data.heroes, [page]: image } };
    await persistChanges(updated);
  }, [data]);

  const addPortfolioItem = useCallback(async (item: Omit<PortfolioItem, "id">) => {
    const updated = {
      ...data,
      portfolio: [...data.portfolio, { ...item, id: crypto.randomUUID() }],
    };
    await persistChanges(updated);
  }, [data]);

  const updatePortfolioItem = useCallback(async (id: string, item: Partial<PortfolioItem>) => {
    const updated = {
      ...data,
      portfolio: data.portfolio.map((p) => (p.id === id ? { ...p, ...item } : p)),
    };
    await persistChanges(updated);
  }, [data]);

  // Atomically replace the full portfolio array and persist. Uses functional update
  // to avoid stale-closure overwrites when multiple updates happen in sequence.
  const updatePortfolioList = useCallback(async (items: PortfolioItem[]) => {
    // Use functional set to ensure we base off latest state, then persist the new
    // value to Supabase.
    setData((prev) => {
      const updated = { ...prev, portfolio: items };
      // Persist asynchronously (we don't await inside the state setter)
      (async () => {
        try {
          await supabase.from("site_data").upsert({ id: ROW_ID, data: updated });
        } catch (err) {
          console.error("Failed to commit portfolio list update:", err);
        }
      })();
      return updated;
    });
  }, []);

  const deletePortfolioItem = useCallback(async (id: string) => {
    const updated = {
      ...data,
      portfolio: data.portfolio.filter((p) => p.id !== id),
    };
    await persistChanges(updated);
  }, [data]);

  const resetAll = useCallback(async () => {
    await persistChanges(DEFAULTS);
  }, []);

  return (
    <SiteContext.Provider
      value={{
        data,
        loading,
        setSettings,
        setHero,
        addPortfolioItem,
        updatePortfolioItem,
        updatePortfolioList,
        deletePortfolioItem,
        uploadFileToStorage,
        resetAll,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}