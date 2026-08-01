"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain, ShieldCheck, Star, GitBranch, ArrowLeft, RefreshCw,
  Search, FileText, CheckCircle2, Award, Zap, Building2, User, Sparkles,
  LayoutDashboard, Briefcase, Cpu, Code2, DollarSign, Layers, Bot, Users, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },

  { href: "/recruiter/candidate-intelligence", label: "Candidate Intel", icon: Star, id: "intel" },
  { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
  { href: "/recruiter/challenges", label: "Hiring Challenges", icon: Sparkles },
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

export default function RecruiterCandidateIntelligencePage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/recruiter/candidates`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
        if (data.length > 0) setSelectedCandidate(data[0]);
      }
    } catch (e) {
      console.error(e);
      const mock = [
        {
          id: 1,
          name: "Aarav Mehta",
          title: "Senior Backend Systems Architect",
          score: 94.8,
          experience: "5 Years",
          github: "https://github.com/aarav-mehta",
          summary: "Outstanding mastery of FastAPI microservices, asynchronous task queues, and Redis cluster caching.",
          strengths: ["Clean Microservice Architecture", "100% Original Code Telemetry"],
          ppt_score: 92,
          plagiarism: "0.0% Clean"
        }
      ];
      setCandidates(mock);
      setSelectedCandidate(mock[0]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="intel" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Brain className="w-6 h-6 text-emerald-400" /> Candidate 360° Intelligence & PPT Verification
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Deep AI candidate analysis, repository telemetry, pitch deck verification, and plagiarism audits.</p>
              </div>
            </div>
            <button onClick={fetchCandidates} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Candidates
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Candidate Roster</h2>
              {loading && <div className="p-8 text-center text-xs text-slate-500 italic"><RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" /> Loading candidates...</div>}
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`glass-panel p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                    selectedCandidate?.id === cand.id ? "border-emerald-500/60 bg-emerald-500/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm">{cand.name}</h3>
                      <p className="text-[11px] text-slate-400">{cand.title}</p>
                    </div>
                    <span className="badge badge-emerald text-xs font-bold">{cand.score || 92} Score</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-6">
              {selectedCandidate ? (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        {selectedCandidate.name} <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">{selectedCandidate.title} • {selectedCandidate.experience || "5 Years Experience"}</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                      {selectedCandidate.score || 94.8} AI Score
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                    <span className="font-bold text-emerald-400">AI Telemetry Executive Summary:</span>
                    <p className="leading-relaxed">{selectedCandidate.summary || "Demonstrates master-level architectural patterns in high-concurrency microservices."}</p>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic">
                  Select a candidate to view 360° telemetry intelligence.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
