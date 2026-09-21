"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadZone } from "@/components/ui/UploadZone";
import { CameraModal } from "@/components/ui/CameraModal";
import { ErrorState } from "@/components/ui/ErrorState";
import { FaceVerificationResult } from "@/lib/types";
import {
  UserCheck,
  Camera,
  Shield,
  Lock,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function FaceVerificationPage() {
  const [refImage, setRefImage] = useState<string | null>(null);
  const [probeImage, setProbeImage] = useState<string | null>(null);
  const [refFileName, setRefFileName] = useState<string | null>(null);
  const [probeFileName, setProbeFileName] = useState<string | null>(null);
  const [claimedIdentity, setClaimedIdentity] = useState("");

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<FaceVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick sample loader for demonstration
  const loadDemoFaces = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(0, 0, 160, 160);
      ctx.fillStyle = "#94A3B8";
      ctx.beginPath();
      ctx.arc(80, 70, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(68, 65, 4, 0, Math.PI * 2);
      ctx.arc(92, 65, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(80, 85, 12, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      const samplePng = canvas.toDataURL("image/png");
      setRefImage(samplePng);
      setProbeImage(samplePng);
      setRefFileName("reference-sample.png");
      setProbeFileName("probe-sample.png");
      setClaimedIdentity("Subject Ref #4021");
      setError(null);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!refImage) {
      setError("Please upload a Reference Image.");
      return;
    }
    if (!probeImage) {
      setError("Please upload a Verification Image or capture one using your camera.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/face/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceImage: refImage,
          verificationImage: probeImage,
          claimedIdentity: claimedIdentity.trim() || undefined,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Face verification failed.");
      }

      setVerificationResult(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to complete biometric verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setRefImage(null);
    setProbeImage(null);
    setRefFileName(null);
    setProbeFileName(null);
    setClaimedIdentity("");
    setVerificationResult(null);
    setError(null);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="border-b border-[#D9DEE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Face Verification
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              1-to-1 facial comparison against a reference identity photograph.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDemoFaces}
            className="px-2.5 py-1 rounded text-xs font-medium text-[#1F3A5F] bg-[#EFF5FB] border border-[#BED7EE] hover:bg-[#D9E9F6] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3B6EA5]" />
            Load Sample Faces
          </button>
        </div>

        {/* Biometric Governance Note */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-3.5 flex items-center gap-3 text-xs shadow-sm">
          <div className="p-1.5 rounded bg-[#F4F6F8] text-[#1F3A5F] border border-[#D9DEE5]">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-[#667085]">
            <strong className="text-[#17202A]">Biometric Privacy: </strong>
            Photographs are analyzed ephemerally in RAM. Raw images and embeddings are immediately discarded post-execution.
          </div>
        </div>

        {/* Verification Result Panel (Clean Enterprise Design) */}
        {verificationResult && (
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-6 space-y-5 shadow-sm">
            {/* Verdict Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#667085] block mb-1">
                  Verification Status
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold px-3 py-1 rounded border flex items-center gap-2 ${
                      verificationResult.status === "MATCH"
                        ? "bg-[#EAF5EF] text-[#287D55] border-[#C2E2D1]"
                        : verificationResult.status === "NO MATCH"
                        ? "bg-[#FDF2F2] text-[#B54747] border-[#F5C7C7]"
                        : "bg-[#FEF7EC] text-[#B7791F] border-[#F7DEBA]"
                    }`}
                  >
                    {verificationResult.status === "MATCH" ? (
                      <Check className="w-4 h-4" />
                    ) : verificationResult.status === "NO MATCH" ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {verificationResult.status}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6 text-left sm:text-right">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#667085] block">
                    Similarity Score
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#17202A]">
                    {verificationResult.similarity}%
                  </span>
                  <span className="text-[10px] font-mono text-[#667085] block">
                    Threshold: {verificationResult.thresholdUsed * 100}%
                  </span>
                </div>

                <div className="border-l border-[#D9DEE5] pl-6">
                  <span className="text-[10px] uppercase font-mono text-[#667085] block">
                    Confidence
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#3B6EA5]">
                    {verificationResult.confidence}%
                  </span>
                  <span className="text-[10px] font-mono text-[#667085] block">
                    Quality calibrated
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation text */}
            <div className="bg-[#F8FAFC] p-3.5 rounded border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#667085] font-semibold block mb-1">
                Comparative Biometric Analysis
              </span>
              <p className="text-xs text-[#17202A] leading-relaxed">
                {verificationResult.explanation}
              </p>
            </div>

            {/* Quality Breakdown: Clean Enterprise Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Reference */}
              <div className="border border-[#D9DEE5] rounded p-3 bg-white">
                <span className="font-semibold text-[#17202A] block mb-2 border-b border-[#E2E8F0] pb-1">
                  Reference Quality Audit
                </span>
                <div className="space-y-1.5 text-[#667085]">
                  <div className="flex justify-between">
                    <span>Face Detected:</span>
                    <strong className="text-[#17202A] font-medium">
                      {verificationResult.referenceMetrics.facesCount === 1 ? "Yes (1 Face)" : "Multiple / None"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Quality:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.referenceMetrics.imageQuality}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pose Alignment:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.referenceMetrics.poseQuality}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lighting:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.referenceMetrics.lighting}</strong>
                  </div>
                </div>
              </div>

              {/* Probe */}
              <div className="border border-[#D9DEE5] rounded p-3 bg-white">
                <span className="font-semibold text-[#17202A] block mb-2 border-b border-[#E2E8F0] pb-1">
                  Probe Quality Audit
                </span>
                <div className="space-y-1.5 text-[#667085]">
                  <div className="flex justify-between">
                    <span>Face Detected:</span>
                    <strong className="text-[#17202A] font-medium">
                      {verificationResult.verificationMetrics.facesCount === 1 ? "Yes (1 Face)" : "Multiple / None"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Quality:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.verificationMetrics.imageQuality}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pose Alignment:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.verificationMetrics.poseQuality}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lighting:</span>
                    <strong className="text-[#17202A] font-medium">{verificationResult.verificationMetrics.lighting}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Actions */}
            <div className="pt-2 border-t border-[#D9DEE5] flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors"
              >
                Perform Another Verification
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          {/* Claimed Identity (Optional) */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 shadow-sm">
            <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
              Claimed Identity / Case Identifier (Optional)
            </label>
            <input
              type="text"
              value={claimedIdentity}
              onChange={(e) => setClaimedIdentity(e.target.value)}
              placeholder="e.g. Employee ID #4021 or Subject Name (Restricted to 1-to-1 matching)"
              className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all"
            />
          </div>

          {/* Dual Image Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reference */}
            <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                  REFERENCE
                </span>
                <span className="text-[10px] font-mono text-[#667085]">Known Anchor</span>
              </div>

              <UploadZone
                label="Reference Portrait"
                value={refImage}
                fileName={refFileName}
                onFileLoaded={(data) => {
                  setRefImage(data.base64 || null);
                  setRefFileName(data.fileName);
                }}
                onClear={() => {
                  setRefImage(null);
                  setRefFileName(null);
                }}
              />
            </div>

            {/* Verification Probe */}
            <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                  VERIFICATION
                </span>

                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-2 py-0.5 rounded text-xs font-semibold text-[#1F3A5F] bg-[#F4F6F8] border border-[#D9DEE5] hover:bg-[#E9EEF3] flex items-center gap-1 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Camera
                </button>
              </div>

              <UploadZone
                label="Probe Image"
                value={probeImage}
                fileName={probeFileName}
                onFileLoaded={(data) => {
                  setProbeImage(data.base64 || null);
                  setProbeFileName(data.fileName);
                }}
                onClear={() => {
                  setProbeImage(null);
                  setProbeFileName(null);
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <ErrorState
              title="Verification Constraint"
              message={error}
              onRetry={() => setError(null)}
            />
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {(refImage || probeImage) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded text-xs font-semibold text-[#667085] hover:text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isVerifying || !refImage || !probeImage}
              className="px-6 py-2 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Comparing Embeddings...
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  Verify Identity
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Camera Modal */}
        <CameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={(base64) => {
            setProbeImage(base64);
            setProbeFileName("camera-capture.jpg");
          }}
        />
      </div>
    </AppShell>
  );
}
