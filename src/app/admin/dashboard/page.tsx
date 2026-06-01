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
      alert("Failed to upload logo image to Supabase Storage.");
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
      alert(`Failed to upload ${PAGE_LABELS[page]} hero image.`);
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
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={data.settings.logo} alt="" className="h-8 w-auto object-contain" />
            <div>
              <p className="font-display text-base font-semibold leading-tight">{data.settings.businessName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mr-2 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Saved to Supabase
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] cinematic-shadow">
          <div>
            <h1 className="font-display text-4xl mb-1">Site Manager</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Manage global imagery, copies, and contact records stored on your cloud profile.
            </p>
          </div>
          {/* Redirection Button Leading directly to the Standalone Portfolio Section */}
          <Link
            href="/admin/gallery"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold uppercase tracking-[0.15em] rounded-full transition-all shadow-md shrink-0 self-start md:self-auto"
          >
            <ImageIcon className="w-4 h-4" />
            Edit Portfolio
          </Link>
        </div>

        {/* Business Info */}
        <Section title="Business Information" subtitle="Logo, name, tagline & contact details">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Logo Upload Box */}
            <div className="bg-white rounded-2xl p-6 cinematic-shadow">
              <Label>Logo</Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center overflow-hidden border border-[var(--color-border)] relative">
                  {uploadingState === "logo" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-brand)]" />
                  ) : (
                    <img src={data.settings.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                  )}
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-brand)] hover:text-white cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingState === "logo" ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingState !== null}
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Business Copy Config */}
            <div className="bg-white rounded-2xl p-6 cinematic-shadow lg:col-span-2 space-y-4">
              <Field
                label="Business Name"
                value={data.settings.businessName}
                onChange={(v) => setSettings({ businessName: v })}
              />
              <Field
                label="Tagline"
                value={data.settings.tagline}
                onChange={(v) => setSettings({ tagline: v })}
              />
            </div>

            {/* Global Identity Contacts */}
            <div className="bg-white rounded-2xl p-6 cinematic-shadow lg:col-span-3 grid md:grid-cols-2 gap-4">
              <Field
                label="Email"
                type="email"
                value={data.settings.email}
                onChange={(v) => setSettings({ email: v })}
              />
              <Field
                label="Phone Number"
                type="tel"
                value={data.settings.phone}
                onChange={(v) => setSettings({ phone: v })}
              />
              <Field
                label="WhatsApp Number"
                type="tel"
                value={data.settings.whatsapp}
                onChange={(v) => setSettings({ whatsapp: v })}
                hint="Digits only with country code (e.g. 1234567890)"
              />
              <Field
                label="Instagram URL"
                type="url"
                value={data.settings.instagram}
                onChange={(v) => setSettings({ instagram: v })}
              />
              <div className="md:col-span-2">
                <Field
                  label="Address"
                  value={data.settings.address}
                  onChange={(v) => setSettings({ address: v })}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Page Hero Images Section */}
        <Section title="Page Hero Images" subtitle="The large banner image shown at the top of each page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(PAGE_LABELS) as Array<keyof PageHeroes>).map((page) => (
              <div key={page} className="bg-white rounded-2xl p-4 cinematic-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">{PAGE_LABELS[page]}</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-brand)] hover:text-white cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    {uploadingState === `hero-${page}` ? "Processing..." : "Change"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingState !== null}
                      onChange={(e) => e.target.files?.[0] && handleHeroUpload(page, e.target.files[0])}
                    />
                  </label>
                </div>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-surface)] flex items-center justify-center relative">
                  {uploadingState === `hero-${page}` ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand)]" />
                  ) : (
                    <img src={data.heroes[page]} alt={`${PAGE_LABELS[page]} hero`} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--color-border)] pt-8 first:border-0 first:pt-0">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--color-muted-foreground)]">{children}</label>;
}

// Input field helper
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
        className="mt-2 w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm text-slate-900"
      />
      {hint && <p className="text-[10px] text-[var(--color-muted-foreground)] mt-1">{hint}</p>}
    </div>
  );
}