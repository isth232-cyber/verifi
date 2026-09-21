import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Check news first, then face
    const news = db.getNewsById(id);
    if (news) {
      return NextResponse.json({ success: true, type: "news", data: news });
    }

    const face = db.getFaceById(id);
    if (face) {
      return NextResponse.json({ success: true, type: "face", data: face });
    }

    // Check report
    const report = db.getReportById(id);
    if (report) {
      return NextResponse.json({ success: true, type: "report", data: report });
    }

    return NextResponse.json(
      { error: `Record with ID '${id}' was not found.` },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("API /api/history/[id] GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve verification record." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = db.deleteHistoryItem(id);
    if (!deleted) {
      return NextResponse.json(
        { error: `Record with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Record ${id} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("API /api/history/[id] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete record." },
      { status: 500 }
    );
  }
}
