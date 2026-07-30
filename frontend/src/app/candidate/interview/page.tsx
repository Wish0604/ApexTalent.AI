"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, ArrowLeft, RefreshCw, Send, CheckCircle, HelpCircle, Star, Sparkles
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || evaluating || questions.length === 0) return;

    const currentQ = questions[activeIdx];
    setEvaluating(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/interview/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.question,
          candidate_answer: candidateAnswer,
          expected_keywords: currentQ.expected_keywords || []
        })
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const evalData = await res.json();

      setEvaluations((prev) => ({
        ...prev,
        [activeIdx]: evalData
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const activeQuestion = questions[activeIdx];
  const activeEval = evaluations[activeIdx];

  // Calculate average score across evaluated questions
  const evalScores = Object.values(evaluations).map((e: any) => e.score);
  const avgScore = evalScores.length > 0 ? (evalScores.reduce((a, b) => a + b, 0) / evalScores.length).toFixed(1) : "N/A";

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link href="/candidate" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Hub
        </Link>
        <div className="flex items-center gap-2">
          <Award className="text-violet-400 w-5 h-5" />
          <span className="font-bold text-sm text-slate-200">AI Mock Interview Center</span>
        </div>
      </div>

      {/* Role Selection & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            AI Technical & Behavioral Mock Interview Simulator
          </h1>
          <p className="text-xs text-slate-400">Practice real-world engineering questions. Get instant evaluation on technical depth & architectural clarity.</p>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Lead FastAPI Developer"
            className="px-3 py-2 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={fetchQuestions}
            disabled={loadingQuestions}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 shrink-0"
          >
            {loadingQuestions ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "New Session"}
          </button>
        </div>
      </div>

      {/* Main Interview Workspace */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Questions List Navigation */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Interview Questions</h3>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const isEvaluated = evaluations[idx] !== undefined;
                return (
                  <button
                    key={q.id || idx}
                    onClick={() => {
                      setActiveIdx(idx);
                      setCandidateAnswer("");
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex justify-between items-center ${
                      activeIdx === idx
                        ? "bg-violet-950/40 border-violet-500 text-white font-bold"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 block">Q{idx + 1} • {q.category}</span>
                      <span className="line-clamp-1">{q.question}</span>
                    </div>
                    {isEvaluated && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overall Session Scorecard */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Session Scorecard Index</span>
            <span className="text-4xl font-black text-violet-400 block">{avgScore}</span>
            <span className="text-[10px] text-slate-400 block">Evaluated by Apex AI Evaluation Agent</span>
          </div>
        </div>

        {/* Right 2 Columns: Active Question & Answer Playground */}
        <div className="lg:col-span-2 space-y-6">
          {activeQuestion ? (
            <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
              
              {/* Question Header */}
              <div className="space-y-2 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-violet-500/10 text-violet-400 rounded text-[10px] font-bold uppercase">
                    {activeQuestion.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100 leading-relaxed">
                  {activeQuestion.question}
                </h2>
              </div>

              {/* Answer Input */}
              <form onSubmit={handleEvaluateAnswer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Your Solution / Explanation
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe your architectural design, key libraries, trade-offs, and implementation approach..."
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={evaluating || !candidateAnswer.trim()}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {evaluating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Evaluate Answer
                    </>
                  )}
                </button>
              </form>

              {/* Evaluation Feedback Card */}
              {activeEval && (
                <div className="p-6 bg-slate-950/80 rounded-xl border border-violet-900/40 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300">AI Evaluation Feedback</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-black text-emerald-400">{activeEval.score}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeEval.feedback}
                  </p>

                  {activeEval.keywords_matched.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">Matched Technical Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {activeEval.keywords_matched.map((kw: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[10px] rounded font-mono">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel p-16 rounded-2xl border border-white/5 text-center text-slate-500 text-sm italic">
              Loading interview questions...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
