"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2, ArrowLeft, RefreshCw, Sparkles, CheckCircle, Terminal,
  Zap, ShieldCheck, Play, Bot, ChevronRight, Layers, FileCode
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_PAIR_CODE = `import asyncio
from typing import Dict, Any

class RateLimiter:
    def __init__(self, rate_limit: int = 100):
        self.rate_limit = rate_limit
        self.requests = {}

    def is_allowed(self, client_ip: str) -> bool:
        # TODO: Add timestamp sliding window pruning
        current_count = self.requests.get(client_ip, 0)
        if current_count >= self.rate_limit:
            return False
        self.requests[client_ip] = current_count + 1
        return True
`;

export default function PairProgrammingPage() {
  const [problemTitle, setProblemTitle] = useState("FastAPI Sliding Window Rate Limiter");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_PAIR_CODE);

  const [loading, setLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<any>(null);

  const handleRunCopilot = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/pair-programming/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          code: code,
          language: language,
          current_problem: problemTitle
        })
      });

      if (!res.ok) throw new Error("Pair copilot request failed");
      const data = await res.json();
      setCopilotData(data);
    } catch (err) {
      console.error(err);
      alert("Error requesting pair copilot hints.");
    } finally {
      setLoading(false);
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
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Live Collaborative Pair Programming Sandbox
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  AI Copilot Monitor
                </span>
              </h1>
              <p className="text-xs text-slate-400">Collaborative code editor sandbox with real-time AI optimization hints and refactoring advice</p>
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
        {/* Code Editor Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Pair Sandbox Editor</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="python" className="bg-[#0d1322]">Python 3.12</option>
                <option value="typescript" className="bg-[#0d1322]">TypeScript</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Active Scenario / Task Title</label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none shadow-inner"
            />

            <button
              onClick={handleRunCopilot}
              disabled={loading || !code.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Code Pair Session...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  Request AI Pair Copilot Feedback
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Copilot Side Panel */}
        <div className="lg:col-span-5 space-y-6">
          {copilotData ? (
            <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  AI Pair Copilot Telemetry
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {copilotData.pairing_status}
                </span>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Optimization & Style Hints</h3>
                <div className="space-y-2">
                  {copilotData.suggestions?.map((sugg: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{sugg.type}</span>
                      <p className="font-semibold text-white">{sugg.title}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{sugg.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refactored Preview */}
              {copilotData.refactored_preview && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Refactored Preview</h3>
                  <pre className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-48 overflow-y-auto">
                    {copilotData.refactored_preview}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[450px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Bot className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">AI Pair Copilot Sandbox</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Type code in the editor on the left and click **Request AI Pair Copilot Feedback** for real-time refactoring hints and security suggestions.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
