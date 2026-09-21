import React from "react";
import { SourceAnalysis } from "@/lib/types";
import { Globe, ShieldCheck, ShieldAlert, Calendar, User, Check, AlertTriangle, HelpCircle } from "lucide-react";

interface SourceCardProps {
  source: SourceAnalysis;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#F4F6F8] border border-[#D9DEE5] text-[#1F3A5F]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#17202A]">
              {source.publisher || source.domain}
            </h4>
            <span className="text-xs font-mono text-[#667085]">{source.domain}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {source.isHttps ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-[#EAF5EF] text-[#287D55] border border-[#C2E2D1]">
              <ShieldCheck className="w-3.5 h-3.5" />
              HTTPS Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-[#FEF7EC] text-[#B7791F] border border-[#F7DEBA]">
              <ShieldAlert className="w-3.5 h-3.5" />
              HTTP Insecure
            </span>
          )}

          <span className="px-2 py-0.5 rounded text-xs font-mono text-[#667085] bg-[#F4F6F8] border border-[#D9DEE5]">
            Evidence: {source.evidenceAvailability}
          </span>
        </div>
      </div>

      {/* Metadata items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {source.author && (
          <div className="flex items-center gap-2 p-2.5 rounded bg-[#F4F6F8] border border-[#E2E8F0]">
            <User className="w-4 h-4 text-[#667085] flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-[#8A99AD] block">Author</span>
              <span className="truncate block font-medium text-[#17202A]">{source.author}</span>
            </div>
          </div>
        )}

        {source.publicationDate && (
          <div className="flex items-center gap-2 p-2.5 rounded bg-[#F4F6F8] border border-[#E2E8F0]">
            <Calendar className="w-4 h-4 text-[#667085] flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-[#8A99AD] block">Published</span>
              <span className="truncate block font-medium text-[#17202A]">{source.publicationDate}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-2.5 rounded bg-[#F4F6F8] border border-[#E2E8F0]">
          <Globe className="w-4 h-4 text-[#667085] flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-mono text-[#8A99AD] block">Metadata</span>
            <span className="font-medium text-[#17202A]">
              {source.metadataFound ? "Structured Meta Available" : "Minimal / Basic Meta"}
            </span>
          </div>
        </div>
      </div>

      {/* Reputation Assessment Box */}
      <div className="bg-[#F8FAFC] p-3.5 rounded border border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] uppercase font-mono tracking-wider text-[#667085] font-semibold">
            Reputation Assessment
          </span>
          <span className="text-[10px] text-[#667085] font-mono">
            &ldquo;Unknown &ne; Untrustworthy&rdquo;
          </span>
        </div>
        <p className="text-xs text-[#17202A] leading-relaxed">
          {source.reputationAssessment}
        </p>
      </div>

      {/* Signals List */}
      {source.signals && source.signals.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block">
            Evaluated Domain Signals
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {source.signals.map((sig) => {
              const statusConfig = {
                Positive: { color: "text-[#287D55] bg-[#EAF5EF] border-[#C2E2D1]", icon: Check },
                Neutral: { color: "text-[#3B6EA5] bg-[#EFF5FB] border-[#BED7EE]", icon: HelpCircle },
                Warning: { color: "text-[#B7791F] bg-[#FEF7EC] border-[#F7DEBA]", icon: AlertTriangle },
                Negative: { color: "text-[#B54747] bg-[#FDF2F2] border-[#F5C7C7]", icon: ShieldAlert },
                Unknown: { color: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]", icon: HelpCircle },
              }[sig.status] || { color: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]", icon: HelpCircle };

              const SigIcon = statusConfig.icon;

              return (
                <div
                  key={sig.id}
                  className="bg-white p-3 rounded border border-[#D9DEE5] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#17202A]">{sig.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${statusConfig.color}`}
                    >
                      <SigIcon className="w-2.5 h-2.5" />
                      {sig.status} ({sig.score})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#667085] leading-normal">
                    {sig.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
