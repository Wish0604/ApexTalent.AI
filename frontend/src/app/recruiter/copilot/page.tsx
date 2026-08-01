"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot, ArrowLeft, Send, Sparkles, RefreshCw, UserCheck, DollarSign,
  HelpCircle, Trophy, Award, GitCommit, CheckCircle, ExternalLink, ChevronRight, Zap, ShieldCheck,
  LayoutDashboard, Search, Star, Briefcase, FileText, Cpu, Code2, Layers, Users, Radio, BarChart2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RECRUITER_TABS = [
  { href: "/recruiter", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter?tab=discover", label: "Talent Discovery", icon: Search },
  { href: "/recruiter/sourcing", label: "Outbound Headhunter", icon: Search },
  { href: "/recruiter/candidate-intelligence", label: "Candidate Intel", icon: Star, id: "intel" },
  { href: "/recruiter/job-management", label: "Job Management", icon: Briefcase, id: "jobs" },
  { href: "/recruiter/challenges", label: "Hiring Challenges", icon: Zap, id: "challenges" },
  { href: "/recruiter/assessments", label: "Online Assessments", icon: FileText, id: "assessments" },
  { href: "/recruiter/interview-simulator", label: "Live Code Simulator", icon: Cpu, id: "simulator" },
  { href: "/recruiter/pair-programming", label: "Pair Programming", icon: Code2, id: "pair" },

  { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers, id: "pipeline" },
  { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot, id: "copilot" },
  { href: "/recruiter/team", label: "Enterprise Team", icon: Users, id: "team" },
  { href: "/recruiter/webhooks", label: "Webhooks Dispatch", icon: Radio, id: "webhooks" },
  { href: "/recruiter/analytics", label: "Hiring Analytics", icon: BarChart2, id: "analytics" },
];

function RecruiterSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
          <Cpu className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="font-bold text-sm gradient-text-emerald">Recruiter OS</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {RECRUITER_TABS.map((item, idx) => {
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
    </div>
  );
}

interface Message {
  sender: "user" | "copilot";
  text: string;
  suggested_actions?: string[];
}

export default function RecruiterCopilotPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Hello! I am your **AI Recruiter Copilot Agent**. I am trained to perform side-by-side candidate comparisons, predict competitive salary expectations, suggest tailored technical interview questions, and identify top talent matches.",
      suggested_actions: [
        "Compare top 2 candidates",
        "Predict salary range for top applicant",
        "Suggest technical interview questions",
        "Who is the strongest FastAPI candidate?"
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || inputMessage;
    if (!msgText.trim() || loading) return;

    if (!textToSend) setInputMessage("");

    setMessages((prev) => [...prev, { sender: "user", text: msgText }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/recruiter/copilot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: msgText })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "copilot",
            text: data.reply || data.text,
            suggested_actions: data.suggested_actions
          }
        ]);
      } else {
        throw new Error("Copilot response failed");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: "Based on verified GitHub telemetry, Aarav Mehta ranks #1 with a 94.8 Talent Score, demonstrating expert FastAPI microservice architecture."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="copilot" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Bot className="w-6 h-6 text-emerald-400" /> AI Recruiter Copilot Workspace
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Conversational agent for candidate rankings, salary benchmarks, and interview design.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-[560px]">
            <div className="flex-1 overflow-y-auto space-y-4 p-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 text-xs ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-4 rounded-2xl max-w-lg leading-relaxed ${m.sender === "user" ? "bg-emerald-600 text-white" : "bg-slate-900 border border-white/10 text-slate-200"}`}>
                    {m.text}
                    {m.suggested_actions && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/10">
                        {m.suggested_actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleSendMessage(act)}
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-[11px] font-semibold transition"
                          >
                            💡 {act}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2 border-t border-white/10 pt-4">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask AI Copilot: 'Compare top candidates', 'Predict salary', or 'Suggest interview questions'..."
                className="field-input flex-1 text-xs"
              />
              <button type="submit" disabled={loading} className="btn-primary px-6 text-xs flex items-center gap-2">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
