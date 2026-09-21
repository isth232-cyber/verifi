import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const report = db.getReportById(id);

    if (!report) {
      return NextResponse.json(
        { error: `Verification report '${id}' was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error("API /api/reports/[id] GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve report." },
      { status: 500 }
    );
  }
}
