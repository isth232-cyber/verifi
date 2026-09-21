import { NextRequest, NextResponse } from "next/server";
import { reportService } from "@/lib/services/reportService";
import { db } from "@/lib/db/database";

export async function GET() {
  try {
    const reports = db.getAllReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error("API /api/reports GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification reports." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, type } = body;

    if (!analysisId) {
      return NextResponse.json(
        { error: "Analysis ID is required to generate a report." },
        { status: 400 }
      );
    }

    let report;
    if (type === "face") {
      report = await reportService.generateReportForFace(analysisId);
    } else {
      report = await reportService.generateReportForNews(analysisId);
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error("API /api/reports POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate report." },
      { status: 500 }
    );
  }
}
