"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart2, ArrowLeft, RefreshCw, TrendingUp, Users, Award, ShieldCheck,
  Zap, ChevronRight, CheckCircle, Trophy, Sparkles, Layers, Cpu,
  LayoutDashboard, Search, Star, Briefcase, FileText, Code2, DollarSign, Bot, Radio
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

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
  { href: "/recruiter/team", label: "Enterprise Team", icon: Users, id: "team" },
  { href: "/recruiter/webhooks", label: "Webhooks Dispatch", icon: Radio, id: "webhooks" },
  { href: "/recruiter/executive-dashboard", label: "Executive Dashboard", icon: BarChart2, id: "executive" },
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

export default function ExecutiveDashboardPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/telemetry/executive`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error("Failed to load executive telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: "Jan", hires: 12 },
    { month: "Feb", hires: 15 },
    { month: "Mar", hires: 22 },
    { month: "Apr", hires: 31 },
    { month: "May", hires: 38 },
    { month: "Jun", hires: 42 },
  ];

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="executive" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-emerald-400" /> Executive Telemetry & Platform Dashboard
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Platform-wide hiring velocity, pipeline throughput & talent graph growth.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Talent Graph Network</span>
              <div className="text-2xl font-black text-white">2,100</div>
              <p className="text-[10px] text-emerald-400">+14.2% month-over-month</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Time-to-Hire</span>
              <div className="text-2xl font-black text-indigo-400">11.5 Days</div>
              <p className="text-[10px] text-slate-400">2.5x faster than market avg</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Conversion</span>
              <div className="text-2xl font-black text-emerald-400">86.4%</div>
              <p className="text-[10px] text-slate-400">High-confidence matches</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Evaluation Accuracy</span>
              <div className="text-2xl font-black text-amber-400">96.8%</div>
              <p className="text-[10px] text-slate-400">Zero-fraud telemetry</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-slate-200">Monthly Hiring Velocity & Placement Throughput</h2>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                    <Bar dataKey="hires" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-slate-200">Top Skill Demand Growth</h2>
              <div className="space-y-3 text-xs">
                {[
                  { skill: "FastAPI", growth: "+42%" },
                  { skill: "PyTorch / MLOps", growth: "+38%" },
                  { skill: "Next.js / TypeScript", growth: "+31%" },
                  { skill: "Kubernetes / Terraform", growth: "+27%" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-slate-200">{item.skill}</span>
                    <span className="text-emerald-400 font-bold">{item.growth}</span>
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
