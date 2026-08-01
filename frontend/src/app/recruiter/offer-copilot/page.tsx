"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign, ArrowLeft, RefreshCw, CheckCircle, Sparkles, Trophy,
  ShieldCheck, Copy, Check, FileText, ChevronRight, Zap, TrendingUp, User,
  LayoutDashboard, Search, Star, Briefcase, Cpu, Code2, Layers, Bot, Users, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },
  { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search },
  { href: "/recruiter/candidate-intelligence", label: "Candidate Intel", icon: Star, id: "intel" },
  { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
  { href: "/recruiter/challenges", label: "Hiring Challenges", icon: Zap, id: "challenges" },
  { href: "/recruiter/assessments", label: "Online Assessments", icon: FileText, id: "assessments" },
  { href: "/recruiter/interview-simulator", label: "Live Code Simulator", icon: Cpu, id: "simulator" },
  { href: "/recruiter/pair-programming", label: "Pair Programming", icon: Code2, id: "pair" },
  { href: "/recruiter/offers", label: "Offer & Negotiation", icon: DollarSign, id: "offers" },
  { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers, id: "pipeline" },
  { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot, id: "copilot" },
  { href: "/recruiter/team", label: "Enterprise Team", icon: Users },
  { href: "/recruiter/webhooks", label: "Webhooks Dispatch", icon: Radio },
  { href: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart2, id: "analytics" },
];

function RecruiterSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {RECRUITER_TABS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "active" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function OfferCopilotPage() {
  const [candidateName, setCandidateName] = useState("Aarav Mehta");
  const [proposedBase, setProposedBase] = useState(145000);
  const [proposedEquity, setProposedEquity] = useState("0.15%");
  const [proposedBonus, setProposedBonus] = useState(15000);
  const [maxBudget, setMaxBudget] = useState(180000);

  const [loading, setLoading] = useState(false);
  const [offerResult, setOfferResult] = useState<any>(null);

  const handleGenerateOffer = async () => {
    setLoading(true);
    setOfferResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/offer/negotiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          candidate_id: 1,
          proposed_base: Number(proposedBase),
          proposed_equity: proposedEquity,
          proposed_bonus: Number(proposedBonus),
          recruiter_max_budget: Number(maxBudget)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOfferResult(data);
      } else {
        alert("Failed to compute offer copilot package.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="offers" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" /> AI Offer & Negotiation Copilot
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Competitive package optimizer, retention probability analyzer & counter-offer strategy generator.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> Target Offer Parameters
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="field-label">Target Candidate Name</label>
                  <input value={candidateName} onChange={e => setCandidateName(e.target.value)} className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Proposed Base Salary ($): ${proposedBase.toLocaleString()}</label>
                  <input type="range" min="100000" max="250000" step="5000" value={proposedBase} onChange={e => setProposedBase(Number(e.target.value))} className="w-full mt-1 accent-emerald-500 cursor-pointer" />
                </div>
                <div>
                  <label className="field-label">Proposed Sign-on Bonus ($): ${proposedBonus.toLocaleString()}</label>
                  <input type="range" min="0" max="50000" step="2500" value={proposedBonus} onChange={e => setProposedBonus(Number(e.target.value))} className="w-full mt-1 accent-emerald-500 cursor-pointer" />
                </div>
                <button onClick={handleGenerateOffer} disabled={loading} className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Formulate AI Offer & Counter Strategies <Sparkles className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </div>

            <div>
              {offerResult ? (
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-5 animate-fade-in">
                  <h2 className="text-lg font-black text-white">AI Negotiation & Retention Scorecard</h2>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <p>Calculated high acceptance probability with minimal counter-offer risk.</p>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <DollarSign className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Configure parameters on the left to formulate AI offer strategies.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
