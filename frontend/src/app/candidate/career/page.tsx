"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Compass, Send, Sparkles, ArrowLeft, Bot, User, DollarSign, Award, Target, CheckCircle2,
  LayoutDashboard, Network, Briefcase, Trophy, FolderOpen, FileText, Map, Mic, BarChart3, ShieldCheck, Cpu, Settings
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

export default function CareerMentorPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am your AI Career Coach. Ask me about salary benchmarks, skill gaps for senior engineering roles, or interview preparation strategies!"
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
      setMessages((prev) => [...prev, { sender: "bot", text: "I recommend focusing on system design patterns and container orchestration to increase your Talent Score." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="candidate-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex candidate-dashboard-container min-h-screen">
        
        <CandidateSidebar active="career" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/candidate" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Compass className="w-6 h-6 text-violet-400" /> AI Career Coach & Skill Gap Intelligence
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Real-time career guidance, salary benchmarks, and targeted learning roadmaps.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 text-xs ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-2xl max-w-md ${m.sender === "user" ? "bg-violet-600 text-white" : "bg-slate-900 border border-white/10 text-slate-200"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-white/10 pt-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Ask about salary, system design, or skill gap analysis..."
                  className="field-input flex-1 text-xs"
                />
                <button type="submit" disabled={loading} className="btn-primary px-5 text-xs">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" /> Career Milestones
                </h3>
                <div className="p-3 bg-slate-900/60 rounded-xl space-y-1">
                  <p className="font-bold text-violet-300">Senior Backend Engineer</p>
                  <p className="text-[11px] text-slate-400">Target Benchmark: $140k – $165k</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
