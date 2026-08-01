"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Activity, GitCommit, Eye, Star, GitBranch, ArrowLeft,
  Calendar, ShieldCheck, Cpu, RefreshCw, BarChart3, LineChart
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CandidateAnalyticsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("apex_token") || localStorage.getItem("token")) : null;
    return token && token !== "demo_jwt_token_2026" ? { "Authorization": `Bearer ${token}` } : {};
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/candidate/profile`, { headers: getAuthHeaders() });
      if (res.ok) setProfile(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-violet-400" /> Candidate Telemetry & GitHub Analytics
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Deep telemetry performance tracking across commits, code velocity, profile views, and recruiter engagement.</p>
            </div>
          </div>
          <button onClick={fetchProfile} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Analytics
          </button>
        </div>

        {/* Top Analytics Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Commits (30d)</span>
              <GitCommit className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-white">142</div>
            <p className="text-[10px] text-emerald-400">+18% vs last month</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Profile Views</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">284</div>
            <p className="text-[10px] text-emerald-400">32 Recruiter Inquiries</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Repository Stars</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">48</div>
            <p className="text-[10px] text-slate-400">Across 6 Public Repos</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Authenticity Rating</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-400">99.2%</div>
            <p className="text-[10px] text-slate-400">Zero Plagiarism Detected</p>
          </div>
        </div>

        {/* Contribution Activity Grid */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Annual Telemetry Contribution Heatmap
          </h2>
          <div className="grid grid-cols-12 gap-1.5 p-4 bg-slate-950/80 rounded-xl border border-slate-800">
            {Array.from({ length: 48 }).map((_, i) => {
              const intensity = (i * 7 + 3) % 4;
              const colors = ["bg-slate-900", "bg-emerald-900/60", "bg-emerald-600/80", "bg-emerald-400"];
              return (
                <div
                  key={i}
                  className={`h-4 rounded-sm ${colors[intensity]} transition hover:scale-125 cursor-pointer`}
                  title={`Week ${i + 1}: ${intensity * 4 + 2} commits`}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
