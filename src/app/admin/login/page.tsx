"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import logo from "../../../assets/logo.png";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 md:p-12 cinematic-shadow">
          <div className="text-center mb-10">
            <img src={logo.src} alt="MyJoy Creations" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="font-display text-2xl mb-1">Studio Management</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
                placeholder="admin@myjoycreations.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all text-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-brand)] text-white text-sm font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-[var(--color-brand-warm)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)] transition-colors">
              Return to website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}