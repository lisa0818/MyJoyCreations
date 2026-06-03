"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { StaticImageData } from "next/image";
import { supabase } from "@/lib/supabase";

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
  location?: string;
  instagram_url?: string;
  homeFeaturedImage?: string;
  aboutFeaturedImage?: string;
  homeAtmosphere1?: string;
  homeAtmosphere2?: string;
  homeAtmosphere3?: string;
  homeAtmosphereTitle1?: string;
  homeAtmosphereTitle2?: string;
  homeAtmosphereTitle3?: string;
  homeAtmosphereDesc1?: string;
  homeAtmosphereDesc2?: string;
  homeAtmosphereDesc3?: string;
  homeMoment1?: string;
  homeMoment2?: string;
  homeMoment3?: string;
  homeMoment4?: string;
  homeMomentTitle1?: string;
  homeMomentTitle2?: string;
  homeMomentTitle3?: string;
  homeMomentTitle4?: string;
  homeMomentCategory1?: string;
  homeMomentCategory2?: string;
  homeMomentCategory3?: string;
  homeMomentCategory4?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactAddress?: string;
  contactInstagram?: string;
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
  sort_order?: number;
  order?: number;
};

export type SiteData = {
  settings: SiteSettings;
  heroes: PageHeroes;
  portfolio: PortfolioItem[];
};

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
    homeFeaturedImage: getSrc(heroMain),
    aboutFeaturedImage: getSrc(aboutTeam),
    homeAtmosphere1: getSrc(gallery1),
    homeAtmosphere2: getSrc(gallery2),
    homeAtmosphere3: getSrc(gallery3),
    homeAtmosphereTitle1: "Wedding Floral Design",
    homeAtmosphereDesc1: "Bespoke floral installations that turn every aisle into a garden of dreams.",
    homeAtmosphereTitle2: "Atmospheric Lighting",
    homeAtmosphereDesc2: "Elegant lighting schemes that sculpt your event space in warmth and wonder.",
    homeAtmosphereTitle3: "Outdoor Event Styling",
    homeAtmosphereDesc3: "Enchanting outdoor designs with luxury details and seamless seasonal flow.",
    homeMoment1: getSrc(gallery4),
    homeMoment2: getSrc(gallery5),
    homeMoment3: getSrc(gallery6),
    homeMoment4: getSrc(gallery1),
    contactPhone: "+1 (234) 567-890",
    contactWhatsapp: "1234567890",
    contactAddress: "123 Celebration Lane, London, UK",
    contactInstagram: "https://instagram.com/myjoycreations",
  },
  heroes: {
    home: getSrc(heroMain),
    about: getSrc(aboutTeam),
    services: getSrc(heroMain),
    portfolio: getSrc(heroMain),
    contact: getSrc(heroMain),
  },
  portfolio: [
    { id: "1", image: getSrc(gallery1), title: "The Grand Ballroom", category: "Weddings", sort_order: 0, order: 0 },
    { id: "2", image: getSrc(gallery2), title: "Champagne Tower Gala", category: "Birthdays", sort_order: 1000, order: 1000 },
    { id: "3", image: getSrc(gallery3), title: "Garden of Light", category: "Outdoor", sort_order: 2000, order: 2000 },
    { id: "4", image: getSrc(gallery4), title: "Misty Elegance", category: "Themed", sort_order: 3000, order: 3000 },
    { id: "5", image: getSrc(gallery5), title: "Golden Celebration", category: "Birthdays", sort_order: 4000, order: 4000 },
    { id: "6", image: getSrc(gallery6), title: "Floral Entrance", category: "Weddings", sort_order: 5000, order: 5000 },
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
          await supabase.from("site_data").insert([{ id: ROW_ID, data: DEFAULTS }]);
        }
      } catch (err) {
        console.error("Failed to sync layout parameters:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSiteData();
  }, []);

  const persistChanges = async (updatedData: SiteData) => {
    setData(updatedData);
    await supabase.from("site_data").upsert({ id: ROW_ID, data: updatedData });
  };

  const uploadFileToStorage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });
    if (uploadError) throw uploadError;
    return supabase.storage.from("portfolio").getPublicUrl(fileName).data.publicUrl;
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
    const updated = { ...data, portfolio: [...data.portfolio, { ...item, id: crypto.randomUUID() }] };
    await persistChanges(updated);
  }, [data]);

  const updatePortfolioItem = useCallback(async (id: string, item: Partial<PortfolioItem>) => {
    const updated = { ...data, portfolio: data.portfolio.map((p) => (p.id === id ? { ...p, ...item } : p)) };
    await persistChanges(updated);
  }, [data]);

  const updatePortfolioList = useCallback(async (items: PortfolioItem[]) => {
    const updated = { ...data, portfolio: items };
    setData(updated);
    await supabase.from("site_data").upsert({ id: ROW_ID, data: updated });
  }, [data]);

  // Realtime Subscription
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const initSubscription = () => {
      // Remove any existing channel with this name to avoid conflicts
      supabase.removeChannel(supabase.channel("site_data_changes"));

      // Create the channel
      channel = supabase.channel("site_data_changes");

      // Register the listener synchronously
      channel
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "site_data", filter: `id=eq.${ROW_ID}` },
          (payload) => {
            const newRow = (payload as any)?.new;
            if (newRow?.data) {
              const parsed = newRow.data as Partial<SiteData>;
              setData((prev) => ({
                settings: { ...DEFAULTS.settings, ...prev.settings, ...(parsed.settings || {}) },
                heroes: { ...DEFAULTS.heroes, ...prev.heroes, ...(parsed.heroes || {}) },
                portfolio: parsed.portfolio?.length ? parsed.portfolio : prev.portfolio,
              }));
            }
          }
        )
        // Subscribe only after the listener is attached
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.warn(`Realtime status: ${status}`);
          }
        });
    };

    initSubscription();

    // Cleanup: Remove the channel when the component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const deletePortfolioItem = useCallback(async (id: string) => {
    const updated = { ...data, portfolio: data.portfolio.filter((p) => p.id !== id) };
    await persistChanges(updated);
  }, [data]);

  const resetAll = useCallback(async () => {
    await persistChanges(DEFAULTS);
  }, []);

  return (
    <SiteContext.Provider value={{ data, loading, setSettings, setHero, addPortfolioItem, updatePortfolioItem, updatePortfolioList, deletePortfolioItem, uploadFileToStorage, resetAll }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}