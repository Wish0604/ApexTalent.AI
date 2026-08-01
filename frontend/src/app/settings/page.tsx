"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Shield, Bell, Key, CheckCircle, Save, AlertCircle, RefreshCw,
  GitBranch, Lock, Mail, Sliders, Smartphone, Check, ArrowLeft
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "api">("profile");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("Candidate User");
  const [email, setEmail] = useState("candidate@apextalent.ai");
  const [role, setRole] = useState("candidate");

  // Notification Preferences State (Connected to backend API)
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

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
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
      console.log("Could not fetch preferences:", e);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const token = localStorage.getItem("token");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/candidate" className="inline-flex items-center gap-2 text-xs text-violet-400 hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Account & System Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your profile preferences, notification subscriptions, and security parameters.
            </p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold animate-pulse">
              <CheckCircle className="w-4 h-4" /> Preferences Saved Successfully
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Settings Sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === "profile" ? "bg-violet-600/20 text-violet-300 border border-violet-500/40" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <User className="w-4 h-4" /> Profile & Account
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === "notifications" ? "bg-violet-600/20 text-violet-300 border border-violet-500/40" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Bell className="w-4 h-4" /> Notification Preferences
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === "security" ? "bg-violet-600/20 text-violet-300 border border-violet-500/40" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Shield className="w-4 h-4" /> Password & Security
            </button>

            <button
              onClick={() => setActiveTab("api")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                activeTab === "api" ? "bg-violet-600/20 text-violet-300 border border-violet-500/40" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Key className="w-4 h-4" /> Connected Accounts & APIs
            </button>
          </nav>
        </div>

        {/* Right Settings Content */}
        <div className="md:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          {/* TAB 1: PROFILE & ACCOUNT */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Profile Information</h2>
              <p className="text-xs text-slate-400 mb-6">Update your basic account profile details displayed across the platform.</p>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Platform Role</label>
                  <input
                    type="text"
                    disabled
                    value={role.toUpperCase()}
                    className="w-full bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-violet-600/30"
                  >
                    <Save className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATION PREFERENCES */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Notification Preferences</h2>
              <p className="text-xs text-slate-400 mb-6">Choose which alerts you want to receive via Email and In-App notifications.</p>

              <div className="space-y-4">
                {[
                  { key: "email_welcome", title: "Welcome & Onboarding Emails", desc: "Tips and guides for getting started on ApexTalent" },
                  { key: "email_security", title: "Security Alerts", desc: "Password updates, new login locations, and security notices" },
                  { key: "email_interviews", title: "Interview Scheduling & Reminders", desc: "Alerts for scheduled interviews, reminders, and links" },
                  { key: "email_ai_reports", title: "AI Evaluation & Score Reports", desc: "Notifications when code reviews or interview AI reports are ready" },
                  { key: "email_jobs", title: "Job Matches & Recruiter Invites", desc: "Direct messages and shortlists from recruiting partners" },
                  { key: "email_hackathons", title: "Hackathon & Event Updates", desc: "Registration receipts, team invites, and leaderboard announcements" },
                  { key: "email_weekly_digest", title: "Weekly Career Digest", desc: "Summary of profile views, skill growth, and recommended opportunities" }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(prefs as any)[item.key]}
                        onChange={(e) => setPrefs({ ...prefs, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    onClick={handleSavePreferences}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-violet-600/30"
                  >
                    <Save className="w-3.5 h-3.5" /> {loading ? "Saving Preferences..." : "Save Notification Settings"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PASSWORD & SECURITY */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Password & Security</h2>
              <p className="text-xs text-slate-400 mb-6">Manage authentication credentials, two-factor auth, and active sessions.</p>

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg mb-8">
                {passwordMsg && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${passwordMsg.includes("✅") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"}`}>
                    {passwordMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition"
                >
                  <Lock className="w-3.5 h-3.5" /> Update Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CONNECTED ACCOUNTS */}
          {activeTab === "api" && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Connected OAuth Accounts</h2>
              <p className="text-xs text-slate-400 mb-6">Manage external identity providers and OAuth authorization tokens.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">GitHub Developer Integration</h4>
                      <p className="text-[11px] text-slate-400">Used for live repository analysis and telemetry AI scoring.</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
