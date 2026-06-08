"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useSite } from "@/lib/site-store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  logoUrl?: string;
  businessName?: string;
}

export function Navbar({ logoUrl, businessName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data } = useSite();
  const { scrollY } = useScroll();

  // Settings from global store
  const settings = data?.settings || {};
  
  // Use passed prop if available, otherwise fallback to settings store
  const activeLogo = logoUrl || settings.logo;
  const activeBusinessName = businessName || settings.businessName || "MyJoy";

  const blur = useTransform(scrollY, [0, 160], [0, 14]);
  const bgOpacity = useTransform(scrollY, [0, 160], [0, 0.85]);
  const backdropFilter = useMotionTemplate`blur(${blur}px)`;
  const background = useMotionTemplate`rgba(250, 249, 246, ${bgOpacity})`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      style={{ background, backdropFilter, WebkitBackdropFilter: backdropFilter }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[border-color] duration-300 ${
        scrolled ? "border-b border-[var(--color-border)]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            {activeLogo && (
              <img
                src={activeLogo}
                alt={activeBusinessName}
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <span className={`font-display text-xl font-semibold tracking-tight hidden sm:block transition-colors ${scrolled ? "text-[var(--color-ink)]" : "text-white"}`}>
              {activeBusinessName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`story-link text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[var(--color-brand)] ${
                  scrolled ? "text-[var(--color-warm-gray)]" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex group relative items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white rounded-full overflow-hidden border border-[var(--color-brand)] bg-[var(--color-brand)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-brand)]/30"
            >
              <span className="absolute inset-0 bg-[var(--color-brand-warm)] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
              <span className="relative">Book Now</span>
              <ArrowRight className="relative w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "hover:bg-[var(--color-secondary)] text-[var(--color-ink)]" : "text-white hover:bg-white/10"}`}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-card border-t border-[var(--color-border)] animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-ink)] hover:text-[var(--color-brand)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] bg-[var(--color-brand)] text-white rounded-full"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}