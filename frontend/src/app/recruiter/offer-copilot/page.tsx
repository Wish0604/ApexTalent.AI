"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign, ArrowLeft, RefreshCw, CheckCircle, Sparkles, Trophy,
  ShieldCheck, Copy, Check, FileText, ChevronRight, Zap, TrendingUp, User
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OfferCopilotPage() {
  const [candidateName, setCandidateName] = useState("Aarav Mehta");
  const [proposedBase, setProposedBase] = useState(145000);
  const [proposedEquity, setProposedEquity] = useState("0.15%");
  const [proposedBonus, setProposedBonus] = useState(15000);
  const [maxBudget, setMaxBudget] = useState(180000);

  const [loading, setLoading] = useState(false);
  const [offerResult, setOfferResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateOffer = async () => {
    setLoading(true);
    setOfferResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/offer/negotiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          candidate_id: 1,
          proposed_base: Number(proposedBase),
          proposed_equity: proposedEquity,
          proposed_bonus: Number(proposedBonus),
          recruiter_max_budget: Number(maxBudget)
        })
      });

      if (!res.ok) throw new Error("Offer generation failed");
      const data = await res.json();
      setOfferResult(data);
    } catch (err) {
      console.error(err);
      alert("Error generating offer strategy. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLetter = () => {
    if (!offerResult?.offer_letter_markdown) return;
    navigator.clipboard.writeText(offerResult.offer_letter_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                AI Offer & Negotiation Copilot
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Retention Analytics
                </span>
              </h1>
              <p className="text-xs text-slate-400">Competitive package optimizer, retention probability analyzer & counter-offer strategy generator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/pipeline"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Pipeline Board
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/10 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Target Offer Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Configure proposed base, equity, and maximum budget headroom.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Candidate Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Proposed Base Salary ($)</span>
                  <span className="font-bold text-emerald-400">${proposedBase.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={80000}
                  max={250000}
                  step={5000}
                  value={proposedBase}
                  onChange={(e) => setProposedBase(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Proposed Sign-on Bonus ($)</span>
                  <span className="font-bold text-emerald-400">${proposedBonus.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={2500}
                  value={proposedBonus}
                  onChange={(e) => setProposedBonus(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Equity Option Grant (%)</label>
                <input
                  type="text"
                  value={proposedEquity}
                  onChange={(e) => setProposedEquity(e.target.value)}
                  placeholder="e.g. 0.15%"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-300">Recruiter Maximum Budget Cap ($)</span>
                  <span className="font-bold text-amber-400">${maxBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={300000}
                  step={5000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                onClick={handleGenerateOffer}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Negotiation Telemetry...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Formulate AI Offer & Counter Strategies
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {offerResult ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Retention Probability & Valuation Card */}
              <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Retention & Market Telemetry
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">{offerResult.candidate_name}</h2>
                    <p className="text-xs text-slate-400">{offerResult.role_title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-400">${offerResult.total_package?.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Total Target Package</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400">Retention Likelihood Score</p>
                    <p className="text-xl font-black text-emerald-400">{offerResult.retention_probability}%</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[11px] text-slate-400">Market Positioning</p>
                    <p className="text-xs font-bold text-white mt-1.5">{offerResult.market_percentile}</p>
                  </div>
                </div>
              </div>

              {/* 3 Counter-Offer Strategy Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  AI Negotiation Counter-Offer Strategies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offerResult.strategies?.map((strat: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl bg-[#0d1322] border space-y-3 flex flex-col justify-between ${
                        idx === 1 ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10" : "border-white/10"
                      }`}
                    >
                      <div className="space-y-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          idx === 1 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-slate-300"
                        }`}>
                          {strat.strategy_name}
                        </span>
                        <p className="text-lg font-black text-white">{strat.total_value}</p>
                        <p className="text-xs text-slate-400">Base: {strat.base_salary} • Equity: {strat.equity}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{strat.recruiter_note}</p>
                      </div>

                      <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Acceptance Rate:</span>
                        <span className="font-bold text-emerald-400">{strat.acceptance_likelihood}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draft Offer Letter Card */}
              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Generated Formal Offer Letter Draft
                  </span>
                  <button
                    onClick={handleCopyLetter}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied to Clipboard!" : "Copy Letter"}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                  {offerResult.offer_letter_markdown}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">AI Offer Negotiation Copilot</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Configure the offer sliders on the left and click **Formulate AI Offer** to compute market percentiles, retention probabilities, and 3 counter-offer strategies.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
