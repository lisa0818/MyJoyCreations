"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Image as ImageIcon } from "lucide-react";
import { useSite, type PageHeroes } from "@/lib/site-store";

const PAGE_LABELS: Record<keyof PageHeroes, string> = {
  home: "Home",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  contact: "Contact",
};

export default function AdminContentManager() {
  const { data, loading, setSettings, setHero, uploadFileToStorage } = useSite();
  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadingState, setUploadingState] = useState<string | null>(null);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const getSafeSrc = (src: any) => (typeof src === "string" && src.trim() !== "" ? src : "");

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
      await setSettings({ [key]: url } as any);
      flashSaved();
    } catch (err) {
      console.error("Featured image upload failed:", err);
      alert("Failed to upload featured image.");
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
            <div className="h-8 w-8 overflow-hidden rounded-md border border-[var(--color-border)]">
              {getSafeSrc(data.settings.logo) ? (
                <img src={data.settings.logo} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <div className="h-full w-full bg-gray-100" />
              )}
            </div>
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
                  {uploadingState === "logo" ? (
                    <Loader2 className="animate-spin" />
                  ) : getSafeSrc(data.settings.logo) ? (
                    <img src={data.settings.logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-gray-400">Empty</span>
                  )}
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

        <Section title="Contact Information">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 cinematic-shadow space-y-4">
              <Field label="Phone Number" value={data.settings.contactPhone || ""} onChange={(v) => setSettings({ contactPhone: v })} />
              <Field label="WhatsApp Number" value={data.settings.contactWhatsapp || ""} onChange={(v) => setSettings({ contactWhatsapp: v })} />
            </div>
            <div className="bg-white rounded-2xl p-6 cinematic-shadow space-y-4">
              <Field label="Address" value={data.settings.contactAddress || ""} onChange={(v) => setSettings({ contactAddress: v })} />
              <Field label="Instagram Link" value={data.settings.contactInstagram || ""} onChange={(v) => setSettings({ contactInstagram: v })} />
            </div>
          </div>
        </Section>

        <Section title="Page Hero Images">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(PAGE_LABELS) as Array<keyof PageHeroes>).map((page) => (
              <FeaturedImageCard 
                key={page}
                label={`${PAGE_LABELS[page]} Hero`}
                src={getSafeSrc(data.heroes[page])}
                onUpload={(f: File) => handleHeroUpload(page, f)}
                isUploading={uploadingState === `hero-${page}`}
              />
            ))}
          </div>
        </Section>

        <Section title="Signature Atmosphere">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 cinematic-shadow space-y-4">
                <FeaturedImageCard 
                  label={`Atmosphere ${i}`} 
                  src={getSafeSrc(data.settings[`homeAtmosphere${i}` as keyof typeof data.settings] as string)} 
                  onUpload={(f) => handleFeaturedImageUpload(`homeAtmosphere${i}`, f)} 
                  isUploading={uploadingState === `homeAtmosphere${i}`} 
                />
                <Field 
                  label="Title" 
                  value={(data.settings[`homeAtmosphereTitle${i}` as keyof typeof data.settings] as string) || ""} 
                  onChange={(v) => setSettings({ [`homeAtmosphereTitle${i}`]: v })} 
                />
                <Field 
                  label="Description" 
                  value={(data.settings[`homeAtmosphereDesc${i}` as keyof typeof data.settings] as string) || ""} 
                  onChange={(v) => setSettings({ [`homeAtmosphereDesc${i}`]: v })} 
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Moments We Have Crafted">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <FeaturedImageCard 
                key={i} 
                label={`Moment ${i}`} 
                src={getSafeSrc(data.settings[`homeMoment${i}` as keyof typeof data.settings] as string)} 
                onUpload={(f) => handleFeaturedImageUpload(`homeMoment${i}`, f)} 
                isUploading={uploadingState === `homeMoment${i}`} 
              />
            ))}
          </div>
        </Section>

        <Section title="About Section">
          <div className="max-w-md bg-white rounded-2xl p-6 cinematic-shadow">
            <FeaturedImageCard 
              label="Featured Image" 
              src={getSafeSrc(data.settings.aboutFeaturedImage)} 
              onUpload={(f) => handleFeaturedImageUpload("aboutFeaturedImage", f)} 
              isUploading={uploadingState === "aboutFeaturedImage"} 
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function FeaturedImageCard({ label, src, onUpload, isUploading }: { label: string, src: string, onUpload: (f: File) => void, isUploading: boolean }) {
  return (
    <div>
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
        ) : src ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-[var(--color-foreground)] uppercase tracking-[0.1em]">{children}</p>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] text-sm"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}