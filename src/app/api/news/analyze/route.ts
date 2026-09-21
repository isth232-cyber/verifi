import { NextRequest, NextResponse } from "next/server";
import { newsAnalysisService } from "@/lib/services/newsAnalysisService";
import { AIAnalysisRequest } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { headline, content, sourceUrl, inputType } = body;

    if (!content || typeof content !== "string" || content.trim().length < 15) {
      return NextResponse.json(
        { error: "Article content must be provided and contain at least 15 characters." },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedHeadline = headline ? String(headline).trim().slice(0, 300) : "";
    const sanitizedContent = String(content).trim().slice(0, 30000);
    const sanitizedUrl = sourceUrl ? String(sourceUrl).trim().slice(0, 500) : "";

    const request: AIAnalysisRequest = {
      headline: sanitizedHeadline,
      content: sanitizedContent,
      sourceUrl: sanitizedUrl,
      inputType: inputType || "article",
    };

    const result = await newsAnalysisService.analyzeNews(request);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("API /api/news/analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process news verification analysis." },
      { status: 500 }
    );
  }
}
