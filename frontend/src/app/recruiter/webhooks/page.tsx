"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, ArrowLeft, Plus, RefreshCw, CheckCircle, Send, Radio, Shield,
  Terminal, ExternalLink, X, Zap, Layers, Check, Globe
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("Slack Engineering Channel");
  const [targetUrl, setTargetUrl] = useState("https://hooks.slack.com/services/T00/B00/XXXXX");
  const [channelType, setChannelType] = useState("slack");

  // Test Payload State
  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/notifications/webhooks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setWebhooks(data);
      }
    } catch (err) {
      console.error("Failed to load webhooks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/notifications/webhooks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: name,
          target_url: targetUrl,
          channel_type: channelType,
          events: ["application.stage_updated", "challenge.submitted", "offer.accepted"]
        })
      });

      if (!res.ok) throw new Error("Failed to create webhook");
      setShowAddModal(false);
      fetchWebhooks();
    } catch (err) {
      console.error(err);
      alert("Error adding webhook integration.");
    }
  };

  const handleTestDispatch = async (webhookId: number) => {
    setTestingId(webhookId);
    setTestResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/v1/notifications/webhooks/test?webhook_id=${webhookId}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error("Test dispatch failed");
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
      alert("Error triggering test webhook payload.");
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-[#0d1322]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recruiter" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <Radio className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                Global Notification & Webhook Dispatch
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  Event Outbound Bus
                </span>
              </h1>
              <p className="text-xs text-slate-400">Configure real-time Slack, Discord, and Custom HTTP webhook integrations</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Add Webhook Integration
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Webhooks List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Configured Webhook Channels ({webhooks.length})</h2>
            <button onClick={fetchWebhooks} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              Loading configured webhooks...
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-3 hover:border-emerald-500/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{wh.name}</h3>
                        <p className="text-xs font-mono text-slate-400 truncate max-w-xs">{wh.target_url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {wh.channel_type}
                      </span>
                      <button
                        onClick={() => handleTestDispatch(wh.id)}
                        disabled={testingId === wh.id}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1"
                      >
                        {testingId === wh.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Test Dispatch
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {wh.events?.map((ev: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                        ⚡ {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Payload Inspector Column */}
        <div className="lg:col-span-5 space-y-6">
          {testResult ? (
            <div className="p-6 rounded-2xl bg-[#0d1322] border border-emerald-500/30 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Live Webhook Telemetry Result
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  HTTP {testResult.status_code} OK
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <p><strong>Event:</strong> `{testResult.event_type}`</p>
                <p><strong>Target Channel:</strong> `{testResult.channel_type?.toUpperCase()}`</p>
                <p><strong>Dispatched At:</strong> {testResult.dispatched_at}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Formatted Outbound JSON Payload</p>
                <pre className="p-4 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-80 overflow-y-auto">
                  {JSON.stringify(testResult.formatted_payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] rounded-2xl bg-[#0d1322]/50 border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Radio className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Outbound Webhook Telemetry</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Click **Test Dispatch** on any configured webhook channel to inspect outbound Slack block kit or Discord payload formats in real time.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0d1322] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Add Webhook Channel Integration</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Integration Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Format</label>
                <select
                  value={channelType}
                  onChange={(e) => setChannelType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="slack" className="bg-[#0d1322]">Slack Webhook (Block Kit)</option>
                  <option value="discord" className="bg-[#0d1322]">Discord Embed Webhook</option>
                  <option value="custom" className="bg-[#0d1322]">Custom HTTP JSON Webhook</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Endpoint URL</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                >
                  Register Webhook Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
