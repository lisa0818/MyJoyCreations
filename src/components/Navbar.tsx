"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  logoUrl?: string;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-16 w-16 shrink-0 bg-[var(--color-surface)] rounded-full overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                // Use a plain <img> tag for externally hosted storage URLs to avoid remotePatterns issues
                <img src={logoUrl} alt="MyJoy Creations" className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/20 animate-pulse" />
              )}
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-[var(--color-ink)] hidden sm:block">
              MyJoy<span className="font-light">Creations</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--color-brand)] font-semibold"
                      : "text-[var(--color-warm-gray)] hover:text-[var(--color-brand)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Book Now Button & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] bg-[var(--color-brand)] text-white rounded-full hover:bg-[var(--color-brand-warm)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-brand)]/20"
            >
              Book Now
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-secondary)] transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Open State */}
      {open && (
        <div className="md:hidden glass-card border-t border-[var(--color-border)] animate-fade-in">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-[var(--color-brand)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] bg-[var(--color-brand)] text-white rounded-full w-full justify-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}