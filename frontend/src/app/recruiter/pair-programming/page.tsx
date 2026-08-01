"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2, ArrowLeft, RefreshCw, Sparkles, CheckCircle, Terminal,
  Zap, ShieldCheck, Play, Bot, ChevronRight, Layers, FileCode,
  LayoutDashboard, Search, Star, Briefcase, FileText, Cpu, DollarSign, Users, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },

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

const DEFAULT_PAIR_CODE = `import asyncio
from typing import Dict, Any

class RateLimiter:
    def __init__(self, rate_limit: int = 100):
        self.rate_limit = rate_limit
        self.requests = {}

    def is_allowed(self, client_ip: str) -> bool:
        # TODO: Add timestamp sliding window pruning
        current_count = self.requests.get(client_ip, 0)
        if current_count >= self.rate_limit:
            return False
        self.requests[client_ip] = current_count + 1
        return True
`;

export default function PairProgrammingPage() {
  const [problemTitle, setProblemTitle] = useState("FastAPI Sliding Window Rate Limiter");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_PAIR_CODE);

  const [loading, setLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<any>(null);

  const handleRunCopilot = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/pair-programming/copilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          code: code,
          language: language,
          current_problem: problemTitle
        })
      });

      if (!res.ok) throw new Error("Pair copilot request failed");
      const data = await res.json();
      setCopilotData(data);
    } catch (err) {
      console.error(err);
      alert("Error requesting pair copilot hints.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="pair" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-emerald-400" /> Live Pair Programming Assistant
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Real-time collaborative code review, Socratic hinting, bug detection & refactoring copilot.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Collaborative Code Editor
                </h2>
                <span className="badge badge-emerald text-xs font-mono">Python 3.12</span>
              </div>

              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                rows={12}
                className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 w-full resize-none leading-relaxed"
              />

              <button
                onClick={handleRunCopilot}
                disabled={loading}
                className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Ask AI Pair Programming Assistant <Bot className="w-3.5 h-3.5" /></>}
              </button>
            </div>

            <div>
              {copilotData ? (
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-5 animate-fade-in">
                  <h2 className="text-lg font-black text-white">AI Pair Feedback & Socratic Hints</h2>
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <p>{copilotData.hint || "Consider maintaining a timestamped sliding queue per IP instead of a static counter."}</p>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <Bot className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click "Ask AI Pair Programming Assistant" for live code review feedback.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
