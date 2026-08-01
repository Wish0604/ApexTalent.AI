"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase, Search, Users, BarChart2, ArrowLeft, Cpu, Bell,
  LayoutDashboard, Zap, Trophy, MessageSquare, RefreshCw, CheckCircle,
  TrendingUp, Target, Star, ChevronRight, ExternalLink, Send, Mic,
  Plus, Layers, Clock, Award, GitBranch, Bot, Filter, DollarSign, FileText, Radio, Code2
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  FunnelChart, Funnel, LabelList, PieChart, Pie, Cell
} from "recharts";

import CustomLoader from "../components/CustomLoader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Sidebar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",    label: "Dashboard",          icon: LayoutDashboard },
  { id: "discover",     label: "Talent Discovery",   icon: Search },
  { id: "intelligence", label: "Candidate Intel",    icon: Star },
  { id: "jobs",         label: "Job Management",     icon: Briefcase },
  { id: "challenges",   label: "Hiring Challenges",  icon: Zap, href: "/recruiter/challenges" },
  { id: "assessments",  label: "Online Assessments", icon: FileText, href: "/recruiter/assessments" },
  { id: "simulator",    label: "Live Code Simulator",icon: Cpu, href: "/recruiter/interview-simulator" },
  { id: "pair",         label: "Pair Programming",   icon: Code2, href: "/recruiter/pair-programming" },
  { id: "pipeline",     label: "Hiring Pipeline",    icon: Layers, href: "/recruiter/pipeline" },
  { id: "copilot",      label: "AI Copilot",         icon: Bot, href: "/recruiter/copilot" },
  { id: "team",         label: "Enterprise Team",    icon: Users, href: "/recruiter/team" },
  { id: "webhooks",     label: "Webhooks Dispatch",  icon: Radio, href: "/recruiter/webhooks" },
  { id: "executive",    label: "Executive Telemetry",icon: BarChart2, href: "/recruiter/executive-dashboard" },
];

