"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Trophy, ArrowLeft, RefreshCw, Sparkles, Award, GitBranch, FileText, CheckCircle2, User, Star
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiEvaluation = async (submissionId: number) => {
    setEvaluatingId(submissionId);
    setEvaluationResult(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/organization/submission/${submissionId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("AI Evaluation failed");
      const evalData = await res.json();
      setEvaluationResult(evalData);
      fetchLeaderboard();
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link href="/organization" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Community Hub
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <span className="font-bold text-sm text-slate-200">Hackathon Judging & AI Evaluation Hub</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="text-indigo-400 w-6 h-6" /> AI Code & Pitch Deck Evaluation System
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Automated multi-agent judging analyzing Repository Architecture, PPT Pitch Quality, and Team Member Contribution Analytics.
            </p>
          </div>
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Refresh Standings"}
          </button>
        </div>
      </div>

      {/* Evaluation Results Modal/Card if Triggered */}
      {evaluationResult && (
        <div className="glass-panel p-8 rounded-2xl border border-indigo-500/30 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> AI Project Evaluation Report
            </h2>
            <span className="text-2xl font-black text-indigo-400">
              {evaluationResult.composite_score}/100 Composite Index
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-xs">
            {/* Repo Evaluation */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-violet-400" /> Code & Architecture
              </span>
              <div className="text-2xl font-black text-white">{evaluationResult.repository_evaluation?.overall_repo_score}</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Rating: <strong className="text-emerald-400">{evaluationResult.repository_evaluation?.architecture_rating}</strong> • Coverage: {evaluationResult.repository_evaluation?.testing_coverage_pct}%
              </p>
            </div>

            {/* PPT Evaluation */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Pitch Deck & Presentation
              </span>
              <div className="text-2xl font-black text-white">{evaluationResult.ppt_evaluation?.overall_ppt_score}</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Innovation: {evaluationResult.ppt_evaluation?.innovation_score} • Business Impact: {evaluationResult.ppt_evaluation?.business_impact_score}
              </p>
            </div>

            {/* Team Contributions */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" /> Team Contribution Breakdown
              </span>
              <div className="space-y-1.5 pt-1">
                {evaluationResult.team_contributions?.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{m.full_name}</span>
                    <span className="font-bold text-indigo-300">{m.contribution_percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
        <h3 className="font-bold text-slate-200 text-base">Live Event Leaderboard & Submissions</h3>
        
        <div className="space-y-3">
          {leaderboard.map((item) => (
            <div key={item.submission_id} className="glass-card p-5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm ${
                  item.rank === 1 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" : "bg-slate-800 text-slate-400"
                }`}>
                  #{item.rank}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                    {item.title} <span className="text-xs font-normal text-slate-500">({item.team_name})</span>
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <a href={item.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-violet-400">
                      <GitBranch className="w-3.5 h-3.5" /> Repository
                    </a>
                    <span>•</span>
                    <a href={item.ppt_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-400">
                      <FileText className="w-3.5 h-3.5" /> Pitch Deck
                    </a>
                  </div>
                  <div className="flex gap-1 pt-1">
                    {item.tech_stack.map((t: string, idx: number) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-semibold">Composite Score</span>
                  <span className="text-xl font-black text-emerald-400">{item.overall_score}</span>
                </div>

                <button
                  onClick={() => handleRunAiEvaluation(item.submission_id)}
                  disabled={evaluatingId === item.submission_id}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                >
                  {evaluatingId === item.submission_id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Run AI Judging
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <p className="text-xs text-slate-500 italic py-8 text-center">No projects submitted yet for this hackathon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
