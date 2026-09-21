import {
  Claim,
  CredibilityTier,
  EvidenceItem,
  RiskLevel,
  ScoreBreakdown,
  SourceAnalysis,
  VerificationStatus,
} from "../types";

export interface AIAnalysisRequest {
  headline?: string;
  content: string;
  sourceUrl?: string;
  inputType: "article" | "url" | "file" | "headline_content";
}

export interface AIAnalysisResponse {
  status: VerificationStatus;
  credibilityScore: number;
  credibilityTier: CredibilityTier;
  confidence: number;
  riskLevel: RiskLevel;
  summary: string;
  breakdown: ScoreBreakdown;
  claims: Claim[];
  evidence: EvidenceItem[];
  sourceAnalysis: SourceAnalysis;
  limitations: string[];
  provider: "gemini" | "local_nlp" | "demo";
}

export interface AINewsProvider {
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}
