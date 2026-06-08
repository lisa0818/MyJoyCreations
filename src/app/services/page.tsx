export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flower2, Lightbulb, Sparkles, PartyPopper, Heart, Star, Crown, MessageCircle } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { getSettings, getHomepageAssets, contentValue } from "@/lib/site";


const baseServices = [
  {
    title: "Wedding Decoration",
    category: "wedding",
    icon: Heart,
    shortDesc:
      "Elegant wedding décor and lighting designed to make your special day unforgettable.",
    features: [
      "Stage decoration",
      "Floral arrangements",
      "Reception styling",
      "Church décor",
      "Venue transformation",
    ],
  },

  {
    title: "Event Lighting",
    category: "lighting",
    icon: Lightbulb,
    shortDesc:
      "Professional lighting solutions that create the perfect atmosphere for every celebration.",
    features: [
      "Wedding lighting",
      "House illumination",
      "Church & chapel lighting",
      "Outdoor lighting setups",
      "Decorative light installations",
    ],
  },

  {
    title: "Indoor & Outdoor Celebrations",
    category: "events",
    icon: Sparkles,
    shortDesc:
      "Creative décor solutions for celebrations of every size and style.",
    features: [
      "Garden events",
      "Indoor venue décor",
      "Outdoor venue styling",
      "Customized themes",
      "Complete event setup",
    ],
  },

  {
    title: "Roce & Portonnem Ceremonies",
    category: "traditional",
    icon: Crown,
    shortDesc:
      "Beautiful décor for traditional Goan ceremonies with attention to every detail.",
    features: [
      "Traditional decorations",
      "Entrance décor",
      "Backdrop and pathway styling",
      "Lighting arrangements",
      "Customized setups",
    ],
  
  },

  {
    title: "Birthdays & Anniversaries",
    category: "celebration",
    assetKey: "service-floral",
    icon: PartyPopper,
    shortDesc:
      "Memorable birthday and anniversary celebrations tailored to your vision.",
    features: [
      "Theme decorations",
      "Balloon/Floral décor",
      "Photo backdrops",
      "Entrance, Backdrop & Pathway styling",
      "Cake table styling",
      "Full Party setups",
    ],
    priceRange: "Custom Quote",
  },

  {
    title: "Baptism, Communion & Confirmations",
    category: "religious",
    assetKey: "service-lighting",
    icon: Sparkles,
    shortDesc:
      "Elegant décor and lighting for religious celebrations and family gatherings.",
    features: [
      "Church decoration",
      "Reception décor",
      "Entrance, Backdrop & Pathway styling",
      "Lighting design",
      "Customized themes",
    ],
    priceRange: "Custom Quote",
  },
];


export default async function ServicesPage() {
  const settings = await getSettings();
  const assets = (await getHomepageAssets()) || [];
  const findAsset = (key: string) => assets?.find((a) => a.image_key === key)?.public_url || "";

  const heroMainUrl = findAsset("hero_main");
  const logoUrl = settings.logo_url || findAsset("logo");

  // Allow overriding service short descriptions from settings.content
  const servicesWithOverrides = baseServices.map((s) => ({
    ...s,
    shortDesc: contentValue(settings, `services.${s.assetKey}.shortDesc`, s.shortDesc),
  }));

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar logoUrl={logoUrl} />

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

      {/* Services Grid Section - REFACTORED WITHOUT IMAGES */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                What We Offer
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-6 text-[var(--color-ink)]">Signature Atmospheres</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {servicesWithOverrides.map((service) => (
              <StaggerItem key={service.title}>
                <div className="group h-full p-10 bg-white border border-[var(--color-border)] rounded-3xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-[var(--color-brand)]/30 flex flex-col">
                  
                  {/* Header: Icon + Price */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-[var(--color-brand)]">
                      <service.icon className="w-6 h-6 text-[var(--color-brand)] transition-colors duration-500 group-hover:text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-2xl mb-4 text-[var(--color-ink)]">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-10 flex-1">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-xs uppercase tracking-wider text-[var(--color-ink)]/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
    <a
                        href="https://wa.me/123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] text-[var(--color-ink)] text-xs font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand)] hover:text-white transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Inquire on WhatsApp
                      </a>
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
              We cater for all types of events. Tell us about your dream event and let's create something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
            >
              Get in Touch with us <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer logoUrl={logoUrl} email={settings.email} phone={settings.phone} address={settings.address || settings.location} instagram={settings.instagram_url} whatsapp={settings.whatsapp} />
      <WhatsAppButton />
    </div>
  );
}