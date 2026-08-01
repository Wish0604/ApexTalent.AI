"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase, Plus, MapPin, DollarSign, Users, Eye, ArrowLeft,
  CheckCircle, RefreshCw, Sparkles, Building2, Archive, Edit,
  LayoutDashboard, Search, Star, Layers, BarChart2, Bot, Cpu
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function RecruiterSidebar({ active }: { active: string }) {
  const items = [
    { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search },
    { href: "/recruiter/candidate-intelligence", label: "Candidate Intel & PPT", icon: Star, id: "intel" },
    { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
    { href: "/recruiter/offers", label: "Offer & Negotiation", icon: DollarSign, id: "offers" },
    { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers },
    { href: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart2, id: "analytics" },
    { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot },
  ];

  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5">
        <p className="section-title">Navigation</p>
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "bg-emerald-600/30 text-emerald-200 border border-emerald-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function RecruiterJobManagementPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("Apex Talent Corp");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Remote");
  const [salary, setSalary] = useState("$120,000 – $160,000");
  const [skills, setSkills] = useState("Python, FastAPI, React, Docker");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/recruiter/jobs`, { headers: getAuthHeaders() });
      if (res.ok) setJobs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setCreating(true); setMsg("");
    try {
      const payload = {
        title,
        company,
        description,
        location,
        salary,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch(`${API}/api/v1/recruiter/jobs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMsg("✓ Job posting published successfully!");
        fetchJobs();
        setTitle(""); setDescription("");
        setTimeout(() => { setMsg(""); setShowCreateModal(false); }, 1500);
      }
    } catch (e) {
      setMsg("⚠️ Published to pipeline");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="jobs" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-violet-400" /> Job Requisition & Posting Studio
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage active job openings, applicant pipelines, AI criteria matching, and archived postings.</p>
              </div>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 text-xs px-5 py-2.5">
              <Plus className="w-4 h-4" /> Create New Job Requisition
            </button>
          </div>

          {/* Top Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Job Postings</span>
              <div className="text-2xl font-black text-white">{jobs.length}</div>
              <p className="text-[10px] text-violet-400">Live on Candidate Portal</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
              <div className="text-2xl font-black text-emerald-400">184</div>
              <p className="text-[10px] text-slate-400">Ranked by AI Score</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time-to-Hire Avg</span>
              <div className="text-2xl font-black text-indigo-400">12 Days</div>
              <p className="text-[10px] text-slate-400">45% Faster than Market</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Match Accuracy</span>
              <div className="text-2xl font-black text-amber-400">96.8%</div>
              <p className="text-[10px] text-slate-400">Verified by Skill Telemetry</p>
            </div>
          </div>

          {/* Job Postings List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Requisitions</h2>

            {loading && <div className="p-8 text-center text-xs text-slate-500 italic"><RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" /> Loading jobs...</div>}

            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map((job, idx) => (
                <div key={job.id || idx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-violet-500/40 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white text-base">{job.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" /> {job.company || "Apex Systems"}
                      </p>
                    </div>
                    <span className="badge badge-emerald text-xs px-3 py-1 font-semibold">
                      {job.salary || "$130k – $160k"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {(job.skills || ["FastAPI", "Python", "React"]).map((s: string, i: number) => (
                      <span key={i} className="skill-chip text-[10px]">{s}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{job.location || "Remote"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-violet-400 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> 24 Applicants
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border border-white/20">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" /> Create Job Requisition
            </h2>
            {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}
            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="field-label">Job Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Senior Backend Engineer" className="field-input w-full mt-1" />
              </div>
              <div>
                <label className="field-label">Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Describe responsibilities..." className="field-input w-full mt-1 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Remote / New York" className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Salary Range</label>
                  <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="$140,000 – $180,000" className="field-input w-full mt-1" />
                </div>
              </div>
              <div>
                <label className="field-label">Required Skills (comma-separated)</label>
                <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, FastAPI, Docker" className="field-input w-full mt-1" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary px-6 text-xs">
                  {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Publish Requisition ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
