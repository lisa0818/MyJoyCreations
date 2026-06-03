"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flower2, Lightbulb, Sparkles, PartyPopper, Heart, Star, Crown, MessageCircle, Loader2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { useSite } from "@/lib/site-store";

// FIXED: Changed hyphens to underscores to match the database values exactly
const baseServices = [
  {
    title: "Wedding Decoration",
    category: "wedding",
    assetKey: "service-floral", // Changed from service-floral
    icon: Heart,
    shortDesc: "Complete wedding styling from ceremony to reception",
    features: ["Ceremony arch design", "Reception table styling", "Aisle decor", "Bridal bouquet", "Venue transformation"],
    priceRange: "From $3,500",
  },
  {
    title: "Architectural Lighting",
    category: "lighting",
    assetKey: "service-lighting", // Changed from service-lighting
    icon: Lightbulb,
    shortDesc: "Dynamic lighting design that transforms any space",
    features: ["LED installations", "Projection mapping", "Fairy light canopies", "Uplighting", "Chandelier arrangements"],
    priceRange: "From $2,000",
  },
  {
    title: "Floral Artistry",
    category: "floral",
    assetKey: "service-outdoor", // Changed from service-outdoor
    icon: Flower2,
    shortDesc: "Bespoke botanical installations and arrangements",
    features: ["Living walls", "Table centerpieces", "Floral chandeliers", "Entrance garlands", "Seasonal curation"],
    priceRange: "From $1,800",
  },
  {
    title: "Themed Events",
    category: "theme",
    assetKey: "service-lounge", // Changed from service-lounge
    icon: Crown,
    shortDesc: "Immersive themed environments for any occasion",
    features: ["Concept development", "Prop design", "Color theming", "Texture layering", "Ambient storytelling"],
    priceRange: "From $4,000",
  },
  {
    title: "Birthday Celebrations",
    category: "theme",
    assetKey: "service-floral", // Changed from service-floral
    icon: PartyPopper,
    shortDesc: "Milestone birthdays that make a statement",
    features: ["Age-themed decor", "Balloon installations", "Cake table design", "Photo backdrops", "Entertainment setup"],
    priceRange: "From $1,500",
  },
  {
    title: "Engagement Parties",
    category: "wedding",
    assetKey: "service-lighting", // Changed from service-lighting
    icon: Sparkles,
    shortDesc: "Elegant celebrations to announce your love",
    features: ["Romantic lighting", "Floral arrangements", "Photo zones", "Table styling", "Welcome signage"],
    priceRange: "From $1,200",
  },
];


export default function ServicesPage() {
  const { data, loading } = useSite();
  const site = (data as any) || { settings: {}, heroes: {}, portfolio: [] };
  const settings = site.settings || {};
  const heroMainUrl = site.heroes?.services || settings.homeFeaturedImage || "";

  // Allow overriding short descriptions from settings.content if provided
  const servicesWithOverrides = baseServices.map((s, i) => ({
    ...s,
    shortDesc: settings?.services?.[s.assetKey]?.shortDesc || s.shortDesc,
    image: settings[`homeAtmosphere${i + 1}` as keyof typeof settings] || site.portfolio?.[i]?.image || "",
  }));

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
              alt="Services background" 
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
            What We Do
          </HeroFadeIn>
          <HeroTitle delay={0.4} className="font-display text-5xl md:text-7xl text-white text-shadow-hero">
            Our <span className="italic">Services</span>
          </HeroTitle>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                What We Offer
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Signature Atmospheres</h2>
              <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
                From intimate gatherings to grand galas, we offer a complete suite of luxury decoration and lighting services.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {servicesWithOverrides.map((service) => {
              const serviceImageUrl = service.image || "";
              return (
                <StaggerItem key={service.title}>
                  <div className="group bg-white rounded-2xl overflow-hidden cinematic-shadow hover-lift h-full flex flex-col">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
                      {serviceImageUrl && (
                        <Image
                          src={serviceImageUrl}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-[var(--color-brand)]" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 z-10 bg-[var(--color-brand)] text-white text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                        {service.priceRange}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="font-display text-2xl mb-2 group-hover:text-[var(--color-brand)] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-6">{service.shortDesc}</p>
                      <ul className="space-y-2 flex-1 mb-6">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                            <Star className="w-3 h-3 text-[var(--color-gold)]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand)] hover:text-white transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Inquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[var(--color-surface)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                How We Work
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Our Process</h2>
            </div>
          </ScrollReveal>
          
          <StaggerContainer className="grid md:grid-cols-4 gap-8" staggerDelay={0.15}>
            {[
              { step: "01", title: "Consultation", desc: "We begin with understanding your vision, preferences, and event requirements." },
              { step: "02", title: "Concept Design", desc: "Our creatives develop a bespoke design concept tailored to your story." },
              { step: "03", title: "Planning", desc: "Detailed planning, vendor coordination, and logistics management." },
              { step: "04", title: "Execution", desc: "Flawless on-site setup and styling, ensuring every detail is perfect." },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center p-8">
                  <span className="font-display text-6xl text-[var(--color-brand)]/20">{item.step}</span>
                  <h3 className="font-display text-xl mt-4 mb-3">{item.title}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              Have something unique in mind?
            </h2>
            <p className="text-[var(--color-muted-foreground)] mb-10 max-w-lg mx-auto">
              We love custom projects. Tell us about your dream event and let's create something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
            >
              Start a Custom Project <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}