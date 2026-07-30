"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, ArrowLeft, RefreshCw, Sparkles, CheckCircle, Mail, Send,
  UserCheck, Award, Star, ExternalLink, ChevronRight, Copy, Check, GitBranch, Zap, Layers
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CandidateSourcingPage() {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Systems Architect");
  const [skillsInput, setSkillsInput] = useState("FastAPI, Python, PostgreSQL, Docker, Redis");
  const [minScore, setMinScore] = useState(80);

  const [sourcing, setSourcing] = useState(false);
  const [sourcedData, setSourcedData] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleRunHeadhunter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    setSourcing(true);
    setSourcedData(null);

    const skills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/headhunter/sourcing-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          role_title: roleTitle,
          required_skills: skills,
          min_talent_score: Number(minScore)
        })
      });

      if (!res.ok) throw new Error("Sourcing agent failed");
      const data = await res.json();
      setSourcedData(data);
    } catch (err) {
      console.error(err);
      alert("Error triggering headhunter agent. Check network session.");
    } finally {
      setSourcing(false);
    }
  };

  const handleCopySequence = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                AI Autonomous Candidate Headhunter & Sourcing Agent
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Outbound Telemetry
                </span>
              </h1>
              <p className="text-xs text-slate-400">Autonomous candidate discovery engine & multi-channel outreach sequence generator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/pipeline"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Pipeline Board
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/10 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Headhunter Sourcing Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Specify job role & required technical skill graph.</p>
            </div>

            <form onSubmit={handleRunHeadhunter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skill Graph (comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Min Talent Score Threshold</span>
                  <span className="font-bold text-emerald-400">{minScore}/100</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={95}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={sourcing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {sourcing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning Developer Graph...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Trigger AI Headhunter Agent
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-8 space-y-6">
          {sourcedData ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Sourced Candidate Alignment Results</h2>
                  <p className="text-xs text-slate-400">Found {sourcedData.total_matches_found} high-confidence matches for {sourcedData.search_role}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                  Outbound Ready
                </span>
              </div>

              <div className="space-y-4">
                {sourcedData.sourced_candidates?.map((cand: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4 hover:border-emerald-500/30 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{cand.full_name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {cand.alignment_score}% Match Alignment
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{cand.title} • @{cand.github_username}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500 text-slate-950">
                        {cand.talent_score}/100
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {cand.matching_skills?.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          ✓ {s}
                        </span>
                      ))}
                    </div>

                    {/* Generated Outreach Sequence Preview */}
                    {cand.outreach_sequence && (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            Personalized Outbound Sequence Draft
                          </span>
                          <button
                            onClick={() => handleCopySequence(cand.outreach_sequence.email_body, idx)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white/5 hover:bg-white/10 text-slate-300 transition flex items-center gap-1"
                          >
                            {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedIdx === idx ? "Copied!" : "Copy Email"}
                          </button>
                        </div>

                        <div className="text-xs font-mono text-slate-300 bg-black/30 p-3 rounded-lg leading-relaxed whitespace-pre-line">
                          <strong>Subject:</strong> {cand.outreach_sequence.email_subject}
                          <br /><br />
                          {cand.outreach_sequence.email_body}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Search className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">AI Headhunter Sourcing Agent</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Configure job role and skill graph parameters on the left and click **Trigger AI Headhunter Agent** to discover matching candidates and generate multi-step outreach sequences.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
