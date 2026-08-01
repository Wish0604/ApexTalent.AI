"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, ArrowLeft, RefreshCw, Sparkles, CheckCircle, Mail, Send,
  UserCheck, Award, Star, ExternalLink, ChevronRight, Copy, Check, GitBranch, Zap, Layers,
  LayoutDashboard, Briefcase, FileText, Cpu, Code2, DollarSign, Bot, Users, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },
  { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search, id: "sourcing" },
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

export default function CandidateSourcingPage() {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Systems Architect");
  const [skillsInput, setSkillsInput] = useState("FastAPI, Python, PostgreSQL, Docker, Redis");
  const [minScore, setMinScore] = useState(80);

  const [sourcing, setSourcing] = useState(false);
  const [sourcedData, setSourcedData] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleRunHeadhunter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    setSourcing(true);
    setSourcedData(null);

    const skills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/headhunter/sourcing-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          role_title: roleTitle,
          required_skills: skills,
          min_talent_score: minScore
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSourcedData(data);
      } else {
        alert("Failed to run sourcing agent.");
      }
    } catch (err) {
      alert("Error triggering headhunter agent. Check network session.");
    } finally {
      setSourcing(false);
    }
  };

  const handleCopySequence = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="sourcing" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-emerald-400" /> AI Autonomous Candidate Headhunter & Sourcing Agent
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Outbound telemetry search, AI candidate scoring, and hyper-personalized email sequence generator.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Headhunter Search Parameters
                </h2>

                <form onSubmit={handleRunHeadhunter} className="space-y-4 text-xs">
                  <div>
                    <label className="field-label">Target Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={e => setRoleTitle(e.target.value)}
                      placeholder="e.g. Lead Backend Engineer"
                      className="field-input w-full mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="field-label">Required Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={e => setSkillsInput(e.target.value)}
                      placeholder="FastAPI, Docker, PyTorch"
                      className="field-input w-full mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="field-label">Min Talent Score: {minScore}</label>
                    <input
                      type="range"
                      min="50"
                      max="99"
                      value={minScore}
                      onChange={e => setMinScore(Number(e.target.value))}
                      className="w-full mt-1 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sourcing}
                    className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
                  >
                    {sourcing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Run Outbound Headhunter <Zap className="w-3.5 h-3.5" /></>}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {sourcedData ? (
                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-300">✓ Sourced {sourcedData.candidates?.length || 0} Candidates</span>
                    <span className="text-slate-400">Target Match: {sourcedData.target_role}</span>
                  </div>

                  {sourcedData.candidates?.map((cand: any, idx: number) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white text-base">{cand.name}</h3>
                          <p className="text-xs text-slate-400">{cand.current_role} • {cand.location}</p>
                        </div>
                        <span className="badge badge-emerald text-xs font-black px-3 py-1">
                          {cand.talent_score} Talent Score
                        </span>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <span className="font-bold text-emerald-400 mb-1 block">AI Sourcing Summary:</span>
                        {cand.ai_summary}
                      </div>

                      {cand.outbound_email_sequence && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400">Hyper-Personalized Outreach Email:</span>
                            <button
                              onClick={() => handleCopySequence(cand.outbound_email_sequence, idx)}
                              className="btn-primary text-[10px] px-3 py-1 flex items-center gap-1"
                            >
                              {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedIdx === idx ? "Copied" : "Copy Email"}
                            </button>
                          </div>
                          <pre className="p-3 bg-slate-900/80 rounded-lg text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                            {cand.outbound_email_sequence}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Configure search parameters to launch AI candidate sourcing.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
