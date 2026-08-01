"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, ArrowLeft, RefreshCw, Sparkles, CheckCircle, HelpCircle,
  Code2, Clock, Award, Plus, ChevronRight, Layers, BookOpen, Send,
  LayoutDashboard, Search, Star, Briefcase, Zap, Cpu, DollarSign, Bot, Users, Radio, BarChart2
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
  { href: "/recruiter/offers", label: "Offer & Negotiation", icon: DollarSign, id: "offers" },
  { href: "/recruiter/pipeline", label: "Hiring Pipeline", icon: Layers, id: "pipeline" },
  { href: "/recruiter/copilot", label: "AI Copilot", icon: Bot, id: "copilot" },
  { href: "/recruiter/team", label: "Enterprise Team", icon: Users },
  { href: "/recruiter/webhooks", label: "Webhooks Dispatch", icon: Radio },
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

export default function OnlineAssessmentsPage() {
  const [roleTitle, setRoleTitle] = useState("FastAPI Backend Systems Architect");
  const [techStackInput, setTechStackInput] = useState("FastAPI, PostgreSQL, Redis, PyTest");
  const [mcqCount, setMcqCount] = useState(5);
  const [codingCount, setCodingCount] = useState(1);
  const [timeLimitMins, setTimeLimitMins] = useState(60);

  const [generating, setGenerating] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);

  const handleGenerateOA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    setGenerating(true);
    setAssessmentData(null);

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

      if (res.ok) {
        const data = await res.json();
        setAssessmentData(data);
      } else {
        alert("Failed to generate Online Assessment.");
      }
    } catch (err) {
      alert("Error generating Online Assessment. Please check session/network.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="recruiter-dashboard-bg relative min-h-screen text-slate-100 font-sans">
      <div className="recruiter-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex recruiter-dashboard-container min-h-screen">
        
        <RecruiterSidebar active="assessments" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/recruiter" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-400" /> Automated Online Assessment (OA) Generator
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Generate timed multiple-choice architecture exams, coding prompts, and automated rubrics.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> OA Test Suite Parameters
                </h2>

                <form onSubmit={handleGenerateOA} className="space-y-4 text-xs">
                  <div>
                    <label className="field-label">Target Role Title</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={e => setRoleTitle(e.target.value)}
                      className="field-input w-full mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="field-label">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={e => setTechStackInput(e.target.value)}
                      className="field-input w-full mt-1"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2"
                  >
                    {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Construct AI Online Assessment <FileText className="w-3.5 h-3.5" /></>}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {assessmentData ? (
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-5 animate-fade-in">
                  <h2 className="text-lg font-black text-white">{assessmentData.title}</h2>
                  <p className="text-xs text-slate-300">{assessmentData.instructions}</p>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl text-slate-500 italic space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Configure parameters to generate AI Online Assessments.</p>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
