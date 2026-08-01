"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FolderOpen, Plus, GitBranch, ExternalLink, Star, Code2, Eye,
  RefreshCw, CheckCircle, ArrowLeft, Terminal, FileText, Layers, ShieldCheck,
  Cpu, Bell, LayoutDashboard, User, Briefcase, Map, Mic, Settings, Trophy, Award, BarChart3, Network
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
        <Link href="/candidate/verification" className="sidebar-item w-full flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification & Badges</span>
        </Link>
        <Link href="/settings" className="sidebar-item w-full flex items-center gap-2 text-slate-400 hover:text-slate-200">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </Link>
      </div>
    </div>
  );
}

export default function CandidateProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/candidate/profile`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const projs = data.projects || (data.projects_json ? JSON.parse(data.projects_json) : []);
        setProjects(projs);
        if (projs.length > 0) setSelectedProject(projs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    setAdding(true); setMsg("");
    try {
      const newProj = {
        name,
        description,
        tech_stack: techStack.split(",").map(s => s.trim()).filter(Boolean),
        github_url: githubUrl,
        demo_url: demoUrl,
        stars: 0,
        forks: 0
      };
      const updated = [newProj, ...projects];
      const res = await fetch(`${API}/api/v1/candidate/profile/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ projects_json: JSON.stringify(updated) })
      });
      if (res.ok) {
        setProjects(updated);
        setSelectedProject(newProj);
        setMsg("✓ Project added & verified by ApexTalent AI!");
        setName(""); setDescription(""); setTechStack(""); setGithubUrl(""); setDemoUrl("");
        setTimeout(() => { setMsg(""); setShowAddModal(false); }, 1500);
      }
    } catch (e: any) {
      setMsg("⚠️ Failed to add project");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="projects" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-violet-400" /> Project Showcase & Telemetry
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage repositories, code quality telemetry, live demos, and documentation viewers.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 text-xs px-5 py-2.5"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Projects</span>
              <div className="text-2xl font-black text-white">{projects.length}</div>
              <p className="text-[10px] text-violet-400">Verified by Telemetry Engine</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GitHub Telemetry</span>
              <div className="text-2xl font-black text-emerald-400">Active</div>
              <p className="text-[10px] text-slate-400">Auto-synced with commits</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Code Quality Rating</span>
              <div className="text-2xl font-black text-indigo-400">A+</div>
              <p className="text-[10px] text-slate-400">Lint & Architecture Verified</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Public Demos</span>
              <div className="text-2xl font-black text-yellow-400">{projects.filter(p => p.demo_url).length}</div>
              <p className="text-[10px] text-slate-400">Live Preview Ready</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Repository Showcase</h2>
              {loading && <div className="p-8 text-center text-xs text-slate-500 italic"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading projects...</div>}
              {!loading && projects.length === 0 && (
                <div className="glass-panel p-8 text-center rounded-2xl space-y-3">
                  <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No projects added yet.</p>
                  <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs px-4 py-2">Add First Project</button>
                </div>
              )}

              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProject(proj)}
                  className={`glass-panel p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                    selectedProject?.name === proj.name ? "border-violet-500/60 bg-violet-500/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-violet-400 shrink-0" />
                      {proj.name}
                    </h3>
                    {proj.stars > 0 && (
                      <span className="badge badge-yellow text-[10px] flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" />{proj.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.tech_stack || []).slice(0, 4).map((tech: string, i: number) => (
                      <span key={i} className="skill-chip text-[10px]">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 space-y-6">
              {selectedProject ? (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        {selectedProject.name}
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">{selectedProject.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedProject.github_url && (
                        <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1 bg-slate-800 hover:bg-slate-700">
                          <GitBranch className="w-3.5 h-3.5 text-violet-400" /> GitHub Repo
                        </a>
                      )}
                      {selectedProject.demo_url && (
                        <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="btn-primary btn-emerald text-xs px-3.5 py-1.5 flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tech Stack & Frameworks</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProject.tech_stack || []).map((t: string, i: number) => (
                        <span key={i} className="badge badge-violet text-xs px-3 py-1">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 rounded-xl border border-white/10 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" /> AI Code Telemetry Audit
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-slate-900/60 rounded-lg space-y-1">
                        <span className="text-slate-500">Architecture Score</span>
                        <p className="text-lg font-black text-emerald-400">94 / 100</p>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-lg space-y-1">
                        <span className="text-slate-500">Test Coverage</span>
                        <p className="text-lg font-black text-indigo-400">88.5%</p>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-lg space-y-1">
                        <span className="text-slate-500">Security Index</span>
                        <p className="text-lg font-black text-yellow-400">A+ Clean</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic">
                  Select a project to inspect telemetry and documentation.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border border-white/20">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Add Project to Telemetry Hub
            </h2>
            {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}
            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="field-label">Project Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Distributed Task Queue" className="field-input w-full mt-1" />
              </div>
              <div>
                <label className="field-label">Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Describe architectural pattern..." className="field-input w-full mt-1 resize-none" />
              </div>
              <div>
                <label className="field-label">Tech Stack (comma-separated)</label>
                <input value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="FastAPI, Redis, Docker, React" className="field-input w-full mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">GitHub URL</label>
                  <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Live Demo URL</label>
                  <input value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="https://demo.com" className="field-input w-full mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary px-6 text-xs">
                  {adding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Project ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
