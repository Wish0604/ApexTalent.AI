"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar, Plus, Users, MapPin, Clock, ArrowLeft, RefreshCw,
  CheckCircle, Sparkles, Building2, Ticket,
  LayoutDashboard, Trophy, Network, Award, GitBranch, UserCheck, BarChart2, Cpu, Brain
} from "lucide-react";

const COMMUNITY_TABS = [
  { href: "/organization", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organization?tab=members", label: "Members", icon: Users },
  { href: "/organization/events", label: "Events & Webinars", icon: Calendar, id: "events" },
  { href: "/organization/hackathons", label: "Hackathons", icon: Trophy, id: "hackathons" },
  { href: "/organization/team-builder", label: "AI Team Builder", icon: Network, id: "teams" },
  { href: "/organization/evaluations", label: "AI Evaluations", icon: Brain, id: "evaluations" },
  { href: "/organization/certificates", label: "Certificates & Badges", icon: Award, id: "certificates" },
  { href: "/organization?tab=leaderboard", label: "Leaderboard", icon: Award },
  { href: "/organization?tab=projects", label: "Project Gallery", icon: GitBranch },
  { href: "/organization?tab=connect", label: "Recruiter Connect", icon: UserCheck },
  { href: "/organization/analytics", label: "Community Analytics", icon: BarChart2, id: "analytics" },
];

function OrganizationSidebar({ active }: { active: string }) {
  return (
    <div className="portal-sidebar hidden md:block">
      <div className="px-4 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
          <Cpu className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="font-bold text-sm gradient-text-gold">Community HQ</span>
      </div>

      <div className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-title">Navigation</p>
        {COMMUNITY_TABS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? "active-indigo" : "text-slate-400 hover:text-white hover:bg-white/5"
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

export default function OrganizationEventsPage() {
  const [events, setEvents] = useState<any[]>([
    {
      id: "evt-101",
      title: "AI Talent Summit 2026",
      date: "August 15, 2026",
      location: "Virtual & Hybrid (Bangalore)",
      attendees: 1240,
      speakers: "12 Industry Leads",
      description: "Annual community gathering exploring AI hiring, skill telemetry, and autonomous developer workflows."
    },
    {
      id: "evt-102",
      title: "Distributed Systems & FastAPI Masterclass",
      date: "September 2, 2026",
      location: "Online Stream",
      attendees: 680,
      speakers: "Aarav Mehta & Neha Sharma",
      description: "Hands-on architectural deep dive into building high-throughput microservices."
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Online / Virtual");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    setCreating(true);
    setTimeout(() => {
      const newEvt = {
        id: `evt-${Date.now()}`,
        title,
        date,
        location,
        attendees: 1,
        speakers: "Community Keynote",
        description
      };
      setEvents([newEvt, ...events]);
      setMsg("✓ Event created & published to community calendar!");
      setCreating(false);
      setTitle(""); setDate(""); setDescription("");
      setTimeout(() => { setMsg(""); setShowCreateModal(false); }, 1500);
    }, 600);
  };

  return (
    <div className="community-dashboard-bg relative min-h-screen">
      <div className="community-dashboard-overlay absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex community-dashboard-container min-h-screen">
        
        <OrganizationSidebar active="events" />

        <main className="portal-main px-6 py-8 max-w-7xl w-full space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Link href="/organization" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-amber-400" /> Community Events & Webinars Studio
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Organize tech summits, community workshops, hackathon orientation calls, and mentor meetups.</p>
              </div>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 text-xs px-5 py-2.5">
              <Plus className="w-4 h-4" /> Create New Community Event
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Upcoming Events</span>
              <div className="text-2xl font-black text-white">{events.length}</div>
              <p className="text-[10px] text-amber-400">Community Scheduled</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Registrations</span>
              <div className="text-2xl font-black text-emerald-400">1,920</div>
              <p className="text-[10px] text-slate-400">+34% vs last event</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mentors & Keynotes</span>
              <div className="text-2xl font-black text-indigo-400">24</div>
              <p className="text-[10px] text-slate-400">Verified Industry Leads</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Engagement Score</span>
              <div className="text-2xl font-black text-amber-400">96.4%</div>
              <p className="text-[10px] text-slate-400">Attendance Rate</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Scheduled Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div key={evt.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-amber-500/40 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="badge badge-amber text-[10px] mb-1 inline-block font-mono">{evt.date}</span>
                      <h3 className="font-bold text-white text-base">{evt.title}</h3>
                    </div>
                    <span className="badge badge-emerald text-xs px-2.5 py-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {evt.attendees} Attending
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{evt.description}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" />{evt.location}</span>
                    <button className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1">
                      <Ticket className="w-3 h-3" /> RSVP & Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full space-y-4 border border-white/20">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Create Community Event
            </h2>
            {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="field-label">Event Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. AI Hackathon Kickoff & Keynote" className="field-input w-full mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Date & Time *</label>
                  <input value={date} onChange={e => setDate(e.target.value)} required placeholder="August 20, 2026 - 6 PM IST" className="field-input w-full mt-1" />
                </div>
                <div>
                  <label className="field-label">Location / Stream URL</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Zoom / YouTube Stream" className="field-input w-full mt-1" />
                </div>
              </div>
              <div>
                <label className="field-label">Description *</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Event agenda..." className="field-input w-full mt-1 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary px-6 text-xs">
                  {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Publish Event ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
