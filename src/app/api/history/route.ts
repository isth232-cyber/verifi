import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = db.getHistory({ type, filter, search, page, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("API /api/history GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve verification history records." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    db.deleteAllAnalysisData();
    return NextResponse.json({
      success: true,
      message: "All verification and analysis data has been permanently cleared.",
    });
  } catch (error: any) {
    console.error("API /api/history DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to clear analysis data." },
      { status: 500 }
    );
  }
}
