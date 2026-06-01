"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Image as ImageIcon,
  ArrowUpRight,
  Clock,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    activeServices: 0,
    galleryItems: 0,
    pendingInquiries: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      const [inquiriesRes, servicesRes, galleryRes, pendingRes, recentRes] = await Promise.all([
        supabase.from("inquiries").select("id", { count: "exact" }),
        supabase.from("services").select("id", { count: "exact" }).eq("active", true),
        supabase.from("gallery").select("id", { count: "exact" }),
        supabase.from("inquiries").select("id", { count: "exact" }).eq("status", "New"),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5)
      ]);

      setMetrics({
        totalInquiries: inquiriesRes.count || 0,
        activeServices: servicesRes.count || 0,
        galleryItems: galleryRes.count || 0,
        pendingInquiries: pendingRes.count || 0
      });

      if (recentRes.data) setRecentInquiries(recentRes.data);
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl mb-1">Overview</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Studio Performance & Analytics Metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl cinematic-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--color-surface)] rounded-xl text-[var(--color-brand)]"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)] font-medium">Total Inquiries</p>
          <h3 className="text-3xl font-display mt-1">{metrics.totalInquiries}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl cinematic-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--color-surface)] rounded-xl text-amber-600"><Clock className="w-5 h-5" /></div>
          </div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)] font-medium">Pending Review</p>
          <h3 className="text-3xl font-display mt-1">{metrics.pendingInquiries}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl cinematic-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--color-surface)] rounded-xl text-emerald-600"><Briefcase className="w-5 h-5" /></div>
          </div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)] font-medium">Active Services</p>
          <h3 className="text-3xl font-display mt-1">{metrics.activeServices}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl cinematic-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[var(--color-surface)] rounded-xl text-blue-600"><ImageIcon className="w-5 h-5" /></div>
          </div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)] font-medium">Gallery Assets</p>
          <h3 className="text-3xl font-display mt-1">{metrics.galleryItems}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl cinematic-shadow p-6">
        <h2 className="font-display text-xl mb-4">Recent Inquiries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-[var(--color-muted-foreground)] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="border-b last:border-none">
                  <td className="py-3 px-4 font-medium">{inq.name}</td>
                  <td className="py-3 px-4 text-[var(--color-muted-foreground)]">{inq.service}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inq.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>{inq.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}