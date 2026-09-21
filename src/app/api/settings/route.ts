import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET() {
  try {
    const settings = db.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("API /api/settings GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve system settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API /api/settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to update system settings." },
      { status: 500 }
    );
  }
}
