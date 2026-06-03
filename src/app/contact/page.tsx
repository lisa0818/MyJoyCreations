"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageCircle, Loader2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
// Client component wrappers for interactive handling and animations
import { ContactForm } from "@/components/ContactForm";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { useSite } from "@/lib/site-store";

export default function ContactPage() {
  const { data, loading } = useSite();
  const site = (data as any) || { settings: {}, heroes: {} };
  const settings = site.settings || {};
  const heroMainUrl = site.heroes?.contact || settings.homeFeaturedImage || "";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-[var(--color-ivory)] min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image 
              src={heroMainUrl} 
              alt="Hero background layout" 
              fill
              priority
              className="object-cover" 
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-[var(--color-ink)]/50" />
        </div>
        <div className="relative z-10 text-center px-6">
          <HeroFadeIn delay={0.2} className="text-white/70 text-xs uppercase tracking-[0.4em] mb-4">
            {settings?.content?.contact?.kicker || settings?.contactKicker || "Get in Touch"}
          </HeroFadeIn>
          <HeroTitle delay={0.4} className="font-display text-5xl md:text-7xl text-white text-shadow-hero">
            {(settings?.content?.contact?.hero_title || settings?.contactHeroTitle || "Let's \nConnect").split("\n").map((line: string, i: number) => i === 1 ? <span key={i} className="italic">{line}</span> : <span key={i}>{line}</span>)}
          </HeroTitle>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Form Wrap Container */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-8 md:p-12 cinematic-shadow">
                <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                  Inquiry Form
                </span>
                <h2 className="font-display text-3xl mb-2">Tell Us About Your Event</h2>
                <p className="text-[var(--color-muted-foreground)] text-sm mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                {/* Mounted client state form container */}
                <ContactForm />
              </div>
            </ScrollReveal>

            {/* Contact Info Sidebar Panel */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-8">
                <div>
                  <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                    Contact Information
                  </span>
                  <h2 className="font-display text-3xl mb-6">Reach Out</h2>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-8">
                    We would love to hear about your upcoming celebration. Whether you have a clear vision or just a spark of an idea, our team is here to help bring it to life.
                  </p>
                </div>

                <StaggerContainer className="space-y-6" staggerDelay={0.1}>
                  {[
                    { icon: Phone, label: "Phone", value: settings.contactPhone || settings.phone || "+1 (234) 567-890", href: settings.contactPhone ? `tel:${settings.contactPhone}` : settings.phone ? `tel:${settings.phone}` : null },
                    { icon: Mail, label: "Email", value: settings.email || "hello@myjoycreations.com", href: settings.email ? `mailto:${settings.email}` : null },
                    { icon: MapPin, label: "Address", value: settings.contactAddress || settings.address || "123 Celebration Lane, London, UK", href: null },
                    { icon: Clock, label: "Hours", value: settings.hours || "Mon - Sat: 9AM - 7PM", href: null },
                  ].map((item) => (
                    <StaggerItem key={item.label}>
                      <div className="flex items-start gap-4 p-6 bg-white rounded-xl cinematic-shadow">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-[var(--color-brand)]" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mb-1">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-sm font-medium hover:text-[var(--color-brand)] transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-0.5">Prefer WhatsApp?</p>
                    <p className="text-sm font-semibold">Chat with us directly</p>
                  </div>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map Segment Container */}
      <section className="h-96 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-[var(--color-muted-foreground)] mx-auto mb-3" />
            <p className="text-sm text-[var(--color-muted-foreground)]">123 Celebration Lane, London, UK</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Google Maps integration ready</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}