function Sidebar({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className="portal-sidebar">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
      </div>
      <div className="flex-1 py-3 px-3 space-y-0.5">
        <p className="section-title">Navigation</p>
        {TABS.map(t => {
          const Icon = t.icon;
          if (t.href) {
            return (
              <Link key={t.id} href={t.href}
                className={`sidebar-item w-full ${active === t.id ? "active-emerald" : ""}`}>
                <Icon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>{t.label}</span>
              </Link>
            );
          }
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`sidebar-item w-full ${active === t.id ? "active-emerald" : ""}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="p-3 border-t border-white/5">
        <Link href="/" className="sidebar-item w-full flex">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portal</span>
        </Link>
      </div>
    </div>
  );
}

// ── Score Mini-Ring ────────────────────────────────────────────────────────────
function MiniRing({ score, color = "#10b981" }: { score: number; color?: string }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <svg width={44} height={44} className="-rotate-90">
      <circle cx={22} cy={22} r={r} fill="none" strokeWidth={5} stroke="rgba(255,255,255,0.06)" />
      <circle cx={22} cy={22} r={r} fill="none" strokeWidth={5} stroke={color}
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
    </svg>
  );
}

// ── Candidate Card ────────────────────────────────────────────────────────────
function CandidateCard({ cand, onSelect }: { cand: any; onSelect: (c: any) => void }) {
  const skills = Array.isArray(cand.skills) ? cand.skills : [];
  const scoreColor = cand.talent_score >= 90 ? "#10b981" : cand.talent_score >= 75 ? "#8b5cf6" : "#f59e0b";
  return (
    <div className="glass-card p-4 rounded-xl flex items-center gap-4 cursor-pointer" onClick={() => onSelect(cand)}>
      <div className="relative shrink-0">
        <MiniRing score={cand.talent_score} color={scoreColor} />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{cand.talent_score?.toFixed(0)}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-200 text-sm truncate">{cand.full_name}</p>
        <p className="text-xs text-slate-500 truncate">{cand.title}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {skills.slice(0, 3).map((s: string, i: number) => (
            <span key={i} className="badge badge-violet text-[9px]">{s}</span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0">
        {cand.match_score && <p className="text-xs text-emerald-400 font-bold">{cand.match_score}% match</p>}
        <span className={`badge text-[9px] ${cand.availability === "open" ? "badge-emerald" : "badge-yellow"}`}>
          {cand.availability === "open" ? "Open" : "Offers"}
        </span>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [intelligenceData, setIntelligenceData] = useState<any>(null);

  // Job form
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobReqs, setJobReqs] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [creatingJob, setCreatingJob] = useState(false);
  const [jobCreated, setJobCreated] = useState(false);

  // Challenge form
  const [chalTitle, setChalTitle] = useState("");
  const [chalDesc, setChalDesc] = useState("");
  const [chalType, setChalType] = useState("coding");
  const [creatingChal, setCreatingChal] = useState(false);
  const [chalCreated, setChalCreated] = useState(false);

  // Search & Sourcing
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [discoverSubTab, setDiscoverSubTab] = useState<"search" | "headhunter">("search");
  const [hhRoleTitle, setHhRoleTitle] = useState("FastAPI Backend Systems Architect");
  const [hhSkills, setHhSkills] = useState("FastAPI, Python, Docker, Redis");
  const [hhMinScore, setHhMinScore] = useState(80);
  const [hhSourcing, setHhSourcing] = useState(false);
  const [hhSourcedData, setHhSourcedData] = useState<any>(null);
  const [hhCopiedIdx, setHhCopiedIdx] = useState<number | null>(null);

  // Copilot
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; text: string }>>([
    { role: "ai", text: "👋 Hi! I'm your AI Recruiter Copilot. Ask me anything about your talent pipeline — e.g., 'Find top FastAPI engineers' or 'Who is available now?'" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Auth headers helper
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [dRes, jRes, cRes, hRes, pRes, aRes] = await Promise.all([
        fetch(`${API}/api/v1/recruiter/dashboard`, { headers }),
        fetch(`${API}/api/v1/recruiter/jobs`, { headers }),
        fetch(`${API}/api/v1/challenges/`, { headers }),
        fetch(`${API}/api/v1/candidate/hackathons`, { headers }),
        fetch(`${API}/api/v1/recruiter/pipeline`, { headers }),
        fetch(`${API}/api/v1/recruiter/analytics`, { headers }),
      ]);
      if (dRes.ok) setDashboard(await dRes.json());
      if (jRes.ok) setJobs(await jRes.json());
      if (cRes.ok) setChallenges(await cRes.json());
      if (hRes.ok) setHackathons(await hRes.json());
      if (pRes.ok) setPipeline(await pRes.json());
      if (aRes.ok) setAnalytics(await aRes.json());
    } catch (e) { console.error(e); }
  }, [getAuthHeaders]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const searchCandidates = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${API}/api/v1/recruiter/candidate-search`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ query })
      });
      if (res.ok) setCandidates(await res.json());
    } catch (e) {}
    finally { setSearching(false); }
  };

  const runHeadhunterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhRoleTitle.trim()) return;
    setHhSourcing(true);
    setHhSourcedData(null);
    try {
      const skills = hhSkills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${API}/api/v1/recruiter/headhunter/sourcing-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          role_title: hhRoleTitle,
          required_skills: skills,
          min_talent_score: hhMinScore
        })
      });
      if (res.ok) setHhSourcedData(await res.json());
    } catch (e) {}
    finally { setHhSourcing(false); }
  };

  const loadIntelligence = async (cand: any) => {
    setSelectedCandidate(cand);
    setTab("intelligence");
    try {
      const res = await fetch(`${API}/api/v1/recruiter/candidates/${cand.id}/intelligence`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setIntelligenceData(await res.json());
    } catch (e) {}
  };

  const createJob = async () => {
    if (!jobTitle || !jobDesc) return;
    setCreatingJob(true);
    try {
      const res = await fetch(`${API}/api/v1/recruiter/job/create`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          title: jobTitle, description: jobDesc,
          requirements: jobReqs.split(",").map(s => s.trim()).filter(Boolean),
          salary_range: jobSalary, location: jobLocation
        })
      });
      if (res.ok) { setJobCreated(true); setJobTitle(""); setJobDesc(""); setJobReqs(""); fetchAll(); }
    } catch (e) {}
    finally { setCreatingJob(false); }
  };

  const createChallenge = async () => {
    if (!chalTitle || !chalDesc) return;
    setCreatingChal(true);
    try {
      const res = await fetch(`${API}/api/v1/challenges/create`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ title: chalTitle, description: chalDesc, challenge_type: chalType, deadline_days: 7 })
      });
      if (res.ok) { setChalCreated(true); setChalTitle(""); setChalDesc(""); fetchAll(); }
    } catch (e) {}
    finally { setCreatingChal(false); }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/ai/copilot`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ message: userMsg, conversation_history: [] })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { role: "ai", text: data.reply }]);
      }
    } catch (e) {}
    finally { setChatLoading(false); }
  };

  const moveStage = async (appId: number, stage: string) => {
    try {
      await fetch(`${API}/api/v1/recruiter/pipeline/${appId}/move`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ stage })
      });
      fetchAll();
    } catch (e) {}
  };

  const PIPELINE_STAGES = [
    { key: "applied",    label: "Applied",     color: "border-slate-600" },
    { key: "ai_review",  label: "AI Review",   color: "border-violet-500/40" },
    { key: "challenge",  label: "Challenge",   color: "border-indigo-500/40" },
    { key: "interview",  label: "Interview",   color: "border-yellow-500/40" },
    { key: "offer",      label: "Offer",       color: "border-emerald-500/40" },
    { key: "hired",      label: "Hired",       color: "border-emerald-400" },
  ];

  if (!dashboard) return (
    <div className="flex items-center justify-center min-h-screen bg-[#070b12]">
      <CustomLoader text="Loading Recruiter" />
    </div>
  );

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container">
        <Sidebar active={tab} setActive={setTab} />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">

        {/* ── DASHBOARD ───────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Recruiter Command Center</h1>
              <p className="text-slate-400 text-sm mt-1">{dashboard.company_name} · {dashboard.is_verified ? "✅ Verified Partner" : "Pending Verification"}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Jobs",    value: dashboard.active_jobs,     icon: Briefcase, color: "text-emerald-400" },
                { label: "Total Applicants",value: dashboard.total_applications,icon: Users, color: "text-violet-400" },
                { label: "In Pipeline",    value: dashboard.shortlisted,      icon: Layers, color: "text-indigo-400" },
                { label: "Platform Talent",value: dashboard.total_candidates_in_platform,icon: Star, color: "text-yellow-400" },
              ].map((k, i) => (
                <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <k.icon className={`w-4 h-4 ${k.color}`} />
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{k.label}</span>
                  </div>
                  <div className="text-3xl font-black text-white">{k.value}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { label: "Hiring Success Rate", value: `${dashboard.hiring_success_rate}%`, color: "text-emerald-400" },
                { label: "Avg. Time to Hire",   value: `${dashboard.avg_time_to_hire} days`, color: "text-violet-400" },
                { label: "Offer Accept Rate",   value: `${dashboard.offer_acceptance_rate}%`, color: "text-yellow-400" },
              ].map((m, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{m.label}</p>
                  <p className={`text-4xl font-black mt-2 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Active Jobs quick list */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-200 text-sm">Active Jobs</h2>
                <button onClick={() => setTab("jobs")} className="text-xs text-violet-400 hover:underline">Manage All →</button>
              </div>
              {jobs.filter(j => j.is_active).slice(0, 4).map((j: any) => (
                <div key={j.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{j.title}</p>
                    <p className="text-slate-500">{j.experience_level} · {j.remote_type}</p>
                  </div>
                  <span className="badge badge-emerald">{j.applications_count} applicants</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TALENT DISCOVERY & OUTBOUND HEADHUNTER ─────────────────────────────── */}
        {tab === "discover" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-xl font-black text-white">Talent Discovery & Sourcing</h1>
                <p className="text-xs text-slate-400">Database talent search & autonomous AI outbound headhunter.</p>
              </div>

              {/* Simple Toggle Bar */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setDiscoverSubTab("search")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    discoverSubTab === "search" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🔍 Instant Talent Search
                </button>
                <button
                  onClick={() => setDiscoverSubTab("headhunter")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    discoverSubTab === "headhunter" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ AI Outbound Headhunter
                </button>
              </div>
            </div>

            {discoverSubTab === "search" ? (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <p className="text-xs text-slate-400">Natural language search — Try: "FastAPI engineers above 85 score" or "open to work ML engineers"</p>
                  <div className="flex gap-2">
                    <input value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && searchCandidates()}
                      placeholder='e.g., "Top Python engineers available now"'
                      className="field-input flex-1" />
                    <button onClick={searchCandidates} disabled={searching} className="btn-primary btn-emerald px-5">
                      {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {candidates.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">{candidates.length} candidate(s) found</p>
                    {candidates.map((c: any, i: number) => (
                      <div key={c.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                        <CandidateCard cand={c} onSelect={loadIntelligence} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                    Search for talent using natural language. Results will appear here.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
                  <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Autonomous Outbound Headhunter Sourcing
                  </h2>

                  <form onSubmit={runHeadhunterAgent} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="field-label">Target Role Title</label>
                      <input
                        type="text"
                        value={hhRoleTitle}
                        onChange={e => setHhRoleTitle(e.target.value)}
                        placeholder="e.g. Lead Backend Engineer"
                        className="field-input w-full mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="field-label">Required Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={hhSkills}
                        onChange={e => setHhSkills(e.target.value)}
                        placeholder="FastAPI, Docker, PyTorch"
                        className="field-input w-full mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="field-label">Min Talent Score: {hhMinScore}</label>
                      <input
                        type="range"
                        min="50"
                        max="99"
                        value={hhMinScore}
                        onChange={e => setHhMinScore(Number(e.target.value))}
                        className="w-full mt-2 accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={hhSourcing}
                        className="btn-primary px-6 py-2.5 text-xs flex items-center gap-2"
                      >
                        {hhSourcing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Run AI Headhunter <Zap className="w-3.5 h-3.5" /></>}
                      </button>
                    </div>
                  </form>
                </div>

                {hhSourcedData ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex justify-between items-center">
                      <span>✓ Sourced {hhSourcedData.candidates?.length || 0} Outbound Talent Matches</span>
                      <span>Target Role: {hhSourcedData.target_role}</span>
                    </div>

                    {hhSourcedData.candidates?.map((cand: any, idx: number) => (
                      <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white text-base">{cand.name}</h3>
                            <p className="text-xs text-slate-400">{cand.current_role} • {cand.location}</p>
                          </div>
                          <span className="badge badge-emerald text-xs font-black px-3 py-1">
                            {cand.talent_score} Talent Score
                          </span>
                        </div>

                        <p className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                          <span className="font-bold text-emerald-400 block mb-1">AI Sourcing Signal:</span>
                          {cand.ai_summary}
                        </p>

                        {cand.outbound_email_sequence && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-400">Personalized Outreach Email:</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(cand.outbound_email_sequence);
                                  setHhCopiedIdx(idx);
                                  setTimeout(() => setHhCopiedIdx(null), 2000);
                                }}
                                className="btn-primary text-[10px] px-3 py-1 flex items-center gap-1"
                              >
                                {hhCopiedIdx === idx ? "✓ Copied" : "Copy Email"}
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
                  <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                    Specify target role and tech stack above to trigger autonomous outbound sourcing.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CANDIDATE INTELLIGENCE ──────────────────────────────────── */}
        {tab === "intelligence" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setTab("discover")} className="btn-ghost text-xs">← Back</button>
              <h1 className="text-xl font-black text-white">
                {selectedCandidate ? `${selectedCandidate.full_name} — Intelligence Report` : "Candidate Intelligence"}
              </h1>
            </div>

            {!intelligenceData && !selectedCandidate && (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                Select a candidate from Talent Discovery to view their full intelligence report.
              </div>
            )}

            {intelligenceData && (
              <div className="space-y-6">
                {/* Header */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-emerald-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-black text-white">
                      {intelligenceData.full_name[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">{intelligenceData.full_name}</h2>
                      <p className="text-sm text-slate-400">{intelligenceData.title}</p>
                      <p className="text-xs text-slate-500">{intelligenceData.location}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {intelligenceData.badges.map((b: string, i: number) => (
                          <span key={i} className="badge badge-emerald text-[9px]">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 flex-wrap">
                    <div className="text-center">
                      <p className="text-3xl font-black text-white">{intelligenceData.talent_score.toFixed(1)}</p>
                      <p className="text-xs text-slate-500">Talent Score</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-black ${intelligenceData.fraud_check?.verdict === "Verified" ? "text-emerald-400" : "text-yellow-400"}`}>
                        {intelligenceData.fraud_check?.verdict}
                      </p>
                      <p className="text-xs text-slate-500">Authenticity</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${intelligenceData.ai_insight?.hire_recommendation?.includes("Strong") ? "text-emerald-400" : "text-yellow-400"}`}>
                        {intelligenceData.ai_insight?.hire_recommendation}
                      </p>
                      <p className="text-xs text-slate-500">AI Verdict</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary + Scores */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="font-bold text-slate-200 text-sm">AI Intelligence Summary</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">{intelligenceData.ai_insight?.summary}</p>
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 mb-2">Strengths</p>
                      {intelligenceData.ai_insight?.strengths?.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-slate-400">✓ {s}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-yellow-400 mb-2">Considerations</p>
                      {intelligenceData.ai_insight?.considerations?.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-slate-400">⚠ {s}</p>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm">Score Breakdown</h2>
                    {[
                      { label: "Coding",        v: intelligenceData.coding_score,        c: "progress-violet" },
                      { label: "Innovation",    v: intelligenceData.innovation_score,    c: "progress-emerald" },
                      { label: "Leadership",    v: intelligenceData.leadership_score,    c: "progress-indigo" },
                      { label: "Communication", v: intelligenceData.communication_score, c: "progress-yellow" },
                      { label: "Community",     v: intelligenceData.community_score,     c: "progress-violet" },
                      { label: "Authenticity",  v: intelligenceData.authenticity_score,  c: "progress-emerald" },
                    ].map((s, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">{s.label}</span>
                          <span className="text-slate-300 font-semibold">{(s.v || 0).toFixed(1)}</span>
                        </div>
                        <div className="progress-track">
                          <div className={`progress-fill ${s.c}`} style={{ width: `${s.v || 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills + Projects */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm">Tech Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {intelligenceData.skills.map((s: string, i: number) => (
                        <span key={i} className="skill-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm">Projects ({intelligenceData.projects.length})</h2>
                    {intelligenceData.projects.map((p: any, i: number) => (
                      <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-xs space-y-1">
                        <p className="font-bold text-slate-200">{p.name}</p>
                        <p className="text-slate-400">{p.description}</p>
                        <div className="flex flex-wrap gap-1">{(p.tech_stack||[]).map((t: string, j: number) => <span key={j} className="badge badge-slate text-[9px]">{t}</span>)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="glass-panel p-5 rounded-2xl flex gap-3 flex-wrap items-center">
                  <button className="btn-primary btn-emerald text-xs flex items-center gap-1.5" onClick={() => fetch(`${API}/api/v1/recruiter/candidate/${intelligenceData.id}/invite`, {method:"POST"})}>
                    <Send className="w-3.5 h-3.5" />Send Invite
                  </button>
                  <button 
                    className="btn-primary text-xs flex items-center gap-1.5 bg-violet-600/80 hover:bg-violet-600 text-white" 
                    onClick={() => {
                      const url = `${window.location.origin}/candidate?tab=interviews&candidate_id=${intelligenceData.id}`;
                      navigator.clipboard.writeText(url);
                      alert("✓ Voice Interview Link copied to clipboard:\n" + url);
                    }}
                  >
                    <Mic className="w-3.5 h-3.5" /> Copy Voice Interview Link
                  </button>
                  <button className="btn-ghost text-xs" onClick={() => setTab("pipeline")}>View in Pipeline →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── JOB MANAGEMENT ──────────────────────────────────────────── */}
        {tab === "jobs" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Job Management</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create form */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" />Post a New Job</h2>
                {jobCreated && <div className="apex-alert-success text-xs">✅ Job posted successfully!</div>}
                <div className="space-y-3">
                  <div><label className="field-label">Job Title</label><input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="field-input" placeholder="e.g., Senior Backend Engineer" /></div>
                  <div><label className="field-label">Description</label><textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} className="field-input min-h-24 resize-none" placeholder="Role summary and responsibilities..." /></div>
                  <div><label className="field-label">Required Skills (comma-separated)</label><input value={jobReqs} onChange={e => setJobReqs(e.target.value)} className="field-input" placeholder="Python, FastAPI, PostgreSQL" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="field-label">Salary Range</label><input value={jobSalary} onChange={e => setJobSalary(e.target.value)} className="field-input" placeholder="$120K–$150K" /></div>
                    <div><label className="field-label">Location</label><input value={jobLocation} onChange={e => setJobLocation(e.target.value)} className="field-input" placeholder="Remote" /></div>
                  </div>
                  <button onClick={createJob} disabled={creatingJob} className="btn-primary btn-emerald w-full">
                    {creatingJob ? <RefreshCw className="w-4 h-4 animate-spin inline" /> : "Post Job"}
                  </button>
                </div>
              </div>

              {/* Job list */}
              <div className="space-y-3">
                <h2 className="font-bold text-slate-200 text-sm">Posted Jobs ({jobs.length})</h2>
                {jobs.map((j: any) => (
                  <div key={j.id} className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-200 text-sm">{j.title}</p>
                      <span className={`badge ${j.is_active ? "badge-emerald" : "badge-slate"}`}>{j.is_active ? "Active" : "Closed"}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="badge badge-indigo text-[9px]">{j.experience_level}</span>
                      <span className="badge badge-violet text-[9px]">{j.remote_type}</span>
                    </div>
                    <p className="text-xs text-slate-500">{j.salary_range} · {j.location}</p>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{j.applications_count} applicants</span>
                      <button onClick={() => setTab("pipeline")} className="text-emerald-400 hover:underline">View Pipeline →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HIRING CHALLENGES ────────────────────────────────────────── */}
        {tab === "challenges" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hiring Challenges</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" />Create a Challenge</h2>
                {chalCreated && <div className="apex-alert-success text-xs">✅ Challenge created!</div>}
                <div className="space-y-3">
                  <div><label className="field-label">Challenge Title</label><input value={chalTitle} onChange={e => setChalTitle(e.target.value)} className="field-input" placeholder="e.g., Build a RAG API" /></div>
                  <div><label className="field-label">Description</label><textarea value={chalDesc} onChange={e => setChalDesc(e.target.value)} className="field-input min-h-24 resize-none" placeholder="Describe the task, expected deliverables..." /></div>
                  <div>
                    <label className="field-label">Challenge Type</label>
                    <select value={chalType} onChange={e => setChalType(e.target.value)} className="field-input">
                      {["coding","backend","frontend","ml","design","open"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <button onClick={createChallenge} disabled={creatingChal} className="btn-primary btn-emerald w-full">
                    {creatingChal ? <RefreshCw className="w-4 h-4 animate-spin inline" /> : "Create Challenge"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-slate-200 text-sm">Active Challenges ({challenges.length})</h2>
                {challenges.map((c: any) => (
                  <div key={c.id} className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-200 text-sm">{c.title}</p>
                      <span className="badge badge-yellow text-[9px]">{c.challenge_type.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                    <p className="text-xs text-slate-500">Deadline: {c.deadline_days} days</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HACKATHON HUB ────────────────────────────────────────────── */}
        {tab === "hackathons" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hackathon Hub</h1>
            <p className="text-sm text-slate-400">Discover top performers from community hackathons and invite them to your pipeline.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {hackathons.map((h: any, i: number) => (
                <div key={h.id} className="glass-panel p-6 rounded-2xl space-y-3 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm">{h.title}</h3>
                    <span className={`badge ${h.status === "active" ? "badge-emerald" : "badge-slate"}`}>{h.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{h.description}</p>
                  {h.prize_pool && <p className="text-xs text-yellow-400 font-semibold flex items-center gap-1"><Trophy className="w-3 h-3" />{h.prize_pool}</p>}
                  <button onClick={() => setTab("discover")} className="btn-primary btn-emerald w-full text-xs">
                    Find Top Performers →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HIRING PIPELINE ──────────────────────────────────────────── */}
        {tab === "pipeline" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hiring Pipeline</h1>
            {!pipeline ? (
              <div className="flex justify-center py-20"><RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" /></div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {PIPELINE_STAGES.map(stage => (
                  <div key={stage.key} className={`pipeline-stage border ${stage.color}`} style={{ minWidth: 220 }}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-slate-300">{stage.label}</p>
                      <span className="badge badge-slate">{(pipeline[stage.key] || []).length}</span>
                    </div>
                    {(pipeline[stage.key] || []).map((card: any) => (
                      <div key={card.application_id} className="pipeline-card">
                        <p className="text-xs font-bold text-slate-200">{card.candidate_name}</p>
                        <p className="text-[10px] text-slate-500">{card.job_title}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] text-violet-400 font-semibold">{card.talent_score?.toFixed(0)} score</span>
                          <span className="text-[10px] text-emerald-400">{card.match_percentage?.toFixed(0)}% match</span>
                        </div>
                        {stage.key !== "hired" && stage.key !== "rejected" && (
                          <button onClick={() => {
                            const nextIdx = PIPELINE_STAGES.findIndex(s => s.key === stage.key) + 1;
                            if (nextIdx < PIPELINE_STAGES.length) moveStage(card.application_id, PIPELINE_STAGES[nextIdx].key);
                          }} className="mt-2 text-[10px] text-slate-500 hover:text-emerald-400 transition">
                            Advance → {PIPELINE_STAGES[PIPELINE_STAGES.findIndex(s => s.key === stage.key) + 1]?.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AI COPILOT ──────────────────────────────────────────────── */}
        {tab === "copilot" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">AI Recruiter Copilot</h1>
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ height: "70vh" }}>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 bg-emerald-600/20 border border-emerald-500/20 rounded-full flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <Bot className="w-3 h-3 text-emerald-400" />
                      </div>
                    )}
                    <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-start gap-2 animate-fade-in">
                    <div className="w-6 h-6 bg-emerald-600/20 border border-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="chat-bubble-ai flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/5 flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Ask about candidates, skills, pipeline..." className="field-input flex-1" />
                <button onClick={sendChat} disabled={chatLoading} className="btn-primary btn-emerald px-4">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ───────────────────────────────────────────────── */}
        {tab === "analytics" && analytics && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hiring Analytics</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm">Hiring Funnel</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.funnel} layout="vertical">
                      <XAxis type="number" stroke="#475569" fontSize={10} />
                      <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={10} width={70} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-panel p-6 rounded-2xl">
                  <h2 className="font-bold text-slate-200 text-sm mb-4">Top Skills in Demand</h2>
                  <div className="flex flex-wrap gap-2">
                    {analytics.top_skills_in_demand.map((s: string, i: number) => (
                      <span key={i} className="skill-chip">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <h2 className="font-bold text-slate-200 text-sm mb-4">Source of Hire</h2>
                  {analytics.source_of_hire.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-slate-400 w-28">{s.source}</span>
                      <div className="flex-1 progress-track">
                        <div className="progress-fill progress-emerald" style={{ width: `${s.percentage}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-8 text-right">{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      </div>
    </div>
  );
}
