"use client";

import React from "react";
import { getTierColor, getTierForScore } from "@/lib/utils/formatters";

interface CredibilityGaugeProps {
  score: number; // 0 - 100
  showLabel?: boolean;
  className?: string;
}

export const CredibilityGauge: React.FC<CredibilityGaugeProps> = ({
  score,
  showLabel = true,
  className = "",
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tier = getTierForScore(clampedScore);
  const tierStyle = getTierColor(tier);

  return (
    <div className={`w-full max-w-xl ${className}`}>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
            Credibility Assessment
          </span>
          {showLabel && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}
            >
              {tier}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-[#17202A]">
            {clampedScore}
          </span>
          <span className="text-xs font-medium text-[#667085]">/ 100</span>
        </div>
      </div>

      {/* Horizontal Gauge Bar */}
      <div className="relative py-2">
        {/* Track */}
        <div className="h-2 w-full bg-[#E9EEF3] rounded-full overflow-hidden flex">
          <div className="w-[30%] bg-[#B54747]/30 h-full border-r border-white" title="0-29 Very Low" />
          <div className="w-[20%] bg-[#C05621]/35 h-full border-r border-white" title="30-49 Low" />
          <div className="w-[20%] bg-[#B7791F]/35 h-full border-r border-white" title="50-69 Moderate" />
          <div className="w-[15%] bg-[#287D55]/30 h-full border-r border-white" title="70-84 High" />
          <div className="w-[15%] bg-[#287D55]/45 h-full" title="85-100 Very High" />
        </div>

        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2.5 transition-all duration-500 ease-out"
          style={{ left: `${clampedScore}%` }}
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
            style={{ backgroundColor: tierStyle.hex }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Axis Scale Ticks */}
      <div className="flex justify-between text-[11px] font-mono text-[#667085] mt-1 px-0.5">
        <span>0</span>
        <span>30</span>
        <span>50</span>
        <span>70</span>
        <span>85</span>
        <span>100</span>
      </div>
    </div>
  );
};
