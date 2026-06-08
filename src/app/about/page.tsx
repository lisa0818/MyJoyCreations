import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Users, Heart, Lightbulb, Sparkles, Star, Target } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../../components/ScrollReveal";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { WhatsAppButton } from "../../components/WhatsAppButton";
// Import our new motion wrappers
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { getSettings, getHomepageAssets, contentValue } from "@/lib/site";
import InstagramSection from "@/components/InstagramSection";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "Staying ahead with the latest trends and creative decoration techniques." },
  { icon: Heart, title: "Passion", desc: "We pour our heart into every project, treating each event as our own celebration." },
  { icon: Users, title: "Collaboration", desc: "Working closely with clients to bring their unique vision to life." },
  { icon: Sparkles, title: "Excellence", desc: "Uncompromising quality in every detail, from concept to execution." },
];

const timeline = [
  { year: "2023", title: "The Begining", desc: "MyJoy Creations was founded with a passion for event décor and lighting, bringing creative concepts to weddings, birthdays, and special celebrations across Goa." },
  { year: "2024", title: "Building Our Presence", desc: "Through dedication, attention to detail, and client trust, we expanded our services and became a preferred choice for customized event décor and lighting solutions." },
  { year: "2025", title: "Growing with Every Event", desc: "From intimate gatherings to larger-scale events, we continued transforming venues into beautiful experiences, earning recognition through word-of-mouth and satisfied clients." },
  { year: "2026", title: "Creating Memorable Celebrations", desc: "Today, MyJoy Creations proudly serves clients across Goa, delivering elegant décor, creative lighting, and personalized event experiences while continuing to grow with every celebration we design." },
  //{ year: "202", title: "Continuing the Journey", desc: "Today, MyJoy Creations stands as a trusted name in event décor and lighting, dedicated to creating elegant celebrations that blend creativity, craftsmanship, and attention to every detail." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const assets = (await getHomepageAssets()) || [];
  const findAsset = (key: string) => assets?.find((a) => a.image_key === key)?.public_url || "";

  const heroMainUrl = findAsset("hero_main");
  const aboutTeamUrl = findAsset("about-team");
  const logoUrl = settings.logo_url || findAsset("logo");

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <Navbar logoUrl={logoUrl} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroMainUrl && (
            <Image 
              src={heroMainUrl} 
              alt="Hero background" 
              fill
              priority
              className="object-cover" 
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-[var(--color-ink)]/50" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          {/* Framer motion animations applied via client wrappers */}
          <HeroFadeIn delay={0.2} className="text-white/70 text-xs uppercase tracking-[0.4em] mb-4">
            {contentValue(settings, "about.kicker", "Our Story")}
          </HeroFadeIn>

          <HeroTitle delay={0.4} className="font-display text-5xl md:text-7xl text-white text-shadow-hero">
            {contentValue(settings, "about.hero_title", "The Art of \nCelebration").split("\n").map((line: string, i: number) => i === 1 ? <span key={i} className="italic">{line}</span> : <span key={i}>{line}</span>)}
          </HeroTitle>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="image-zoom rounded-2xl overflow-hidden cinematic-shadow relative aspect-[4/3]">
                {aboutTeamUrl && (
                  <Image
                    src={aboutTeamUrl}
                    alt="The MyJoy Creations team"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-4 block">
                Who We Are
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Crafting Memories Since 2012</h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                {contentValue(settings, "about.intro_p1", "MyJoy Creations was born from a simple belief: every celebration deserves to be extraordinary. What started as a passion project between two friends has become a journey of creating stunning décor for life's most cherished moments.")}
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-8">
                {contentValue(settings, "about.intro_p2", "With a vision to redefine event décor through artistry, innovation, and personalized service, we specialize in designing immersive celebrations where lighting, décor, and ambiance come together seamlessly to create extraordinary experiences. Every project is approached with passion, precision, and a commitment to turning your most important moments into cherished memories.")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[var(--color-surface)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerContainer className="grid md:grid-cols-2 gap-12" staggerDelay={0.2}>
            <StaggerItem>
              <div className="bg-white rounded-2xl p-10 cinematic-shadow">
                <Award className="w-8 h-8 text-[var(--color-brand)] mb-6" />
                <h3 className="font-display text-3xl mb-4">Our Mission</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  To redefine the art of celebration by creating immersive, emotionally resonant environments 
                  that elevate every moment into a lasting memory. We believe in the transformative power of 
                  thoughtful design.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white rounded-2xl p-10 cinematic-shadow">
                <Sparkles className="w-8 h-8 text-[var(--color-brand)] mb-6" />
                <h3 className="font-display text-3xl mb-4">Our Vision</h3>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  To be the world's most sought-after event design studio, known for pushing creative boundaries 
                  while maintaining the intimate, personal touch that makes each event uniquely yours.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                Core Values
              </span>
              <h2 className="font-display text-4xl md:text-5xl">What Drives Us</h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-4 gap-8" staggerDelay={0.1}>
            {values.map((v) => {
              const ValueIcon = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <div className="text-center p-8 bg-white rounded-2xl cinematic-shadow hover-lift">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center mx-auto mb-6">
                      <ValueIcon className="w-6 h-6 text-[var(--color-brand)]" />
                    </div>
                    <h3 className="font-display text-xl mb-3">{v.title}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{v.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[var(--color-surface)] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                Our Journey
              </span>
              <h2 className="font-display text-4xl md:text-5xl">Timeline of Excellence</h2>
            </div>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)] md:-translate-x-px" />
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <span className="font-display text-2xl text-[var(--color-brand)]">{item.year}</span>
                    <h3 className="font-display text-xl mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{item.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] border-4 border-[var(--color-ivory)] flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

       <InstagramSection settings={settings} />

      {/* CTA */}
      <section className="py-24 bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl text-black mb-6">
              Ready to work with us?
            </h2>
            <p className="text-black/60 mb-10 max-w-lg mx-auto">
              Let's collaborate to create an event that will be remembered for a lifetime.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer logoUrl={logoUrl} email={settings.email} phone={settings.phone} address={settings.address || settings.location} instagram={settings.instagram_url} whatsapp={settings.whatsapp} />
      <WhatsAppButton />
    </div>
  );
}