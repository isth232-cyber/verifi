"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { VerificationReport } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/formatters";
import {
  ArrowLeft,
  Printer,
  FileCode,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisId: id, type: id.startsWith("fv-") ? "face" : "news" }),
        });

        if (!res.ok) {
          throw new Error("Failed to compile verification report.");
        }

        const json = await res.json();
        setReport(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to load report.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrustVerify-AuditReport-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#1F3A5F]" />
          <p className="text-xs font-mono text-[#667085]">Compiling formal verification report...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !report) {
    return (
      <AppShell>
        <div className="py-12">
          <ErrorState
            title="Report Generation Failed"
            message={error || "Could not retrieve audit record."}
            onRetry={() => router.push("/reports")}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Navigation & Actions (Hidden during print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#17202A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports Registry
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3.5 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white hover:bg-[#F4F6F8] border border-[#D9DEE5] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileCode className="w-3.5 h-3.5 text-[#3B6EA5]" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Formal Verification Report Document Container */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-6 sm:p-10 space-y-6 shadow-sm text-[#17202A] print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-[#17202A] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#1F3A5F] flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-wider text-[#17202A]">
                    TRUSTVERIFY AI
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F4F6F8] border border-[#D9DEE5] text-[#17202A] font-semibold">
                    AUDIT CERTIFICATE
                  </span>
                </div>
                <p className="text-xs font-mono text-[#667085]">
                  Verification Report &bull; Certificate of Algorithmic Analysis
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-[#667085] space-y-0.5">
              <p>Report ID: <strong className="text-[#17202A]">{report.id}</strong></p>
              <p>Analysis ID: <strong className="text-[#17202A]">{report.analysisId}</strong></p>
              <p>Generated: {formatDateTime(report.generatedAt)}</p>
            </div>
          </div>

          {/* Title & Subject Summary */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-bold block">
              Audit Subject
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#17202A]">
              {report.title}
            </h2>
            <p className="text-xs text-[#17202A] leading-relaxed bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
              {report.inputSummary}
            </p>
          </div>

          {/* Verification Verdict & Primary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-white border border-[#D9DEE5]">
              <span className="text-[10px] font-mono uppercase text-[#667085] block">
                Verification Result
              </span>
              <p className="text-sm font-bold text-[#287D55] mt-0.5">
                {report.result}
              </p>
            </div>

            {report.credibilityScore !== undefined && (
              <div className="p-3 rounded bg-white border border-[#D9DEE5]">
                <span className="text-[10px] font-mono uppercase text-[#667085] block">
                  AI Credibility Score
                </span>
                <p className="text-sm font-bold text-[#17202A] mt-0.5 font-mono">
                  {report.credibilityScore} / 100
                </p>
              </div>
            )}

            <div className="p-3 rounded bg-white border border-[#D9DEE5]">
              <span className="text-[10px] font-mono uppercase text-[#667085] block">
                Model Confidence
              </span>
              <p className="text-sm font-bold text-[#3B6EA5] mt-0.5 font-mono">
                {report.confidence}%
              </p>
            </div>
          </div>

          {/* Score Breakdown (if news report) */}
          {report.scoreBreakdown && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-bold block">
                Credibility Component Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Evidence Support (25%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.evidenceSupport}/100</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Source Signals (20%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.sourceSignals}/100</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Claim Consistency (20%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.claimConsistency}/100</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Content Quality (15%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.contentQuality}/100</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Context Relevance (10%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.contextRelevance}/100</span>
                </div>
                <div className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#667085] block">Cross-Source Agreement (10%)</span>
                  <span className="font-mono font-bold text-[#17202A]">{report.scoreBreakdown.crossSourceAgreement}/100</span>
                </div>
              </div>
            </div>
          )}

          {/* Claims List */}
          {report.claims && report.claims.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-bold block">
                Audited Claims
              </span>
              <div className="space-y-2">
                {report.claims.map((claim, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-[#17202A]">&ldquo;{claim.claim}&rdquo;</span>
                      <span className="font-mono text-[10px] font-bold text-[#1F3A5F]">{claim.status} ({claim.confidence}%)</span>
                    </div>
                    <p className="text-[11px] text-[#667085]">{claim.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Citations */}
          {report.evidence && report.evidence.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-bold block">
                Evidence Citations
              </span>
              <div className="space-y-2">
                {report.evidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#17202A]">{item.title}</span>
                      <span className="text-[10px] font-mono text-[#667085]">{item.evidenceType}</span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-0.5">{item.snippet}</p>
                    <span className="text-[10px] font-mono text-[#8A99AD] mt-1 block">Source: {item.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Analysis Summary */}
          {report.sourceAnalysis && (
            <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-xs space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#667085] font-bold block">
                Source Attribution
              </span>
              <p className="font-semibold text-[#17202A]">
                {report.sourceAnalysis.publisher} ({report.sourceAnalysis.domain})
              </p>
              <p className="text-[11px] text-[#667085]">
                {report.sourceAnalysis.reputationAssessment}
              </p>
            </div>
          )}

          {/* Limitations */}
          {report.limitations && report.limitations.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-bold block">
                Audit Limitations
              </span>
              <ul className="list-disc list-inside text-xs text-[#667085] space-y-0.5">
                {report.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-3 border-t border-[#D9DEE5] text-[11px] text-[#8A99AD] leading-relaxed">
            <p><strong>Disclaimer:</strong> {report.disclaimer}</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
