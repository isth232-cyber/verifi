import fs from "fs";
import path from "path";
import {
  DashboardStats,
  FaceVerificationResult,
  HistoryRecord,
  NewsAnalysis,
  SystemSettings,
  VerificationReport,
} from "../types";
import { DEFAULT_SCORING_WEIGHTS } from "../credibility/scoringEngine";

export interface DatabaseSchema {
  newsAnalyses: NewsAnalysis[];
  faceVerifications: FaceVerificationResult[];
  history: HistoryRecord[];
  reports: VerificationReport[];
  settings: SystemSettings;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

const DEFAULT_SETTINGS: SystemSettings = {
  aiProvider: "gemini",
  geminiApiKeyConfigured: false,
  faceVerificationThreshold: 0.82,
  faceProvider: "local_biometric",
  scoringWeights: DEFAULT_SCORING_WEIGHTS,
  theme: "navy",
  storeBiometricsTemporarily: false,
  enableExternalSearch: true,
};

// Realistic baseline demonstration records for academic defense & immediate functionality
const INITIAL_SEED_DATA: DatabaseSchema = {
  settings: DEFAULT_SETTINGS,
  newsAnalyses: [
    {
      id: "na-seed-001",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      headline: "Global Renewable Energy Generation Surpasses 30% of Total Electricity Demand in 2024",
      content:
        "According to the latest comprehensive assessment published by the International Energy Agency (IEA), global renewable energy generation reached a historic milestone in 2024, accounting for slightly above 30% of worldwide power demand. The growth was predominantly driven by solar photovoltaic capacity additions across Europe, East Asia, and North America. Grid operators reported increased integration investments to maintain frequency stability amid intermittent supplies.",
      sourceUrl: "https://iea.org/reports/renewables-2024",
      inputType: "article",
      status: "LIKELY CREDIBLE",
      credibilityScore: 88,
      credibilityTier: "Very High Credibility",
      confidence: 94,
      riskLevel: "Low",
      summary:
        "Assessment indicates high alignment with established global energy reporting datasets and institutional publications. No linguistic deception patterns identified.",
      breakdown: {
        overallScore: 88,
        sourceSignals: 92,
        evidenceSupport: 90,
        claimConsistency: 88,
        contentQuality: 85,
        contextRelevance: 84,
        crossSourceAgreement: 89,
      },
      claims: [
        {
          id: "claim-1",
          claim: "Renewables reached over 30% of global electricity generation in 2024.",
          status: "Supported",
          confidence: 95,
          evidence: "IEA World Energy Outlook 2024 and Ember Clean Power analysis confirm ~30.3% share.",
          sources: ["IEA", "Ember Climate"],
        },
        {
          id: "claim-2",
          claim: "Solar PV installations were the leading driver of new clean energy capacity.",
          status: "Supported",
          confidence: 92,
          evidence: "Global solar installations accounted for approximately 75% of renewable additions.",
          sources: ["IRENA 2024 Capacity Statistics"],
        },
      ],
      evidence: [
        {
          id: "ev-1",
          title: "IEA Clean Energy Market Monitor 2024",
          source: "International Energy Agency",
          url: "https://iea.org",
          date: "2024-03-15",
          evidenceType: "Supporting",
          relevance: 96,
          verificationStatus: "Verified",
          snippet: "Renewables contributed 30.2% of global electricity output, reflecting massive deployment of solar and wind technologies.",
        },
        {
          id: "ev-2",
          title: "Global Grid Modernization Review",
          source: "World Energy Council",
          url: "https://worldenergy.org",
          date: "2024-05-20",
          evidenceType: "Contextual",
          relevance: 85,
          verificationStatus: "Verified",
          snippet: "Transmission network capital expenditures increased 12% year-over-year to support distributed renewables.",
        },
      ],
      sourceAnalysis: {
        domain: "iea.org",
        publisher: "International Energy Agency (Intergovernmental Organization)",
        publicationDate: "2024-03-15",
        author: "Energy Markets & Security Directorate",
        isHttps: true,
        metadataFound: true,
        evidenceAvailability: "High",
        reputationAssessment: "Highly reputable intergovernmental organization with rigorous peer-reviewed statistical methodologies.",
        signals: [
          {
            id: "sig-1",
            name: "Domain Reputation",
            score: 95,
            status: "Positive",
            explanation: "Established intergovernmental research domain with authenticated DNS and publication history.",
          },
          {
            id: "sig-2",
            name: "HTTPS Security & TLS",
            score: 98,
            status: "Positive",
            explanation: "Valid SSL/TLS certificate with strict transport security.",
          },
          {
            id: "sig-3",
            name: "Editorial Standards",
            score: 90,
            status: "Positive",
            explanation: "Identifiable authors and public methodological documentation.",
          },
        ],
      },
      limitations: [
        "Analysis restricted to primary institutional reports and public electricity datasets.",
        "Regional sub-grid statistics vary in latency and reporting standards.",
      ],
      aiProvider: "local_nlp",
    },
    {
      id: "na-seed-002",
      createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      headline: "Secret Miracle Mineral Discovered in Arctic Ice Cures All Known Viral Infections Overnight",
      content:
        "In an astonishing underground briefing leaked today, an unnamed military scientist claims that a crystalline compound extracted from deep Arctic permafrost instantly eradicates all influenza, COVID, and retroviral strains within 4 hours. Big pharmaceutical companies and health authorities are allegedly suppressing the findings to protect trillion-dollar treatments. Order emergency sample kits exclusively from the encrypted link below.",
      inputType: "article",
      status: "LIKELY FALSE",
      credibilityScore: 14,
      credibilityTier: "Very Low Credibility",
      confidence: 96,
      riskLevel: "High",
      summary:
        "High-risk disinformation alert. Text exhibits extreme sensationalism, conspiratorial suppression tropes, zero verifiable clinical trials, anonymous scientific claims, and urgency-driven commercial solicitations.",
      breakdown: {
        overallScore: 14,
        sourceSignals: 12,
        evidenceSupport: 8,
        claimConsistency: 15,
        contentQuality: 10,
        contextRelevance: 20,
        crossSourceAgreement: 18,
      },
      claims: [
        {
          id: "claim-3",
          claim: "Arctic mineral compound cures all viral infections within 4 hours.",
          status: "Contradicted",
          confidence: 98,
          evidence: "Completely contradicts established virology, clinical pharmacology, and FDA/WHO records.",
        },
        {
          id: "claim-4",
          claim: "Health organizations are actively suppressing miracle antiviral compound.",
          status: "Contradicted",
          confidence: 92,
          evidence: "Standard conspiratorial defense mechanism commonly seen in health product scams.",
        },
      ],
      evidence: [
        {
          id: "ev-3",
          title: "WHO Guidelines on Antiviral Therapeutics and Fact Checks",
          source: "World Health Organization",
          url: "https://who.int",
          date: "2024-01-10",
          evidenceType: "Contradicting",
          relevance: 98,
          verificationStatus: "Verified",
          snippet: "There is no known single chemical or mineral agent capable of broad-spectrum universal eradication of unrelated viral families.",
        },
      ],
      sourceAnalysis: {
        domain: "unknown / unlinked publication",
        publisher: "Anonymous Blog Network",
        isHttps: false,
        metadataFound: false,
        evidenceAvailability: "Unavailable",
        reputationAssessment: "No identifiable institutional backing, author credentials, or verifiable clinical citations.",
        signals: [
          {
            id: "sig-4",
            name: "Linguistic Sensationalism",
            score: 10,
            status: "Negative",
            explanation: "High density of hyperbolic buzzwords ('miracle', 'overnight', 'secret suppression').",
          },
          {
            id: "sig-5",
            name: "Publisher Identity",
            score: 15,
            status: "Negative",
            explanation: "No registered organization or verified editorial board found.",
          },
        ],
      },
      limitations: [
        "No verified peer-reviewed scientific literature matches the claimed compound or molecular structure.",
      ],
      aiProvider: "local_nlp",
    },
    {
      id: "na-seed-003",
      createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
      headline: "Tech Giant Quantum Computing Breakthrough Solves RSA-4096 Encryption in Under 10 Seconds",
      content:
        "A circulating viral post suggests that researchers at a leading technology firm have developed a room-temperature quantum processor with 100,000 fault-tolerant logical qubits, successfully factoring RSA-4096 keys in test environments. While the company announced progress on intermediate scale NISQ hardware, commercial cryptographic breaking was not confirmed.",
      inputType: "headline_content",
      status: "POTENTIALLY MISLEADING",
      credibilityScore: 46,
      credibilityTier: "Low Credibility",
      confidence: 84,
      riskLevel: "Medium",
      summary:
        "Assessment finds misinterpretation of actual scientific research. A genuine quantum hardware progress announcement was conflated with an exaggerated claim of breaking modern public-key cryptography.",
      breakdown: {
        overallScore: 46,
        sourceSignals: 60,
        evidenceSupport: 40,
        claimConsistency: 35,
        contentQuality: 52,
        contextRelevance: 48,
        crossSourceAgreement: 42,
      },
      claims: [
        {
          id: "claim-5",
          claim: "Quantum processor successfully factored RSA-4096 in 10 seconds.",
          status: "Questionable",
          confidence: 88,
          evidence: "NIST and peer-reviewed quantum benchmarks show current hardware remains orders of magnitude away from Shor's algorithm at 4096 bits.",
        },
      ],
      evidence: [
        {
          id: "ev-4",
          title: "NIST Post-Quantum Cryptography Standardization Report",
          source: "National Institute of Standards and Technology",
          url: "https://nist.gov",
          date: "2024-08-13",
          evidenceType: "Contradicting",
          relevance: 90,
          verificationStatus: "Verified",
          snippet: "Fault-tolerant quantum computing capable of threatening RSA-2048 or RSA-4096 requires millions of physical qubits with error correction, not achieved to date.",
        },
      ],
      sourceAnalysis: {
        domain: "social-discussion.net",
        publisher: "Online Tech Forum Post",
        isHttps: true,
        metadataFound: true,
        evidenceAvailability: "Moderate",
        reputationAssessment: "Unvetted forum speculation amplifying an academic press release beyond its stated empirical scope.",
        signals: [
          {
            id: "sig-6",
            name: "Cross-Source Corroboration",
            score: 40,
            status: "Warning",
            explanation: "No corroborating statements from NIST or recognized cryptographic conferences.",
          },
        ],
      },
      limitations: [
        "Company research paper verified, but claimed encryption cracking capability is unsubstantiated.",
      ],
      aiProvider: "local_nlp",
    },
  ],
  faceVerifications: [
    {
      id: "fv-seed-001",
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      status: "MATCH",
      similarity: 94.2,
      confidence: 96,
      thresholdUsed: 0.82,
      explanation:
        "Facial feature embeddings were compared across key ocular, nasal, and jawline landmarks. Cosine similarity of 0.94 exceeded the configured threshold of 0.82.",
      referenceMetrics: {
        faceDetected: true,
        facesCount: 1,
        imageQuality: "High",
        poseQuality: "Optimal",
        lighting: "Adequate",
        sharpnessScore: 92,
      },
      verificationMetrics: {
        faceDetected: true,
        facesCount: 1,
        imageQuality: "High",
        poseQuality: "Optimal",
        lighting: "Adequate",
        sharpnessScore: 89,
      },
      provider: "local_biometric",
      privacyNotice: "Biometric vectors computed in-memory. Raw imagery discarded pursuant to local data governance.",
    },
    {
      id: "fv-seed-002",
      createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
      status: "NO MATCH",
      similarity: 38.6,
      confidence: 94,
      thresholdUsed: 0.82,
      explanation:
        "Facial landmark vectors do not match. Cosine similarity of 0.39 fell well below the configured threshold of 0.82.",
      referenceMetrics: {
        faceDetected: true,
        facesCount: 1,
        imageQuality: "High",
        poseQuality: "Optimal",
        lighting: "Adequate",
        sharpnessScore: 90,
      },
      verificationMetrics: {
        faceDetected: true,
        facesCount: 1,
        imageQuality: "Medium",
        poseQuality: "Angled",
        lighting: "Uneven",
        sharpnessScore: 78,
      },
      provider: "local_biometric",
      privacyNotice: "Biometric vectors computed in-memory. Raw imagery discarded pursuant to local data governance.",
    },
  ],
  history: [
    {
      id: "hist-001",
      type: "news",
      title: "Global Renewable Energy Generation Surpasses 30%",
      inputSummary: "According to the latest comprehensive assessment published by the IEA...",
      result: "LIKELY CREDIBLE",
      score: 88,
      confidence: 94,
      riskLevel: "Low",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      statusTag: "Verified",
      targetId: "na-seed-001",
    },
    {
      id: "hist-002",
      type: "face",
      title: "Identity Verification - Ref #4021 vs Probe #4022",
      inputSummary: "Dual-image biometric facial landmark verification",
      result: "MATCH",
      score: 94,
      confidence: 96,
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      statusTag: "Verified",
      targetId: "fv-seed-001",
    },
    {
      id: "hist-003",
      type: "news",
      title: "Secret Miracle Mineral Discovered in Arctic Ice Cures All...",
      inputSummary: "In an astonishing underground briefing leaked today...",
      result: "LIKELY FALSE",
      score: 14,
      confidence: 96,
      riskLevel: "High",
      createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      statusTag: "High Risk",
      targetId: "na-seed-002",
    },
    {
      id: "hist-004",
      type: "face",
      title: "Identity Verification - Ref #3109 vs Probe #3110",
      inputSummary: "Dual-image biometric facial landmark verification",
      result: "NO MATCH",
      score: 39,
      confidence: 94,
      createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
      statusTag: "Unverified",
      targetId: "fv-seed-002",
    },
    {
      id: "hist-005",
      type: "news",
      title: "Tech Giant Quantum Computing Breakthrough Solves RSA-4096...",
      inputSummary: "A circulating viral post suggests that researchers at a leading...",
      result: "POTENTIALLY MISLEADING",
      score: 46,
      confidence: 84,
      riskLevel: "Medium",
      createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
      statusTag: "Moderate",
      targetId: "na-seed-003",
    },
  ],
  reports: [
    {
      id: "rep-001",
      analysisId: "na-seed-001",
      type: "news",
      title: "Verification Report: Global Renewable Energy Generation Surpasses 30%",
      generatedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      inputSummary: "IEA published assessment on global renewable energy generation reaching 30%...",
      result: "LIKELY CREDIBLE",
      credibilityScore: 88,
      confidence: 94,
      riskLevel: "Low",
      scoreBreakdown: {
        overallScore: 88,
        sourceSignals: 92,
        evidenceSupport: 90,
        claimConsistency: 88,
        contentQuality: 85,
        contextRelevance: 84,
        crossSourceAgreement: 89,
      },
      limitations: [
        "Regional sub-grid statistics vary in reporting cadence.",
        "Assessments are algorithmic and probabilistic, not absolute determinations of truth.",
      ],
      disclaimer:
        "TRUSTVERIFY AI provides probabilistic credibility analysis based on empirical data, linguistic patterns, and available references. It should not be used as the sole determinant for legal or clinical decisions.",
    },
  ],
};

function ensureDbExists(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2), "utf8");
      return INITIAL_SEED_DATA;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(content) as DatabaseSchema;
    return parsed;
  } catch (error) {
    console.error("Database read error, restoring defaults:", error);
    return INITIAL_SEED_DATA;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Database write error:", error);
  }
}

