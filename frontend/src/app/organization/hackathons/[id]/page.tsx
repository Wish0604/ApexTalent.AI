"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Trophy, ArrowLeft, RefreshCw, Sparkles, Award, GitBranch, FileText, CheckCircle2, User, Star,
  LayoutDashboard, Users, Calendar, Network, Brain, BarChart2, Cpu, GitBranch as GitIcon
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const COMMUNITY_TABS = [
  { href: "/organization", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organization?tab=members", label: "Members", icon: Users },
  { href: "/organization/events", label: "Events & Webinars", icon: Calendar, id: "events" },
  { href: "/organization?tab=hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
  { href: "/organization?tab=teams", label: "AI Team Builder", icon: Network, id: "teams" },
  { href: "/organization/evaluations", label: "AI Evaluations", icon: Brain, id: "evaluations" },
  { href: "/organization/certificates", label: "Certificates & Badges", icon: Award, id: "certificates" },
  { href: "/organization?tab=leaderboard", label: "Leaderboard", icon: Award },
  { href: "/organization?tab=projects", label: "Project Gallery", icon: GitIcon },
  { href: "/organization/analytics", label: "Community Analytics", icon: BarChart2, id: "analytics" },
];

function OrganizationSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="font-bold text-sm gradient-text-gold">Community HQ</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {COMMUNITY_TABS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "active-indigo" : "text-slate-400 hover:text-white hover:bg-white/5"
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

export default function HackathonJudgingPage() {
  const params = useParams();
  const hackathonId = params?.id || "1";
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [hackathonId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/organization/hackathon/${hackathonId}/leaderboard`);
      if (!res.ok) throw new Error("Failed to load leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error(err);
      setLeaderboard([
        {
          id: 101,
          team_name: "NeuralFlow AI",
          project_title: "Autonomous Code Telemetry Engine",
          github_url: "https://github.com/apextalent/telemetry-engine",
          ai_score: 94.8,
          rank: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiEvaluation = async (submissionId: number) => {
    setEvaluatingId(submissionId);
    setEvaluationResult(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/organization/hackathon/${hackathonId}/evaluate`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();
      setEvaluationResult(data);
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="community-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="community-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex community-dashboard-container min-h-screen">
        
        <OrganizationSidebar active="evaluations" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/organization" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" /> Hackathon Judging & AI Evaluation Hub
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Automated multi-agent judging analyzing Repository Architecture, PPT Pitch Quality, and Team Member Analytics.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-slate-200">Hackathon Submissions & Leaderboard</h2>
            <div className="space-y-3 text-xs">
              {leaderboard.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900/80 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.project_title}</h3>
                    <p className="text-slate-400">{item.team_name} • {item.github_url}</p>
                  </div>
                  <span className="badge badge-amber text-xs font-bold">{item.ai_score} AI Score</span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
