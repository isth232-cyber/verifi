import React from "react";
import { HelpCircle, Check } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number; // 0 - 100
  showTooltip?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  showTooltip = true,
}) => {
  const rounded = Math.round(confidence);

  return (
    <div className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#EFF5FB] text-[#3B6EA5] border border-[#BED7EE]">
      <Check className="w-3.5 h-3.5 text-[#3B6EA5]" />
      <span>AI Confidence: {rounded}%</span>
      {showTooltip && (
        <HelpCircle className="w-3 h-3 text-[#3B6EA5]/70 hover:text-[#3B6EA5] cursor-help ml-0.5" />
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-[#17202A] border border-[#253342] text-white text-[11px] font-normal leading-relaxed rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <p className="font-semibold text-white mb-0.5">Confidence vs. Credibility</p>
          Credibility represents the evaluation of available evidence. Confidence represents model certainty based on signal consistency and source completeness.
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#17202A]" />
        </div>
      )}
    </div>
  );
};
