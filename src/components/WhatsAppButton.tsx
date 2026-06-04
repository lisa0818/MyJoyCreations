"use client";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-0 bg-emerald-500 pl-4 pr-1 py-1 rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:pr-2"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-xs font-semibold text-white tracking-wide uppercase max-w-0 overflow-hidden group-hover:max-w-[200px] group-hover:mr-2 transition-all duration-300 whitespace-nowrap">
        Chat Now
      </span>
      <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>
    </a>
  );
}
