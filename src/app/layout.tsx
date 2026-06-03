import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import { SiteProvider } from "@/lib/site-store"; // Import your SiteProvider
import { Fraunces } from 'next/font/google';
import "./globals.css";

// 1. Initialize the font with the CSS variable
const fraunces = Fraunces({ 
  subsets: ['latin'], 
  variable: '--font-fraunces' 
});

// 2. Metadata configuration
export const metadata: Metadata = {
  title: "MyJoyCreations",
  description: "Website for MyJoyCreations, an event decoration and lighting business specializing in creating unforgettable experiences for weddings, events, and private parties.",
  authors: [{ name: "Lisa Dsouza" }],
  openGraph: {
    title: "MyJoyCreations",
    description: "Website for MyJoyCreations, an event decoration and lighting business specializing in creating unforgettable experiences for weddings, events, and private parties.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@MyJoyCreations",
  },
};

// 3. Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// 4. Single RootLayout component
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body className="font-sans">
        <Providers>
          {/* Wrapping children in SiteProvider ensures the data is available throughout your site */}
          <SiteProvider>
            {children}
          </SiteProvider>
        </Providers>
      </body>
    </html>
  );
}