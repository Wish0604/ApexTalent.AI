"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot, ArrowLeft, Send, Sparkles, RefreshCw, UserCheck, DollarSign,
  HelpCircle, Trophy, Award, GitCommit, CheckCircle, ExternalLink, ChevronRight, Zap, ShieldCheck
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  sender: "user" | "copilot";
  text: string;
  comparison_data?: any;
  salary_prediction?: any;
  interview_questions?: any[];
  suggested_actions?: string[];
}

export default function RecruiterCopilotPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Hello! I am your **AI Recruiter Copilot Agent**. I am trained to perform side-by-side candidate comparisons, predict competitive salary expectations, suggest tailored technical interview questions, and identify top talent matches.\n\nHow can I assist your hiring decision today?",
      suggested_actions: [
        "Compare top 2 candidates",
        "Predict salary range for top applicant",
        "Suggest technical interview questions",
        "Who is the strongest FastAPI candidate?"
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/copilot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: query,
          conversation_history: messages.map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!res.ok) throw new Error("Copilot response error");
      const data = await res.json();

      const copilotMsg: Message = {
        sender: "copilot",
        text: data.reply || "I analyzed your candidate dataset.",
        comparison_data: data.comparison_data,
        salary_prediction: data.salary_prediction,
        interview_questions: data.interview_questions,
        suggested_actions: data.suggested_actions || [
          "Compare top 2 candidates",
          "Predict salary range",
          "Suggest interview questions"
        ]
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: "I encountered an error accessing live candidate telemetry. Please try again."
        }
      ]);
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
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                AI Recruiter Copilot
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Candidate Comparison & Intelligence
                </span>
              </h1>
              <p className="text-xs text-slate-400">Conversational agent for candidate rankings, salary benchmarks, and interview design</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/pipeline"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Hiring Pipeline Board
          </Link>
        </div>
      </header>

      {/* Main Chat Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col justify-between space-y-6">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-2`}
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {msg.sender === "copilot" ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">Recruiter Copilot Agent</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-300">Recruiter</span>
                  </>
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm max-w-3xl leading-relaxed whitespace-pre-line shadow-lg ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                    : "bg-[#0d1322] border border-white/10 text-slate-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Special Render: Candidate Comparison Widget */}
              {msg.comparison_data && (
                <div className="w-full max-w-3xl p-5 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" />
                      Side-by-Side Candidate Comparison
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Candidate A */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-white">{msg.comparison_data.candidate_a.full_name}</p>
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500 text-slate-950">
                          {msg.comparison_data.candidate_a.talent_score}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{msg.comparison_data.candidate_a.title}</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Coding Score:</span>
                          <span className="font-bold text-slate-200">{msg.comparison_data.candidate_a.coding_score}/100</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Authenticity Index:</span>
                          <span className="font-bold text-emerald-400">{msg.comparison_data.candidate_a.authenticity_score}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Repo Commits:</span>
                          <span className="font-bold text-slate-200">{msg.comparison_data.candidate_a.github_commits}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.comparison_data.candidate_a.primary_skills?.map((s: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Candidate B */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-white">{msg.comparison_data.candidate_b.full_name}</p>
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-500 text-slate-950">
                          {msg.comparison_data.candidate_b.talent_score}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{msg.comparison_data.candidate_b.title}</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Coding Score:</span>
                          <span className="font-bold text-slate-200">{msg.comparison_data.candidate_b.coding_score}/100</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Authenticity Index:</span>
                          <span className="font-bold text-emerald-400">{msg.comparison_data.candidate_b.authenticity_score}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Repo Commits:</span>
                          <span className="font-bold text-slate-200">{msg.comparison_data.candidate_b.github_commits}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.comparison_data.candidate_b.primary_skills?.map((s: string, i: number) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Render: Salary Prediction Widget */}
              {msg.salary_prediction && (
                <div className="w-full max-w-3xl p-5 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      AI Salary Valuation & Benchmark
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                      Confidence: {msg.salary_prediction.confidence_score}%
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-300 font-semibold">{msg.salary_prediction.candidate_name} ({msg.salary_prediction.role_title})</p>
                      <p className="text-2xl font-black text-white mt-1">{msg.salary_prediction.predicted_range}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {msg.salary_prediction.market_percentile}
                    </span>
                  </div>
                </div>
              )}

              {/* Special Render: Interview Questions Widget */}
              {msg.interview_questions && (
                <div className="w-full max-w-3xl p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-3 animate-in fade-in">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Tailored Interview Question Bank
                  </span>
                  <div className="space-y-2">
                    {msg.interview_questions.map((q, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{q.category}</span>
                        <p className="text-xs font-semibold text-white">{q.question}</p>
                        <p className="text-[11px] text-slate-400">Target Evaluation: {q.evaluation_focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Action Chips */}
              {msg.suggested_actions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggested_actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(act)}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 rounded-xl text-slate-300 font-medium transition"
                    >
                      💡 {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl w-fit">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Recruiter Copilot Agent analyzing telemetry & candidate scores...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 rounded-2xl bg-[#0d1322] border border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask AI Copilot: 'Compare top candidates', 'Predict salary for Backend Arch', or 'Suggest interview questions'..."
            className="flex-1 bg-transparent border-none text-slate-100 text-sm placeholder-slate-500 focus:outline-none px-2"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
