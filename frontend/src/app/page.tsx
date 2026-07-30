"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cpu, ArrowRight, Sparkles, Shield, GitBranch, FileText, Target, Trophy,
  Network, Users, TrendingUp, Briefcase, ChevronRight, CheckCircle
} from "lucide-react";
import AuthModal from "./components/AuthModal";

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activePortal, setActivePortal] = useState<string | null>(null);

  const stats = [
    { value: "12,400+", label: "Verified Candidates", icon: Users },
    { value: "94%",     label: "Hire Accuracy",       icon: TrendingUp },
    { value: "850+",    label: "Hackathons Hosted",   icon: Trophy },
    { value: "2,300+",  label: "Companies Hiring",    icon: Briefcase },
  ];

  const features = [
    { icon: GitBranch, title: "GitHub Intelligence",   desc: "Deep repository analysis — commits, PRs, tech stack, innovation score — all automated.", color: "text-violet-300" },
    { icon: FileText,  title: "AI Resume Parser",      desc: "Upload any PDF resume. Our AI extracts skills, experience, education, and projects instantly.", color: "text-emerald-300" },
    { icon: Target,    title: "Semantic Job Matching", desc: "Beyond keywords — our AI understands context and matches candidates to roles at 94% accuracy.", color: "text-blue-300" },
    { icon: Trophy,    title: "Hackathon Platform",    desc: "Host end-to-end hackathons with AI team formation, submission evaluation, and leaderboards.", color: "text-yellow-300" },
    { icon: Network,   title: "AI Interview Engine",   desc: "Real-time mock interviews with instant feedback, NLP scoring, and detailed scorecards.", color: "text-purple-300" },
    { icon: Shield,    title: "Authenticity Score",    desc: "Anti-fraud verification layer. Every profile is cross-referenced for skill authenticity.", color: "text-teal-300" },
  ];

  const portals = [
    {
      id: "candidate",
      href: "/candidate",
      title: "Candidate Portal",
      emoji: "🚀",
      tagline: "Build your AI-verified Talent Profile",
      desc: "Sync GitHub, parse resume, compete in hackathons, ace AI interviews, and let verified scores speak louder than any resume.",
      points: ["GitHub & Resume AI Sync", "360° Talent Score™", "Job Match Engine", "AI Interview Coach"],
    },
    {
      id: "recruiter",
      href: "/recruiter",
      title: "Recruiter OS",
      emoji: "⚡",
      tagline: "Hire with intelligence, not intuition",
      desc: "Discover verified talent with natural language search, run hiring challenges, manage pipelines, and consult your AI Copilot.",
      points: ["Natural Language Search", "360° Candidate Intel", "Hiring Pipeline Kanban", "AI Challenge Evaluator"],
    },
    {
      id: "organization",
      href: "/organization",
      title: "Community HQ",
      emoji: "🏆",
      tagline: "Power your developer community",
      desc: "Host hackathons, workshops, and bootcamps. Let AI build teams, evaluate projects, and generate ranked leaderboards.",
      points: ["Hackathon Management", "AI Team Builder", "Submission Evaluator", "Ranked Leaderboards"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-white/20">

      {/* ── Top Centered Floating Glass Navbar (Perplexity Aesthetic) ────── */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-6 md:gap-8 text-xs font-medium text-slate-200">
        <div className="flex items-center gap-2 pr-2 border-r border-white/15">
          <div className="p-1 rounded-full bg-white/20">
            <Cpu className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white tracking-wide">ApexTalent</span>
        </div>

        <div className="flex items-center gap-6 text-slate-300/90 font-light">
          <a href="#how-it-works" className="hover:text-white transition duration-200">How It Works</a>
          <a href="#ecosystem"    className="hover:text-white transition duration-200">Use Cases</a>
          <a href="#portals"      className="hover:text-white transition duration-200">Portals</a>
          <a href="#telemetry"    className="hover:text-white transition duration-200">Research Feed</a>
        </div>
      </nav>

      {/* ── Hero Section (Full Bleed Background matching reference image) ── */}
      <section className="relative w-full min-h-screen flex flex-col justify-between p-8 md:p-14 lg:p-16 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/hero_bg.png')" }}>
        {/* Subtle Dark Vignette & Atmospheric Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/30 to-[#070b12]/60 pointer-events-none" />

        {/* Top Spacer */}
        <div className="h-20" />

        {/* Hero Main Grid Layout (Fixed Baseline & Title Stability) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto max-w-7xl mx-auto w-full pt-8">
          
          {/* Bottom-Left Main Title & Subtitle - Anchored Fixed Position */}
          <div className="lg:col-span-7 space-y-3 pt-8 lg:pt-20">
            <h1 className="text-6xl md:text-8xl font-normal tracking-tight text-white leading-none font-sans">
              ApexTalent AI
            </h1>
            <p className="text-3xl md:text-4xl font-light text-slate-200/90 tracking-tight">
              Where Verified Talent Begins.
            </p>
          </div>

          {/* Middle-Right Start Exploring Action & Descriptive Paragraphs OR Login/Register Card */}
          <div className="lg:col-span-5 lg:pl-8">
            {!isAuthOpen ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white text-sm font-medium transition duration-300 shadow-2xl hover:scale-[1.03] inline-flex items-center gap-2"
                  >
                    Launch Talent →
                  </button>
                </div>

                <div className="space-y-4 text-slate-200/90 font-light text-sm md:text-base leading-relaxed">
                  <p>
                    Discovery doesn't always begin with resumes — it starts with evidence. Verified skills that guide hiring decisions forward.
                  </p>
                  <p className="text-xs md:text-sm text-slate-300/80 leading-relaxed">
                    ApexTalent AI is your companion for deeper insight. A calm, intelligent ecosystem for asking better questions and discovering thoughtful developer telemetry. Less noise. More meaning.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <AuthModal isOpen={true} onClose={() => setIsAuthOpen(false)} inline={true} />
              </div>
            )}
          </div>
        </div>

        {/* Seamless Fade-out Gradient Transition into Lower Sections */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-[#070b12]/80 to-[#070b12] pointer-events-none z-0" />
      </section>

      {/* ── Secondary Deep-Dive Ecosystem Content ────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 md:px-14 bg-[#070b12] relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-light">Ecosystem Architecture</span>
            <h2 className="text-4xl md:text-5xl font-light text-white">AI Intelligence at Every Layer</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 hover:border-white/20 transition">
                <f.icon className={`w-6 h-6 ${f.color}`} />
                <h3 className="text-lg font-medium text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three Portals Grid ────────────────────────────────────────── */}
      <section id="portals" className="py-20 px-6 md:px-14 bg-[#070b12] relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-light">Integrated Portals</span>
            <h2 className="text-4xl md:text-5xl font-light text-white">Three Portals. One Shared Intelligence.</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {portals.map((p) => (
              <div key={p.id} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6 flex flex-col justify-between hover:border-white/30 transition">
                <div className="space-y-4">
                  <span className="text-4xl">{p.emoji}</span>
                  <h3 className="text-2xl font-medium text-white">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{p.desc}</p>
                  <ul className="space-y-2 pt-2">
                    {p.points.map((pt, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-slate-300 font-light">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-white transition flex items-center justify-center gap-2 mt-6"
                >
                  Enter {p.title} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="py-12 bg-[#070b12] text-center text-xs text-slate-500 font-light relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-medium">ApexTalent AI Ecosystem</span>
        </div>
        <p>Evidence-Based Talent Intelligence Infrastructure</p>
      </footer>
    </div>
  );
}
