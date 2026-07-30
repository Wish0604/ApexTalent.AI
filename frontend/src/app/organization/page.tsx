"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users, Calendar, Trophy, BarChart2, ArrowLeft, Cpu,
  LayoutDashboard, GitBranch, Network, Zap, Award,
  RefreshCw, Plus, CheckCircle, Star, TrendingUp,
  ExternalLink, Target, Layers, UserCheck
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

import CustomLoader from "../components/CustomLoader";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Sidebar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",   label: "Dashboard",       icon: LayoutDashboard },
  { id: "members",     label: "Members",         icon: Users },
  { id: "events",      label: "Events",          icon: Calendar },
  { id: "hackathons",  label: "Hackathons",      icon: Trophy },
  { id: "teams",       label: "AI Team Builder", icon: Network },
  { id: "leaderboard", label: "Leaderboard",     icon: Award },
  { id: "projects",    label: "Project Gallery", icon: GitBranch },
  { id: "connect",     label: "Recruiter Connect",icon: UserCheck },
  { id: "analytics",   label: "Analytics",       icon: BarChart2 },
];

function Sidebar({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className="portal-sidebar">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="font-bold text-sm gradient-text-gold">Community HQ</span>
      </div>
      <div className="flex-1 py-3 px-3 space-y-0.5">
        <p className="section-title">Navigation</p>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`sidebar-item w-full ${active === t.id ? "active-indigo" : ""}`}>
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

export default function OrganizationDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState<any>(null);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [selectedHackathon, setSelectedHackathon] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [buildingTeams, setBuildingTeams] = useState(false);
  const [teamsBuilt, setTeamsBuilt] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  // Create Hackathon form
  const [hackTitle, setHackTitle] = useState("");
  const [hackDesc, setHackDesc] = useState("");
  const [hackPrize, setHackPrize] = useState("");
  const [hackTracks, setHackTracks] = useState("");
  const [creatingHack, setCreatingHack] = useState(false);
  const [hackCreated, setHackCreated] = useState(false);

  // Create Event form
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtType, setEvtType] = useState("workshop");
  const [creatingEvt, setCreatingEvt] = useState(false);
  const [evtCreated, setEvtCreated] = useState(false);

  const [teamSize, setTeamSize] = useState(3);

  const fetchAll = useCallback(async () => {
    try {
      const [dRes, hRes, eRes, mRes, rRes, aRes] = await Promise.all([
        fetch(`${API}/api/v1/organization/dashboard`),
        fetch(`${API}/api/v1/organization/hackathons`),
        fetch(`${API}/api/v1/organization/events`),
        fetch(`${API}/api/v1/recruiter/candidate-search`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "engineer developer" })
        }),
        fetch(`${API}/api/v1/organization/recruiter-connect`),
        fetch(`${API}/api/v1/organization/analytics`),
      ]);
      if (dRes.ok) setDashboard(await dRes.json());
      if (hRes.ok) setHackathons(await hRes.json());
      if (eRes.ok) setEvents(await eRes.json());
      if (mRes.ok) setMembers(await mRes.json());
      if (rRes.ok) setRecruiters(await rRes.json());
      if (aRes.ok) setAnalytics(await aRes.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createHackathon = async () => {
    if (!hackTitle || !hackDesc) return;
    setCreatingHack(true);
    try {
      const res = await fetch(`${API}/api/v1/organization/hackathon/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: hackTitle, description: hackDesc, prize_pool: hackPrize, max_team_size: teamSize,
          problem_tracks: hackTracks.split(",").map(s => s.trim()).filter(Boolean)
        })
      });
      if (res.ok) { setHackCreated(true); setHackTitle(""); setHackDesc(""); fetchAll(); }
    } catch (e) {}
    finally { setCreatingHack(false); }
  };

  const createEvent = async () => {
    if (!evtTitle || !evtDesc) return;
    setCreatingEvt(true);
    try {
      const res = await fetch(`${API}/api/v1/organization/event/create`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: evtTitle, description: evtDesc, event_type: evtType, is_online: true })
      });
      if (res.ok) { setEvtCreated(true); setEvtTitle(""); setEvtDesc(""); fetchAll(); }
    } catch (e) {}
    finally { setCreatingEvt(false); }
  };

  const buildTeams = async (hackId: number) => {
    setBuildingTeams(true); setTeamsBuilt(false);
    try {
      const res = await fetch(`${API}/api/v1/organization/hackathon/${hackId}/team-builder`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathon_id: hackId, team_size: teamSize })
      });
      if (res.ok) {
        setTeams(await res.json());
        setTeamsBuilt(true);
        fetchAll();
      }
    } catch (e) {}
    finally { setBuildingTeams(false); }
  };

  const loadParticipants = async (hackId: number) => {
    try {
      const res = await fetch(`${API}/api/v1/organization/hackathon/${hackId}/participants`);
      if (res.ok) setParticipants(await res.json());
    } catch (e) {}
  };

  const loadLeaderboard = async (hackId: number) => {
    try {
      const res = await fetch(`${API}/api/v1/organization/leaderboard/${hackId}`);
      if (res.ok) setLeaderboard(await res.json());
    } catch (e) {}
  };

  const evaluateHackathon = async (hackId: number) => {
    setEvaluating(true);
    try {
      const res = await fetch(`${API}/api/v1/organization/hackathon/${hackId}/evaluate`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setEvaluations(data.evaluations || []);
        await loadLeaderboard(hackId);
      }
    } catch (e) {}
    finally { setEvaluating(false); }
  };

  if (!dashboard) return (
    <div className="flex items-center justify-center min-h-screen bg-[#070b12]">
      <CustomLoader text="Loading Community" />
    </div>
  );

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const registrationData = (analytics?.monthly_registrations || []).map((v: number, i: number) => ({ month: monthLabels[i] || `M${i+1}`, count: v }));

  return (
    <div className="community-dashboard-bg relative min-h-screen">
      <div className="community-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex community-dashboard-container">
        <Sidebar active={tab} setActive={(t) => {
          setTab(t);
          if (t === "leaderboard" && hackathons[0]) loadLeaderboard(hackathons[0].id);
        }} />
        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">

        {/* ── DASHBOARD ───────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Community Command Center</h1>
              <p className="text-slate-400 text-sm mt-1">{dashboard.org_name} · {dashboard.org_type} · {dashboard.is_verified ? "✅ Verified" : "Pending"}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Community Members", value: dashboard.member_count,       icon: Users,    color: "text-indigo-400" },
                { label: "Events Hosted",      value: dashboard.events_hosted,      icon: Calendar, color: "text-violet-400" },
                { label: "Active Hackathons",  value: dashboard.active_hackathons,  icon: Trophy,   color: "text-yellow-400" },
                { label: "Recruiter Connect",  value: dashboard.recruiter_connections,icon: UserCheck,color: "text-emerald-400" },
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
                { label: "Community Reputation", value: `${dashboard.community_reputation_score}`, suffix: "/100", color: "text-indigo-400" },
                { label: "Innovation Index",      value: `${dashboard.innovation_index}`,           suffix: "/100", color: "text-violet-400" },
                { label: "Hiring Rate",           value: `${analytics?.hiring_rate || 34.5}%`, suffix: "",     color: "text-emerald-400" },
              ].map((m, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{m.label}</p>
                  <p className={`text-4xl font-black mt-2 ${m.color}`}>{m.value}<span className="text-lg text-slate-500">{m.suffix}</span></p>
                </div>
              ))}
            </div>

            {/* Top Skills */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <h2 className="font-bold text-slate-200 text-sm">Top Skills in Community</h2>
              <div className="flex flex-wrap gap-2">
                {(dashboard.top_skills_in_community || []).map((s: string, i: number) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>

            {/* Quick hackathon status */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-slate-200 text-sm">Hackathons</h2>
                <button onClick={() => setTab("hackathons")} className="text-xs text-indigo-400 hover:underline">Manage All →</button>
              </div>
              {hackathons.slice(0, 3).map((h: any) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{h.title}</p>
                    <p className="text-slate-500">{h.participant_count} participants · Teams: {h.teams?.length ?? 0}</p>
                  </div>
                  <span className={`badge ${h.status === "active" ? "badge-emerald" : h.status === "completed" ? "badge-slate" : "badge-yellow"}`}>{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MEMBERS ─────────────────────────────────────────────────── */}
        {tab === "members" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Community Members ({members.length})</h1>
            <div className="grid md:grid-cols-2 gap-4">
              {members.map((m: any, i: number) => (
                <div key={m.id} className="glass-card p-4 rounded-xl flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                    {m.full_name?.[0] ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 text-sm truncate">{m.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{m.title}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {(m.skills || []).slice(0, 3).map((s: string, j: number) => (
                        <span key={j} className="badge badge-indigo text-[9px]">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-indigo-400">{m.talent_score?.toFixed(0)}</p>
                    <p className="text-[10px] text-slate-500">Score</p>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="col-span-2 glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                  No members yet. Candidates who join hackathons appear here.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EVENTS ──────────────────────────────────────────────────── */}
        {tab === "events" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Events</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" />Create New Event</h2>
                {evtCreated && <div className="apex-alert-success text-xs">✅ Event created!</div>}
                <div className="space-y-3">
                  <div><label className="field-label">Event Title</label><input value={evtTitle} onChange={e => setEvtTitle(e.target.value)} className="field-input" placeholder="e.g., FastAPI Workshop" /></div>
                  <div><label className="field-label">Description</label><textarea value={evtDesc} onChange={e => setEvtDesc(e.target.value)} className="field-input min-h-24 resize-none" placeholder="What will participants learn?" /></div>
                  <div>
                    <label className="field-label">Event Type</label>
                    <select value={evtType} onChange={e => setEvtType(e.target.value)} className="field-input">
                      {["workshop","bootcamp","competition","conference","meetup"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <button onClick={createEvent} disabled={creatingEvt} className="btn-primary w-full" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                    {creatingEvt ? <RefreshCw className="w-4 h-4 animate-spin inline" /> : "Create Event"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-slate-200 text-sm">Upcoming Events ({events.length})</h2>
                {events.map((e: any) => (
                  <div key={e.id} className="glass-card p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-200 text-sm">{e.title}</p>
                      <span className="badge badge-indigo text-[9px]">{e.event_type}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{e.description}</p>
                    <p className="text-xs text-slate-500">{e.is_online ? "🌐 Online" : e.location || "TBD"}</p>
                  </div>
                ))}
                {events.length === 0 && <p className="text-xs text-slate-600 italic p-4">No events yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── HACKATHONS ───────────────────────────────────────────────── */}
        {tab === "hackathons" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hackathon Management</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-yellow-400" />Launch a Hackathon</h2>
                {hackCreated && <div className="apex-alert-success text-xs">✅ Hackathon created!</div>}
                <div className="space-y-3">
                  <div><label className="field-label">Hackathon Title</label><input value={hackTitle} onChange={e => setHackTitle(e.target.value)} className="field-input" placeholder="e.g., Global AI Challenge 2026" /></div>
                  <div><label className="field-label">Description</label><textarea value={hackDesc} onChange={e => setHackDesc(e.target.value)} className="field-input min-h-20 resize-none" placeholder="Overview, goals, and judging criteria..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="field-label">Prize Pool</label><input value={hackPrize} onChange={e => setHackPrize(e.target.value)} className="field-input" placeholder="$10,000" /></div>
                    <div><label className="field-label">Max Team Size</label><input type="number" value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value))} className="field-input" min={2} max={6} /></div>
                  </div>
                  <div><label className="field-label">Problem Tracks (comma-separated)</label><input value={hackTracks} onChange={e => setHackTracks(e.target.value)} className="field-input" placeholder="AI, FinTech, Healthcare" /></div>
                  <button onClick={createHackathon} disabled={creatingHack} className="btn-primary w-full" style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)", color: "#000" }}>
                    {creatingHack ? <RefreshCw className="w-4 h-4 animate-spin inline" /> : "🏆 Launch Hackathon"}
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                <h2 className="font-bold text-slate-200 text-sm">All Hackathons ({hackathons.length})</h2>
                {hackathons.map((h: any) => (
                  <div key={h.id} className="glass-card p-5 rounded-xl space-y-3 cursor-pointer" onClick={() => setSelectedHackathon(h)}>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-200 text-sm">{h.title}</p>
                      <span className={`badge ${h.status === "active" ? "badge-emerald" : h.status === "completed" ? "badge-slate" : "badge-yellow"}`}>{h.status}</span>
                    </div>
                    <p className="text-xs text-slate-400">{h.prize_pool} · {h.participant_count} participants</p>
                    <div className="flex flex-wrap gap-1">
                      {h.problem_tracks.map((t: string, i: number) => (
                        <span key={i} className="badge badge-indigo text-[9px]">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={e => { e.stopPropagation(); loadParticipants(h.id); }} className="btn-ghost text-xs px-3">View Participants</button>
                      <button onClick={e => { e.stopPropagation(); evaluateHackathon(h.id); }} disabled={evaluating} className="btn-primary text-xs px-3">
                        {evaluating ? <RefreshCw className="w-3 h-3 animate-spin inline" /> : "AI Evaluate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {participants.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h2 className="font-bold text-slate-200 text-sm">Registered Participants ({participants.length})</h2>
                <table className="apex-table">
                  <thead><tr><th>Name</th><th>Title</th><th>Talent Score</th><th>Team</th></tr></thead>
                  <tbody>
                    {participants.map((p: any) => (
                      <tr key={p.id}>
                        <td className="text-slate-200 font-medium">{p.full_name}</td>
                        <td>{p.title}</td>
                        <td><span className="text-indigo-400 font-bold">{p.talent_score?.toFixed(1)}</span></td>
                        <td>{p.team_name || <span className="text-slate-600 italic">Unassigned</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── AI TEAM BUILDER ──────────────────────────────────────────── */}
        {tab === "teams" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">AI Team Builder</h1>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Our AI Team Builder uses skill complementarity to form balanced teams — pairing Frontend, Backend, and ML/AI engineers for maximum synergy.
              </p>
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <label className="field-label">Team Size</label>
                  <input type="number" value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value))} className="field-input w-24" min={2} max={6} />
                </div>
                <div className="space-y-1 flex-1">
                  <label className="field-label">Select Hackathon</label>
                  <select className="field-input" onChange={e => setSelectedHackathon(hackathons.find(h => h.id === parseInt(e.target.value)))}>
                    <option value="">-- Select --</option>
                    {hackathons.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={() => selectedHackathon && buildTeams(selectedHackathon.id)}
                disabled={buildingTeams || !selectedHackathon}
                className="btn-primary w-full"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              >
                {buildingTeams ? <><RefreshCw className="w-4 h-4 animate-spin inline mr-2" />Building Teams...</> : "🤖 Build Balanced Teams"}
              </button>
            </div>

            {teamsBuilt && teams.length > 0 && (
              <div className="space-y-4 animate-slide-up">
                <p className="text-sm text-emerald-400 font-semibold">✅ {teams.length} team(s) formed successfully!</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {teams.map((t: any, i: number) => (
                    <div key={i} className="glass-card p-5 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-200 text-sm">{t.team_name}</h3>
                        {t.complementarity_score && (
                          <span className="text-xs text-indigo-400 font-bold">{t.complementarity_score}% synergy</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(t.members || []).map((m: any, j: number) => (
                          <div key={j} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg text-xs">
                            <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-[10px]">
                              {m.full_name?.[0] ?? "?"}
                            </div>
                            <span className="text-slate-300">{m.full_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!teamsBuilt && hackathons.length > 0 && hackathons[0].teams?.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Previously formed teams for {hackathons[0].title}:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {hackathons[0].teams.map((t: any, i: number) => (
                    <div key={i} className="glass-card p-5 rounded-xl space-y-2">
                      <h3 className="font-bold text-slate-200 text-sm">{t.team_name}</h3>
                      {(t.members || []).map((m: any, j: number) => (
                        <p key={j} className="text-xs text-slate-400">• {m.full_name}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LEADERBOARD ──────────────────────────────────────────────── */}
        {tab === "leaderboard" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hackathon Leaderboard</h1>
            <div className="flex gap-3 flex-wrap">
              {hackathons.map(h => (
                <button key={h.id} onClick={() => loadLeaderboard(h.id)} className="btn-ghost text-xs">{h.title}</button>
              ))}
            </div>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry: any, i: number) => (
                  <div key={i} className={`glass-panel p-5 rounded-2xl flex items-center gap-5 animate-slide-up ${i === 0 ? "border border-yellow-500/30" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${i === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : i === 1 ? "bg-slate-400/20 text-slate-300" : "bg-orange-500/15 text-orange-400"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{entry.team_name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(entry.strengths || []).map((s: string, j: number) => (
                          <span key={j} className="badge badge-emerald text-[9px]">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center shrink-0">
                      <div>
                        <p className="text-xl font-black text-white">{entry.overall_score?.toFixed(0)}</p>
                        <p className="text-[9px] text-slate-500">Overall</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-indigo-400">{entry.innovation_score?.toFixed(0)}</p>
                        <p className="text-[9px] text-slate-500">Innovation</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-emerald-400">{entry.code_quality_score?.toFixed(0)}</p>
                        <p className="text-[9px] text-slate-500">Code</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                Select a hackathon to view its leaderboard. Run AI Evaluation first if no scores exist.
              </div>
            )}
          </div>
        )}

        {/* ── PROJECT GALLERY ──────────────────────────────────────────── */}
        {tab === "projects" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Project Gallery</h1>
            {evaluations.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {evaluations.map((e: any, i: number) => (
                  <div key={i} className="glass-card p-5 rounded-xl space-y-3 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-200">{e.team}</h3>
                      <span className="text-xl font-black text-indigo-400">{e.evaluation?.overall_score?.toFixed(0)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        ["Architecture",  e.evaluation?.architecture_score,  "text-violet-400"],
                        ["Code Quality",  e.evaluation?.code_quality_score,  "text-emerald-400"],
                        ["Innovation",    e.evaluation?.innovation_score,    "text-yellow-400"],
                        ["Documentation", e.evaluation?.documentation_score, "text-indigo-400"],
                      ].map(([l, v, c], j) => (
                        <div key={j} className="p-2 bg-slate-900/50 rounded-lg">
                          <p className="text-slate-500">{l}</p>
                          <p className={`font-bold ${c}`}>{(v as number)?.toFixed(0)}</p>
                        </div>
                      ))}
                    </div>
                    {e.evaluation?.strengths?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {e.evaluation.strengths.slice(0, 2).map((s: string, j: number) => (
                          <span key={j} className="badge badge-emerald text-[9px]">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                No evaluations yet. Run AI Evaluation from the Hackathons tab to generate project scores.
              </div>
            )}
          </div>
        )}

        {/* ── RECRUITER CONNECT ────────────────────────────────────────── */}
        {tab === "connect" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Recruiter Connect</h1>
            <p className="text-sm text-slate-400">Companies interested in your community's talent pool and event sponsorships.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {recruiters.map((r: any, i: number) => (
                <div key={r.id} className="glass-card p-5 rounded-xl flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="h-12 w-12 bg-gradient-to-br from-emerald-600 to-indigo-600 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0">
                    {r.company_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-200">{r.company_name}</p>
                    <p className="text-xs text-slate-500">{r.department || "Talent Acquisition"}</p>
                    <div className="flex gap-2 mt-1">
                      {r.is_verified && <span className="badge badge-emerald text-[9px]">Verified</span>}
                      <span className="badge badge-indigo text-[9px]">Interest: {r.interest_level}</span>
                    </div>
                  </div>
                  <button className="btn-ghost text-xs px-3">Connect</button>
                </div>
              ))}
              {recruiters.length === 0 && (
                <div className="col-span-2 glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm">
                  No recruiter connections yet. Host hackathons to attract company partnerships.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ANALYTICS ───────────────────────────────────────────────── */}
        {tab === "analytics" && analytics && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Community Analytics</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm">Monthly Registrations</h2>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} />
                      <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <h2 className="font-bold text-slate-200 text-sm">Community Highlights</h2>
                  {[
                    { label: "Total Participants",   value: analytics.total_participants },
                    { label: "Events Hosted",        value: analytics.total_events },
                    { label: "Hiring Rate",          value: `${analytics.hiring_rate}%` },
                    { label: "Recruiter Engagement", value: analytics.recruiter_engagement },
                    { label: "Community Growth",     value: `+${analytics.community_growth_pct}%` },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl text-xs">
                      <span className="text-slate-400">{m.label}</span>
                      <span className="font-bold text-indigo-400">{m.value}</span>
                    </div>
                  ))}
                </div>
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <h2 className="font-bold text-slate-200 text-sm">Top Skills in Community</h2>
                  <div className="flex flex-wrap gap-2">
                    {analytics.top_skills.map((s: string, i: number) => (
                      <span key={i} className="skill-chip">{s}</span>
                    ))}
                  </div>
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
