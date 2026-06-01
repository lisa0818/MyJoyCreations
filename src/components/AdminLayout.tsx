"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Briefcase,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: Briefcase, label: "Services", href: "/admin/services" },
  { icon: Inbox, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-[var(--color-border)] fixed h-screen z-30">
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            {/* Optimized Next.js Image handling */}
            <div className="relative h-10 w-10 shrink-0">
              <Image 
                src="/assets/logo.png" 
                alt="MyJoy" 
                fill 
                sizes="40px"
                className="object-contain" 
              />
            </div>
            <div>
              <span className="font-display text-lg font-semibold block text-slate-800">MyJoy</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] block -mt-1">Admin</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Sidebar Management Engine */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--color-brand)] text-white shadow-md shadow-[var(--color-brand)]/20"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--color-border)] z-40 flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0">
            <Image 
              src="/assets/logo.png" 
              alt="MyJoy" 
              fill 
              sizes="32px"
              className="object-contain" 
            />
          </div>
          <span className="font-display text-base font-semibold text-slate-800">MyJoy Admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-600" aria-label="Toggle Menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slider Menu Drawer Container */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white pt-16 animate-slide-in-right">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-brand)] text-white"
                      : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--color-muted-foreground)]"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </nav>
        </div>
      )}

      {/* Main Framework Content Yield Point */}
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}