"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers, ArrowLeft, RefreshCw, Star, CheckCircle, ChevronRight, ChevronLeft,
  X, GitBranch, Trophy, ShieldCheck, FileText, Zap, Award, Sparkles, User, ExternalLink, MessageSquare
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STAGES = [
  { id: "applied text-slate-400", key: "applied", label: "Applied", color: "border-slate-700 bg-slate-900/40" },
  { id: "ai_review", key: "ai_review", label: "AI Reviewed", color: "border-cyan-500/30 bg-cyan-950/20" },
  { id: "challenge", key: "challenge", label: "Challenge", color: "border-amber-500/30 bg-amber-950/20" },
  { id: "interview", key: "interview", label: "Interview", color: "border-violet-500/30 bg-violet-950/20" },
  { id: "offer", key: "offer", label: "Offer", color: "border-emerald-500/30 bg-emerald-950/20" },
  { id: "hired", key: "hired", label: "Hired", color: "border-teal-500/40 bg-teal-950/30" },
];

export default function RecruiterPipelinePage() {
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({
    applied: [],
    ai_review: [],
    challenge: [],
    interview: [],
    offer: [],
    hired: []
  });
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState<number | null>(null);

  // Candidate 360° Intel Modal state
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [intelData, setIntelData] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/pipeline`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPipeline(data);
      }
    } catch (err) {
      console.error("Failed to load pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (applicationId: number, currentStage: string, direction: "next" | "prev") => {
    const stageKeys = STAGES.map(s => s.key);
    const currIdx = stageKeys.indexOf(currentStage);
    if (currIdx === -1) return;

    const nextIdx = direction === "next" ? currIdx + 1 : currIdx - 1;
    if (nextIdx < 0 || nextIdx >= stageKeys.length) return;

    const newStage = stageKeys[nextIdx];
    setMovingId(applicationId);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/pipeline/update-stage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          application_id: applicationId,
          stage: newStage,
          recruiter_notes: `Moved stage to ${newStage} via Recruiter OS Kanban`
        })
      });

      if (res.ok) {
        fetchPipeline();
      }
    } catch (err) {
      console.error("Error moving pipeline stage:", err);
    } finally {
      setMovingId(null);
    }
  };

  const open360IntelReport = async (candidateId: number) => {
    setSelectedCandidateId(candidateId);
    setIntelLoading(true);
    setIntelData(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/candidate/${candidateId}/intelligence`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setIntelData(data);
      }
    } catch (err) {
      console.error("Failed to load 360 intel report:", err);
    } finally {
      setIntelLoading(false);
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
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Interactive Hiring Pipeline Board
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Kanban Operating System
                </span>
              </h1>
              <p className="text-xs text-slate-400">Track candidates seamlessly across stage transitions with live candidate notifications</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPipeline}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition"
            title="Refresh Pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <Link
            href="/recruiter/copilot"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open AI Copilot
          </Link>
        </div>
      </header>

      {/* Main Kanban Board */}
      <main className="flex-1 p-6 overflow-x-auto">
        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">Fetching applicant pipeline telemetry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 min-w-[1200px]">
            {STAGES.map((stg) => {
              const cards = pipeline[stg.key] || [];
              return (
                <div
                  key={stg.key}
                  className={`rounded-2xl border ${stg.color} p-3.5 flex flex-col min-h-[650px] space-y-3`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-200">{stg.label}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {cards.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    {cards.length === 0 ? (
                      <div className="h-32 rounded-xl border border-dashed border-white/5 flex items-center justify-center text-[11px] text-slate-500">
                        No candidates
                      </div>
                    ) : (
                      cards.map((app) => (
                        <div
                          key={app.application_id}
                          className="p-3.5 rounded-xl bg-[#0d1322] border border-white/10 hover:border-emerald-500/40 shadow-lg transition space-y-3 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p
                                onClick={() => open360IntelReport(app.candidate_id)}
                                className="font-bold text-xs text-white truncate hover:text-emerald-400 cursor-pointer transition flex items-center gap-1"
                              >
                                {app.candidate_name}
                                <Sparkles className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition" />
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">{app.candidate_title}</p>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {app.talent_score}/100
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                            <span className="truncate">{app.job_title}</span>
                            <span className="text-emerald-400 font-bold">{app.match_percentage}% match</span>
                          </div>

                          {/* Action Controls */}
                          <div className="flex items-center justify-between pt-1 gap-1">
                            <button
                              onClick={() => open360IntelReport(app.candidate_id)}
                              className="text-[10px] font-bold text-slate-300 hover:text-emerald-400 transition"
                            >
                              360° Report
                            </button>

                            <div className="flex items-center gap-1">
                              {stg.key !== "applied" && (
                                <button
                                  disabled={movingId === app.application_id}
                                  onClick={() => handleMoveStage(app.application_id, stg.key, "prev")}
                                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition"
                                  title="Move Previous Stage"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {stg.key !== "hired" && (
                                <button
                                  disabled={movingId === app.application_id}
                                  onClick={() => handleMoveStage(app.application_id, stg.key, "next")}
                                  className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 text-[10px]"
                                  title="Advance Stage"
                                >
                                  Advance
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Candidate 360° Intelligence Slide-over Modal */}
      {selectedCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0d1322] border-l border-white/10 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                    <User className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Candidate Intelligence 360° Report</h2>
                    <p className="text-xs text-slate-400">Deep telemetry, repo analytics & authenticity verification</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidateId(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {intelLoading ? (
                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                  Loading candidate intelligence 360° analytics...
                </div>
              ) : intelData ? (
                <div className="space-y-6">
                  {/* Candidate Primary Banner */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{intelData.full_name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{intelData.title} • {intelData.location}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {intelData.badges?.map((badge: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            🛡️ {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-emerald-400">{intelData.talent_score}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Talent Score</div>
                    </div>
                  </div>

                  {/* Talent Score Breakdown Grid */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-emerald-400" />
                      Multidimensional Talent Score Radar
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Coding", score: intelData.coding_score },
                        { label: "Innovation", score: intelData.innovation_score },
                        { label: "Leadership", score: intelData.leadership_score },
                        { label: "Communication", score: intelData.communication_score },
                        { label: "Community", score: intelData.community_score },
                        { label: "Consistency", score: intelData.consistency_score },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                          <p className="text-[11px] text-slate-400">{item.label}</p>
                          <p className="text-base font-bold text-white mt-1">{item.score}/100</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Repository Analytics */}
                  {intelData.repo_analytics && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <GitBranch className="w-4 h-4" />
                        GitHub Repository Analytics
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between p-2 rounded bg-black/20 text-slate-300">
                          <span>Total Commit Volume:</span>
                          <span className="font-bold text-white">{intelData.repo_analytics.total_commits}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-black/20 text-slate-300">
                          <span>PRs Merged:</span>
                          <span className="font-bold text-white">{intelData.repo_analytics.pull_requests_merged}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-black/20 text-slate-300 col-span-2">
                          <span>Code Review Rating:</span>
                          <span className="font-bold text-emerald-400">{intelData.repo_analytics.code_review_score}/100</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PPT Evaluation Score */}
                  {intelData.ppt_evaluation && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        PPT & Pitch Deck Evaluation
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-black/20 flex justify-between text-slate-300">
                          <span>Overall PPT Score:</span>
                          <span className="font-bold text-amber-400">{intelData.ppt_evaluation.overall_ppt_score}/100</span>
                        </div>
                        <div className="p-2.5 rounded bg-black/20 flex justify-between text-slate-300">
                          <span>Architecture Clarity:</span>
                          <span className="font-bold text-white">{intelData.ppt_evaluation.architecture_clarity}/100</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Authenticity Index */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">Authenticity & Fraud Verification</p>
                        <p className="text-[11px] text-slate-400">Zero plagiarism flags detected across GitHub commits</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-emerald-400">{intelData.authenticity_score}%</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setSelectedCandidateId(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Close Report
              </button>
              <Link
                href="/recruiter/copilot"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask Copilot About Candidate
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
