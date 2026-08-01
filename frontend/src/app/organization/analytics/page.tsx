"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, Award, Calendar, ArrowLeft, RefreshCw,
  Building2, Zap, ShieldCheck, Activity
} from "lucide-react";

export default function OrganizationAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/organization" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" /> Community Reputation & Analytics Intelligence
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

      </div>
    </div>
  );
}
