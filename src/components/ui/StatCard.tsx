import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  accentColor?: "blue" | "purple" | "emerald" | "amber" | "rose";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm hover:border-[#B8C2CC] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
          {title}
        </span>
        <div className="p-1.5 rounded bg-[#F4F6F8] text-[#1F3A5F] border border-[#E2E8F0]">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold font-mono text-[#17202A] tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.neutral
                ? "text-[#667085]"
                : trend.isPositive
                ? "text-[#287D55]"
                : "text-[#B54747]"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#667085] line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
};
