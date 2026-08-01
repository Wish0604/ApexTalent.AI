"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Award, FileText, CheckCircle2, AlertTriangle, Upload,
  GitBranch, Cpu, ArrowLeft, RefreshCw, Lock, Zap
} from "lucide-react";

export default function VerificationPage() {
  const [uploading, setUploading] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certList, setCertList] = useState([
    { id: 1, name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", score: "99.2% Authentic", date: "2026-05-12", verified: true },
    { id: 2, name: "FastAPI Production Systems Certification", issuer: "Python Software Foundation", score: "97.8% Authentic", date: "2026-03-20", verified: true }
  ]);

  const handleUploadCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateName) return;
    setUploading(true);
    setTimeout(() => {
      setCertList([
        {
          id: Date.now(),
          name: certificateName,
          issuer: "Verified Issuing Authority",
          score: "98.5% Authentic",
          date: new Date().toISOString().split("T")[0],
          verified: true
        },
        ...certList
      ]);
      setCertificateName("");
      setUploading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/candidate" className="inline-flex items-center gap-2 text-xs text-violet-400 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidate Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Talent Verification & Verification Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Verify your technical credentials, certificates, GitHub telemetry, and identity badges for recruiters.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Verified Talent Status: Level 3 (Highest)</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Verification Overview Widgets */}
        <div className="md:col-span-2 space-y-6">
          {/* Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <GitBranch className="w-4 h-4 text-violet-400" /> GitHub Verification
              </div>
              <p className="text-lg font-bold text-slate-100">100% Authentic</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Commits Verified
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <Award className="w-4 h-4 text-emerald-400" /> Skill Verification
              </div>
              <p className="text-lg font-bold text-slate-100">15 Badges</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> AI Evaluated Code
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Identity Audit
              </div>
              <p className="text-lg font-bold text-slate-100">Passed</p>
              <p className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Candidate
              </p>
            </div>
          </div>

          {/* Upload New Certificate */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" /> Upload & Verify Certificate / License
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Our AI verification model analyzes PDF/Image certificates, cross-checks issuing authority signatures, and assigns authenticity badges.
            </p>

            <form onSubmit={handleUploadCert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Certificate Title</label>
                <input
                  type="text"
                  placeholder="e.g. Certified Kubernetes Administrator (CKA)"
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="border-2 border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 text-center transition cursor-pointer bg-slate-950/40">
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">Click or drag & drop certificate document (PDF, PNG, JPG)</p>
                <p className="text-[10px] text-slate-500 mt-1">Maximum size 10MB &bull; Automated OCR & signature audit</p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/30"
              >
                <Zap className="w-3.5 h-3.5" /> {uploading ? "Analyzing & Verifying..." : "Upload & Run AI Verification"}
              </button>
            </form>
          </div>

          {/* Verified Credentials List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Verified Certificates & Licenses</h2>

            <div className="space-y-3">
              {certList.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{cert.name}</h4>
                      <p className="text-[11px] text-slate-400">{cert.issuer} &bull; Verified on {cert.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      {cert.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Audit Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" /> GitHub Telemetry Audit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI cross-references commit history, code structure, and pull request activity to prevent fake portfolio claims.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-800/40 rounded-xl">
                <span className="text-slate-400">Total Valid Commits</span>
                <span className="font-bold text-slate-200">1,420</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-800/40 rounded-xl">
                <span className="text-slate-400">Original Repositories</span>
                <span className="font-bold text-slate-200">28</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-800/40 rounded-xl">
                <span className="text-slate-400">Plagiarism Check</span>
                <span className="font-bold text-emerald-400">0% Flagged</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border border-violet-500/30 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-violet-300 mb-2">Verified Recruiter Badge</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Verified candidates receive a green checkmark badge next to their name in Recruiter Search, granting top priority in headhunter results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
