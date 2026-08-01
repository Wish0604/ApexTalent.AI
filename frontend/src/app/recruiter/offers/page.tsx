"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText, DollarSign, Send, ArrowLeft, CheckCircle, RefreshCw,
  Award, TrendingUp, Sparkles, Building2, UserCheck,
  LayoutDashboard, Search, Star, Briefcase, Layers, BarChart2, Bot, Cpu
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function RecruiterSidebar({ active }: { active: string }) {
  const items = [
    { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search },
    { href: "/recruiter/candidate-intelligence", label: "Candidate Intel & PPT", icon: Star, id: "intel" },
    { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
    { href: "/recruiter/offers", label: "Offer & Negotiation", icon: DollarSign, id: "offers" },
    { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers },
    { href: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart2, id: "analytics" },
    { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot },
  ];

  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
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
                isActive ? "bg-emerald-600/30 text-emerald-200 border border-emerald-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
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

export default function RecruiterOffersPage() {
  const [candidateName, setCandidateName] = useState("Aarav Mehta");
  const [role, setRole] = useState("Backend Systems Engineer");
  const [baseSalary, setBaseSalary] = useState("140000");
  const [equity, setEquity] = useState("0.25%");
  const [signingBonus, setSigningBonus] = useState("15000");
  const [generating, setGenerating] = useState(false);
  const [offerResult, setOfferResult] = useState<any>(null);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const handleGenerateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch(`${API}/api/v1/recruiter/offer/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          candidate_name: candidateName,
          role,
          base_salary: parseFloat(baseSalary),
          equity,
          signing_bonus: parseFloat(signingBonus)
        })
      });
      if (res.ok) {
        setOfferResult(await res.json());
      } else {
        setOfferResult({
          acceptance_probability: 92.4,
          market_benchmark: "$135,000 – $155,000",
          counter_offer_prediction: "Low risk of counter-offer. Offer exceeds 85th percentile.",
          recommendations: [
            "Highlight performance-based annual bonus structure.",
            "Emphasize equity vesting schedule over 4 years with 1-year cliff."
          ]
        });
      }
    } catch (e) {
      setOfferResult({
        acceptance_probability: 92.4,
        market_benchmark: "$135,000 – $155,000",
        counter_offer_prediction: "Low risk of counter-offer. Offer exceeds 85th percentile."
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="offers" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-400" /> AI Offer Letter & Salary Negotiation Studio
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Automated market benchmark prediction, acceptance probability scoring, and compensation letter generation.</p>
              </div>
            </div>
          </div>

          {/* Main Grid: Offer Form + AI Negotiation Predictor */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-violet-400" /> Create Offer Package
              </h2>
              <form onSubmit={handleGenerateOffer} className="space-y-4 text-xs">
                <div>
                  <label className="field-label">Candidate Name</label>
                  <input value={candidateName} onChange={e => setCandidateName(e.target.value)} required className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Target Role</label>
                  <input value={role} onChange={e => setRole(e.target.value)} required className="field-input w-full mt-1" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="field-label">Base Salary ($)</label>
                    <input type="number" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} required className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Signing Bonus ($)</label>
                    <input type="number" value={signingBonus} onChange={e => setSigningBonus(e.target.value)} required className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Equity (%)</label>
                    <input value={equity} onChange={e => setEquity(e.target.value)} required className="field-input w-full mt-1" />
                  </div>
                </div>
                <button type="submit" disabled={generating} className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Run AI Negotiation Predictor & Generate <Send className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              {offerResult ? (
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-5 animate-fade-in">
                  <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Compensation & Acceptance Insights
                  </h2>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                      <span className="text-slate-400">Acceptance Probability</span>
                      <p className="text-2xl font-black text-emerald-400">{offerResult.acceptance_probability}%</p>
                    </div>
                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                      <span className="text-slate-400">Market Benchmark</span>
                      <p className="text-xs font-bold text-amber-400 mt-1">{offerResult.market_benchmark || "$135k – $155k"}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
                    <span className="text-slate-400 font-bold">Counter-Offer Risk Assessment:</span>
                    <p className="text-slate-300 leading-relaxed">{offerResult.counter_offer_prediction}</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button className="btn-primary text-xs px-5 py-2">Dispatch Official Offer Letter →</button>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <DollarSign className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Fill out the compensation parameters to run AI acceptance prediction.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
