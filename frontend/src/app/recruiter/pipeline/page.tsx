"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers, ArrowLeft, RefreshCw, Star, CheckCircle, ChevronRight, ChevronLeft,
  X, GitBranch, Trophy, ShieldCheck, FileText, Zap, Award, Sparkles, User, ExternalLink, MessageSquare,
  LayoutDashboard, Search, Briefcase, Cpu, Code2, DollarSign, Bot, Users, Radio, BarChart2
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

const STAGES = [
  { id: "applied", key: "applied", label: "APPLIED", color: "border-slate-700 bg-slate-900/40" },
  { id: "ai_review", key: "ai_review", label: "AI REVIEWED", color: "border-cyan-500/30 bg-cyan-950/20" },
  { id: "challenge", key: "challenge", label: "CHALLENGE", color: "border-amber-500/30 bg-amber-950/20" },
  { id: "interview", key: "interview", label: "INTERVIEW", color: "border-violet-500/30 bg-violet-950/20" },
  { id: "offer", key: "offer", label: "OFFER", color: "border-emerald-500/30 bg-emerald-950/20" },
  { id: "hired", key: "hired", label: "HIRED", color: "border-teal-500/40 bg-teal-950/30" },
];

export default function RecruiterPipelinePage() {
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({
    applied: [],
    ai_review: [],
    challenge: [],
    interview: [],
    offer: [],
    hired: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/pipeline`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPipeline(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="pipeline" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-emerald-400" /> Interactive Hiring Pipeline Board
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Track candidates seamlessly across stage transitions with live candidate notifications.</p>
              </div>
            </div>
            <button onClick={fetchPipeline} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Board
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAGES.map((st) => (
              <div key={st.key} className={`glass-panel p-4 rounded-2xl border ${st.color} space-y-3 min-h-[480px]`}>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-bold text-xs text-slate-200">{st.label}</span>
                  <span className="badge badge-emerald text-[10px]">{(pipeline[st.key] || []).length}</span>
                </div>

                <div className="space-y-2">
                  {(pipeline[st.key] || []).length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic text-center py-8">No candidates</p>
                  ) : (
                    (pipeline[st.key] || []).map((cand: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                        <h4 className="font-bold text-white text-xs">{cand.candidate_name || cand.name}</h4>
                        <p className="text-[10px] text-slate-400">{cand.role_title || "Backend Engineer"}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
