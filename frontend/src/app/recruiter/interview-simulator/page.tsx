"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2, ArrowLeft, Play, RefreshCw, CheckCircle, AlertTriangle, Sparkles,
  Zap, Clock, ShieldCheck, FileCode, CheckSquare, Award, ChevronRight, Terminal
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_PYTHON_CODE = `import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks

app = FastAPI(title="Resilient Production Service")
task_queue = asyncio.Queue()

@app.post("/tasks/enqueue")
async def enqueue_task(payload: dict, background_tasks: BackgroundTasks):
    """
    Enqueue asynchronous payload with rate limiting & error boundaries.
    """
    if not payload or "data" not in payload:
        raise HTTPException(status_code=422, detail="Invalid payload structure")
    
    try:
        await task_queue.put(payload)
        background_tasks.add_task(process_task, payload)
        return {"status": "accepted", "queue_size": task_queue.qsize()}
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Enqueue failed: {str(err)}")

async def process_task(payload: dict):
    # Simulated non-blocking processing
    await asyncio.sleep(0.05)
    print(f"Processed task: {payload.get('data')}")
`;

export default function LiveInterviewSimulatorPage() {
  const [problemTitle, setProblemTitle] = useState("FastAPI Asynchronous Task Queue");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);

  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const handleRunEvaluation = async () => {
    if (!code.trim()) return;
    setEvaluating(true);
    setEvalResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/interview/simulate-coding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          code: code,
          language: language,
          problem_title: problemTitle
        })
      });

      if (!res.ok) throw new Error("Evaluation request failed");
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      console.error(err);
      alert("Error evaluating code. Please verify your connection.");
    } finally {
      setEvaluating(false);
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
                AI Live Voice & Coding Technical Simulator
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Big-O Telemetry
                </span>
              </h1>
              <p className="text-xs text-slate-400">Live code execution evaluator, Big-O complexity analyzer, and technical interview scorecard generator</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/copilot"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Recruiter Copilot
          </Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Code Editor Panel */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Coding Sandbox</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-200 focus:outline-none"
                >
                  <option value="python" className="bg-[#0d1322]">Python 3.12</option>
                  <option value="typescript" className="bg-[#0d1322]">TypeScript / Node</option>
                  <option value="go" className="bg-[#0d1322]">Go 1.22</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Interview Problem Scenario</label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Code Editor Source</span>
                <span>Lines: {code.split("\n").length}</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none shadow-inner"
              />
            </div>

            <button
              onClick={handleRunEvaluation}
              disabled={evaluating || !code.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running AI Code Evaluator & Big-O Analyzer...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run AI Technical Evaluation & Test Cases
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Scorecard & Big-O Telemetry Panel */}
        <div className="lg:col-span-6 space-y-6">
          {evalResult ? (
            <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-6 animate-in fade-in">
              {/* Header Score Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Scorecard Verdict
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{evalResult.problem_title}</h2>
                  <p className="text-xs text-slate-400">Language: {evalResult.language?.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400">{evalResult.overall_score}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Overall Score</div>
                </div>
              </div>

              {/* Big-O Complexity Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Time Complexity</p>
                  <p className="text-base font-black text-emerald-400 mt-1">{evalResult.time_complexity}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Space Complexity</p>
                  <p className="text-base font-black text-cyan-400 mt-1">{evalResult.space_complexity}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Complexity Rating</p>
                  <p className="text-xs font-bold text-slate-200 mt-2">{evalResult.complexity_rating}</p>
                </div>
              </div>

              {/* Sub-Score Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-black/20 text-xs">
                  <p className="text-[10px] text-slate-400">Correctness</p>
                  <p className="font-bold text-white mt-0.5">{evalResult.correctness_score}/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/20 text-xs">
                  <p className="text-[10px] text-slate-400">Code Quality</p>
                  <p className="font-bold text-white mt-0.5">{evalResult.code_quality_score}/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/20 text-xs">
                  <p className="text-[10px] text-slate-400">Complexity</p>
                  <p className="font-bold text-white mt-0.5">{evalResult.complexity_score}/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/20 text-xs">
                  <p className="text-[10px] text-slate-400">Resilience</p>
                  <p className="font-bold text-white mt-0.5">{evalResult.resilience_score}/100</p>
                </div>
              </div>

              {/* Test Case Execution Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Automated Test Case Verification
                </h3>
                <div className="space-y-1.5">
                  {evalResult.test_case_results?.map((tc: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {tc.passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-200">{tc.test_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                        <span>{tc.latency_ms}ms</span>
                        <span className={`font-bold ${tc.passed ? "text-emerald-400" : "text-amber-400"}`}>{tc.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Interview Verdict */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs leading-relaxed text-slate-200 space-y-1">
                <p className="font-bold text-emerald-400 text-xs">🎙️ AI Audio / Text Interviewer Verdict</p>
                <p>{evalResult.interview_verdict}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Live Evaluator Telemetry</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Click **Run AI Technical Evaluation** to analyze line-by-line Big-O time and space complexity, test boundary edge cases, and generate an AI scorecard.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
