"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, ArrowLeft, GitBranch, FileText, Globe, Send, RefreshCw, CheckCircle2, Sparkles
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CandidateHackathonSubmissionPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [pptUrl, setPptUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("FastAPI, React, PostgreSQL, Docker");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !githubUrl) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const stackList = techStack.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(`${API_URL}/api/v1/organization/hackathon/1/submit-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_title: projectTitle,
          github_url: githubUrl,
          ppt_url: pptUrl || "https://slides.com/demo-pitch.pdf",
          demo_url: demoUrl || "https://demo-app.com",
          tech_stack: stackList,
          team_members: []
        })
      });
      if (!res.ok) throw new Error("Project submission failed");
      setSuccess(true);
      setProjectTitle("");
      setGithubUrl("");
      setPptUrl("");
      setDemoUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link href="/candidate" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Hub
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <span className="font-bold text-sm text-slate-200">Hackathon Project Submission Hub</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" /> Submit Hackathon Deliverables
          </h1>
          <p className="text-slate-400 text-sm">
            Submit your repository, pitch deck, and live demo URL. The AI Evaluation Agent will run automated code architecture & presentation judging.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Project submitted successfully! It has been entered into the AI evaluation queue and added to the Live Leaderboard.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. ApexTalent Autonomous Agent System"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-violet-400" /> GitHub Repository URL
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/username/project-repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Pitch Deck / PPT URL
              </label>
              <input
                type="url"
                placeholder="https://slides.com/demo.pdf"
                value={pptUrl}
                onChange={(e) => setPptUrl(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-400" /> Live Demo URL
              </label>
              <input
                type="url"
                placeholder="https://my-app.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              placeholder="FastAPI, React, PostgreSQL, Docker"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 disabled:opacity-50 rounded-lg text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Project for AI Judging
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
