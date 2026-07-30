"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, ArrowLeft, Plus, RefreshCw, CheckCircle, Shield, ShieldCheck,
  UserCheck, Mail, Building, Key, X, Lock, Check, Layers
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EnterpriseTeamPage() {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Technical Interviewer");
  const [inviteDept, setInviteDept] = useState("Engineering TA");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/team`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setTeamData(data);
      }
    } catch (err) {
      console.error("Failed to fetch team:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/team/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          department: inviteDept
        })
      });

      if (!res.ok) throw new Error("Invite failed");
      const data = await res.json();

      setInviteSuccess(`✨ Invitation sent to ${inviteEmail} as ${inviteRole}!`);
      setInviteEmail("");
      setShowInviteModal(false);
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert("Failed to send team invitation.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recruiter" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Enterprise Team Management & RBAC
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Role-Based Security
                </span>
              </h1>
              <p className="text-xs text-slate-400">Manage recruiter workspace members, permissions matrix & team access controls</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Invite Team Member
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {inviteSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{inviteSuccess}</span>
            </div>
            <button onClick={() => setInviteSuccess("")} className="text-xs text-emerald-400 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">Loading team roster and RBAC configuration...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Member List Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Active Team Members ({teamData?.team_members?.length || 0})</h2>
                <span className="text-xs text-slate-400">Organization: <strong className="text-white">{teamData?.company_name}</strong></span>
              </div>

              <div className="space-y-3">
                {teamData?.team_members?.map((m: any) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-[#0d1322] border border-white/10 flex items-center justify-between hover:border-emerald-500/30 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-emerald-400 text-sm">
                        {m.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white flex items-center gap-2">
                          {m.full_name}
                          {m.role === "Admin" && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </p>
                        <p className="text-xs text-slate-400">{m.email} • {m.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        m.role === "Admin" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-white/10 text-slate-300"
                      }`}>
                        {m.role}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RBAC Matrix Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Role-Based Access Matrix
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="font-bold text-white">👑 Admin</p>
                    <p className="text-slate-400 text-[11px]">Full access to team invites, job posting, offer negotiation, and billing telemetry.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="font-bold text-white">💼 Senior Recruiter</p>
                    <p className="text-slate-400 text-[11px]">Can post jobs, move pipeline stages, trigger AI challenge generator, and run offer copilot.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="font-bold text-white">🎙️ Technical Interviewer</p>
                    <p className="text-slate-400 text-[11px]">Access to candidate 360° intel reports and live voice/coding simulator workspace.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0d1322] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Invite Enterprise Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="Senior Recruiter" className="bg-[#0d1322]">Senior Recruiter</option>
                  <option value="Technical Interviewer" className="bg-[#0d1322]">Technical Interviewer</option>
                  <option value="Admin" className="bg-[#0d1322]">Admin</option>
                  <option value="Viewer" className="bg-[#0d1322]">Viewer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                >
                  Send Team Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
