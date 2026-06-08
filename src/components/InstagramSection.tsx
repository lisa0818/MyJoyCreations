"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface InstagramSectionProps {
  settings: { instagram_url: string };
}

export default function InstagramSection({ settings }: InstagramSectionProps) {
  return (
    <section className="bg-[var(--color-ink)] py-3 md:py-3 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-brand)]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.span
              className="text-[var(--color-brand)] text-[10px] font-semibold uppercase tracking-[0.3em] mb-3 block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              @myjoycreations
            </motion.span>
            <h2 className="font-display text-3xl md:text-4xl mb-4 text-white">Follow Our Journey</h2>
            <p className="text-white/50 max-w-0.5xl mx-auto leading-relaxed">
             From concept to completion, explore the creativity that go into every event we design.
            </p>
          </div>
        </ScrollReveal>

        {/* Flex Wrapper for the Centerpiece */}
        <div className="flex justify-center mb-20">
          <motion.a
            href={settings.instagram_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-30 h-30 md:w-30 md:h-30 block cursor-pointer"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Story Ring Pulse */}
            <motion.div
              className="absolute -inset-3 rounded-full border-2 border-[var(--color-gold)]/30"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner Ring */}
            <motion.div
              className="absolute -inset-6 rounded-full border border-[var(--color-brand)]/20"
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Outer Dashed Ring */}
            <motion.div
              className="absolute -inset-10 rounded-full border-2 border-dashed border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            {/* Camera Icon Container */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-brand)] via-[var(--color-brand-warm)] to-[var(--color-gold)] p-[3px]">
              <div className="w-full h-full rounded-full bg-[var(--color-ink)] flex items-center justify-center">
                <Camera className="w-14 h-14 md:w-20 md:h-20 text-white" />
              </div>
            </div>
            {/* Orbiting Dot 1 */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--color-gold)] shadow-[0_0_16px_rgba(201,168,76,0.7)]" />
            </motion.div>
            {/* Orbiting Dot 2 */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_14px_rgba(217,45,32,0.7)]" />
            </motion.div>
          </motion.a>
        </div> {/* Closes Flex Wrapper */}
      </div> {/* Closes Main Container */}
    </section> // Closes Section
  );
}