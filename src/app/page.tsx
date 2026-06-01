export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Flower2,
  Heart,
  Star,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { getSettings, getHomepageAssets, contentValue } from "@/lib/site";

interface Asset {
  image_key: string;
  public_url: string;
}

const servicesData = [
  {
    key: "service-floral",
    title: "Floral Design",
    subtitle: "Living Artistry",
    description: "Bespoke floral installations that transform spaces into living, breathing masterpieces of natural beauty.",
    icon: Flower2,
  },
  {
    key: "service-lighting",
    title: "Atmospheric Lighting",
    subtitle: "Light & Shadow",
    description: "Architectural lighting design that manipulates warmth and shadow to guide the emotional journey of your evening.",
    icon: Lightbulb,
  },
  {
    key: "service-outdoor",
    title: "Outdoor Setup",
    subtitle: "Garden Dreams",
    description: "Enchanting garden and terrace transformations with fairy lights, drapery, and nature-inspired elegance.",
    icon: Sparkles,
  },
];

const galleryMetadata = [
  { key: "gallery_1", title: "The Grand Ballroom", category: "Wedding" },
  { key: "gallery_2", title: "Champagne Tower", category: "Gala" },
  { key: "gallery_3", title: "Garden of Light", category: "Outdoor" },
  { key: "gallery_4", title: "Misty Elegance", category: "Themed" },
];


const packages = [
  {
    name: "Essential",
    price: "From $2,500",
    features: ["Floral centerpieces", "Ambient lighting", "Table decor", "Consultation"],
    popular: false,
  },
  {
    name: "Luxury",
    price: "From $5,500",
    features: ["Full floral design", "Architectural lighting", "Stage decoration", "Drapery & linens", "Dedicated planner"],
    popular: true,
  },
  {
    name: "Bespoke",
    price: "Custom",
    features: ["Complete design concept", "Premium installations", "Themed environments", "Lighting choreography", "Full event production"],
    popular: false,
  },
];

