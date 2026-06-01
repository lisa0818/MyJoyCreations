"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    date: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl mb-2">Thank You!</h3>
        <p className="text-[var(--color-muted-foreground)]">
          We've received your inquiry and will be in touch soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
            placeholder="+1 (234) 567-890"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Event Type</label>
          <select
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
          >
            <option value="">Select event type</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="engagement">Engagement</option>
            <option value="corporate">Corporate</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Event Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Message</label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm resize-none"
          placeholder="Tell us about your vision..."
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all"
      >
        <Send className="w-4 h-4" />
        Send Inquiry
      </button>
    </form>
  );
}