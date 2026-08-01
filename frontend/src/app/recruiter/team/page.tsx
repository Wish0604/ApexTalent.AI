"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, ArrowLeft, Plus, RefreshCw, CheckCircle, Shield, ShieldCheck,
  UserCheck, Mail, Building, Key, X, Lock, Check, Layers,
  LayoutDashboard, Search, Star, Briefcase, Zap, FileText, Cpu, Code2, DollarSign, Bot, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },
  { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search },
  { href: "/recruiter/candidate-intelligence", label: "Candidate Intel", icon: Star, id: "intel" },
  { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
  { href: "/recruiter/challenges", label: "Hiring Challenges", icon: Zap, id: "challenges" },
  { href: "/recruiter/assessments", label: "Online Assessments", icon: FileText, id: "assessments" },
  { href: "/recruiter/interview-simulator", label: "Live Code Simulator", icon: Cpu, id: "simulator" },
  { href: "/recruiter/pair-programming", label: "Pair Programming", icon: Code2, id: "pair" },

  { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers, id: "pipeline" },
  { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot, id: "copilot" },
  { href: "/recruiter/team", label: "Enterprise Team", icon: Users, id: "team" },
  { href: "/recruiter/webhooks", label: "Webhooks Dispatch", icon: Radio, id: "webhooks" },
  { href: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart2, id: "analytics" },
];

function RecruiterSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {RECRUITER_TABS.map((item, idx) => {
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
    </div>
  );
}

export default function EnterpriseTeamPage() {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleSendInvite = async (e: React.FormEvent) => {
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
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="team" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" /> Enterprise Team Management & RBAC
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage recruiter workspace members, permissions matrix & team access controls.</p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn-primary flex items-center gap-2 text-xs px-5 py-2.5"
            >
              <Plus className="w-4 h-4" /> Invite Team Member
            </button>
          </div>

          {inviteSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> {inviteSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Active Team Members ({(teamData?.members || []).length || 3})
              </h2>

              <div className="space-y-3">
                {((teamData?.members || []).length > 0 ? teamData.members : [
                  { id: 1, name: "Aarav Mehta", email: "aarav@apextalent.ai", role: "Admin", department: "Talent Acquisition" },
                  { id: 2, name: "Sarah Jenkins", email: "sarah.j@apextalent.ai", role: "Senior Recruiter", department: "Engineering TA" },
                  { id: 3, name: "David Chen", email: "david.c@apextalent.ai", role: "Technical Interviewer", department: "Backend Systems" }
                ]).map((mem: any) => (
                  <div key={mem.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                        {mem.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          {mem.name} <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </h3>
                        <p className="text-xs text-slate-400">{mem.email} • {mem.department}</p>
                      </div>
                    </div>
                    <span className="badge badge-emerald text-xs font-semibold px-3 py-1">{mem.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> Role-Based Access Matrix
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="font-bold text-amber-400">Admin</span>
                    <p className="text-[11px] text-slate-400">Full access to team invites, job posting, offer negotiation, and billing telemetry.</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-400">Senior Recruiter</span>
                    <p className="text-[11px] text-slate-400">Can post jobs, move pipeline stages, trigger AI challenge generator, and run offer copilot.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border border-white/20">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Invite Team Member
            </h2>
            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="field-label">Email Address *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  placeholder="colleague@company.com"
                  className="field-input w-full mt-1"
                />
              </div>

              <div>
                <label className="field-label">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="field-input w-full mt-1">
                  <option value="Admin">Admin</option>
                  <option value="Senior Recruiter">Senior Recruiter</option>
                  <option value="Technical Interviewer">Technical Interviewer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">Cancel</button>
                <button type="submit" className="btn-primary px-6 text-xs">Send Invite ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
