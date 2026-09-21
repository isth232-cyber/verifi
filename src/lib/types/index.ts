export type VerificationStatus =
  | "LIKELY CREDIBLE"
  | "POTENTIALLY MISLEADING"
  | "LIKELY FALSE"
  | "INSUFFICIENT EVIDENCE";

export type RiskLevel = "Low" | "Medium" | "High";

export type CredibilityTier =
  | "Very Low Credibility"
  | "Low Credibility"
  | "Moderate Credibility"
  | "High Credibility"
  | "Very High Credibility";

export type ClaimVerificationStatus =
  | "Supported"
  | "Contradicted"
  | "Unverified"
  | "Questionable";

export type EvidenceType =
  | "Supporting"
  | "Contradicting"
  | "Contextual"
  | "Unverified";

export interface Claim {
  id: string;
  claim: string;
  status: ClaimVerificationStatus;
  confidence: number; // 0 - 100
  evidence: string;
  sources?: string[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  url?: string;
  date?: string;
  evidenceType: EvidenceType;
  relevance: number; // 0 - 100
  verificationStatus: "Verified" | "Unverified" | "Contextual";
  snippet: string;
}

export interface SourceSignal {
  id: string;
  name: string;
  score: number; // 0 - 100
  status: "Positive" | "Neutral" | "Warning" | "Negative" | "Unknown";
  explanation: string;
}

export interface SourceAnalysis {
  domain: string;
  publisher: string;
  publicationDate?: string;
  author?: string;
  isHttps: boolean;
  metadataFound: boolean;
  evidenceAvailability: "High" | "Moderate" | "Low" | "Unavailable";
  reputationAssessment: string;
  signals: SourceSignal[];
}

export interface ScoreBreakdown {
  overallScore: number;
  evidenceSupport: number;
  sourceSignals: number;
  claimConsistency: number;
  contentQuality: number;
  contextRelevance: number;
  crossSourceAgreement: number;
}

export interface ScoringWeights {
  sourceSignals: number;      // default 20
  evidenceSupport: number;    // default 25
  claimConsistency: number;   // default 20
  contentQuality: number;     // default 15
  contextRelevance: number;   // default 10
  crossSourceAgreement: number;// default 10
}

export interface NewsAnalysis {
  id: string;
  createdAt: string;
  headline: string;
  content: string;
  sourceUrl?: string;
  inputType: "article" | "url" | "file" | "headline_content";
  status: VerificationStatus;
  credibilityScore: number; // 0 - 100
  credibilityTier: CredibilityTier;
  confidence: number; // 0 - 100 (Model Certainty)
  riskLevel: RiskLevel;
  summary: string;
  breakdown: ScoreBreakdown;
  claims: Claim[];
  evidence: EvidenceItem[];
  sourceAnalysis: SourceAnalysis;
  limitations: string[];
  aiProvider: "gemini" | "local_nlp" | "demo";
}

export type FaceMatchStatus = "MATCH" | "NO MATCH" | "UNABLE TO VERIFY";

export interface FaceQualityMetrics {
  faceDetected: boolean;
  facesCount: number;
  imageQuality: "High" | "Medium" | "Low";
  poseQuality: "Optimal" | "Angled" | "Suboptimal";
  lighting: "Adequate" | "Low Light" | "Harsh" | "Uneven";
  sharpnessScore: number; // 0 - 100
}

export interface FaceVerificationResult {
  id: string;
  createdAt: string;
  status: FaceMatchStatus;
  similarity: number; // 0 - 100
  confidence: number; // 0 - 100
  thresholdUsed: number; // e.g. 0.82
  explanation: string;
  referenceMetrics: FaceQualityMetrics;
  verificationMetrics: FaceQualityMetrics;
  provider: "local_biometric" | "demo";
  privacyNotice: string;
}

export type VerificationType = "news" | "face";

export interface HistoryRecord {
  id: string;
  type: VerificationType;
  title: string;
  inputSummary: string;
  result: string;
  score: number;
  confidence: number;
  riskLevel?: RiskLevel;
  createdAt: string;
  statusTag: "Verified" | "High Risk" | "Unverified" | "Moderate";
  targetId: string; // Links to NewsAnalysis.id or FaceVerificationResult.id
}

export interface VerificationReport {
  id: string;
  analysisId: string;
  type: VerificationType;
  title: string;
  generatedAt: string;
  inputSummary: string;
  result: string;
  credibilityScore?: number;
  confidence: number;
  riskLevel?: RiskLevel;
  scoreBreakdown?: ScoreBreakdown;
  claims?: Claim[];
  evidence?: EvidenceItem[];
  sourceAnalysis?: SourceAnalysis;
  limitations: string[];
  disclaimer: string;
  downloadUrl?: string;
}

export interface SystemSettings {
  aiProvider: "gemini" | "local_nlp" | "demo";
  geminiApiKeyConfigured: boolean;
  faceVerificationThreshold: number; // 0.5 - 0.95 (default 0.82)
  faceProvider: "local_biometric" | "demo";
  scoringWeights: ScoringWeights;
  theme: "dark" | "navy";
  storeBiometricsTemporarily: boolean;
  enableExternalSearch: boolean;
}

export interface DashboardStats {
  totalVerifications: number;
  newsAnalyzed: number;
  facesVerified: number;
  averageCredibilityScore: number;
  highRiskFindings: number;
  credibilityDistribution: {
    name: string;
    count: number;
    color: string;
  }[];
  newsClassificationDistribution: {
    status: string;
    count: number;
    color: string;
  }[];
  activityOverTime: {
    date: string;
    news: number;
    face: number;
    total: number;
  }[];
  verificationResultBreakdown: {
    name: string;
    value: number;
  }[];
}
