"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, Sparkles, Download, ArrowLeft, RefreshCw, CheckCircle, Copy, Globe, Eye
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResumeBuilderPage() {
  const [targetRole, setTargetRole] = useState("Backend Systems Architect");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover" | "portfolio">("resume");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/candidate/resume/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole })
      });
      if (!res.ok) throw new Error("Resume generation failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = activeTab === "resume" ? result.ats_resume_markdown : activeTab === "cover" ? result.cover_letter_text : result.portfolio_html;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <Link href="/candidate" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Candidate Hub
        </Link>
        <div className="flex items-center gap-2">
          <FileText className="text-violet-400 w-5 h-5" />
          <span className="font-bold text-sm text-slate-200">AI ATS Resume & Portfolio Suite</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="text-violet-400 w-6 h-6" /> Tailor ATS Resume & Cover Letter
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              AI analyzes your verified Talent Profile, GitHub commits, and projects to dynamically format ATS-friendly resumes and tailored cover letters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch shrink-0">
            <input
              type="text"
              placeholder="e.g. Lead Cloud Architect"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500 min-w-64"
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg text-sm font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 glow-btn"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate Documents"}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Results Area */}
      {result ? (
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "resume" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> ATS Resume (Markdown)
              </button>
              <button
                onClick={() => setActiveTab("cover")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "cover" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Cover Letter
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "portfolio" ? "bg-violet-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Portfolio Web Preview
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded border border-slate-700 flex items-center gap-1.5 transition"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          {/* Document Content View */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed text-slate-200 whitespace-pre-wrap overflow-x-auto">
            {activeTab === "resume" && result.ats_resume_markdown}
            {activeTab === "cover" && result.cover_letter_text}
            {activeTab === "portfolio" && (
              <div dangerouslySetInnerHTML={{ __html: result.portfolio_html }} className="font-sans" />
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-2xl border border-white/5 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-slate-400 text-sm">Enter your target role above and click <strong>Generate Documents</strong> to build your customized ATS Resume & Cover Letter.</p>
        </div>
      )}
    </div>
  );
}
