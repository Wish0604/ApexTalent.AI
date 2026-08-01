"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  User, Cpu, GitBranch, GitBranch as Github, FileText, Briefcase, Award, CheckCircle,
  RefreshCw, Network, ArrowLeft, Bell, LayoutDashboard, Map, Compass,
  Trophy, FolderOpen, BookOpen, Mic, ChevronRight, Star,
  TrendingUp, Target, Zap, Clock, Send, ExternalLink, ShieldCheck, Settings
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line
} from "recharts";

import CustomLoader from "../components/CustomLoader";
import { useTabSwitchPrevention, TabSwitchWarningBanner } from "../components/TabSwitchPrevention";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Talent Score Ring ─────────────────────────────────────────────────────────
function TalentScoreRing({ score }: { score: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const pct = Math.min(score / 100, 1);
  const color = score >= 90 ? "#10b981" : score >= 75 ? "#8b5cf6" : "#f59e0b";
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={r} fill="none" strokeWidth={10} stroke="rgba(255,255,255,0.06)" />
        <circle cx={70} cy={70} r={r} fill="none" strokeWidth={10} stroke={color}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-black text-white">{score.toFixed(0)}</div>
        <div className="text-[10px] text-slate-500 font-medium">TALENT</div>
      </div>
    </div>
  );
}

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color = "bg-violet-500" }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-semibold">{value.toFixed(1)}</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",  label: "Dashboard",       icon: LayoutDashboard },
  { id: "profile",    label: "Profile Hub",      icon: User },
  { id: "skills",     label: "Skill Intelligence",icon: Network },
  { id: "jobs",       label: "Job Matches",      icon: Briefcase },
  { id: "hackathons", label: "Hackathons",       icon: Trophy },
  { id: "projects",   label: "Projects",         icon: FolderOpen },
  { id: "resume",     label: "Resume & Portfolio",icon: FileText },
  { id: "career",     label: "Career Guidance",  icon: Map },
  { id: "interviews", label: "AI Interviews",    icon: Mic },
];

