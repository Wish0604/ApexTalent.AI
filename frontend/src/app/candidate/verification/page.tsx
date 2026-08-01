"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Award, FileText, CheckCircle2, AlertTriangle, Upload,
  GitBranch, Cpu, ArrowLeft, RefreshCw, Lock, Zap,
  LayoutDashboard, User, Network, Briefcase, Trophy, FolderOpen, Map, Mic, BarChart3, Settings
} from "lucide-react";

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
        <Link href="/candidate/verification" className="sidebar-item w-full flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
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

export default function VerificationPage() {
  const [uploading, setUploading] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certList, setCertList] = useState([
    { id: 1, name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", score: "99.2% Authentic", date: "2026-05-12", verified: true },
    { id: 2, name: "FastAPI Production Systems Certification", issuer: "Python Software Foundation", score: "97.8% Authentic", date: "2026-03-20", verified: true }
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateName) return;
    setUploading(true);
    setTimeout(() => {
      setCertList([
        {
          id: Date.now(),
          name: certificateName,
          issuer: "Verified Issuing Authority",
          score: "98.5% Authentic",
          date: new Date().toISOString().split("T")[0],
          verified: true
        },
        ...certList
      ]);
      setCertificateName("");
      setUploading(false);
    }, 1200);
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="verification" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" /> Talent Verification & Badge Authority
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Verify technical credentials, certificates, GitHub telemetry, and identity badges for recruiters.</p>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Verified Talent: Level 3 (Highest)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              
              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                    <GitBranch className="w-4 h-4 text-violet-400" /> GitHub Verification
                  </div>
                  <p className="text-lg font-bold text-slate-100">100% Authentic</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Commits Verified
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                    <Award className="w-4 h-4 text-emerald-400" /> Skill Verification
                  </div>
                  <p className="text-lg font-bold text-slate-100">15 Badges</p>
                  <p className="text-[11px] text-violet-400 mt-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> AI Evaluated Code
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                    <Lock className="w-4 h-4 text-indigo-400" /> Identity Audit
                  </div>
                  <p className="text-lg font-bold text-slate-100">Passed</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Candidate
                  </p>
                </div>
              </div>

              {/* Upload Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-violet-400" /> Upload & Verify Certificate / License
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="field-label">Certificate Title</label>
                    <input
                      type="text"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                      placeholder="e.g. Certified Kubernetes Administrator (CKA)"
                      className="field-input w-full mt-1 text-xs"
                      required
                    />
                  </div>

                  <div className="border-2 border-dashed border-white/10 hover:border-violet-500/40 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-900/40">
                    <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-300 font-semibold">Click or drag & drop certificate document (PDF, PNG, JPG)</p>
                    <p className="text-[10px] text-slate-500 mt-1">Maximum size 10MB • Automated OCR & signature audit</p>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
                  >
                    {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <> <Zap className="w-3.5 h-3.5" /> Upload & Run AI Verification</>}
                  </button>
                </form>
              </div>

              {/* Certificate List */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">Verified Certificates & Licenses</h3>
                <div className="space-y-3">
                  {certList.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{cert.name}</h4>
                          <p className="text-[11px] text-slate-400">{cert.issuer} • Verified on {cert.date}</p>
                        </div>
                      </div>
                      <span className="badge badge-emerald text-[11px]">{cert.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Audit Sidebar */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-violet-400" /> GitHub Telemetry Audit
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI cross-references commit history, code structure, and pull request activity to prevent fake portfolio claims.
                </p>
                <div className="space-y-2.5 border-t border-white/10 pt-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Valid Commits</span>
                    <span className="font-bold text-slate-200">1,420</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Original Repositories</span>
                    <span className="font-bold text-slate-200">28</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Plagiarism Check</span>
                    <span className="font-bold text-emerald-400">0% Flagged</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300">Verified Recruiter Badge</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Verified candidates receive a green checkmark badge next to their name in Recruiter Search, granting top priority in headhunter results.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
