"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  Check,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useSite, type PageHeroes } from "@/lib/site-store";

const PAGE_LABELS: Record<keyof PageHeroes, string> = {
  home: "Home",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  contact: "Contact",
};

export default function AdminContentManager() {
  const {
    data,
    loading,
    setSettings,
    setHero,
    uploadFileToStorage,
  } = useSite();

  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadingState, setUploadingState] = useState<string | null>(null);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingState("logo");
      const url = await uploadFileToStorage(file, "logos");
      await setSettings({ logo: url });
      flashSaved();
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Failed to upload logo.");
    } finally {
      setUploadingState(null);
    }
  };

  const handleHeroUpload = async (page: keyof PageHeroes, file: File) => {
    try {
      setUploadingState(`hero-${page}`);
      const url = await uploadFileToStorage(file, `heroes/${page}`);
      await setHero(page, url);
      flashSaved();
    } catch (err) {
      console.error("Hero upload failed:", err);
      alert(`Failed to upload ${PAGE_LABELS[page]} hero.`);
    } finally {
      setUploadingState(null);
    }
  };

  const handleFeaturedImageUpload = async (key: string, file: File) => {
    try {
      setUploadingState(key);
      const url = await uploadFileToStorage(file, "featured");
      await setSettings({ [key]: url });
      flashSaved();
    } catch (err) {
      console.error("Featured image upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingState(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[var(--color-surface)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={data.settings.logo} alt="Logo" className="h-8 w-auto object-contain" />
            <div>
              <p className="font-display text-base font-semibold leading-tight">{data.settings.businessName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Content Management</p>
            </div>
          </div>
          {savedFlash && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold animate-pulse">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] cinematic-shadow">
          <div>
            <h1 className="font-display text-4xl mb-1">Site Manager</h1>
          </div>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold uppercase tracking-[0.15em] rounded-full transition-all shadow-md"
          >
            <ImageIcon className="w-4 h-4" /> Edit Portfolio
          </Link>
        </div>

        <Section title="Business Information">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 cinematic-shadow">
              <Label>Logo</Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center overflow-hidden border border-[var(--color-border)] relative">
                  {uploadingState === "logo" ? <Loader2 className="animate-spin" /> : <img src={data.settings.logo} alt="Logo" className="w-full h-full object-contain" />}
                </div>
                <label className="cursor-pointer bg-slate-100 px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-slate-200">
                  {uploadingState === "logo" ? "Uploading..." : "Upload"}
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
                </label>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 cinematic-shadow lg:col-span-2 space-y-4">
              <Field label="Business Name" value={data.settings.businessName || ""} onChange={(v) => setSettings({ businessName: v })} />
              <Field label="Tagline" value={data.settings.tagline || ""} onChange={(v) => setSettings({ tagline: v })} />
            </div>
          </div>
        </Section>

        <Section title="Page Hero Images">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(PAGE_LABELS) as Array<keyof PageHeroes>).map((page) => (
              <div key={page} className="bg-white rounded-2xl p-4 cinematic-shadow">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs uppercase font-semibold">{PAGE_LABELS[page]}</p>
                  <label className="cursor-pointer text-xs font-bold uppercase">
                    {uploadingState === `hero-${page}` ? "..." : "Change"}
                    <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleHeroUpload(page, e.target.files[0])} />
                  </label>
                </div>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                  <img src={data.heroes[page] || ""} alt={PAGE_LABELS[page]} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Featured Page Images">
          <div className="grid md:grid-cols-2 gap-6">
            <FeaturedImageCard 
              label="Home: Featured Image" 
              src={data.settings.homeFeaturedImage || ""} 
              onUpload={(f: File) => handleFeaturedImageUpload("homeFeaturedImage", f)}
              isUploading={uploadingState === "homeFeaturedImage"}
            />
            <FeaturedImageCard 
              label="About: Featured Image" 
              src={data.settings.aboutFeaturedImage || ""} 
              onUpload={(f: File) => handleFeaturedImageUpload("aboutFeaturedImage", f)}
              isUploading={uploadingState === "aboutFeaturedImage"}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  label: string;
  src: string;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

function FeaturedImageCard({ label, src, onUpload, isUploading }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 cinematic-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase font-semibold">{label}</p>
        <label className="cursor-pointer px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold uppercase hover:bg-slate-200">
          {isUploading ? "Uploading..." : "Change"}
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
        </label>
      </div>
      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative">
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="border-t pt-8">
      <h2 className="font-display text-2xl mb-5">{title}</h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500">{children}</label>;
}

function Field({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
      />
    </div>
  );
}