"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, Send, Sparkles, ArrowLeft, Bot, User, DollarSign, Award, Target, CheckCircle2
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CareerMentorPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am your AI Career Mentor. I've analyzed your verified Talent Profile. Ask me about salary benchmarks, skill gaps for senior roles, or interview preparation tips!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/career/mentor-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      if (!res.ok) throw new Error("Chat response failed");
      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm having trouble connecting to the mentor service right now, but keep building verified projects to increase your score!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link href="/candidate" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Hub
        </Link>
        <div className="flex items-center gap-2">
          <Compass className="text-emerald-400 w-5 h-5" />
          <span className="font-bold text-sm text-slate-200">AI Career Guidance & Mentor</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Conversational AI Mentor */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[650px]">
          
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
                Apex AI Career Mentor <Sparkles className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">Calibrated to live global market intelligence & verified profile stats</p>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-lg ${
                    m.sender === "user"
                      ? "bg-violet-600 text-white rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    YOU
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 italic">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-400" /> Mentor is formulating guidance...
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ask mentor: 'What is the salary range for my stack?' or 'What skills should I learn next?'..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>

        </div>

        {/* Right Column: Salary Predictions & Skill Gap Checklist */}
        <div className="space-y-6">
          
          {/* Salary Benchmark Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> AI Salary Intelligence
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Predicted Market Salary</span>
              <span className="text-3xl font-black text-emerald-400 block">$135,000 - $165,000</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Calculated based on verified Python, FastAPI, and Docker skills + top 15% GitHub activity index.
              </p>
            </div>
          </div>

          {/* Skill Gap Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> Senior Architect Skill Gaps
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">FastAPI & Async Microservices</span>
                  <span className="text-slate-500 text-[10px]">Verified via GitHub repository inspection</span>
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block">Relational Database Optimization</span>
                  <span className="text-slate-500 text-[10px]">PostgreSQL indexing & query plan tuning</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-violet-900/50 flex items-start gap-2">
                <Award className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-violet-300 block">Recommended: Vector DB (Qdrant)</span>
                  <span className="text-slate-400 text-[10px]">Adding vector search will unlock AI Platform roles</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
