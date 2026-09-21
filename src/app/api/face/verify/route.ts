import { NextRequest, NextResponse } from "next/server";
import { faceVerificationService } from "@/lib/services/faceVerificationService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { referenceImage, verificationImage, claimedIdentity, provider } = body;

    if (!referenceImage || !verificationImage) {
      return NextResponse.json(
        { error: "Both Reference Image and Verification Image are required." },
        { status: 400 }
      );
    }

    const result = await faceVerificationService.verifyFace({
      referenceImageBase64: referenceImage,
      verificationImageBase64: verificationImage,
      claimedIdentity,
      provider,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("API /api/face/verify error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process face verification." },
      { status: 500 }
    );
  }
}
