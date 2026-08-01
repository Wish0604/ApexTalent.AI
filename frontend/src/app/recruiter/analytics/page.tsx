"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, BarChart2, PieChart, Users, ArrowLeft, RefreshCw,
  Building2, Zap, ShieldCheck, Target, LineChart
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RecruiterAnalyticsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-violet-400" /> Recruiter Hiring Analytics & Market Intelligence
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Pipeline funnel conversions, recruiter team benchmarks, skill demand trends, and time-to-fill analytics.</p>
            </div>
          </div>
        </div>

        {/* Executive KPI Summary */}
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

        {/* Funnel Analytics & Skill Demand */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Recruitment Funnel */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-violet-400" /> Pipeline Conversion Funnel
            </h2>
            <div className="space-y-3.5 text-xs">
              {[
                { stage: "Sourced Candidates", count: 412, pct: "100%", color: "bg-violet-500" },
                { stage: "AI Evaluated & Screened", count: 248, pct: "60.1%", color: "bg-indigo-500" },
                { stage: "Interview Conducted", count: 96, pct: "23.3%", color: "bg-emerald-500" },
                { stage: "Offers Extended", count: 32, pct: "7.7%", color: "bg-amber-500" },
                { stage: "Hired & Onboarded", count: 29, pct: "7.0%", color: "bg-pink-500" },
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

          {/* Market Skill Demand Index */}
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

      </div>
    </div>
  );
}
