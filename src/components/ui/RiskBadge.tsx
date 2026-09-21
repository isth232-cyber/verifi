import React from "react";
import { RiskLevel } from "@/lib/types";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = "md" }) => {
  const isSmall = size === "sm";

  switch (level) {
    case "Low":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium border bg-[#EAF5EF] text-[#287D55] border-[#C2E2D1] ${
            isSmall ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          <CheckCircle2 className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Risk: Low
        </span>
      );
    case "Medium":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium border bg-[#FEF7EC] text-[#B7791F] border-[#F7DEBA] ${
            isSmall ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          <AlertTriangle className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Risk: Moderate
        </span>
      );
    case "High":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded font-medium border bg-[#FDF2F2] text-[#B54747] border-[#F5C7C7] ${
            isSmall ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          <ShieldAlert className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Risk: High
        </span>
      );
  }
};
