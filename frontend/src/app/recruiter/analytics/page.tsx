"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp, BarChart2, PieChart, Users, ArrowLeft, RefreshCw,
  Building2, Zap, ShieldCheck, Target, LineChart,
  LayoutDashboard, Search, Star, Briefcase, DollarSign, Layers, Bot, Cpu, FileText, Code2, Radio
} from "lucide-react";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },

  { href: "/recruiter/candidate-intelligence", label: "Candidate Intel", icon: Star, id: "intel" },
  { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
  { href: "/recruiter/challenges", label: "Hiring Challenges", icon: Zap },
  { href: "/recruiter/assessments", label: "Online Assessments", icon: FileText },
  { href: "/recruiter/interview-simulator", label: "Live Code Simulator", icon: Cpu },
  { href: "/recruiter/pair-programming", label: "Pair Programming", icon: Code2 },

  { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers },
  { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot },
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

export default function RecruiterAnalyticsPage() {
  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="analytics" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" /> Recruiter Hiring Analytics & Market Intelligence
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Pipeline funnel conversions, recruiter team benchmarks, skill demand trends, and time-to-fill analytics.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Candidates</span>
              <div className="text-2xl font-black text-white">412</div>
              <p className="text-[10px] text-emerald-400">+24% this quarter</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offer Acceptance Rate</span>
              <div className="text-2xl font-black text-emerald-400">91.8%</div>
              <p className="text-[10px] text-slate-400">Market Avg: 74%</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Time to Hire</span>
              <div className="text-2xl font-black text-indigo-400">11.4 Days</div>
              <p className="text-[10px] text-slate-400">AI Sourced</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Candidate Satisfaction</span>
              <div className="text-2xl font-black text-amber-400">4.9 / 5.0</div>
              <p className="text-[10px] text-slate-400">Post-interview survey</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" /> Pipeline Conversion Funnel
              </h2>
              <div className="space-y-3.5 text-xs">
                {[
                  { stage: "Sourced Candidates", count: 412, pct: "100%", color: "bg-emerald-500" },
                  { stage: "AI Evaluated & Screened", count: 248, pct: "60.1%", color: "bg-indigo-500" },
                  { stage: "Interview Conducted", count: 96, pct: "23.3%", color: "bg-violet-500" },
                  { stage: "Offers Extended", count: 32, pct: "7.7%", color: "bg-amber-500" },
                  { stage: "Hired & Onboarded", count: 29, pct: "7.0%", color: "bg-emerald-400" },
                ].map((f, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{f.stage}</span>
                      <span className="font-bold">{f.count} ({f.pct})</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                      <div className={`${f.color} h-2.5 rounded-full`} style={{ width: f.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Real-time Market Skill Demand
              </h2>
              <div className="space-y-3 text-xs">
                {[
                  { skill: "FastAPI / Python Microservices", growth: "+42%", salary: "$145,000" },
                  { skill: "React / Next.js Frontend Lead", growth: "+38%", salary: "$138,000" },
                  { skill: "PyTorch & LLM Fine-Tuning", growth: "+64%", salary: "$175,000" },
                  { skill: "Docker & Kubernetes Orchestration", growth: "+29%", salary: "$150,000" },
                ].map((s, i) => (
                  <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-white/10 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-xs">{s.skill}</h3>
                      <p className="text-[10px] text-emerald-400">Demand: {s.growth} YoY</p>
                    </div>
                    <span className="badge badge-amber text-xs font-bold">{s.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
