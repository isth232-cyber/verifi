import React from "react";
import { LucideIcon, FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-lg bg-white border border-[#D9DEE5]">
      <div className="p-3 rounded bg-[#F4F6F8] text-[#1F3A5F] border border-[#D9DEE5] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-[#17202A] mb-1">{title}</h3>
      <p className="text-xs text-[#667085] max-w-sm leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
