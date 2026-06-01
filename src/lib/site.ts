import { supabase } from "./supabase";

export async function getSettings() {
  try {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) return {};
    // Ensure content JSON is parsed
    const parsed = { ...data } as any;
    try {
      if (parsed.content && typeof parsed.content === "string") parsed.content = JSON.parse(parsed.content);
    } catch (e) {
      // leave as-is if not valid JSON
    }
    return parsed || {};
  } catch (e) {
    return {};
  }
}

export async function getHomepageAssets() {
  const { data } = await supabase.from("homepage_assets").select("*");
  return (data || []) as Array<{ image_key: string; public_url: string }>;
}

export function contentValue(settings: any, key: string, fallback = "") {
  if (!settings) return fallback;
  if (settings.content && typeof settings.content === "object" && key in settings.content) return settings.content[key];
  return settings[key] ?? fallback;
}
