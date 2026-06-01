"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Mail,
  Phone,
  Camera,
  MessageCircle,
  Upload,
  Check,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import fallbackLogo from "../../../assets/logo.png";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile Form States
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [pinterestUrl, setPinterestUrl] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setBusinessName(data.business_name || "");
      setTagline(data.tagline || "");
      setMetaDescription(data.meta_description || "");
      setLogoUrl(data.logo_url || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setWhatsApp(data.whatsapp || "");
      setWebsiteUrl(data.website_url || "");
      setInstagramUrl(data.instagram_url || "");
      setPinterestUrl(data.pinterest_url || "");
    }
    setLoading(false);
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `branding/logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .upsert({
        id: 1,
        business_name: businessName,
        tagline,
        meta_description: metaDescription,
        logo_url: logoUrl,
        email,
        phone,
        whatsapp,
        website_url: websiteUrl,
        instagram_url: instagramUrl,
        pinterest_url: pinterestUrl
      });

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl mb-1">Settings</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Manage your website and business settings</p>
      </div>

      <div className="bg-white rounded-2xl p-8 cinematic-shadow mb-6">
        <h2 className="font-display text-xl mb-6">Website Information</h2>
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Meta Description</label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 cinematic-shadow mb-6">
        <h2 className="font-display text-xl mb-6">Logo & Branding</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center overflow-hidden">
            <img src={logoUrl || fallbackLogo.src} alt="Current logo" className="w-full h-full object-contain p-2" />
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand)] hover:text-white transition-all mb-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Upload New Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-xs text-[var(--color-muted-foreground)]">Recommended: PNG, 500x500px, transparent background</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 cinematic-shadow mb-6">
        <h2 className="font-display text-xl mb-6">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <Mail className="w-3 h-3 inline mr-1" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <Phone className="w-3 h-3 inline mr-1" /> Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <MessageCircle className="w-3 h-3 inline mr-1" /> WhatsApp Number
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsApp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <Globe className="w-3 h-3 inline mr-1" /> Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 cinematic-shadow mb-6">
        <h2 className="font-display text-xl mb-6">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <Camera className="w-3 h-3 inline mr-1" /> Instagram
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">
              <MessageCircle className="w-3 h-3 inline mr-1" /> Pinterest
            </label>
            <input
              type="url"
              value={pinterestUrl}
              onChange={(e) => setPinterestUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] rounded-full transition-all ${
            saved
              ? "bg-emerald-500 text-white"
              : "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-warm)]"
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}