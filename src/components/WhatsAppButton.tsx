'use client';
import { MessageCircle, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useSite } from "@/lib/site-store";

export function WhatsAppButton() {
  const { data } = useSite();
  const reduce = useReducedMotion();
  const number = data.settings.whatsapp.replace(/\D/g, "");
  const phone = data.settings.phone.replace(/\D/g, "");
  const hover = reduce ? undefined : { scale: 1.1 };
  const tap = reduce ? undefined : { scale: 0.95 };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      <motion.a
        whileHover={hover}
        whileTap={tap}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        href={`tel:${phone}`}
        className="group flex items-center gap-0 bg-[var(--color-brand)] pl-4 pr-1 py-1 rounded-full shadow-xl shadow-[var(--color-brand)]/25 hover:pr-2 transition-[padding] duration-300"
        aria-label="Call us"
      >
        <span className="text-xs font-semibold text-white tracking-wide uppercase max-w-0 overflow-hidden group-hover:max-w-[200px] group-hover:mr-2 transition-all duration-300 whitespace-nowrap">
          Call Now
        </span>
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
          <Phone className="w-5 h-5 text-white" />
        </div>
      </motion.a>

      <motion.a
        whileHover={hover}
        whileTap={tap}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-0 bg-emerald-500 pl-4 pr-1 py-1 rounded-full shadow-xl shadow-emerald-500/25 hover:pr-2 transition-[padding] duration-300"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-xs font-semibold text-white tracking-wide uppercase max-w-0 overflow-hidden group-hover:max-w-[200px] group-hover:mr-2 transition-all duration-300 whitespace-nowrap">
          Chat Now
        </span>
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </motion.a>
    </div>
  );
}
