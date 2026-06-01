"use client";

import { ReactNode } from "react";
import { SiteProvider } from "@/lib/site-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteProvider>
      {children}
    </SiteProvider>
  );
}