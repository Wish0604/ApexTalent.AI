"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart2, ArrowLeft, RefreshCw, TrendingUp, Users, Award, ShieldCheck,
  Zap, ChevronRight, CheckCircle, Trophy, Sparkles, Layers, Cpu
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ExecutiveDashboardPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/telemetry/executive`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.error("Failed to load executive telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#10b981", "#8b5cf6", "#06b6d4", "#f59e0b"];

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
              <BarChart2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Executive Telemetry & Platform Dashboard
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Real-time Intelligence
                </span>
              </h1>
              <p className="text-xs text-slate-400">Platform-wide hiring velocity, pipeline throughput & talent graph growth</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTelemetry}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <Link
            href="/recruiter/pipeline"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            Hiring Pipeline Board
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">Fetching executive platform telemetry...</p>
          </div>
        ) : telemetry ? (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Talent Graph Network</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">{telemetry.platform_summary?.total_candidates_in_network?.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +14.2% month-over-month
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Avg Time-to-Hire</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white">{telemetry.platform_summary?.avg_time_to_hire_days} Days</p>
                <p className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 2.5x faster than market avg
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pipeline Conversion Rate</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white">{telemetry.platform_summary?.platform_conversion_rate}%</p>
                <p className="text-[11px] text-amber-400 font-semibold">High-confidence matches</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>AI Evaluation Accuracy</span>
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                </div>
                <p className="text-2xl font-black text-white">{telemetry.platform_summary?.ai_evaluation_accuracy}%</p>
                <p className="text-[11px] text-violet-400 font-semibold">Zero-fraud telemetry</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Hiring Throughput & Velocity Chart */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h2 className="font-bold text-sm text-white">Monthly Hiring Velocity & Placement Throughput</h2>
                    <p className="text-xs text-slate-400">Total verified hires per month vs days-to-hire reduction</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                    Accelerating
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={telemetry.hiring_velocity}>
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ background: "#0d1322", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f1f5f9" }} />
                      <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} name="Successful Hires" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Demand Growth Side Panel */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <h2 className="font-bold text-sm text-white">Top Skill Demand Growth</h2>
                    <p className="text-xs text-slate-400">Fastest-growing tech stacks in candidate pipeline</p>
                  </div>

                  <div className="space-y-3">
                    {telemetry.top_skills_velocity?.map((sk: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{sk.skill}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {sk.demand_growth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link
                    href="/recruiter/copilot"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-xs font-bold text-slate-200 hover:text-emerald-300 border border-white/10 flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Query AI Copilot Insights
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
