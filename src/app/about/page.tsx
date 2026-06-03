"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Users, Heart, Lightbulb, Sparkles, Star, Target, Loader2 } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../../components/ScrollReveal";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { WhatsAppButton } from "../../components/WhatsAppButton";
// Import our new motion wrappers
import { HeroFadeIn, HeroTitle } from "@/components/MotionWrapper";
import { useSite } from "@/lib/site-store";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "We push boundaries to craft custom-tailored sensory spaces unique to your concept." },
  { icon: Target, title: "Precision", desc: "From scheduling blueprints to tiny floral nodes, we design with rigorous attention." },
  { icon: Heart, title: "Empathy", desc: "We listen carefully to ensure your personal cultural story guides our creative approach." },
  { icon: Star, title: "Excellence", desc: "We hold ourselves to premium editorial production values across every framework layer." },
];

const timeline = [
  { year: "2012", title: "The Studio Opens", desc: "MyJoy Creations launched as a localized creative project design partnership." },
  { year: "2016", title: "Going National", desc: "Expanded production across major regional centers with dedicated warehousing engines." },
  { year: "2020", title: "Digital Immersive Shift", desc: "Integrated multi-sensory light maps and precision structural mechanics into our designs." },
  { year: "2025", title: "Global Recognition", desc: "Awarded top design honours for editorial aesthetic engineering execution milestones." },
];

const team = [
  { name: "Joy Mitchell", role: "Creative Director", bio: "Artistic visionary with over a decade of dedication to conceptual interior staging transformations." },
  { name: "Marcus Vance", role: "Technical Producer", bio: "Applies rigid physical calculation blueprints to transition abstract concepts into real structural builds." },
  { name: "Sophia Lin", role: "Floral Designer", bio: "Specializes in bespoke organic palette sourcing configurations across seasonal balance metrics." },
  { name: "David Kross", role: "Logistics Lead", bio: "Controls complex on-site schedules to ensure flawless execution deployment." },
];

export default function AboutPage() {
  const { data, loading } = useSite();
  const site = (data as any) || { settings: {}, heroes: {} };
  const settings = site.settings || {};
  const heroMainUrl = site.heroes?.about || settings.aboutFeaturedImage || "";
  const aboutTeamUrl = site.settings?.aboutFeaturedImage || "";

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
            {settings?.content?.about?.kicker || settings?.aboutKicker || "Our Story"}
          </HeroFadeIn>

          <HeroTitle delay={0.4} className="font-display text-5xl md:text-7xl text-white text-shadow-hero">
            {(settings?.content?.about?.hero_title || settings?.aboutHeroTitle || "The Art of \nCelebration").split("\n").map((line: string, i: number) => i === 1 ? <span key={i} className="italic">{line}</span> : <span key={i}>{line}</span>)}
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
                {settings?.content?.about?.intro_p1 || settings?.aboutIntroP1 || "MyJoy Creations was born from a simple belief: every celebration deserves to be extraordinary. What started as a passion project between two friends has blossomed into an internationally recognized event design studio."}
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-8">
                {settings?.content?.about?.intro_p2 || settings?.aboutIntroP2 || "We specialize in creating immersive environments where light, texture, and emotion converge to tell your unique story. From intimate garden gatherings to grand ballroom transformations, we approach each project with the same dedication to artistry and detail."}
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="font-display text-3xl text-[var(--color-brand)]">500+</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Events</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[var(--color-brand)]">12</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Years</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-[var(--color-brand)]">50+</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">Awards</p>
                </div>
              </div>
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

      {/* Team */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block">
                The Team
              </span>
              <h2 className="font-display text-4xl md:text-5xl">Meet the Creatives</h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-4 gap-8" staggerDelay={0.15}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="text-center group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-warm)] mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-display text-xl mb-1">{member.name}</h3>
                  <p className="text-[var(--color-brand)] text-xs uppercase tracking-[0.2em] mb-3">{member.role}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{member.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[var(--color-ink)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              Ready to work with us?
            </h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto">
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
}