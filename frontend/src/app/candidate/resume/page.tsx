"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, Sparkles, Download, ArrowLeft, RefreshCw, CheckCircle, Copy, Globe, Eye,
  LayoutDashboard, User, Network, Briefcase, Trophy, FolderOpen, Map, Mic, Award, BarChart3, ShieldCheck, Cpu, Settings
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CANDIDATE_TABS = [
  { href: "/candidate", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate?tab=profile", label: "Profile Hub", icon: User },
  { href: "/candidate?tab=skills", label: "Skill Intelligence", icon: Network },
  { href: "/candidate/jobs", label: "Job Matches", icon: Briefcase, id: "jobs" },
  { href: "/candidate/hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
  { href: "/candidate/projects", label: "Projects", icon: FolderOpen, id: "projects" },
  { href: "/candidate/resume", label: "Resume & Portfolio", icon: FileText, id: "resume" },
  { href: "/candidate/career", label: "Career Guidance", icon: Map, id: "career" },
  { href: "/candidate/interview", label: "AI Interviews", icon: Mic, id: "interviews" },
  { href: "/candidate/talent-score", label: "Talent Score 360", icon: Award, id: "talent-score" },
  { href: "/candidate/analytics", label: "Analytics & GitHub", icon: BarChart3, id: "analytics" },
];

function CandidateSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-violet-600/20 rounded-lg border border-violet-500/30">
          <Cpu className="w-4 h-4 text-violet-400" />
        </div>
        <span className="font-bold text-sm gradient-text-violet">Candidate Hub</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {CANDIDATE_TABS.map((item, idx) => {
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

      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link href="/candidate/verification" className="sidebar-item w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verification & Badges</span>
        </Link>
        <Link href="/settings" className="sidebar-item w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const [targetRole, setTargetRole] = useState("Backend Systems Architect");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover" | "portfolio">("resume");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/resume/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole })
      });
      if (!res.ok) throw new Error("Resume generation failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = activeTab === "resume" ? result.ats_resume_markdown : activeTab === "cover" ? result.cover_letter_text : result.portfolio_html;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="resume" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-violet-400" /> AI Resume & ATS Portfolio Generator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Build tailored ATS-optimized resumes, cover letters, and public portfolio pages using verified telemetry.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" /> Target Role Criteria
                </h2>
                <div>
                  <label className="field-label text-xs">Target Position Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="field-input w-full mt-1 text-xs"
                    placeholder="e.g. Senior Fullstack Engineer"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Generate ATS Assets <Sparkles className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("resume")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === "resume" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"}`}
                      >
                        ATS Resume
                      </button>
                      <button
                        onClick={() => setActiveTab("cover")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${activeTab === "cover" ? "bg-violet-600 text-white" : "bg-white/5 text-slate-400"}`}
                      >
                        Cover Letter
                      </button>
                    </div>

                    <button onClick={handleCopy} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy Markdown"}
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {activeTab === "resume" ? result.ats_resume_markdown : result.cover_letter_text}
                  </pre>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Enter a target role and click generate to create ATS resume assets.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
