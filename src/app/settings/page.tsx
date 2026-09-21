"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SystemSettings } from "@/lib/types";
import {
  Cpu,
  Sliders,
  Shield,
  Database,
  Check,
  Save,
  Trash2,
  Key,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [aiProvider, setAiProvider] = useState<"gemini" | "local_nlp" | "demo">("gemini");
  const [faceThreshold, setFaceThreshold] = useState(0.82);
  const [sourceWeight, setSourceWeight] = useState(20);
  const [evidenceWeight, setEvidenceWeight] = useState(25);
  const [claimWeight, setClaimWeight] = useState(20);
  const [qualityWeight, setQualityWeight] = useState(15);
  const [contextWeight, setContextWeight] = useState(10);
  const [crossSourceWeight, setCrossSourceWeight] = useState(10);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          const s = json.data as SystemSettings;
          setSettings(s);
          setAiProvider(s.aiProvider);
          setFaceThreshold(s.faceVerificationThreshold);
          setSourceWeight(s.scoringWeights.sourceSignals);
          setEvidenceWeight(s.scoringWeights.evidenceSupport);
          setClaimWeight(s.scoringWeights.claimConsistency);
          setQualityWeight(s.scoringWeights.contentQuality);
          setContextWeight(s.scoringWeights.contextRelevance);
          setCrossSourceWeight(s.scoringWeights.crossSourceAgreement);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const payload: Partial<SystemSettings> = {
        aiProvider,
        faceVerificationThreshold: faceThreshold,
        scoringWeights: {
          sourceSignals: sourceWeight,
          evidenceSupport: evidenceWeight,
          claimConsistency: claimWeight,
          contentQuality: qualityWeight,
          contextRelevance: contextWeight,
          crossSourceAgreement: crossSourceWeight,
        },
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeAll = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete all analysis records, verification history, and stored audit logs?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        alert("All verification history and analysis data have been purged.");
      }
    } catch (err) {
      console.error("Purge error:", err);
    }
  };

  const totalWeight =
    sourceWeight +
    evidenceWeight +
    claimWeight +
    qualityWeight +
    contextWeight +
    crossSourceWeight;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Platform Configuration
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Tune scoring weights, biometric verification thresholds, and AI provider fallback layers.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-[#287D55]" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saveSuccess ? "Configuration Saved" : "Save Changes"}
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: AI Provider */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
              <Cpu className="w-4 h-4 text-[#1F3A5F]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                  AI Intelligence Engine
                </h3>
                <p className="text-[11px] text-[#667085]">
                  Select the underlying analysis provider for news evaluation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "gemini",
                  name: "Google Gemini AI",
                  desc: "Primary LLM multimodal extraction engine via Gemini API.",
                  badge: settings?.geminiApiKeyConfigured ? "Key Configured" : "Unconfigured",
                  badgeColor: settings?.geminiApiKeyConfigured ? "text-[#287D55] bg-[#EAF5EF] border-[#C2E2D1]" : "text-[#B7791F] bg-[#FEF7EC] border-[#F7DEBA]",
                },
                {
                  id: "local_nlp",
                  name: "Local Heuristic NLP",
                  desc: "Deterministic rule-based NLP and verified domain registry.",
                  badge: "Default Fallback",
                  badgeColor: "text-[#1F3A5F] bg-[#EFF5FB] border-[#BED7EE]",
                },
                {
                  id: "demo",
                  name: "Simulated Provider",
                  desc: "Explicitly labeled demo mode for verification walk-throughs.",
                  badge: "DEMO ONLY",
                  badgeColor: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]",
                },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setAiProvider(p.id as any)}
                  className={`p-3.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                    aiProvider === p.id
                      ? "bg-[#EFF5FB] border-[#1F3A5F] shadow-xs"
                      : "bg-white border-[#D9DEE5] hover:border-[#B8C2CC]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#17202A]">{p.name}</span>
                      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] leading-snug">{p.desc}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-[10px] font-mono font-semibold text-[#1F3A5F]">
                      {aiProvider === p.id ? "✓ Active" : "Select"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0] flex items-center gap-2.5 text-xs text-[#667085]">
              <Key className="w-4 h-4 text-[#1F3A5F] flex-shrink-0" />
              <div>
                Secret API keys are stored securely on the server via <code className="font-mono text-[#1F3A5F]">GEMINI_API_KEY</code> and are never leaked to client web bundles.
              </div>
            </div>
          </div>

          {/* Section 2: Biometric Verification Policy */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
              <Shield className="w-4 h-4 text-[#1F3A5F]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                  Biometric Verification Policy
                </h3>
                <p className="text-[11px] text-[#667085]">
                  Minimum cosine similarity required to declare a facial identity MATCH
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#17202A]">
                  Similarity Threshold
                </label>
                <span className="text-xs font-mono font-bold text-[#1F3A5F] px-2 py-0.5 rounded bg-[#F4F6F8] border border-[#D9DEE5]">
                  {Math.round(faceThreshold * 100)}% ({faceThreshold.toFixed(2)})
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.01"
                value={faceThreshold}
                onChange={(e) => setFaceThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] text-[#667085] font-mono">
                <span>0.50 (Permissive)</span>
                <span>0.82 (Standard SOC Recommended)</span>
                <span>0.95 (Ultra Strict)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Credibility Scoring Matrix */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1F3A5F]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                    Credibility Scoring Weights
                  </h3>
                  <p className="text-[11px] text-[#667085]">
                    Formula component weights (Sum must equal 100%)
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  totalWeight === 100
                    ? "bg-[#EAF5EF] text-[#287D55] border-[#C2E2D1]"
                    : "bg-[#FEF7EC] text-[#B7791F] border-[#F7DEBA]"
                }`}
              >
                Total: {totalWeight}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Evidence Support</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{evidenceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={evidenceWeight}
                  onChange={(e) => setEvidenceWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Source Signals</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{sourceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={sourceWeight}
                  onChange={(e) => setSourceWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Claim Consistency</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{claimWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={claimWeight}
                  onChange={(e) => setClaimWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Content Quality</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{qualityWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={qualityWeight}
                  onChange={(e) => setQualityWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Context & Date Relevance</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{contextWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={contextWeight}
                  onChange={(e) => setContextWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#17202A]">Cross-Source Agreement</span>
                  <span className="font-mono text-[#1F3A5F] font-bold">{crossSourceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={crossSourceWeight}
                  onChange={(e) => setCrossSourceWeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F3A5F] h-1.5 bg-[#E2E8F0] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Data Retention & Privacy Controls */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D9DEE5]">
              <Database className="w-4 h-4 text-[#B54747]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                  Data Retention & Governance
                </h3>
                <p className="text-[11px] text-[#667085]">
                  Manage stored audit trails and perform privacy data purges
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded bg-[#FDF2F2] border border-[#F5C7C7]">
              <div>
                <h4 className="text-xs font-bold text-[#17202A]">Purge All Audit Records</h4>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Permanently delete all historical news analyses, verification certificates, and face verification records.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePurgeAll}
                className="px-3 py-1.5 rounded text-xs font-semibold text-[#B54747] hover:bg-white border border-[#F5C7C7] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Analysis Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
