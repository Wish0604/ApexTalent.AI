"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Brain, ShieldCheck, Award, GitBranch, FileText, ArrowLeft, RefreshCw,
  Sparkles, CheckCircle2, AlertTriangle, Scale, Cpu, Search
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OrganizationEvaluationsPage() {
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>({
    team_name: "NeuralFlow AI",
    project_name: "Autonomous Code Telemetry Engine",
    repository_url: "https://github.com/apextalent/telemetry-engine",
    ai_score: 94.8,
    originality_rating: "100% Verified Clean",
    plagiarism_risk: "0.0% (Zero Similarity)",
    code_architecture_score: 96,
    ppt_deck_clarity: 92,
    judges_consensus: "Rank 1 (Gold Winner Eligible)"
  });

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
                <Brain className="w-6 h-6 text-emerald-400" /> AI Submission Evaluation & Judges Matrix
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Automated repository AST analysis, pitch deck structure verification, plagiarism detection, and leaderboards.</p>
            </div>
          </div>
        </div>

        {/* Top Evaluation Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evaluated Projects</span>
            <div className="text-2xl font-black text-white">48 Submissions</div>
            <p className="text-[10px] text-emerald-400">100% Automated Audit</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average Innovation Score</span>
            <div className="text-2xl font-black text-violet-400">89.4 / 100</div>
            <p className="text-[10px] text-slate-400">High Code Quality</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plagiarism Violations</span>
            <div className="text-2xl font-black text-emerald-400">0 Flagged</div>
            <p className="text-[10px] text-slate-400">On-chain AST Verification</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Judges Alignment</span>
            <div className="text-2xl font-black text-amber-400">98.2%</div>
            <p className="text-[10px] text-slate-400">Consensus Achieved</p>
          </div>
        </div>

        {/* Selected Project Evaluation Detail */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="badge badge-amber text-[10px] mb-1 inline-block font-mono">Rank 1 Submission</span>
              <h2 className="text-xl font-black text-white">{selectedSubmission.project_name}</h2>
              <p className="text-xs text-slate-400 mt-1">Submitted by <strong className="text-slate-200">{selectedSubmission.team_name}</strong> • {selectedSubmission.repository_url}</p>
            </div>
            <span className="text-2xl font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              {selectedSubmission.ai_score} AI Score
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-500">Code Architecture Score</span>
              <p className="text-xl font-black text-violet-400">{selectedSubmission.code_architecture_score} / 100</p>
              <p className="text-[10px] text-slate-400">Clean Microservice Pattern</p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-500">PPT & Pitch Deck Analysis</span>
              <p className="text-xl font-black text-indigo-400">{selectedSubmission.ppt_deck_clarity} / 100</p>
              <p className="text-[10px] text-slate-400">High Executive Clarity</p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-500">Plagiarism & Anti-Fraud</span>
              <p className="text-xl font-black text-emerald-400">{selectedSubmission.originality_rating}</p>
              <p className="text-[10px] text-slate-400">{selectedSubmission.plagiarism_risk}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
