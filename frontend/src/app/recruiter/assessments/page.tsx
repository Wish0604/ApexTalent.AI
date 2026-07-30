"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, ArrowLeft, RefreshCw, Sparkles, CheckCircle, HelpCircle,
  Code2, Clock, Award, Plus, ChevronRight, Layers, BookOpen, Send
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OnlineAssessmentsPage() {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Systems Architect");
  const [techStackInput, setTechStackInput] = useState("FastAPI, PostgreSQL, Redis, PyTest");
  const [mcqCount, setMcqCount] = useState(5);
  const [codingCount, setCodingCount] = useState(1);
  const [timeLimitMins, setTimeLimitMins] = useState(60);

  const [generating, setGenerating] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const handleGenerateOA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    setGenerating(true);
    setAssessmentData(null);
    setAssignedSuccess(false);

    const techStack = techStackInput.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/assessment/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          role_title: roleTitle,
          tech_stack: techStack,
          mcq_count: Number(mcqCount),
          coding_count: Number(codingCount),
          time_limit_mins: Number(timeLimitMins)
        })
      });

      if (!res.ok) throw new Error("Assessment generation failed");
      const data = await res.json();
      setAssessmentData(data);
    } catch (err) {
      console.error(err);
      alert("Error generating Online Assessment. Please check session/network.");
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
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Automated Online Assessment (OA) Generator
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Agent Test Suites
                </span>
              </h1>
              <p className="text-xs text-slate-400">Generate timed multiple-choice architecture exams, coding prompts, and automated rubrics</p>
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
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/10 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                OA Test Suite Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Specify job role & target question distribution.</p>
            </div>

            <form onSubmit={handleGenerateOA} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Architecture MCQs</label>
                  <select
                    value={mcqCount}
                    onChange={(e) => setMcqCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:outline-none"
                  >
                    <option value={3} className="bg-[#0d1322]">3 Questions</option>
                    <option value={5} className="bg-[#0d1322]">5 Questions (Standard)</option>
                    <option value={10} className="bg-[#0d1322]">10 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Limit (Minutes)</label>
                  <select
                    value={timeLimitMins}
                    onChange={(e) => setTimeLimitMins(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 text-xs focus:outline-none"
                  >
                    <option value={30} className="bg-[#0d1322]">30 Minutes</option>
                    <option value={60} className="bg-[#0d1322]">60 Minutes (Standard)</option>
                    <option value={90} className="bg-[#0d1322]">90 Minutes</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Constructing Test Suite...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Construct AI Online Assessment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Preview Column */}
        <div className="lg:col-span-7 space-y-6">
          {assessmentData ? (
            <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Generated Assessment Suite
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{assessmentData.assessment_title}</h2>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {assessmentData.time_limit_mins} Mins Allotted
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-yellow-400" />
                      Total Score: {assessmentData.total_points} Points
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setAssignedSuccess(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Assign to Pipeline
                </button>
              </div>

              {assignedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Assessment suite successfully assigned to active candidate pipeline applicants!
                </div>
              )}

              {/* MCQ Question List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  Multiple-Choice Architecture Exam ({assessmentData.mcq_questions?.length} Questions)
                </h3>
                <div className="space-y-3">
                  {assessmentData.mcq_questions?.map((q: any) => (
                    <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-400 text-[10px]">
                        <span className="uppercase font-bold text-emerald-400">{q.category}</span>
                        <span>10 Points</span>
                      </div>
                      <p className="font-semibold text-white">{q.id}. {q.question}</p>
                      <div className="space-y-1 pl-2">
                        {q.options?.map((opt: string, i: number) => (
                          <div key={i} className={`p-1.5 rounded text-[11px] ${opt.startsWith(q.correct_answer) ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coding Prompt Card */}
              {assessmentData.coding_challenge && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    Live Algorithmic Coding Challenge (50 Points)
                  </h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                    <h4 className="font-bold text-white text-sm">{assessmentData.coding_challenge.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{assessmentData.coding_challenge.problem_description}</p>
                    <div className="pt-2 border-t border-white/5 flex justify-between text-[11px] text-slate-400">
                      <span>Target Complexity: {assessmentData.coding_challenge.expected_complexity}</span>
                      <span>Budget: {assessmentData.coding_challenge.time_budget_mins} mins</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Online Assessment Preview</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Configure role title and question parameters on the left and click **Construct AI Online Assessment** to generate architecture MCQs and coding challenges.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
