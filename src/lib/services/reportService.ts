import { db } from "../db/database";
import { VerificationReport } from "../types";

export class ReportService {
  async generateReportForNews(newsId: string): Promise<VerificationReport> {
    const news = db.getNewsById(newsId);
    if (!news) {
      throw new Error(`News analysis with ID ${newsId} not found.`);
    }

    // Check if report already exists
    const existing = db.getReportById(newsId);
    if (existing) return existing;

    const report: VerificationReport = {
      id: `rep-${Date.now()}`,
      analysisId: news.id,
      type: "news",
      title: `Verification Report: ${news.headline}`,
      generatedAt: new Date().toISOString(),
      inputSummary: news.content.slice(0, 240) + (news.content.length > 240 ? "..." : ""),
      result: news.status,
      credibilityScore: news.credibilityScore,
      confidence: news.confidence,
      riskLevel: news.riskLevel,
      scoreBreakdown: news.breakdown,
      claims: news.claims,
      evidence: news.evidence,
      sourceAnalysis: news.sourceAnalysis,
      limitations: news.limitations,
      disclaimer:
        "IMPORTANT NOTICE: TRUSTVERIFY AI delivers probabilistic algorithmic assessments synthesized from available digital signals, stylistic patterns, and comparative knowledge stores. These assessments do not represent infallible factual arbitrations or judicial determinations. Independent multi-source verification is recommended for critical decisions.",
    };

    db.saveReport(report);
    return report;
  }

  async generateReportForFace(faceId: string): Promise<VerificationReport> {
    const face = db.getFaceById(faceId);
    if (!face) {
      throw new Error(`Face verification with ID ${faceId} not found.`);
    }

    const existing = db.getReportById(faceId);
    if (existing) return existing;

    const report: VerificationReport = {
      id: `rep-${Date.now()}`,
      analysisId: face.id,
      type: "face",
      title: `Biometric Verification Audit: ${face.status}`,
      generatedAt: new Date().toISOString(),
      inputSummary: `1-to-1 Facial Verification. Evaluated similarity ${face.similarity}% against security threshold ${face.thresholdUsed * 100}%.`,
      result: face.status,
      confidence: face.confidence,
      limitations: [
        "Assessment is strictly 1-to-1 reference probe verification; no open-ended database facial recognition was executed.",
        "Quality variance in lighting, pose, or focal length can impact gradient similarity scores.",
        "Pursuant to biometric privacy standards, zero raw biometric embeddings or image buffers were retained.",
      ],
      disclaimer:
        "IMPORTANT NOTICE: Biometric comparison provides statistical similarity between provided digital media frames. This report certifies the comparative mathematical alignment at timestamp of execution and does not constitute a legal identity document.",
    };

    db.saveReport(report);
    return report;
  }
}

export const reportService = new ReportService();