export const db = {
  getSettings(): SystemSettings {
    const data = ensureDbExists();
    // Check if environment has GEMINI_API_KEY
    const envKey = process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(envKey && envKey.trim().length > 10);
    return {
      ...data.settings,
      geminiApiKeyConfigured: isConfigured,
    };
  },

  updateSettings(partial: Partial<SystemSettings>): SystemSettings {
    const data = ensureDbExists();
    data.settings = { ...data.settings, ...partial };
    writeDb(data);
    return data.settings;
  },

  getAllNews(): NewsAnalysis[] {
    const data = ensureDbExists();
    return [...data.newsAnalyses].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getNewsById(id: string): NewsAnalysis | undefined {
    const data = ensureDbExists();
    return data.newsAnalyses.find((n) => n.id === id);
  },

  saveNews(analysis: NewsAnalysis): NewsAnalysis {
    const data = ensureDbExists();
    data.newsAnalyses.unshift(analysis);

    // Also push to history
    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      type: "news",
      title: analysis.headline || analysis.content.slice(0, 60) + "...",
      inputSummary: analysis.content.slice(0, 100) + "...",
      result: analysis.status,
      score: analysis.credibilityScore,
      confidence: analysis.confidence,
      riskLevel: analysis.riskLevel,
      createdAt: analysis.createdAt,
      statusTag:
        analysis.riskLevel === "High"
          ? "High Risk"
          : analysis.credibilityScore >= 70
          ? "Verified"
          : analysis.credibilityScore >= 50
          ? "Moderate"
          : "Unverified",
      targetId: analysis.id,
    };
    data.history.unshift(historyItem);

    writeDb(data);
    return analysis;
  },

  saveFaceVerification(result: FaceVerificationResult): FaceVerificationResult {
    const data = ensureDbExists();
    data.faceVerifications.unshift(result);

    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      type: "face",
      title: `Face Verification [${result.status}]`,
      inputSummary: `Biometric similarity: ${result.similarity}% (Threshold: ${result.thresholdUsed * 100}%)`,
      result: result.status,
      score: result.similarity,
      confidence: result.confidence,
      createdAt: result.createdAt,
      statusTag: result.status === "MATCH" ? "Verified" : "Unverified",
      targetId: result.id,
    };
    data.history.unshift(historyItem);

    writeDb(data);
    return result;
  },

  getFaceById(id: string): FaceVerificationResult | undefined {
    const data = ensureDbExists();
    return data.faceVerifications.find((f) => f.id === id);
  },

  getHistory(filters?: {
    type?: string;
    filter?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): { items: HistoryRecord[]; total: number; page: number; totalPages: number } {
    const data = ensureDbExists();
    let records = [...data.history];

    if (filters?.type && filters.type !== "all") {
      records = records.filter((r) => r.type === filters.type);
    }

    if (filters?.filter && filters.filter !== "all") {
      if (filters.filter === "high_risk") {
        records = records.filter((r) => r.statusTag === "High Risk" || r.riskLevel === "High");
      } else if (filters.filter === "verified") {
        records = records.filter((r) => r.statusTag === "Verified" || r.score >= 70);
      } else if (filters.filter === "unverified") {
        records = records.filter((r) => r.statusTag === "Unverified" || r.score < 50);
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.inputSummary.toLowerCase().includes(q) ||
          r.result.toLowerCase().includes(q)
      );
    }

    // Sort descending by timestamp
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = records.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const paginated = records.slice(start, start + limit);
    const totalPages = Math.ceil(total / limit) || 1;

    return { items: paginated, total, page, totalPages };
  },

  deleteHistoryItem(id: string): boolean {
    const data = ensureDbExists();
    const initialLen = data.history.length;
    data.history = data.history.filter((h) => h.id !== id);

    // If item deleted, also remove target if found
    data.newsAnalyses = data.newsAnalyses.filter((n) => n.id !== id);
    data.faceVerifications = data.faceVerifications.filter((f) => f.id !== id);
    data.reports = data.reports.filter((r) => r.id !== id && r.analysisId !== id);

    writeDb(data);
    return data.history.length < initialLen;
  },

  deleteAllAnalysisData(): void {
    const data = ensureDbExists();
    data.newsAnalyses = [];
    data.faceVerifications = [];
    data.history = [];
    data.reports = [];
    writeDb(data);
  },

  saveReport(report: VerificationReport): VerificationReport {
    const data = ensureDbExists();
    data.reports.unshift(report);
    writeDb(data);
    return report;
  },

  getAllReports(): VerificationReport[] {
    const data = ensureDbExists();
    return [...data.reports].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  },

  getReportById(id: string): VerificationReport | undefined {
    const data = ensureDbExists();
    return data.reports.find((r) => r.id === id || r.analysisId === id);
  },

  getDashboardStats(): DashboardStats {
    const data = ensureDbExists();
    const news = data.newsAnalyses;
    const faces = data.faceVerifications;
    const history = data.history;

    const totalVerifications = history.length;
    const newsAnalyzed = news.length;
    const facesVerified = faces.length;

    const averageCredibilityScore =
      news.length > 0
        ? Math.round(news.reduce((acc, curr) => acc + curr.credibilityScore, 0) / news.length)
        : 0;

    const highRiskFindings = news.filter((n) => n.riskLevel === "High").length;

    // Credibility distribution across standard buckets
    const buckets = [
      { name: "0-29 Very Low", min: 0, max: 29, color: "#ef4444", count: 0 },
      { name: "30-49 Low", min: 30, max: 49, color: "#f97316", count: 0 },
      { name: "50-69 Moderate", min: 50, max: 69, color: "#f59e0b", count: 0 },
      { name: "70-84 High", min: 70, max: 84, color: "#06b6d4", count: 0 },
      { name: "85-100 Very High", min: 85, max: 100, color: "#10b981", count: 0 },
    ];

    news.forEach((item) => {
      const bucket = buckets.find(
        (b) => item.credibilityScore >= b.min && item.credibilityScore <= b.max
      );
      if (bucket) bucket.count++;
    });

    // Classification distribution
    const statusCounts: Record<string, { count: number; color: string }> = {
      "LIKELY CREDIBLE": { count: 0, color: "#10b981" },
      "POTENTIALLY MISLEADING": { count: 0, color: "#f59e0b" },
      "LIKELY FALSE": { count: 0, color: "#ef4444" },
      "INSUFFICIENT EVIDENCE": { count: 0, color: "#64748b" },
    };

    news.forEach((item) => {
      if (statusCounts[item.status]) {
        statusCounts[item.status].count++;
      }
    });

    const newsClassificationDistribution = Object.entries(statusCounts).map(
      ([status, val]) => ({
        status,
        count: val.count,
        color: val.color,
      })
    );

    // Group activity by date (last 7 days)
    const dateMap: Record<string, { news: number; face: number; total: number }> = {};
    const daysToShow = 7;
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400 * 1000);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dateMap[label] = { news: 0, face: 0, total: 0 };
    }

    history.forEach((h) => {
      const d = new Date(h.createdAt);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateMap[label]) {
        if (h.type === "news") dateMap[label].news++;
        if (h.type === "face") dateMap[label].face++;
        dateMap[label].total++;
      }
    });

    const activityOverTime = Object.entries(dateMap).map(([date, val]) => ({
      date,
      news: val.news,
      face: val.face,
      total: val.total,
    }));

    // Overall verification result breakdown
    const verifiedCount = history.filter((h) => h.statusTag === "Verified").length;
    const warningCount = history.filter((h) => h.statusTag === "Moderate").length;
    const riskCount = history.filter((h) => h.statusTag === "High Risk").length;
    const unverifiedCount = history.filter((h) => h.statusTag === "Unverified").length;

    const verificationResultBreakdown = [
      { name: "Verified / Match", value: verifiedCount },
      { name: "Moderate / Uncertain", value: warningCount },
      { name: "High Risk / False", value: riskCount },
      { name: "Unverified / No Match", value: unverifiedCount },
    ];

    return {
      totalVerifications,
      newsAnalyzed,
      facesVerified,
      averageCredibilityScore,
      highRiskFindings,
      credibilityDistribution: buckets.map((b) => ({
        name: b.name,
        count: b.count,
        color: b.color,
      })),
      newsClassificationDistribution,
      activityOverTime,
      verificationResultBreakdown,
    };
  },
};
