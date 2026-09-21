import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Analysis Operation Notice",
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg bg-[#FDF2F2] border border-[#F5C7C7] max-w-lg mx-auto">
      <div className="p-2.5 rounded bg-white text-[#B54747] border border-[#F5C7C7] mb-2.5 shadow-sm">
        <AlertOctagon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-bold text-[#17202A] mb-1">{title}</h4>
      <p className="text-xs text-[#B54747] leading-relaxed mb-3.5 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#B54747] hover:bg-[#8C3636] transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Operation
        </button>
      )}
    </div>
  );
};
