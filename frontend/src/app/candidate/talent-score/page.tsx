"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Award, TrendingUp, Sparkles, Zap, ArrowLeft, BarChart2,
  CheckCircle2, RefreshCw, Cpu, Activity, ShieldCheck, Target
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CandidateTalentScorePage() {
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

  const score = profile?.talent_score ?? 88.5;

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
                <Award className="w-6 h-6 text-amber-400" /> AI Talent Score™ 360 & Skill Graph
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry evaluation across coding, innovation, leadership, and contribution consistency.</p>
            </div>
          </div>
          <button onClick={fetchProfile} className="btn-primary flex items-center gap-2 text-xs px-4 py-2">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Intelligence
          </button>
        </div>

        {/* Hero Score Display */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-indigo-500/10 grid md:grid-cols-3 gap-6 items-center">
          
          <div className="flex flex-col items-center justify-center text-center space-y-2 border-r border-white/10 pr-6">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Overall AI Rating</span>
            <div className="text-6xl font-black text-white tracking-tight">{score.toFixed(1)}</div>
            <div className="badge badge-amber text-xs px-3 py-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Top 3% Candidate Worldwide
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Executive Score Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">Coding Execution</span>
                <p className="font-bold text-violet-400 text-sm">{profile?.coding_score?.toFixed(1) ?? "92.0"}/100</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">Innovation Index</span>
                <p className="font-bold text-emerald-400 text-sm">{profile?.innovation_score?.toFixed(1) ?? "86.5"}/100</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">System Leadership</span>
                <p className="font-bold text-indigo-400 text-sm">{profile?.leadership_score?.toFixed(1) ?? "84.0"}/100</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">Authenticity Score</span>
                <p className="font-bold text-amber-400 text-sm">99% Verified</p>
              </div>
            </div>
          </div>

        </div>

        {/* Skill Graph & Heatmap Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Skill Graph */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-violet-400" /> Interactive Skill Radar
            </h2>
            <div className="space-y-4 text-xs">
              {[
                { label: "Backend Systems Architecture", val: 95, color: "bg-violet-500" },
                { label: "Distributed Caching & DB Optimization", val: 89, color: "bg-emerald-500" },
                { label: "React / Frontend State Management", val: 84, color: "bg-indigo-500" },
                { label: "Docker & Kubernetes DevOps", val: 82, color: "bg-amber-500" },
                { label: "AI Agent & LLM Prompt Pipelines", val: 91, color: "bg-pink-500" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Growth Suggestions & Improvement Roadmap */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> AI Growth & Score Maximizer
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Connect Live GitHub OAuth 2.0
                </div>
                <p className="text-slate-400">Verifying live commit frequency adds up to +5.0 points to your Talent Score.</p>
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-violet-500/30 space-y-1">
                <div className="flex items-center gap-2 text-violet-300 font-bold">
                  <Cpu className="w-4 h-4" /> Complete AI Coding Challenge
                </div>
                <p className="text-slate-400">Completing an AI-eval challenge validates algorithmic proficiency.</p>
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-indigo-500/30 space-y-1">
                <div className="flex items-center gap-2 text-indigo-300 font-bold">
                  <Activity className="w-4 h-4" /> Complete AI Voice Mock Interview
                </div>
                <p className="text-slate-400">System architecture interviews boost communication & leadership ratings.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
