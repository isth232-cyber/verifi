"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CredibilityGauge } from "@/components/ui/CredibilityGauge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { ClaimCard } from "@/components/ui/ClaimCard";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { SourceCard } from "@/components/ui/SourceCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { NewsAnalysis } from "@/lib/types";
import { formatDateTime, getTierColor } from "@/lib/utils/formatters";
import {
  ArrowLeft,
  FileCode,
  FileText,
  AlertOctagon,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export default function NewsAnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/history/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to load verification assessment (${res.status}).`);
        }
        const json = await res.json();
        setAnalysis(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to load analysis record.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  const handleExportJson = () => {
    if (!analysis) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrustVerify-Audit-${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleViewReport = () => {
    if (!analysis) return;
    router.push(`/reports/${analysis.id}`);
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#1F3A5F]" />
          <p className="text-xs font-mono text-[#667085]">
            Retrieving verification audit record...
          </p>
        </div>
      </AppShell>
    );
  }

  if (error || !analysis) {
    return (
      <AppShell>
        <div className="py-12">
          <ErrorState
            title="Analysis Record Not Found"
            message={error || "Could not locate verification data for this record."}
            onRetry={() => router.push("/news")}
          />
        </div>
      </AppShell>
    );
  }

  const tierColors = getTierColor(analysis.credibilityTier);

  // Group evidence by type
  const supportingEvidence = analysis.evidence.filter((e) => e.evidenceType === "Supporting");
  const contradictingEvidence = analysis.evidence.filter((e) => e.evidenceType === "Contradicting");
  const contextualEvidence = analysis.evidence.filter(
    (e) => e.evidenceType === "Contextual" || e.evidenceType === "Unverified"
  );

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DEE5] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/news"
              className="p-1.5 rounded bg-white border border-[#D9DEE5] text-[#667085] hover:text-[#17202A] hover:bg-[#F4F6F8] transition-colors"
              title="Back to Verification"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#667085] font-semibold">
                  AUDIT ID: {analysis.id}
                </span>
                <span className="text-[#D9DEE5]">&bull;</span>
                <span className="text-[11px] font-mono text-[#667085]">
                  {formatDateTime(analysis.createdAt)}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#17202A] tracking-tight">
                {analysis.headline}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5 text-[#3B6EA5]" />
              Export JSON
            </button>
            <button
              onClick={handleViewReport}
              className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Report
            </button>
          </div>
        </div>

        {/* VERIFICATION RESULT PANEL */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#667085] block mb-1 font-semibold">
                Verification Result
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold tracking-wide px-3 py-1 rounded border uppercase ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}
                >
                  {analysis.status}
                </span>
                <RiskBadge level={analysis.riskLevel} />
                <ConfidenceBadge confidence={analysis.confidence} />
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-mono text-[#667085] block">
                Evaluation Provider
              </span>
              <span className="font-mono text-xs text-[#17202A] font-semibold">
                {analysis.aiProvider.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Horizontal Credibility Gauge */}
          <div className="pt-1">
            <CredibilityGauge score={analysis.credibilityScore} />
          </div>
        </div>

        {/* ASSESSMENT SUMMARY SECTION */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
            Assessment Summary
          </h3>
          <p className="text-xs text-[#17202A] leading-relaxed">
            {analysis.summary}
          </p>

          {analysis.sourceUrl && (
            <div className="pt-2 text-xs text-[#667085] flex items-center gap-2 border-t border-[#E2E8F0] mt-3">
              <span className="font-mono text-[#8A99AD] text-[10px] uppercase">Evaluated URL:</span>
              <a
                href={analysis.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3B6EA5] hover:underline font-mono truncate max-w-md inline-flex items-center gap-1"
              >
                {analysis.sourceUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* WHY THIS RESULT? — Compact Score Matrix */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                Why This Result?
              </h3>
              <p className="text-[11px] text-[#667085]">
                Component score breakdown across the 6 weighted credibility factors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {[
              { name: "Evidence Support", score: analysis.breakdown.evidenceSupport, weight: "25%" },
              { name: "Source Signals", score: analysis.breakdown.sourceSignals, weight: "20%" },
              { name: "Claim Consistency", score: analysis.breakdown.claimConsistency, weight: "20%" },
              { name: "Content Quality", score: analysis.breakdown.contentQuality, weight: "15%" },
              { name: "Context Relevance", score: analysis.breakdown.contextRelevance, weight: "10%" },
              { name: "Cross-Source Agreement", score: analysis.breakdown.crossSourceAgreement, weight: "10%" },
            ].map((factor, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-[#17202A] block">{factor.name}</span>
                  <span className="text-[10px] font-mono text-[#667085]">Weight: {factor.weight}</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#17202A]">
                  {factor.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CLAIM REVIEW SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Claim Review ({analysis.claims.length})
            </h3>
            <span className="text-[11px] text-[#667085] font-mono">
              Factual assertions extracted & audited
            </span>
          </div>

          <div className="space-y-2">
            {analysis.claims.map((claim, idx) => (
              <ClaimCard key={claim.id || idx} claim={claim} index={idx} />
            ))}
          </div>
        </div>

        {/* EVIDENCE SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
            Evidence & Corroborating Citations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Supporting */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#287D55] uppercase tracking-wider font-mono block">
                Supporting Evidence ({supportingEvidence.length})
              </span>
              {supportingEvidence.length > 0 ? (
                supportingEvidence.map((item) => (
                  <EvidenceCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-xs text-[#667085] italic p-3 bg-white rounded border border-[#D9DEE5]">
                  No direct supporting citations identified.
                </p>
              )}
            </div>

            {/* Contradicting */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#B54747] uppercase tracking-wider font-mono block">
                Contradicting Evidence ({contradictingEvidence.length})
              </span>
              {contradictingEvidence.length > 0 ? (
                contradictingEvidence.map((item) => (
                  <EvidenceCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-xs text-[#667085] italic p-3 bg-white rounded border border-[#D9DEE5]">
                  No contradictory citations identified.
                </p>
              )}
            </div>
          </div>

          {contextualEvidence.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-[#3B6EA5] uppercase tracking-wider font-mono block">
                Contextual References ({contextualEvidence.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contextualEvidence.map((item) => (
                  <EvidenceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SOURCE INFORMATION SECTION */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
            Source Information
          </h3>
          <SourceCard source={analysis.sourceAnalysis} />
        </div>

        {/* LIMITATIONS & LEGAL DISCLAIMER */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-[#B7791F]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Limitations & Audit Constraints
            </h4>
          </div>

          <ul className="space-y-1 text-xs text-[#667085] list-disc list-inside">
            {analysis.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>

          <p className="text-[11px] text-[#8A99AD] pt-2 border-t border-[#D9DEE5] leading-relaxed">
            <strong>Notice:</strong> TRUSTVERIFY AI provides automated probabilistic assessments based on computational linguistic analysis, source registries, and comparative citations. This assessment is not an absolute determination of fact or legal guilt.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D9DEE5]">
          <Link
            href="/news"
            className="px-4 py-2 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#1F3A5F]" />
            Verify Another Article
          </Link>

          <button
            onClick={handleViewReport}
            className="px-4 py-2 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Official Audit Certificate
          </button>
        </div>
      </div>
    </AppShell>
  );
}
