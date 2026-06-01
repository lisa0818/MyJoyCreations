"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; 
import { SiteProvider } from "@/lib/site-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function checkUserSession() {
      try {
        // Using getUser() safely re-verifies the user's token with the Supabase API
        const { data: { user }, error } = await supabase.auth.getUser();

        if (mounted) {
          if (error || !user) {
            router.push("/admin/login");
          } else {
            setIsAuthenticated(true);
            setChecking(false);
          }
        }
      } catch (e) {
        console.error("Layout auth check failed:", e);
        if (mounted) router.push("/admin/login");
      }
    }

    checkUserSession();

    // Set up an auth state listener to automatically handle sign-outs or expired tokens instantly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          if (mounted) {
            setIsAuthenticated(false);
            router.push("/admin/login");
          }
        }
      }
    );

    return () => { 
      mounted = false; 
      subscription.unsubscribe();
    };
  }, [router]);

  // Keep your custom dark-theme dashboard initial loader state
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="animate-pulse tracking-wide text-sm">Checking authentication...</div>
      </div>
    );
  }

  // Wrap children in SiteProvider only if authentication completes successfully
  return isAuthenticated ? (
    <SiteProvider>
      {children}
    </SiteProvider>
  ) : null;
}