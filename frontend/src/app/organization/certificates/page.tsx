"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award, ShieldCheck, Download, Share2, ArrowLeft, RefreshCw,
  Sparkles, CheckCircle2, QrCode,
  LayoutDashboard, Calendar, Trophy, Network, Brain, BarChart2, Cpu
} from "lucide-react";

function OrganizationSidebar({ active }: { active: string }) {
  const items = [
    { href: "/organization", label: "Dashboard", icon: LayoutDashboard },
    { href: "/organization/events", label: "Events & Webinars", icon: Calendar, id: "events" },
    { href: "/organization/hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
    { href: "/organization/team-builder", label: "AI Team Builder", icon: Network, id: "teams" },
    { href: "/organization/evaluations", label: "AI Evaluations", icon: Brain, id: "evaluations" },
    { href: "/organization/certificates", label: "Certificates & Badges", icon: Award, id: "certificates" },
    { href: "/organization/analytics", label: "Community Analytics", icon: BarChart2, id: "analytics" },
  ];

  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="font-bold text-sm gradient-text-gold">Community HQ</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5">
        <p className="section-title">Navigation</p>
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "bg-amber-600/30 text-amber-200 border border-amber-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function OrganizationCertificatesPage() {
  const [recipient, setRecipient] = useState("Aarav Mehta");
  const [eventTitle, setEventTitle] = useState("AI Talent Hackathon 2026");
  const [role, setRole] = useState("1st Place Winner");
  const [generating, setGenerating] = useState(false);
  const [issued, setIssued] = useState(false);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setIssued(true);
    }, 800);
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <OrganizationSidebar active="certificates" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/organization" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" /> Certificate & Verification Badge Authority
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Issue cryptographically verifiable certificates, hackathon achievement badges, and skill credentials.</p>
              </div>
            </div>
          </div>

          {/* Main Grid: Certificate Form + Live Preview */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Issue Credential
              </h2>
              <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
                <div>
                  <label className="field-label">Recipient Name</label>
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} required className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Event / Hackathon Name</label>
                  <input value={eventTitle} onChange={e => setEventTitle(e.target.value)} required className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Achievement / Rank</label>
                  <input value={role} onChange={e => setRole(e.target.value)} required className="field-input w-full mt-1" />
                </div>
                <button type="submit" disabled={generating} className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate & Sign Certificate ✓"}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-300">Live Certificate Preview</h2>
              <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-[#0a101f] to-slate-950 text-center space-y-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-violet-500 to-emerald-400" />

                <Award className="w-12 h-12 text-amber-400 mx-auto" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Official Certificate of Excellence</span>
                  <h3 className="text-2xl font-black text-white">{eventTitle}</h3>
                </div>

                <div className="space-y-1 py-2">
                  <p className="text-xs text-slate-400">This credential is proudly awarded to</p>
                  <p className="text-xl font-bold text-violet-300 font-serif">{recipient}</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">For outstanding performance as: {role}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cryptographically Verified</span>
                  <span>ID: APEX-CERT-2026-8842</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
