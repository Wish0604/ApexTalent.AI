"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, Award, Calendar, ArrowLeft, RefreshCw,
  Building2, Zap, ShieldCheck, Activity,
  LayoutDashboard, Trophy, Network, Brain, Cpu, BarChart2
} from "lucide-react";

function OrganizationSidebar({ active }: { active: string }) {
  const items = [
    { href: "/organization", label: "Dashboard", icon: LayoutDashboard },
    { href: "/organization/events", label: "Events & Webinars", icon: Calendar, id: "events" },
    { href: "/organization/hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
    { href: "/organization/team-builder", label: "AI Team Builder", icon: Network, id: "teams" },
    { href: "/organization/evaluations", label: "AI Evaluations", icon: Brain, id: "evaluations" },
    { href: "/organization/certificates", label: "Certificates & Badges", icon: Award, id: "certificates" },
    { href: "/organization/analytics", label: "Community Analytics", icon: BarChart2, id: "analytics" },
  ];

  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="font-bold text-sm gradient-text-gold">Community HQ</span>
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
                isActive ? "bg-amber-600/30 text-amber-200 border border-amber-500/40" : "text-slate-400 hover:text-white hover:bg-white/5"
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

export default function OrganizationAnalyticsPage() {
  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <OrganizationSidebar active="analytics" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          {/* Navigation Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/organization" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-amber-400" /> Community Reputation & Analytics Intelligence
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Community engagement metrics, hackathon participation growth, recruiter connections, and reputation rankings.</p>
              </div>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Community Members</span>
              <div className="text-2xl font-black text-white">4,820</div>
              <p className="text-[10px] text-emerald-400">+28% this month</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hackathon Projects</span>
              <div className="text-2xl font-black text-violet-400">142 Submitted</div>
              <p className="text-[10px] text-slate-400">A+ Innovation Rating</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recruiter Connections</span>
              <div className="text-2xl font-black text-indigo-400">68 Organizations</div>
              <p className="text-[10px] text-slate-400">Actively Hiring Members</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Community Index</span>
              <div className="text-2xl font-black text-amber-400">98.4 / 100</div>
              <p className="text-[10px] text-slate-400">Tier-1 Reputation</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
