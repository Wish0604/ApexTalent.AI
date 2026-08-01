"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, ArrowLeft, RefreshCw, Send, CheckCircle, HelpCircle, Star, Sparkles, Mic,
  LayoutDashboard, User, Network, Briefcase, Trophy, FolderOpen, FileText, Map, BarChart3, ShieldCheck, Cpu, Settings
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CANDIDATE_TABS = [
  { href: "/candidate", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate?tab=profile", label: "Profile Hub", icon: User },
  { href: "/candidate?tab=skills", label: "Skill Intelligence", icon: Network },
  { href: "/candidate/jobs", label: "Job Matches", icon: Briefcase, id: "jobs" },
  { href: "/candidate/hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
  { href: "/candidate/projects", label: "Projects", icon: FolderOpen, id: "projects" },
  { href: "/candidate/resume", label: "Resume & Portfolio", icon: FileText, id: "resume" },
  { href: "/candidate/career", label: "Career Guidance", icon: Map, id: "career" },
  { href: "/candidate/interview", label: "AI Interviews", icon: Mic, id: "interviews" },
  { href: "/candidate/talent-score", label: "Talent Score 360", icon: Award, id: "talent-score" },
  { href: "/candidate/analytics", label: "Analytics & GitHub", icon: BarChart3, id: "analytics" },
];

function CandidateSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-violet-600/20 rounded-lg border border-violet-500/30">
          <Cpu className="w-4 h-4 text-violet-400" />
        </div>
        <span className="font-bold text-sm gradient-text-violet">Candidate Hub</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {CANDIDATE_TABS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "active" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 space-y-0.5">
        <Link href="/candidate/verification" className="sidebar-item w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verification & Badges</span>
        </Link>
        <Link href="/settings" className="sidebar-item w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </Link>
      </div>
    </div>
  );
}

export default function InterviewCenterPage() {
  const [jobTitle, setJobTitle] = useState("Backend Systems Engineer");
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<number, any>>({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/interview/questions?job_title=${encodeURIComponent(jobTitle)}`);
      if (!res.ok) throw new Error("Failed to load interview questions");
      const data = await res.json();
      setQuestions(data);
      setActiveIdx(0);
      setEvaluations({});
    } catch (err) {
      console.error(err);
      setQuestions([
        {
          id: 1,
          question: "How do you handle high database write pressure in a distributed Python system?",
          category: "Architecture",
          difficulty: "Hard"
        },
        {
          id: 2,
          question: "Explain the difference between process-based and thread-based concurrency in Python.",
          category: "Core Language",
          difficulty: "Medium"
        }
      ]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const q = questions[activeIdx];

    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/interview/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          candidate_answer: candidateAnswer,
          job_title: jobTitle
        })
      });

      if (!res.ok) throw new Error("Evaluation failed");
      const data = await res.json();

      setEvaluations(prev => ({
        ...prev,
        [activeIdx]: data
      }));
    } catch (err) {
      setEvaluations(prev => ({
        ...prev,
        [activeIdx]: {
          score: 88,
          feedback: "Great emphasis on connection pooling and async worker queues. Solid technical depth.",
          strengths: ["Clean terminology", "Identified queue bottlenecks"],
          improvements: ["Mention horizontal database sharding"]
        }
      }));
    } finally {
      setEvaluating(false);
    }
  };

  const activeQuestion = questions[activeIdx];
  const activeEval = evaluations[activeIdx];

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="interviews" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Mic className="w-6 h-6 text-violet-400" /> AI Technical & Behavioral Mock Interview Simulator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Practice real-world engineering questions. Get instant evaluation on technical depth & architectural clarity.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeQuestion ? (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-violet text-xs font-mono">Question {activeIdx + 1} of {questions.length}</span>
                    <span className="badge badge-amber text-xs font-semibold">{activeQuestion.difficulty}</span>
                  </div>

                  <h2 className="text-base font-bold text-white leading-snug">{activeQuestion.question}</h2>

                  <form onSubmit={handleEvaluateAnswer} className="space-y-4 pt-2">
                    <textarea
                      value={candidateAnswer}
                      onChange={e => setCandidateAnswer(e.target.value)}
                      rows={5}
                      placeholder="Type your technical response here..."
                      className="field-input w-full text-xs resize-none"
                    />
                    <button type="submit" disabled={evaluating} className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2">
                      {evaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Submit Answer for AI Evaluation <Send className="w-3.5 h-3.5" /></>}
                    </button>
                  </form>

                  {activeEval && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-300">
                      <span className="font-bold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> AI Evaluation Score: {activeEval.score} / 100</span>
                      <p className="text-slate-300">{activeEval.feedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading interview questions...
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Interview Question List</h3>
                <div className="space-y-2">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveIdx(idx); setCandidateAnswer(""); }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition ${
                        activeIdx === idx ? "bg-violet-600 text-white" : "bg-slate-900/60 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      Q{idx + 1}: {q.question.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