export default async function HomePage() {
  const settings = await getSettings();
  // Fetch assets from Supabase
  const assets = (await getHomepageAssets()) || [];

  // Helper function to extract URL based on key
  const findAsset = (key: string): string => {
    return assets.find((a: Asset) => a.image_key === key)?.public_url || "";
  };

  const heroMainUrl = findAsset("hero_main");
  const logoUrl = settings.logo_url || findAsset("logo");

  const services = servicesData.map((service) => ({
    ...service,
    image: findAsset(service.key),
  }));

  const galleryItems = galleryMetadata.map((item) => ({
    ...item,
    image: findAsset(item.key),
  }));

  // Safely grab the spotlight item or provide a structured fallback
  const featuredGalleryItem = galleryItems[0] || { image: "", title: "Featured Creation", category: "Design" };

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar logoUrl={logoUrl} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image
              src={heroMainUrl}
              alt="Luxury event decoration"
              priority
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          <HeroFadeIn delay={0.2} className="text-white/80 text-xs font-medium uppercase tracking-[0.4em] mb-8">
            {contentValue(settings, "home.kicker", "The Art of Celebration")}
          </HeroFadeIn>

          <HeroTitle delay={0.4} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] text-balance mb-8 text-shadow-hero">
            {contentValue(settings, "home.hero_title", "Where Light\nMeets Legacy")
              .split("\n")
              .map((line: string, i: number) => 
                i === 0 ? (
                  <span key={i}>{line}<br /></span>
                ) : (
                  <span key={i} className="italic text-balance mb-8 text-shadow-hero">
                    {line}
                  </span>
                )
              )}
          </HeroTitle>

          <HeroFadeIn delay={0.6}>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-12">
              {contentValue(settings, "home.lead", "Architectural event lighting and bespoke floral curation for the world's most intimate celebrations.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-brand)]/25"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-white hover:text-[var(--color-ink)] transition-all duration-300"
              >
                Book a Consultation
              </Link>
            </div>
          </HeroFadeIn>
        </div>

        {/* Animated Line Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-pulse" />
        </div>
      </section>


      {/* Services Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                  Curated Services
                </span>
                <h2 className="font-display text-4xl md:text-5xl text-balance">Signature Atmospheres</h2>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold uppercase tracking-[0.2em] border-b-2 border-[var(--color-brand)] pb-1 hover:text-[var(--color-brand)] transition-colors"
              >
                Explore All Services
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <StaggerItem key={service.title}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl cinematic-shadow mb-6 aspect-[4/5]">
                      {service.image && (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                          0{i + 1}
                        </span>
                      </div>
                      <IconComponent className="absolute bottom-4 right-4 w-6 h-6 text-white/80" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted-foreground)] mb-1">
                      {service.subtitle}
                    </p>
                    <h3 className="font-display text-2xl mb-3 group-hover:text-[var(--color-brand)] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="bg-[var(--color-surface)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                Portfolio
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Moments We've Crafted</h2>
              <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
                A curated selection of our most transformative event designs, from intimate gatherings to grand galas.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-12 gap-4" staggerDelay={0.1}>
            {/* Main Featured Item */}
            <StaggerItem className="col-span-12 md:col-span-7">
              <Link href="/portfolio" className="block relative group overflow-hidden rounded-2xl cinematic-shadow aspect-video">
                {featuredGalleryItem.image && (
                  <Image
                    src={featuredGalleryItem.image}
                    alt={featuredGalleryItem.title || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] text-white/70 uppercase tracking-[0.2em]">{featuredGalleryItem.category}</span>
                  <h3 className="font-display text-xl text-white">{featuredGalleryItem.title}</h3>
                </div>
              </Link>
            </StaggerItem>

            {/* Explanatory Callout Box */}
            <StaggerItem className="col-span-12 md:col-span-5 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  Each event is a blank canvas where we paint with light, texture, and emotion. Explore our complete portfolio to witness the breadth of our creative vision.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Weddings", "Birthdays", "Galas", "Outdoor", "Themed"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full border border-[var(--color-border)] text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-all cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] hover:gap-3 transition-all"
                >
                  View Full Gallery <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>

            {/* Remaining Gallery Row Grid Items */}
            {galleryItems.slice(1).map((item) => (
              <StaggerItem key={item.title} className="col-span-6 md:col-span-4">
                <Link href="/portfolio" className="block relative group overflow-hidden rounded-2xl cinematic-shadow aspect-[3/4]">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || ""}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
                    <span className="text-[10px] text-white/70 uppercase tracking-[0.2em]">{item.category}</span>
                    <h3 className="font-display text-lg text-white">{item.title}</h3>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* Featured Packages */}
      <section className="bg-[var(--color-surface)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                Packages
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4">Celebration Packages</h2>
              <p className="text-[var(--color-muted-foreground)] max-w-xl mx-auto">
                Thoughtfully designed packages to elevate your special moments.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {packages.map((pkg) => (
              <StaggerItem key={pkg.name}>
                <div
                  className={`bg-white rounded-2xl p-8 h-full flex flex-col ${
                    pkg.popular
                      ? "ring-2 ring-[var(--color-brand)] shadow-xl shadow-[var(--color-brand)]/10"
                      : "cinematic-shadow hover-lift"
                  }`}
                >
                  {pkg.popular && (
                    <span className="inline-block self-start px-3 py-1 bg-[var(--color-brand)] text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full mb-4">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl mb-2">{pkg.name}</h3>
                  <p className="text-[var(--color-brand)] font-display text-3xl mb-6">{pkg.price}</p>
                  <ul className="space-y-3 flex-1 mb-8">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                        <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full text-center py-3 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
                      pkg.popular
                        ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-warm)]"
                        : "bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white"
                    }`}
                  >
                    Inquire Now
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image
              src={heroMainUrl}
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          )}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.4em] mb-6">
              Available for Bookings
            </p>
            <h2 className="font-display text-5xl md:text-6xl mb-8">
              Let's create something <span className="italic">timeless</span>
            </h2>
            <p className="text-[var(--color-muted-foreground)] max-w-lg mx-auto mb-10">
              Ready to transform your event into an unforgettable experience? Our team is here to bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-brand)]/25"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Bar */}
      <section className="bg-[var(--color-ink)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.1}>
            {[
              { icon: Phone, label: "Call Us", value: "+1 (234) 567-890" },
              { icon: Mail, label: "Email Us", value: "hello@myjoycreations.com" },
              { icon: MapPin, label: "Visit Us", value: "London, United Kingdom" },
            ].map((item) => {
              const ContactIcon = item.icon;
              return (
                <StaggerItem key={item.label}>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <ContactIcon className="w-5 h-5 text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <Footer logoUrl={logoUrl} email={settings.email} phone={settings.phone} address={settings.address || settings.location} instagram={settings.instagram_url} whatsapp={settings.whatsapp} />
      <WhatsAppButton />
    </div>
  );
}