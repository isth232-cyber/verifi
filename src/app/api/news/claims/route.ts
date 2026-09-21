import { NextRequest, NextResponse } from "next/server";
import { newsAnalysisService } from "@/lib/services/newsAnalysisService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, headline } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required for claim extraction." },
        { status: 400 }
      );
    }

    const analysis = await newsAnalysisService.analyzeNews({
      content,
      headline,
      inputType: "headline_content",
    });

    return NextResponse.json({
      success: true,
      claims: analysis.claims,
      overallCredibility: analysis.credibilityScore,
    });
  } catch (error: any) {
    console.error("API /api/news/claims error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract claims." },
      { status: 500 }
    );
  }
}
