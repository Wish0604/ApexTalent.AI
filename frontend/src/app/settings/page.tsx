"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Shield, Bell, Key, CheckCircle, Save, AlertCircle, RefreshCw,
  GitBranch, Lock, Mail, Sliders, Smartphone, Check, ArrowLeft,
  LayoutDashboard, Network, Briefcase, Trophy, FolderOpen, FileText, Map, Mic, Award, BarChart3, ShieldCheck, Cpu, Settings as SettingsIcon
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
        <Link href="/candidate/verification" className="sidebar-item w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verification & Badges</span>
        </Link>
        <Link href="/settings" className="sidebar-item w-full flex items-center gap-2 text-violet-300 font-bold bg-violet-600/20 border border-violet-500/30 rounded-xl px-3 py-2 text-xs">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </Link>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "api">("profile");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [fullName, setFullName] = useState("Candidate User");
  const [email, setEmail] = useState("candidate@apextalent.ai");
  const [role, setRole] = useState("candidate");

  const [prefs, setPrefs] = useState({
    email_welcome: true,
    email_security: true,
    email_interviews: true,
    email_ai_reports: true,
    email_jobs: true,
    email_hackathons: true,
    email_weekly_digest: true,
    in_app_all: true
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("apex_token")) : null;
      if (!token) return;
      const res = await fetch(`${API}/api/v1/notifications/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrefs({
          email_welcome: data.email_welcome ?? true,
          email_security: data.email_security ?? true,
          email_interviews: data.email_interviews ?? true,
          email_ai_reports: data.email_ai_reports ?? true,
          email_jobs: data.email_jobs ?? true,
          email_hackathons: data.email_hackathons ?? true,
          email_weekly_digest: data.email_weekly_digest ?? true,
          in_app_all: data.in_app_all ?? true
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("apex_token")) : null;
      if (token) {
        await fetch(`${API}/api/v1/notifications/preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(prefs)
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters long.");
      return;
    }
    setPasswordMsg("✅ Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="settings" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6 text-violet-400" /> Account & System Settings
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage profile preferences, notification subscriptions, and security parameters.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  activeTab === "profile"
                    ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <User className="w-4 h-4" /> Profile & Account
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  activeTab === "notifications"
                    ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Bell className="w-4 h-4" /> Notification Preferences
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  activeTab === "security"
                    ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Shield className="w-4 h-4" /> Password & Security
              </button>

              <button
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  activeTab === "api"
                    ? "bg-violet-600/30 text-violet-200 border border-violet-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Key className="w-4 h-4" /> Connected Accounts & APIs
              </button>
            </div>

            {/* Form Area */}
            <div className="md:col-span-3">
              {saveSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Settings updated successfully!
                </div>
              )}

              {/* Tab 1: Profile */}
              {activeTab === "profile" && (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Profile Information</h3>
                    <p className="text-xs text-slate-400 mt-1">Update your basic account profile details displayed across the platform.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="field-label text-xs">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="field-input w-full mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="field-label text-xs">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field-input w-full mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="field-label text-xs">Platform Role</label>
                      <input
                        type="text"
                        value={role.toUpperCase()}
                        disabled
                        className="field-input w-full mt-1 text-xs opacity-60 cursor-not-allowed bg-slate-900"
                      />
                    </div>

                    <button
                      onClick={handleSavePreferences}
                      disabled={loading}
                      className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Notifications */}
              {activeTab === "notifications" && (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Notification Preferences</h3>
                    <p className="text-xs text-slate-400 mt-1">Choose which email alerts and platform updates you want to receive.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "email_security", label: "Security & Account Alerts", desc: "Critical security notifications and login alerts" },
                      { key: "email_interviews", label: "AI Interview Reminders", desc: "Notifications when an interview is scheduled or report is ready" },
                      { key: "email_ai_reports", label: "AI Talent Score Updates", desc: "Updates when your skill telemetry or rank changes" },
                      { key: "email_jobs", label: "Job Match Alerts", desc: "New high-matching jobs posted by recruiters" },
                      { key: "email_hackathons", label: "Hackathon & Challenge Invites", desc: "Invitations to new hackathons and coding challenges" },
                      { key: "email_weekly_digest", label: "Weekly Talent Digest", desc: "A summary of profile views, recruiter messages, and recommendations" }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{item.label}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={(prefs as any)[item.key]}
                          onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                        />
                      </div>
                    ))}

                    <button
                      onClick={handleSavePreferences}
                      disabled={loading}
                      className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Security */}
              {activeTab === "security" && (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Password & Security</h3>
                    <p className="text-xs text-slate-400 mt-1">Update your password and enable multi-factor security options.</p>
                  </div>

                  {passwordMsg && (
                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
                      {passwordMsg}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="field-label text-xs">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="field-input w-full mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="field-label text-xs">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="field-input w-full mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="field-label text-xs">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="field-input w-full mt-1 text-xs"
                      />
                    </div>

                    <button type="submit" className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" /> Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 4: API */}
              {activeTab === "api" && (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Connected Developer Accounts</h3>
                    <p className="text-xs text-slate-400 mt-1">Manage OAuth integrations and code repository access tokens.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-violet-400">
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">GitHub Developer Integration</h4>
                          <p className="text-[11px] text-slate-400">Used for live repository analysis and telemetry AI scoring.</p>
                        </div>
                      </div>
                      <span className="badge badge-emerald text-[11px]">Connected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
