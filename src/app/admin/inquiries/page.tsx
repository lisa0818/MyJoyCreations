"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, Clock, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  message: string;
  status: 'New' | 'Reviewed' | 'Archived';
  created_at: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setInquiries(data as Inquiry[]);
    setLoading(false);
  }

  const updateStatus = async (id: string, nextStatus: 'Reviewed' | 'Archived') => {
    const { error } = await supabase
      .from("inquiries")
      .update({ status: nextStatus })
      .eq("id", id);

    if (!error) {
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: nextStatus } : i));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: nextStatus });
      }
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry ledger line item?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) {
      setInquiries(inquiries.filter(i => i.id !== id));
      setSelectedInquiry(null);
    }
  };

  const filtered = inquiries.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="font-display text-3xl mb-1">Inquiries Workspace</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Review incoming consultation booking entries</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Master Column */}
        <div className="lg:col-span-1 bg-white rounded-2xl cinematic-shadow flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter entries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center flex-1"><Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand)]" /></div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y">
              {filtered.map(inq => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-[var(--color-surface)]/50 ${
                    selectedInquiry?.id === inq.id ? "bg-[var(--color-surface)]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{inq.name}</h4>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                      inq.status === 'New' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}>{inq.status}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{inq.service}</p>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {inq.event_date || "No date set"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail View Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl cinematic-shadow overflow-y-auto p-8">
          {selectedInquiry ? (
            <div>
              <div className="flex justify-between items-start border-b pb-6 mb-6">
                <div>
                  <h2 className="font-display text-2xl mb-1">{selectedInquiry.name}</h2>
                  <p className="text-sm font-medium text-[var(--color-brand)]">{selectedInquiry.service}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedInquiry.status === 'New' && (
                    <button
                      onClick={() => updateStatus(selectedInquiry.id, 'Reviewed')}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Reviewed
                    </button>
                  )}
                  {selectedInquiry.status !== 'Archived' && (
                    <button
                      onClick={() => updateStatus(selectedInquiry.id, 'Archived')}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-200"
                    >
                      <Clock className="w-3.5 h-3.5" /> Archive Task
                    </button>
                  )}
                  <button
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-[var(--color-surface)] rounded-xl flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedInquiry.email}</span>
                </div>
                <div className="p-4 bg-[var(--color-surface)] rounded-xl flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedInquiry.phone || "Not specified"}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Message Context</h4>
                <div className="p-6 bg-[var(--color-surface)] rounded-2xl text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message || "The user didn't leave any extra description text details."}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
              <Mail className="w-8 h-8 mb-2 stroke-1" /> Select an inquiry card line item item entry sheet from the left pane workspace column view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}