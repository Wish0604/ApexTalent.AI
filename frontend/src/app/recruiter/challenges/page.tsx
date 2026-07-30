"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap, ArrowLeft, Plus, CheckCircle, RefreshCw, Cpu, Layers, Sparkles,
  Clock, Award, BookOpen, AlertCircle, FileCode, CheckSquare, BarChart3, ChevronRight, User
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RecruiterChallengesPage() {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Architect");
  const [techStackInput, setTechStackInput] = useState("FastAPI, PostgreSQL, Docker, PyTest, Redis");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [timeLimitHours, setTimeLimitHours] = useState(48);

  const [generating, setGenerating] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<any>(null);
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeTab, setActiveTab] = useState<"generator" | "hub">("generator");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoadingList(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/challenges/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setActiveChallenges(data);
      }
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleGenerateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    setGenerating(true);
    setSuccessMsg("");
    setGeneratedChallenge(null);

    const techStack = techStackInput.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/challenge/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          role_title: roleTitle,
          tech_stack: techStack,
          experience_level: experienceLevel,
          time_limit_hours: Number(timeLimitHours)
        })
      });

      if (!res.ok) throw new Error("Failed to generate challenge");
      const data = await res.json();
      setGeneratedChallenge(data);
      setSuccessMsg("✨ AI Hiring Challenge successfully generated and active!");
      fetchChallenges();
    } catch (err) {
      console.error(err);
      alert("Error generating challenge. Please check your session or network.");
    } finally {
      setGenerating(false);
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
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                AI Hiring Challenge Generator
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Agent Powered
                </span>
              </h1>
              <p className="text-xs text-slate-400">Automated problem statements, rubric weights & deliverable evaluation hub</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === "generator"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generator Agent
          </button>
          <button
            onClick={() => setActiveTab("hub")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === "hub"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Active Challenges ({activeChallenges.length})
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg("")} className="text-xs text-emerald-400/80 hover:text-emerald-300 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {activeTab === "generator" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/10 shadow-xl space-y-5">
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    Configure Agent Requirements
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Specify target role parameters to trigger AI generation.</p>
                </div>

                <form onSubmit={handleGenerateChallenge} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Senior FastAPI Systems Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Required Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="e.g. FastAPI, PostgreSQL, Docker, PyTest"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Experience Level</label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 transition"
                      >
                        <option value="junior" className="bg-[#0d1322]">Junior (0-2 yrs)</option>
                        <option value="mid" className="bg-[#0d1322]">Mid-Level (2-5 yrs)</option>
                        <option value="senior" className="bg-[#0d1322]">Senior (5-8 yrs)</option>
                        <option value="lead" className="bg-[#0d1322]">Architect / Lead</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time Limit (Hours)</label>
                      <select
                        value={timeLimitHours}
                        onChange={(e) => setTimeLimitHours(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/60 transition"
                      >
                        <option value={24} className="bg-[#0d1322]">24 Hours</option>
                        <option value={48} className="bg-[#0d1322]">48 Hours (Standard)</option>
                        <option value={72} className="bg-[#0d1322]">72 Hours</option>
                        <option value={168} className="bg-[#0d1322]">7 Days</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        Generating Agent Payload...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Challenge & Rubrics
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Sample Templates */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Preset Roles</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "FastAPI Backend Architect",
                    "Lead MLOps Engineer",
                    "Senior Fullstack React Dev",
                    "Cloud DevOps Specialist"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRoleTitle(preset);
                        if (preset.includes("ML")) setTechStackInput("PyTorch, FastAPI, Docker, Kubernetes, MLflow");
                        else if (preset.includes("React")) setTechStackInput("Next.js, TypeScript, Tailwind, Cypress");
                        else if (preset.includes("Cloud")) setTechStackInput("Terraform, AWS, Kubernetes, Helm, PyTest");
                        else setTechStackInput("FastAPI, PostgreSQL, Docker, PyTest, Redis");
                      }}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 rounded-lg text-slate-300 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Challenge Preview Column */}
            <div className="lg:col-span-7 space-y-6">
              {generatedChallenge ? (
                <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 shadow-2xl space-y-6 animate-in fade-in">
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {generatedChallenge.challenge_type?.toUpperCase()} CHALLENGE
                      </span>
                      <h2 className="text-xl font-bold text-white mt-2">{generatedChallenge.title}</h2>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {generatedChallenge.time_limit_hours} Hours Allocated
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-yellow-400" />
                          Level: {generatedChallenge.experience_level || "Mid-Senior"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("hub")}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1"
                    >
                      View in Hub
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      Problem Statement
                    </h3>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-200 leading-relaxed font-mono text-[13px]">
                      {generatedChallenge.problem_statement}
                    </div>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedChallenge.tech_stack?.map((tech: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      Deliverable Requirements Checklist
                    </h3>
                    <div className="space-y-2">
                      {generatedChallenge.deliverables?.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation Rubrics */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      AI Evaluation Rubric Weights
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(generatedChallenge.evaluation_rubric || {}).map(([key, val]: any, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <span className="text-xs text-slate-400 capitalize">{key.replace("_weight", "").replace(/_/g, " ")}</span>
                          <span className="text-xs font-bold text-emerald-400">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Scenarios */}
                  {generatedChallenge.test_scenarios && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        Automated Validation Criteria
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-1">
                        {generatedChallenge.test_scenarios.map((sc: string, i: number) => (
                          <li key={i}>{sc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[500px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">AI Agent Challenge Preview</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Fill out the parameters on the left and click **Generate AI Challenge** to construct automated problem statements, rubric weights, and deliverables.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Active Challenges Hub Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Active Recruiter Challenges</h2>
                <p className="text-xs text-slate-400">All hiring challenges active across candidate pipelines</p>
              </div>
              <button
                onClick={() => setActiveTab("generator")}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create New Challenge
              </button>
            </div>

            {loadingList ? (
              <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                Loading challenges...
              </div>
            ) : activeChallenges.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0d1322] border border-white/10 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No active challenges found.</p>
                <button
                  onClick={() => setActiveTab("generator")}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white"
                >
                  Generate First Challenge
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map((ch) => {
                  const deliverables = typeof ch.deliverables_json === "string" 
                    ? JSON.parse(ch.deliverables_json || "[]") 
                    : (ch.deliverables || []);
                  return (
                    <div key={ch.id} className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 hover:border-emerald-500/40 transition space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {ch.challenge_type || "Coding"}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {ch.deadline_days} Days
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-white line-clamp-1">{ch.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-3">{ch.description}</p>
                      </div>

                      <div className="border-t border-white/5 pt-3 space-y-2">
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Deliverables count:</span>
                          <span className="font-bold text-slate-200">{deliverables.length} items</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="badge badge-emerald text-[10px]">Active</span>
                          <Link href={`/recruiter?tab=pipeline`} className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
                            Assign to Applicant
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
