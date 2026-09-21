"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationReport } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/formatters";
import {
  FileText,
  Clock,
  FileCode,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportJson = (report: VerificationReport) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrustVerify-AuditReport-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Verification Reports
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Formal audit records, structured claim reviews, and exportable verification certificates.
            </p>
          </div>

          <Link
            href="/news"
            className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors shadow-sm self-start sm:self-auto"
          >
            New Audit
          </Link>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#1F3A5F]" />
            <p className="text-xs font-mono text-[#667085]">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            title="No Reports Generated Yet"
            description="Run a news or face verification to generate and download official audit reports."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-[#D9DEE5] rounded-lg p-5 hover:border-[#B8C2CC] transition-colors flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F6F8] text-[#17202A] border border-[#D9DEE5]">
                      REPORT ID: {report.id}
                    </span>
                    <span className="text-[11px] font-mono text-[#667085] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(report.generatedAt)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#17202A] mt-2.5 line-clamp-2">
                    {report.title}
                  </h3>

                  <p className="text-xs text-[#667085] mt-1 line-clamp-2">
                    {report.inputSummary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#EAF5EF] text-[#287D55] border border-[#C2E2D1]">
                      {report.result}
                    </span>
                    {report.credibilityScore !== undefined && (
                      <span className="text-xs font-mono text-[#17202A]">
                        Score: <strong>{report.credibilityScore}/100</strong>
                      </span>
                    )}
                    <span className="text-xs font-mono text-[#667085]">
                      Confidence: <strong>{report.confidence}%</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9DEE5] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleExportJson(report)}
                    className="text-xs font-medium text-[#667085] hover:text-[#17202A] flex items-center gap-1 transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#3B6EA5]" />
                    Export JSON
                  </button>

                  <Link
                    href={`/reports/${report.analysisId}`}
                    className="px-3 py-1 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    View & Print
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
