import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET() {
  try {
    const stats = db.getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("API /api/analytics GET error:", error);
    return NextResponse.json(
      { error: "Failed to compute dashboard analytics." },
      { status: 500 }
    );
  }
}
