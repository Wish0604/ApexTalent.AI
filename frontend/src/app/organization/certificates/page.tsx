"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award, ShieldCheck, Download, Share2, ArrowLeft, RefreshCw,
  Sparkles, CheckCircle2, QrCode
} from "lucide-react";

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
    <div className="min-h-screen bg-[#070b12] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
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

        {/* Main Grid: Certificate Form + Real-time Certificate Preview */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Certificate Form */}
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

          {/* Certificate Live Canvas Preview */}
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

      </div>
    </div>
  );
}
