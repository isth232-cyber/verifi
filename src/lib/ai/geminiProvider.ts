import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAnalysisRequest, AIAnalysisResponse, AINewsProvider } from "./types";
import { getTierForScore } from "../utils/formatters";

export class GeminiProvider implements AINewsProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (!this.apiKey || this.apiKey.trim().length === 0) {
      throw new Error("GEMINI_API_KEY is not configured in the environment or settings.");
    }

    const genAI = new GoogleGenerativeAI(this.apiKey);
    // Use gemini-1.5-flash or gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = `You are the core intelligence engine for TRUSTVERIFY AI, an academic and professional cybersecurity and information verification platform.
Analyze the following news submission. You must NOT present any probabilistic assessment as absolute infallible truth.
Use measured, objective terminology: "AI Assessment", "Confidence", "Evidence", "Credibility Score", "Potentially Misleading", "Unable to Verify".

Article Headline: ${request.headline || "N/A"}
Source URL: ${request.sourceUrl || "N/A"}
Input Type: ${request.inputType}
Article Content:
"""
${request.content}
"""

Return ONLY a JSON object with this exact structure:
{
  "status": "LIKELY CREDIBLE" | "POTENTIALLY MISLEADING" | "LIKELY FALSE" | "INSUFFICIENT EVIDENCE",
  "credibilityScore": number (0 to 100 representing assessment of available evidence),
  "confidence": number (0 to 100 representing how certain the model is in its assessment),
  "riskLevel": "Low" | "Medium" | "High",
  "summary": "Concise analytical summary explaining the rationale without claiming absolute truth",
  "breakdown": {
    "overallScore": number (0-100),
    "sourceSignals": number (0-100),
    "evidenceSupport": number (0-100),
    "claimConsistency": number (0-100),
    "contentQuality": number (0-100),
    "contextRelevance": number (0-100),
    "crossSourceAgreement": number (0-100)
  },
  "claims": [
    {
      "id": "claim-1",
      "claim": "Specific factual claim extracted verbatim or summarized",
      "status": "Supported" | "Contradicted" | "Unverified" | "Questionable",
      "confidence": number (0-100),
      "evidence": "Specific reason for status or 'Unable to verify this signal.'"
    }
  ],
  "evidence": [
    {
      "id": "ev-1",
      "title": "Document or standard dataset reference",
      "source": "Publishing entity or consensus dataset",
      "url": "Optional URL if genuine, otherwise omit or write empty",
      "evidenceType": "Supporting" | "Contradicting" | "Contextual" | "Unverified",
      "relevance": number (0-100),
      "verificationStatus": "Verified" | "Unverified" | "Contextual",
      "snippet": "Short quotation or contextual summary"
    }
  ],
  "sourceAnalysis": {
    "domain": "Domain name or 'Unspecified'",
    "publisher": "Name of publisher or 'Unknown'",
    "isHttps": boolean,
    "metadataFound": boolean,
    "evidenceAvailability": "High" | "Moderate" | "Low" | "Unavailable",
    "reputationAssessment": "Fair explanation. Distinguish 'Unknown' from 'Untrustworthy'. Do not invent factual claims.",
    "signals": [
      {
        "id": "sig-1",
        "name": "Signal name (e.g. Domain Reputation, HTTPS, Editorial Disclosures)",
        "score": number (0-100),
        "status": "Positive" | "Neutral" | "Warning" | "Negative" | "Unknown",
        "explanation": "Clear explanation of this signal"
      }
    ]
  },
  "limitations": [
    "Limitations of this automated AI verification"
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean JSON if code blocks were returned
      const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const credibilityScore = Math.max(0, Math.min(100, Math.round(parsed.credibilityScore || 50)));
      const confidence = Math.max(0, Math.min(100, Math.round(parsed.confidence || 75)));

      return {
        status: parsed.status || "INSUFFICIENT EVIDENCE",
        credibilityScore,
        credibilityTier: getTierForScore(credibilityScore),
        confidence,
        riskLevel: parsed.riskLevel || "Medium",
        summary: parsed.summary || "AI verification assessment completed.",
        breakdown: {
          overallScore: credibilityScore,
          sourceSignals: parsed.breakdown?.sourceSignals ?? 60,
          evidenceSupport: parsed.breakdown?.evidenceSupport ?? 60,
          claimConsistency: parsed.breakdown?.claimConsistency ?? 60,
          contentQuality: parsed.breakdown?.contentQuality ?? 60,
          contextRelevance: parsed.breakdown?.contextRelevance ?? 60,
          crossSourceAgreement: parsed.breakdown?.crossSourceAgreement ?? 60,
        },
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
        sourceAnalysis: parsed.sourceAnalysis || {
          domain: "N/A",
          publisher: "Unknown",
          isHttps: false,
          metadataFound: false,
          evidenceAvailability: "Unavailable",
          reputationAssessment: "Unable to verify source signals.",
          signals: [],
        },
        limitations: Array.isArray(parsed.limitations)
          ? parsed.limitations
          : ["AI probabilistic evaluation generated using Google Gemini."],
        provider: "gemini",
      };
    } catch (err: any) {
      console.error("Gemini API execution error:", err);
      throw new Error(`Gemini Provider failed: ${err.message || "Unknown error"}`);
    }
  }
}
