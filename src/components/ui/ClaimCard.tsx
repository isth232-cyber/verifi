"use client";

import React, { useState } from "react";
import { Claim } from "@/lib/types";
import { ChevronDown, ChevronUp, Check, X, AlertTriangle, HelpCircle } from "lucide-react";

interface ClaimCardProps {
  claim: Claim;
  index: number;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const statusConfig = {
    Supported: {
      color: "text-[#287D55] bg-[#EAF5EF] border-[#C2E2D1]",
      icon: Check,
    },
    Contradicted: {
      color: "text-[#B54747] bg-[#FDF2F2] border-[#F5C7C7]",
      icon: X,
    },
    Questionable: {
      color: "text-[#B7791F] bg-[#FEF7EC] border-[#F7DEBA]",
      icon: AlertTriangle,
    },
    Unverified: {
      color: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]",
      icon: HelpCircle,
    },
  }[claim.status] || {
    color: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]",
    icon: HelpCircle,
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden transition-colors hover:border-[#B8C2CC]">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 focus:outline-none"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 w-5 h-5 rounded bg-[#F4F6F8] text-[#1F3A5F] border border-[#D9DEE5] flex items-center justify-center text-xs font-mono font-bold">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#17202A] leading-snug">
              &ldquo;{claim.claim}&rdquo;
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${statusConfig.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {claim.status}
              </span>
              <span className="text-xs font-mono text-[#667085]">
                Confidence: <strong className="text-[#17202A]">{claim.confidence}%</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="text-[#667085] hover:text-[#17202A] p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#D9DEE5] bg-[#F8FAFC] space-y-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#667085] font-semibold block mb-1">
              Evidence & Evaluated Rationale
            </span>
            <p className="text-xs text-[#17202A] leading-relaxed bg-white p-3 rounded border border-[#D9DEE5]">
              {claim.evidence}
            </p>
          </div>

          {claim.sources && claim.sources.length > 0 && (
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#667085] font-semibold block mb-1">
                Referenced Datasets & Outlets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {claim.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white text-[#17202A] text-[11px] font-mono border border-[#D9DEE5]"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
