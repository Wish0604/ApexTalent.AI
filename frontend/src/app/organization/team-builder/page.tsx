"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users, Sparkles, UserPlus, ArrowLeft, CheckCircle, Search,
  Award, Layers, Cpu, ShieldCheck, Zap
} from "lucide-react";

export default function AITeamBuilderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const candidatesList = [
    { id: 1, name: "Aarav Mehta", title: "Backend Systems Architect", skills: ["Python", "FastAPI", "Docker", "PostgreSQL"], score: 94.5, role: "Backend Lead" },
    { id: 2, name: "Neha Sharma", title: "Frontend & UI Design Lead", skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"], score: 96.2, role: "Frontend Lead" },
    { id: 3, name: "Vikram Malhotra", title: "Machine Learning Engineer", skills: ["PyTorch", "Hugging Face", "LangChain", "Qdrant"], score: 95.8, role: "AI Specialist" },
    { id: 4, name: "Priya Nair", title: "Full Stack Engineer", skills: ["Node.js", "TypeScript", "GraphQL", "AWS"], score: 91.0, role: "Fullstack Dev" },
    { id: 5, name: "Rohan Kapoor", title: "DevOps & Cloud Engineer", skills: ["Kubernetes", "Docker", "Terraform", "CI/CD"], score: 89.5, role: "DevOps Engineer" }
  ];

  const handleAutoTeamMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setSelectedCandidates(candidatesList.slice(0, 3));
      setIsMatching(false);
    }, 1000);
  };

  const toggleSelectCandidate = (cand: any) => {
    if (selectedCandidates.find((c) => c.id === cand.id)) {
      setSelectedCandidates(selectedCandidates.filter((c) => c.id !== cand.id));
    } else {
      setSelectedCandidates([...selectedCandidates, cand]);
    }
  };

  const filteredCandidates = candidatesList.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-10">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link href="/organization" className="inline-flex items-center gap-2 text-xs text-violet-400 hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Community Hub
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-400" /> AI Team Builder Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Automated skill complementarity matchmaking for hackathons, open source sprints, and community projects.
            </p>
          </div>
          <button
            onClick={handleAutoTeamMatch}
            disabled={isMatching}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs px-6 py-3 rounded-2xl shadow-xl shadow-purple-600/30 transition"
          >
            <Zap className="w-4 h-4" /> {isMatching ? "Running Skill Matchmaker..." : "Auto-Form Balanced AI Team"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Candidate Pool */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Participant Pool ({candidatesList.length})
              </h2>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredCandidates.map((cand) => {
                const isSelected = selectedCandidates.some((c) => c.id === cand.id);
                return (
                  <div
                    key={cand.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                      isSelected ? "bg-purple-900/20 border-purple-500/50" : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                    }`}
                    onClick={() => toggleSelectCandidate(cand)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300 text-xs">
                        {cand.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{cand.name}</h4>
                        <p className="text-[11px] text-slate-400">{cand.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cand.skills.map((s) => (
                            <span key={s} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                        Score: {cand.score}
                      </span>
                      <button
                        className={`mt-2 flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-lg transition ${
                          isSelected ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {isSelected ? <CheckCircle className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        {isSelected ? "In Team" : "Add to Team"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Formed Team Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Formed Team Roster
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Selected members: <strong className="text-purple-300">{selectedCandidates.length} / 4</strong>
            </p>

            {selectedCandidates.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No members added yet.</p>
                <p className="text-[10px] text-slate-500 mt-1">Select participants from the pool or click Auto-Form Team.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {selectedCandidates.map((cand) => (
                  <div key={cand.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-xs font-bold text-slate-100">{cand.name}</h5>
                        <p className="text-[10px] text-purple-300 font-medium">{cand.role}</p>
                      </div>
                      <button
                        onClick={() => toggleSelectCandidate(cand)}
                        className="text-[10px] text-slate-400 hover:text-red-400 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCandidates.length > 0 && (
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition">
                Create & Register Team Workspace
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
