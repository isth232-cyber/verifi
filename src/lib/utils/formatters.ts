import { CredibilityTier, RiskLevel, VerificationStatus } from "../types";

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateRelative(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoString;
  }
}

export function getTierForScore(score: number): CredibilityTier {
  if (score >= 85) return "Very High Credibility";
  if (score >= 70) return "High Credibility";
  if (score >= 50) return "Moderate Credibility";
  if (score >= 30) return "Low Credibility";
  return "Very Low Credibility";
}

export function getRiskLevelForScore(score: number): RiskLevel {
  if (score >= 70) return "Low";
  if (score >= 45) return "Medium";
  return "High";
}

export function getVerificationStatusForScore(score: number): VerificationStatus {
  if (score >= 70) return "LIKELY CREDIBLE";
  if (score >= 40) return "POTENTIALLY MISLEADING";
  return "LIKELY FALSE";
}

export function getTierColor(tier: CredibilityTier): {
  text: string;
  bg: string;
  border: string;
  hex: string;
} {
  switch (tier) {
    case "Very High Credibility":
    case "High Credibility":
      return {
        text: "text-[#287D55]",
        bg: "bg-[#EAF5EF]",
        border: "border-[#C2E2D1]",
        hex: "#287D55",
      };
    case "Moderate Credibility":
      return {
        text: "text-[#B7791F]",
        bg: "bg-[#FEF7EC]",
        border: "border-[#F7DEBA]",
        hex: "#B7791F",
      };
    case "Low Credibility":
      return {
        text: "text-[#C05621]",
        bg: "bg-[#FEEBC8]",
        border: "border-[#FBD38D]",
        hex: "#C05621",
      };
    case "Very Low Credibility":
    default:
      return {
        text: "text-[#B54747]",
        bg: "bg-[#FDF2F2]",
        border: "border-[#F5C7C7]",
        hex: "#B54747",
      };
  }
}