function Sidebar({ active, setActive, unread }: { active: string; setActive: (t: string) => void; unread: number }) {
  return (
    <div className="portal-sidebar">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-violet-600/20 rounded-lg border border-violet-500/30">
          <Cpu className="w-4 h-4 text-violet-400" />
        </div>
        <span className="font-bold text-sm gradient-text-violet">Candidate Hub</span>
        <div className="ml-auto relative">
          <Bell className="w-4 h-4 text-slate-500" />
          {unread > 0 && <div className="notif-dot absolute -top-1 -right-1" />}
        </div>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5">
        <p className="section-title">Navigation</p>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`sidebar-item w-full ${active === t.id ? "active" : ""}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link href="/candidate/verification" className="sidebar-item w-full flex text-emerald-400 hover:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification & Badges</span>
        </Link>
        <Link href="/settings" className="sidebar-item w-full flex text-slate-400 hover:text-slate-200">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </Link>
        <Link href="/" className="sidebar-item w-full flex">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CandidateDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [careerGuidance, setCareerGuidance] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  // AI Sync state
  const [gitUsername, setGitUsername] = useState("");
  const [resumeUrl, setResumeUrl] = useState("s3://resumes/candidate.pdf");
  const [syncingGit, setSyncingGit] = useState(false);
  const [parsingResume, setParsingResume] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [error, setError] = useState("");
  const [applyingJob, setApplyingJob] = useState<number | null>(null);
  const [applySuccess, setApplySuccess] = useState<number | null>(null);

  // Interview state
  const [activeInterview, setActiveInterview] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<string>("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  // Voice AI & Proctored Telemetry State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { tabSwitchCount } = useTabSwitchPrevention();

  const speakQuestion = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your response!");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) setAnswer(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    setIsListening(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Auth headers helper
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  // Profile Edit state
  const [editMode, setEditMode] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editAvailability, setEditAvailability] = useState("open");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [pRes, jRes, hRes, iRes, nRes, aRes] = await Promise.all([
        fetch(`${API}/api/v1/candidate/profile`, { headers }),
        fetch(`${API}/api/v1/candidate/jobs`, { headers }),
        fetch(`${API}/api/v1/candidate/hackathons`, { headers }),
        fetch(`${API}/api/v1/candidate/interviews`, { headers }),
        fetch(`${API}/api/v1/notifications/`, { headers }),
        fetch(`${API}/api/v1/candidate/applications`, { headers }),
      ]);
      if (pRes.ok) {
        const prof = await pRes.json();
        setProfile(prof);
        setEditFullName(prof.full_name || "");
        setEditTitle(prof.title || "");
        setEditBio(prof.bio || "");
        setEditLocation(prof.location || "");
        setEditGithub(prof.github_username || "");
        setEditLinkedin(prof.linkedin_url || "");
        setEditSalary(prof.salary_expectation || "");
        setEditAvailability(prof.availability || "open");
      }
      if (jRes.ok) setJobs(await jRes.json());
      if (hRes.ok) setHackathons(await hRes.json());
      if (iRes.ok) setInterviews(await iRes.json());
      if (nRes.ok) { const n = await nRes.json(); setNotifications(n); setUnread(n.filter((x: any) => !x.is_read).length); }
      if (aRes.ok) setApplications(await aRes.json());
    } catch (e) { console.error(e); }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get("token");
      const connectedParam = params.get("github_connected");
      if (tokenParam) {
        localStorage.setItem("apex_token", tokenParam);
      }
      if (connectedParam === "true") {
        setProfileSavedMsg("✓ GitHub OAuth 2.0 Connected! Live telemetry scores & repositories synchronized.");
        setTimeout(() => setProfileSavedMsg(""), 6000);
      }
    }
    fetchAll();
  }, [fetchAll]);

  const saveProfile = async () => {
    setSavingProfile(true); setProfileSavedMsg(""); setError("");
    try {
      const headers = { "Content-Type": "application/json", ...getAuthHeaders() };
      const res = await fetch(`${API}/api/v1/candidate/profile/edit`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          full_name: editFullName,
          title: editTitle,
          bio: editBio,
          location: editLocation,
          github_username: editGithub.replace("https://github.com/", "").replace("github.com/", "").trim(),
          linkedin_url: editLinkedin,
          salary_expectation: editSalary,
          availability: editAvailability
        })
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const updated = await res.json();
      setProfile(updated);
      setProfileSavedMsg("✓ Profile updated & saved to live database!");
      setTimeout(() => setProfileSavedMsg(""), 3500);
      setEditMode(false);
      fetchAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const syncGitHub = async () => {
    if (!gitUsername) return;
    setSyncingGit(true); setError("");
    try {
      const res = await fetch(`${API}/api/v1/ai/sync-github`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ github_username: gitUsername })
      });
      if (!res.ok) throw new Error("GitHub sync failed");
      setProfile(await res.json());
      fetchAll();
    } catch (e: any) { setError(e.message); }
    finally { setSyncingGit(false); }
  };

  const syncResume = async () => {
    setParsingResume(true); setError("");
    try {
      const res = await fetch(`${API}/api/v1/ai/sync-resume`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ resume_url: resumeUrl })
      });
      if (!res.ok) throw new Error("Resume parse failed");
      setProfile(await res.json());
      fetchAll();
    } catch (e: any) { setError(e.message); }
    finally { setParsingResume(false); }
  };

  const applyToJob = async (jobId: number) => {
    setApplyingJob(jobId);
    try {
      const res = await fetch(`${API}/api/v1/candidate/apply/${jobId}`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      if (res.ok) { setApplySuccess(jobId); fetchAll(); }
    } catch (e) {}
    finally { setApplyingJob(null); }
  };

  const joinHackathon = async (hackId: number) => {
    try {
      await fetch(`${API}/api/v1/candidate/hackathon/${hackId}/join`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      fetchAll();
    } catch (e) {}
  };

  const generateResume = async () => {
    setGeneratingResume(true);
    try {
      const res = await fetch(`${API}/api/v1/ai/generate-resume`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ target_role: profile?.title })
      });
      if (res.ok) setGeneratedResume(await res.json());
    } catch (e) {}
    finally { setGeneratingResume(false); }
  };

  const loadCareerGuidance = async () => {
    if (careerGuidance) return;
    try {
      const res = await fetch(`${API}/api/v1/candidate/career-guidance`, {
        headers: getAuthHeaders()
      });
      if (res.ok) setCareerGuidance(await res.json());
    } catch (e) {}
  };

  const scheduleInterview = async (type = "mock") => {
    setSchedulingInterview(true);
    try {
      const res = await fetch(`${API}/api/v1/interviews/schedule`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ interview_type: type })
      });
      if (res.ok) {
        const data = await res.json();
        const startRes = await fetch(`${API}/api/v1/interviews/${data.id}/start`, {
          method: "POST",
          headers: getAuthHeaders()
        });
        if (startRes.ok) {
          const started = await startRes.json();
          setActiveInterview({ ...data, current_question: started.first_question, total: started.total_questions });
          setCurrentQ(0); setAnswer(""); setInterviewComplete(false); setInterviewFeedback("");
          setTab("interviews");
        }
      }
    } catch (e) {}
    finally { setSchedulingInterview(false); }
  };

  const submitAnswer = async () => {
    if (!activeInterview || !answer.trim()) return;
    try {
      const res = await fetch(`${API}/api/v1/interviews/${activeInterview.id}/answer`, {
        method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ question_index: currentQ, answer })
      });
      if (res.ok) {
        const data = await res.json();
        setInterviewFeedback(data.instant_feedback || "");
        if (data.is_complete) {
          setInterviewComplete(true);
          fetchAll();
        } else if (data.next_question) {
          setActiveInterview((prev: any) => ({ ...prev, current_question: data.next_question }));
          setCurrentQ(currentQ + 1);
          setAnswer("");
        }
      }
    } catch (e) {}
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen bg-[#070b12]">
      <CustomLoader text="Loading Profile" />
    </div>
  );

  const skills = JSON.parse(profile.skills_json || "[]");
  const projects = JSON.parse(profile.projects_json || "[]");
  const badges = JSON.parse(profile.verification_badges_json || "[]");
  const education = JSON.parse(profile.education_json || "[]");
  const experience = JSON.parse(profile.experience_json || "[]");
  const hackResults = JSON.parse(profile.hackathon_results_json || "[]");
  const radarData = [
    { subject: "Coding",        A: profile.coding_score },
    { subject: "Innovation",    A: profile.innovation_score },
    { subject: "Leadership",    A: profile.leadership_score },
    { subject: "Communication", A: profile.communication_score },
    { subject: "Community",     A: profile.community_score },
    { subject: "Consistency",   A: profile.consistency_score },
  ];

  return (
    <div className="candidate-dashboard-bg relative min-h-screen">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container">
        <Sidebar active={tab} setActive={(t) => { setTab(t); if (t === "career") loadCareerGuidance(); }} unread={unread} />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">

        {/* ── DASHBOARD ───────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Welcome back, {profile.full_name.split(" ")[0]} 👋</h1>
              <p className="text-slate-400 text-sm mt-1">Your AI Talent Profile is live and being matched to opportunities.</p>
            </div>

            {error && <div className="apex-alert-error">{error}</div>}

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Talent Score", value: profile.talent_score.toFixed(1), icon: Star, color: "text-violet-400" },
                { label: "Job Matches",  value: jobs.length, icon: Briefcase, color: "text-emerald-400" },
                { label: "Applications", value: applications.length, icon: Send, color: "text-indigo-400" },
                { label: "Notifications", value: unread, icon: Bell, color: "text-yellow-400" },
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

            {/* Profile + Score */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg shadow-violet-500/30">
                    {profile.full_name[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base">{profile.full_name}</h2>
                    <p className="text-xs text-slate-400">{profile.title}</p>
                    <p className="text-xs text-slate-500">{profile.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((b: string, i: number) => (
                    <span key={i} className="badge badge-emerald flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />{b}
                    </span>
                  ))}
                </div>
                <div className="divider" />
                <div className="space-y-2.5">
                  <ScoreBar label="Coding" value={profile.coding_score} color="progress-violet" />
                  <ScoreBar label="Innovation" value={profile.innovation_score} color="progress-emerald" />
                  <ScoreBar label="Leadership" value={profile.leadership_score} color="progress-indigo" />
                  <ScoreBar label="Communication" value={profile.communication_score} color="progress-yellow" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">AI Talent Score™</p>
                <TalentScoreRing score={profile.talent_score} />
                <div className="grid grid-cols-2 gap-3 mt-4 w-full text-center text-xs">
                  <div className="bg-slate-900/60 rounded-lg p-2">
                    <p className="text-slate-500">Authenticity</p>
                    <p className="font-bold text-emerald-400">{profile.authenticity_score?.toFixed(0) ?? "99"}%</p>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-2">
                    <p className="text-slate-500">Consistency</p>
                    <p className="font-bold text-violet-400">{profile.consistency_score?.toFixed(0) ?? "88"}%</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-400" /> Recent Updates
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 6).map((n: any) => (
                    <div key={n.id} className={`p-3 rounded-lg border text-xs space-y-0.5 ${n.is_read ? "border-slate-900 bg-slate-950/30" : "border-violet-500/20 bg-violet-500/5"}`}>
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <p className="text-slate-500 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-xs text-slate-600 italic">No notifications yet.</p>}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200">⚡ Quick Actions</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="field-label flex items-center justify-between">
                    <span className="flex items-center gap-1"><Github className="w-3 h-3 text-violet-400" />GitHub OAuth</span>
                  </label>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`${API}/api/v1/auth/github/url`);
                        if (res.ok) {
                          const data = await res.json();
                          if (data.auth_url) {
                            window.location.href = data.auth_url;
                            return;
                          }
                        }
                      } catch (e) {}
                      window.location.href = `${API}/api/v1/auth/github`;
                    }}
                    className="btn-primary bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs w-full py-2 flex items-center justify-center gap-1.5 text-violet-200 transition"
                  >
                    <Github className="w-3.5 h-3.5" /> Connect GitHub OAuth 2.0
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="field-label flex items-center gap-1"><FileText className="w-3 h-3 text-emerald-400" />Resume Parse</label>
                  <div className="flex gap-2">
                    <input value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} placeholder="s3://..." className="field-input text-xs" />
                    <button onClick={syncResume} disabled={parsingResume} className="btn-primary btn-emerald px-3 text-xs shrink-0">
                      {parsingResume ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Parse"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="field-label flex items-center gap-1"><Mic className="w-3 h-3 text-indigo-400" />Mock Interview</label>
                  <button onClick={() => scheduleInterview("mock")} disabled={schedulingInterview} className="btn-primary w-full text-xs">
                    {schedulingInterview ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Start Mock Interview →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE HUB ─────────────────────────────────────────────── */}
        {tab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-white">Profile Hub</h1>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs font-semibold text-violet-200 transition"
              >
                {editMode ? "Cancel Editing" : "✏️ Edit Profile Data"}
              </button>
            </div>

            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-semibold animate-in fade-in">
                {profileSavedMsg}
              </div>
            )}

            {/* Live Edit Profile Form */}
            {editMode && (
              <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in fade-in">
                <h2 className="font-bold text-slate-200 text-sm border-b border-white/10 pb-2">Edit Live Database Profile</h2>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="field-label">Full Name</label>
                    <input value={editFullName} onChange={e => setEditFullName(e.target.value)} className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Professional Title</label>
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Location</label>
                    <input value={editLocation} onChange={e => setEditLocation(e.target.value)} className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">GitHub Username</label>
                    <input value={editGithub} onChange={e => setEditGithub(e.target.value)} placeholder="username" className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">LinkedIn URL</label>
                    <input value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Salary Expectation</label>
                    <input value={editSalary} onChange={e => setEditSalary(e.target.value)} placeholder="$120,000 / yr" className="field-input w-full mt-1" />
                  </div>
                  <div>
                    <label className="field-label">Availability</label>
                    <select value={editAvailability} onChange={e => setEditAvailability(e.target.value)} className="field-input w-full mt-1 bg-slate-900 text-white">
                      <option value="open">Open to Work</option>
                      <option value="open_to_offers">Open to Offers</option>
                      <option value="not_looking">Not Looking</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label">Bio / Summary</label>
                    <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="field-input w-full mt-1" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">Cancel</button>
                  <button onClick={saveProfile} disabled={savingProfile} className="btn-primary px-6 text-xs">
                    {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Changes to Database ✓"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Identity */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm">Identity</h2>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-black text-white">
                    {profile.full_name ? profile.full_name[0] : "C"}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{profile.full_name}</h3>
                    <p className="text-sm text-slate-400">{profile.title}</p>
                    <p className="text-xs text-slate-500">{profile.location}</p>
                  </div>
                </div>
                {profile.bio && <p className="text-sm text-slate-400 leading-relaxed">{profile.bio}</p>}
                <div className="flex flex-wrap gap-2">
                  {badges.map((b: string, i: number) => (
                    <span key={i} className="badge badge-emerald flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />{b}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  {profile.github_username && <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-violet-400"><Github className="w-3 h-3" />{profile.github_username}</a>}
                  {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-violet-400"><ExternalLink className="w-3 h-3" />LinkedIn</a>}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`badge ${profile.availability === "open" ? "badge-emerald" : "badge-yellow"}`}>
                    {profile.availability === "open" ? "🟢 Open to Work" : "🟡 Open to Offers"}
                  </span>
                  {profile.salary_expectation && <span className="text-slate-500">{profile.salary_expectation}</span>}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <h2 className="font-bold text-slate-200 text-sm flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-indigo-400" />Education</h2>
                  {education.map((e: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-xs space-y-0.5">
                      <p className="font-semibold text-slate-200">{e.degree}</p>
                      <p className="text-slate-400">{e.institution}</p>
                      <p className="text-slate-500">Class of {e.year}</p>
                    </div>
                  ))}
                  {education.length === 0 && <p className="text-xs text-slate-600 italic">Sync your resume to populate education.</p>}
                </div>
                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <h2 className="font-bold text-slate-200 text-sm flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-400" />Experience</h2>
                  {experience.map((e: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <p className="font-semibold text-slate-200">{e.role}</p>
                        <span className="badge badge-slate">{e.years}y</span>
                      </div>
                      <p className="text-violet-400 font-medium">{e.company}</p>
                      <p className="text-slate-400 leading-relaxed">{e.description}</p>
                    </div>
                  ))}
                  {experience.length === 0 && <p className="text-xs text-slate-600 italic">Sync your resume to populate experience.</p>}
                </div>
              </div>
            </div>

            {/* Hackathon Results */}
            {hackResults.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" />Hackathon Results</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {hackResults.map((h: any, i: number) => (
                    <div key={i} className="p-4 glass-card rounded-xl flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${h.rank === 1 ? "bg-yellow-500/20 text-yellow-400" : h.rank === 2 ? "bg-slate-400/20 text-slate-300" : "bg-orange-500/20 text-orange-400"}`}>
                        #{h.rank}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-slate-200">{h.event}</p>
                        <p className="text-slate-400">{h.project}</p>
                        <p className="text-emerald-400 font-semibold">{h.prize}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SKILL INTELLIGENCE ──────────────────────────────────────── */}
        {tab === "skills" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Skill Intelligence</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <h2 className="font-bold text-slate-200 text-sm mb-4">Skill Radar</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1e2d45" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" tick={false} />
                      <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm">Score Breakdown</h2>
                <div className="space-y-3">
                  <ScoreBar label="Coding"        value={profile.coding_score}       color="progress-violet" />
                  <ScoreBar label="Innovation"    value={profile.innovation_score}   color="progress-emerald" />
                  <ScoreBar label="Leadership"    value={profile.leadership_score}   color="progress-indigo" />
                  <ScoreBar label="Communication" value={profile.communication_score} color="progress-yellow" />
                  <ScoreBar label="Community"     value={profile.community_score}    color="progress-violet" />
                  <ScoreBar label="Consistency"   value={profile.consistency_score}  color="progress-emerald" />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="font-bold text-slate-200 text-sm">Tech Stack ({skills.length} skills)</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>

            {profile.github_username && (() => {
              const gs = JSON.parse(profile.github_stats_json || "{}");
              return (
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Github className="w-4 h-4 text-violet-400" />GitHub Analytics — @{profile.github_username}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Commits", value: gs.commits ?? "320+" },
                      { label: "Pull Requests", value: gs.prs ?? "28" },
                      { label: "Stars Earned", value: gs.stars ?? "145" },
                      { label: "Repos", value: gs.repos ?? "24" },
                    ].map((m, i) => (
                      <div key={i} className="bg-slate-900/60 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-white">{m.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── JOB MATCHES ─────────────────────────────────────────────── */}
        {tab === "jobs" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Job Matches <span className="text-violet-400">({jobs.length})</span></h1>
            <div className="space-y-4">
              {jobs.map((job: any, i: number) => (
                <div key={job.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm">{job.title}</h3>
                      <span className="badge badge-slate">{job.company_name}</span>
                      <span className="badge badge-indigo">{job.remote_type}</span>
                      <span className="badge badge-violet">{job.experience_level}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{job.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requirements.slice(0, 5).map((r: string, j: number) => (
                        <span key={j} className="skill-chip">{r}</span>
                      ))}
                    </div>
                    {job.missing_skills.length > 0 && (
                      <p className="text-xs text-yellow-500/80">⚠ Missing: {job.missing_skills.slice(0, 3).join(", ")}</p>
                    )}
                    <p className="text-xs text-slate-500">{job.salary_range} · {job.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-black text-emerald-400">{job.match_percentage}%</div>
                      <div className="text-[10px] text-slate-500">AI Match</div>
                    </div>
                    {applySuccess === job.id ? (
                      <span className="badge badge-emerald text-xs">✓ Applied</span>
                    ) : applications.find((a: any) => a.job_id === job.id) ? (
                      <span className="badge badge-violet text-xs">Applied · {applications.find((a: any) => a.job_id === job.id)?.stage}</span>
                    ) : (
                      <button onClick={() => applyToJob(job.id)} disabled={applyingJob === job.id} className="btn-primary btn-emerald text-xs px-4">
                        {applyingJob === job.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Apply Now →"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HACKATHONS ───────────────────────────────────────────────── */}
        {tab === "hackathons" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Hackathons & Events</h1>
            <div className="grid md:grid-cols-2 gap-4">
              {hackathons.map((h: any, i: number) => (
                <div key={h.id} className="glass-panel p-6 rounded-2xl space-y-4 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-sm">{h.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{h.org_name}</p>
                    </div>
                    <span className={`badge ${h.status === "active" ? "badge-emerald" : h.status === "completed" ? "badge-slate" : "badge-yellow"}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{h.description}</p>
                  {h.prize_pool && (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-semibold">
                      <Trophy className="w-3.5 h-3.5" />{h.prize_pool}
                    </div>
                  )}
                  {h.problem_tracks?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {h.problem_tracks.map((t: string, j: number) => (
                        <span key={j} className="badge badge-indigo">{t}</span>
                      ))}
                    </div>
                  )}
                  <button onClick={() => joinHackathon(h.id)} className="btn-primary w-full text-xs">
                    Register for Hackathon →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROJECTS ────────────────────────────────────────────────── */}
        {tab === "projects" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Projects ({projects.length})</h1>
            {projects.length === 0 && (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-500 text-sm italic">
                No projects yet. Sync GitHub or parse your resume to import projects.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p: any, i: number) => (
                <div key={i} className="glass-card p-5 rounded-xl space-y-3 animate-slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-100 text-sm">{p.name}</h3>
                    <GitBranch className="w-4 h-4 text-violet-400 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(p.tech_stack || []).map((t: string, j: number) => (
                      <span key={j} className="skill-chip text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESUME & PORTFOLIO ──────────────────────────────────────── */}
        {tab === "resume" && (
          <div className="space-y-6">
            <h1 className="text-xl font-black text-white">Resume & Portfolio</h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h2 className="font-bold text-slate-200 text-sm">AI Resume Generator</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Generate an ATS-optimized resume tailored to your Talent Profile. Our AI engine structures your skills, projects, and experience for maximum recruiter visibility.</p>
                <div className="flex gap-2">
                  <Link href="/candidate/resume" className="btn-primary w-full text-center">
                    ✨ Launch Full AI Resume Builder →
                  </Link>
                </div>
                <button onClick={generateResume} disabled={generatingResume} className="btn-primary w-full bg-slate-800 hover:bg-slate-700 text-slate-300">
                  {generatingResume ? <><RefreshCw className="w-4 h-4 animate-spin inline mr-2" />Generating Quick ATS Preview...</> : "Quick ATS Summary"}
                </button>
                {generatedResume && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ATS Score</span>
                      <span className="text-emerald-400 font-bold">{generatedResume.ats_score}/100</span>
                    </div>
                    <pre className="bg-slate-950/60 p-4 rounded-lg text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-72 overflow-y-auto font-mono">
                      {generatedResume.resume_text}
                    </pre>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <h2 className="font-bold text-slate-200 text-sm">Profile Completeness</h2>
                  {[
                    { label: "GitHub Connected", done: !!profile.github_username },
                    { label: "Resume Uploaded", done: !!profile.resume_url },
                    { label: "Skills Added", done: skills.length > 0 },
                    { label: "Projects Linked", done: projects.length > 0 },
                    { label: "Education Added", done: education.length > 0 },
                    { label: "Experience Added", done: experience.length > 0 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      {item.done ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                    </div>
                  ))}
                </div>
                <div className="glass-panel p-5 rounded-2xl space-y-2">
                  <h2 className="font-bold text-slate-200 text-sm">Talent Profile Links</h2>
                  {profile.github_username && (
                    <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-violet-400 hover:underline">
                      <GitBranch className="w-3.5 h-3.5" />github.com/{profile.github_username}
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-violet-400 hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" />LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CAREER GUIDANCE ─────────────────────────────────────────── */}
        {tab === "career" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-black text-white">Career Guidance</h1>
              <Link href="/candidate/career" className="btn-primary text-xs flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Launch AI Mentor Chat →
              </Link>
            </div>
            {!careerGuidance ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-6 h-6 text-violet-500 animate-spin" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="glass-panel p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Target className="w-4 h-4 text-violet-400" />Target Role</h2>
                      <span className="badge badge-violet">{careerGuidance.market_demand} Demand</span>
                    </div>
                    <p className="text-lg font-bold text-white">{careerGuidance.target_role}</p>
                    <p className="text-sm text-emerald-400 font-semibold">{careerGuidance.estimated_salary}</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Career Progress</span>
                        <span>{careerGuidance.progress_percentage?.toFixed(0)}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill progress-violet" style={{ width: `${careerGuidance.progress_percentage}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />Skill Gaps</h2>
                    <div className="flex flex-wrap gap-2">
                      {(careerGuidance.skill_gaps || []).map((g: string, i: number) => (
                        <span key={i} className="badge badge-yellow">{g}</span>
                      ))}
                      {!careerGuidance.skill_gaps?.length && <p className="text-xs text-emerald-400">🎉 No major skill gaps identified!</p>}
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm">Recommended Certifications</h2>
                    {(careerGuidance.recommended_certifications || []).map((c: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 p-2 bg-slate-900/50 rounded-lg">
                        <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />{c}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h2 className="font-bold text-slate-200 text-sm flex items-center gap-2"><Map className="w-4 h-4 text-indigo-400" />Learning Roadmap</h2>
                  <div className="space-y-3">
                    {(careerGuidance.learning_roadmap || []).map((step: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-violet-400">{step.phase}</span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{step.estimated_hours}h</span>
                        </div>
                        <p className="text-sm font-bold text-white">{step.skill}</p>
                        <div className="space-y-1">
                          {(step.resources || []).map((r: string, j: number) => (
                            <p key={j} className="text-xs text-slate-400">• {r}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI INTERVIEWS ────────────────────────────────────────────── */}
        {tab === "interviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-black text-white">AI Interview Center</h1>
              <Link href="/candidate/interview" className="btn-primary text-xs flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Launch Full Interview Simulator →
              </Link>
            </div>

            {!activeInterview ? (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="font-bold text-slate-200 text-sm">Start an Interview</h2>
                    {[
                      { type: "mock", label: "Mock Interview", desc: "Practice with AI. No pressure.", icon: "🤖" },
                      { type: "technical", label: "Technical Round", desc: "Deep dive into your tech skills.", icon: "⚡" },
                      { type: "behavioral", label: "Behavioral Round", desc: "STAR-method scenario questions.", icon: "🎯" },
                    ].map(iv => (
                      <button key={iv.type} onClick={() => scheduleInterview(iv.type)} disabled={schedulingInterview}
                        className="w-full p-4 text-left glass-card rounded-xl border border-white/5 space-y-1 hover:border-violet-500/30 transition">
                        <p className="text-sm font-bold text-slate-200">{iv.icon} {iv.label}</p>
                        <p className="text-xs text-slate-500">{iv.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-panel p-6 rounded-2xl space-y-3">
                    <h2 className="font-bold text-slate-200 text-sm">Past Interviews ({interviews.length})</h2>
                    {interviews.length === 0 && <p className="text-xs text-slate-600 italic">No interviews yet. Start one above!</p>}
                    {interviews.map((iv: any) => (
                      <div key={iv.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-slate-200 capitalize">{iv.interview_type} Interview</p>
                          <span className={`badge ${iv.status === "completed" ? "badge-emerald" : "badge-yellow"}`}>{iv.status}</span>
                        </div>
                        {iv.status === "completed" && (
                          <div className="text-right text-xs space-y-1">
                            <p className="text-xl font-black text-white">{iv.overall_score.toFixed(0)}</p>
                            <p className="text-slate-500">Overall Score</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : interviewComplete ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-white">Interview Complete!</h2>
                <p className="text-slate-400 text-sm">Your AI evaluation report is being generated. Check your Past Interviews for the full scorecard.</p>
                <button onClick={() => { setActiveInterview(null); fetchAll(); }} className="btn-primary">
                  View Results →
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
                {/* Proctored Anti-Cheating Telemetry Banner */}
                <TabSwitchWarningBanner switchCount={tabSwitchCount} maxAllowed={3} />

                <div className="glass-panel p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Question {currentQ + 1} of {activeInterview.total}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const questionText = activeInterview.current_question?.question || "";
                          if (questionText) speakQuestion(questionText);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 font-medium text-[11px] flex items-center gap-1 transition"
                      >
                        🔊 Read Question
                      </button>
                      <span className="badge badge-violet capitalize">{activeInterview.interview_type}</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill progress-violet" style={{ width: `${((currentQ) / activeInterview.total) * 100}%` }} />
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-violet-500/20 space-y-2">
                    <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                      {activeInterview.current_question?.question || "Loading next question..."}
                    </p>
                    {activeInterview.current_question?.category && (
                      <span className="badge badge-violet inline-block">{activeInterview.current_question.category}</span>
                    )}
                  </div>

                  {interviewFeedback && (
                    <div className="apex-alert-info text-xs">{interviewFeedback}</div>
                  )}

                  {/* Voice Microphone Control Toolbar */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <Mic className={`w-4 h-4 ${isListening ? "text-red-400 animate-pulse" : "text-violet-400"}`} />
                      <span className="font-semibold text-slate-300">
                        {isListening ? "🎙️ Listening & Transcribing Speech..." : "Voice Input Mode"}
                      </span>
                    </div>
                    {isListening ? (
                      <button onClick={stopVoiceInput} className="px-3 py-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-red-300 font-medium hover:bg-red-600/50">
                        Stop Mic
                      </button>
                    ) : (
                      <button onClick={startVoiceInput} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                        <Mic className="w-3.5 h-3.5" /> Speak Answer
                      </button>
                    )}
                  </div>

                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Type or speak your answer. Your speech will automatically transcribe into text..."
                    className="field-input min-h-32 resize-none text-sm"
                  />
                  <button onClick={() => { stopVoiceInput(); submitAnswer(); }} disabled={!answer.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {currentQ + 1 >= activeInterview.total ? "Submit Final Answer" : "Next Question →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
      </div>
    </div>
  );
}
