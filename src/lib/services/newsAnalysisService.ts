import { AIAnalysisRequest } from "../ai/types";
import { GeminiProvider } from "../ai/geminiProvider";
import { LocalFallbackProvider } from "../ai/localFallbackProvider";
import { db } from "../db/database";
import { NewsAnalysis } from "../types";

export class NewsAnalysisService {
  private localProvider = new LocalFallbackProvider();

  async analyzeNews(request: AIAnalysisRequest): Promise<NewsAnalysis> {
    const settings = db.getSettings();
    let aiResponse;
    let providerUsed: "gemini" | "local_nlp" | "demo" = "local_nlp";

    // Attempt Gemini if configured and preferred
    if (settings.aiProvider === "gemini" && process.env.GEMINI_API_KEY) {
      try {
        const gemini = new GeminiProvider(process.env.GEMINI_API_KEY);
        aiResponse = await gemini.analyze(request);
        providerUsed = "gemini";
      } catch (geminiError) {
        console.warn("Gemini analysis failed or rate limited; falling back to local NLP engine:", geminiError);
        aiResponse = await this.localProvider.analyze(request);
        providerUsed = "local_nlp";
        aiResponse.limitations.push(
          "Primary Gemini AI service was temporarily unreachable; analyzed using deterministic local heuristic verification engine."
        );
      }
    } else {
      // Local NLP heuristic engine
      aiResponse = await this.localProvider.analyze(request);
      providerUsed = "local_nlp";
    }

    const newsAnalysis: NewsAnalysis = {
      id: `na-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      headline: request.headline || request.content.slice(0, 80) + (request.content.length > 80 ? "..." : ""),
      content: request.content,
      sourceUrl: request.sourceUrl,
      inputType: request.inputType,
      status: aiResponse.status,
      credibilityScore: aiResponse.credibilityScore,
      credibilityTier: aiResponse.credibilityTier,
      confidence: aiResponse.confidence,
      riskLevel: aiResponse.riskLevel,
      summary: aiResponse.summary,
      breakdown: aiResponse.breakdown,
      claims: aiResponse.claims,
      evidence: aiResponse.evidence,
      sourceAnalysis: aiResponse.sourceAnalysis,
      limitations: aiResponse.limitations,
      aiProvider: providerUsed,
    };

    // Persist to database
    db.saveNews(newsAnalysis);

    return newsAnalysis;
  }
}

export const newsAnalysisService = new NewsAnalysisService();
