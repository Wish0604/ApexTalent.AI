"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Trophy, ArrowLeft, GitBranch, FileText, Globe, Send, RefreshCw, CheckCircle2, Sparkles,
  LayoutDashboard, User, Network, Briefcase, FolderOpen, Map, Mic, Award, BarChart3, ShieldCheck, Cpu, Settings
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

export default function CandidateHackathonSubmissionPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("FastAPI, React, PostgreSQL, Docker");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !githubUrl) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const stackList = techStack.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(`${API_URL}/api/v1/organization/hackathon/1/submit-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_title: projectTitle,
          github_url: githubUrl,
          ppt_url: pptUrl || "https://slides.com/demo-pitch.pdf",
          demo_url: demoUrl || "https://demo-app.com",
          tech_stack: stackList,
          team_members: []
        })
      });
      if (!res.ok) throw new Error("Project submission failed");
      setSuccess(true);
      setProjectTitle("");
      setGithubUrl("");
      setPptUrl("");
      setDemoUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="hackathons" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" /> Hackathon Project Submission Hub
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Submit repositories, pitch decks, and live demo links for automated AI evaluation & judging.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 max-w-3xl">
            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Deliverables submitted successfully! The AI Evaluator agent will now score your repository.
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
              <div>
                <label className="field-label">Project Title *</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. ApexTalent Autonomous Copilot"
                  required
                  className="field-input w-full mt-1"
                />
              </div>

              <div>
                <label className="field-label">GitHub Repository URL *</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  required
                  className="field-input w-full mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Pitch Deck (PPT/PDF URL)</label>
                  <input
                    type="url"
                    value={pptUrl}
                    onChange={(e) => setPptUrl(e.target.value)}
                    placeholder="https://slides.com/demo.pdf"
                    className="field-input w-full mt-1"
                  />
                </div>

                <div>
                  <label className="field-label">Live Demo URL</label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://demo-app.com"
                    className="field-input w-full mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="FastAPI, React, Docker, Python"
                  className="field-input w-full mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Submit Deliverables <Send className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
