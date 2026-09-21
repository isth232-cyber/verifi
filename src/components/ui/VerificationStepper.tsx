"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
  description: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: "Extracting content", description: "Parsing text blocks, headers, and metadata" },
  { id: 2, label: "Identifying claims", description: "Isolating testable factual assertions" },
  { id: 3, label: "Reviewing evidence", description: "Cross-referencing verified databases" },
  { id: 4, label: "Assessing source signals", description: "Evaluating domain reputation and TLS security" },
  { id: 5, label: "Calculating credibility", description: "Applying multi-factor transparent weight matrix" },
];

interface VerificationStepperProps {
  currentStep: number; // 1 to 5
  isComplete?: boolean;
}

export const VerificationStepper: React.FC<VerificationStepperProps> = ({
  currentStep,
  isComplete = false,
}) => {
  return (
    <div className="w-full bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D9DEE5]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#1F3A5F] animate-spin" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
            Verification Analysis Progress
          </h4>
        </div>
        <span className="text-xs font-mono text-[#667085]">
          Step {Math.min(currentStep, 5)} of 5
        </span>
      </div>

      <div className="space-y-2">
        {STEPS.map((step) => {
          const isDone = isComplete || currentStep > step.id;
          const isCurrent = !isComplete && currentStep === step.id;
          const isPending = !isComplete && currentStep < step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between p-2.5 rounded border transition-colors ${
                isCurrent
                  ? "bg-[#EFF5FB] border-[#BED7EE] text-[#17202A]"
                  : isDone
                  ? "bg-[#F4F6F8] border-[#E2E8F0] text-[#287D55]"
                  : "bg-white border-[#E9EEF3] text-[#8A99AD] opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isDone
                      ? "bg-[#287D55] text-white"
                      : isCurrent
                      ? "bg-[#1F3A5F] text-white"
                      : "bg-[#E9EEF3] text-[#667085]"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : `0${step.id}`}
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold ${
                      isDone
                        ? "text-[#17202A]"
                        : isCurrent
                        ? "text-[#1F3A5F] font-bold"
                        : "text-[#667085]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <p className="text-[11px] text-[#667085] line-clamp-1">
                    {step.description}
                  </p>
                </div>
              </div>

              <div>
                {isCurrent && (
                  <span className="text-[11px] font-mono font-semibold text-[#1F3A5F] px-2 py-0.5 rounded bg-white border border-[#BED7EE]">
                    In Progress
                  </span>
                )}
                {isDone && (
                  <span className="text-[11px] font-mono text-[#287D55] font-semibold">
                    Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
