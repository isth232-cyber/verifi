import {
  CredibilityTier,
  RiskLevel,
  ScoreBreakdown,
  ScoringWeights,
  VerificationStatus,
} from "../types";
import {
  getRiskLevelForScore,
  getTierForScore,
  getVerificationStatusForScore,
} from "../utils/formatters";

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  sourceSignals: 20,
  evidenceSupport: 25,
  claimConsistency: 20,
  contentQuality: 15,
  contextRelevance: 10,
  crossSourceAgreement: 10,
};

export interface ScoringInput {
  sourceSignalsScore: number;       // 0 - 100
  evidenceSupportScore: number;     // 0 - 100
  claimConsistencyScore: number;    // 0 - 100
  contentQualityScore: number;      // 0 - 100
  contextRelevanceScore: number;    // 0 - 100
  crossSourceAgreementScore: number;// 0 - 100
  weights?: Partial<ScoringWeights>;
}

export interface CredibilityResult {
  overallScore: number;
  breakdown: ScoreBreakdown;
  credibilityTier: CredibilityTier;
  riskLevel: RiskLevel;
  verificationStatus: VerificationStatus;
  explanation: string;
}

/**
 * Calculates the weighted credibility score using the transparent multi-factor engine.
 * Weights are completely configurable and normalized.
 */
export function calculateCredibilityScore(input: ScoringInput): CredibilityResult {
  const activeWeights: ScoringWeights = {
    sourceSignals: input.weights?.sourceSignals ?? DEFAULT_SCORING_WEIGHTS.sourceSignals,
    evidenceSupport: input.weights?.evidenceSupport ?? DEFAULT_SCORING_WEIGHTS.evidenceSupport,
    claimConsistency: input.weights?.claimConsistency ?? DEFAULT_SCORING_WEIGHTS.claimConsistency,
    contentQuality: input.weights?.contentQuality ?? DEFAULT_SCORING_WEIGHTS.contentQuality,
    contextRelevance: input.weights?.contextRelevance ?? DEFAULT_SCORING_WEIGHTS.contextRelevance,
    crossSourceAgreement: input.weights?.crossSourceAgreement ?? DEFAULT_SCORING_WEIGHTS.crossSourceAgreement,
  };

  const totalWeight =
    activeWeights.sourceSignals +
    activeWeights.evidenceSupport +
    activeWeights.claimConsistency +
    activeWeights.contentQuality +
    activeWeights.contextRelevance +
    activeWeights.crossSourceAgreement;

  // Bound each component to 0-100
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const sourceSignals = clamp(input.sourceSignalsScore);
  const evidenceSupport = clamp(input.evidenceSupportScore);
  const claimConsistency = clamp(input.claimConsistencyScore);
  const contentQuality = clamp(input.contentQualityScore);
  const contextRelevance = clamp(input.contextRelevanceScore);
  const crossSourceAgreement = clamp(input.crossSourceAgreementScore);

  const weightedSum =
    sourceSignals * activeWeights.sourceSignals +
    evidenceSupport * activeWeights.evidenceSupport +
    claimConsistency * activeWeights.claimConsistency +
    contentQuality * activeWeights.contentQuality +
    contextRelevance * activeWeights.contextRelevance +
    crossSourceAgreement * activeWeights.crossSourceAgreement;

  const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 50;
  const overallScore = Math.round(rawScore);

  const credibilityTier = getTierForScore(overallScore);
  const riskLevel = getRiskLevelForScore(overallScore);
  const verificationStatus = getVerificationStatusForScore(overallScore);

  const breakdown: ScoreBreakdown = {
    overallScore,
    sourceSignals,
    evidenceSupport,
    claimConsistency,
    contentQuality,
    contextRelevance,
    crossSourceAgreement,
  };

  // Human-readable explainable rationale
  const lowestFactor = [
    { name: "Source Signals", score: sourceSignals },
    { name: "Evidence Support", score: evidenceSupport },
    { name: "Claim Consistency", score: claimConsistency },
    { name: "Content Quality", score: contentQuality },
    { name: "Context Relevance", score: contextRelevance },
    { name: "Cross-Source Agreement", score: crossSourceAgreement },
  ].sort((a, b) => a.score - b.score)[0];

  const highestFactor = [
    { name: "Source Signals", score: sourceSignals },
    { name: "Evidence Support", score: evidenceSupport },
    { name: "Claim Consistency", score: claimConsistency },
    { name: "Content Quality", score: contentQuality },
    { name: "Context Relevance", score: contextRelevance },
    { name: "Cross-Source Agreement", score: crossSourceAgreement },
  ].sort((a, b) => b.score - a.score)[0];

  const explanation =
    `AI assessment score of ${overallScore}/100 based on multi-factor weighted evidence. ` +
    `Strongest signal: ${highestFactor.name} (${highestFactor.score}/100). ` +
    (lowestFactor.score < 60
      ? `Primary concern: ${lowestFactor.name} (${lowestFactor.score}/100).`
      : `All evaluation signals show positive to moderate corroboration.`);

  return {
    overallScore,
    breakdown,
    credibilityTier,
    riskLevel,
    verificationStatus,
    explanation,
  };
}

/**
 * Distinguishes AI Confidence from Credibility.
 * Credibility represents the assessment of available evidence.
 * Confidence represents model certainty based on data richness, text length, signal consistency, and citations.
 */
export function calculateConfidence(params: {
  textLength: number;
  claimsCount: number;
  evidenceCount: number;
  hasSourceUrl: boolean;
  varianceInScores: number; // lower variance = higher confidence
}): number {
  let confidence = 50; // base

  // Text length factors
  if (params.textLength > 1000) confidence += 15;
  else if (params.textLength > 300) confidence += 10;
  else if (params.textLength > 100) confidence += 5;

  // Claim density
  if (params.claimsCount >= 3) confidence += 10;
  else if (params.claimsCount >= 1) confidence += 5;

  // Evidence density
  if (params.evidenceCount >= 4) confidence += 15;
  else if (params.evidenceCount >= 2) confidence += 8;

  // Verified source URL available
  if (params.hasSourceUrl) confidence += 10;

  // High score variance slightly reduces certainty
  if (params.varianceInScores > 35) confidence -= 10;

  return Math.max(35, Math.min(98, confidence));
}
