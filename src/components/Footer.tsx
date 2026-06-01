"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin, Mail, Phone, Camera } from "lucide-react";

interface FooterProps {
  logoUrl?: string;
}

export function Footer({ logoUrl }: FooterProps) {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {logoUrl ? (
                <div className="relative h-12 w-12 shrink-0">
                  <Image 
                    src={logoUrl} 
                    alt="MyJoy Creations" 
                    fill
                    sizes="48px"
                    className="object-contain" 
                  />
                </div>
              ) : (
                /* Fallback styling placeholder while image URL isn't loaded */
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand)]/10 animate-pulse" />
              )}
              <span className="font-display text-xl font-semibold text-[var(--color-ink)]">MyJoy Creations</span>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed max-w-xs">
              Designing moments that linger long after the lights fade. Luxury event decoration and lighting for life's most precious celebrations.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-[var(--color-ink)]">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Contact", href: "/contact" },
              ].map((link) => ( 
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-[var(--color-ink)]">
              Services
            </h4>
            <nav className="flex flex-col gap-3">
              {["Wedding Decor", "Floral Design", "Stage & Lighting", "Outdoor Setup", "Theme Decorations", "Birthday Events"].map(
                (item) => (
                  <span key={item} className="text-sm text-[var(--color-muted-foreground)]">
                    {item}
                  </span>
                )
              )}
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-[var(--color-ink)]">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:hello@myjoycreations.com"
                className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@myjoycreations.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                <MapPin className="w-4 h-4" />
                Verna, Goa
              </div>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-all"
                >
                  <Camera className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-[0.15em]">
            &copy; {new Date().getFullYear()} MyJoy Creations. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-[var(--color-muted-foreground)] uppercase tracking-[0.15em]">
            <span className="hover:text-[var(--color-brand)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[var(--color-brand)] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}