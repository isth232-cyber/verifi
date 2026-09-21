"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, X, RefreshCw, Check } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string) => void;
  title?: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = "Live Verification Camera Capture",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    setCapturedPhoto(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access is not supported by your browser environment.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access in your browser."
          : err.message || "Failed to initialize camera device."
      );
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#D9DEE5] rounded-lg w-full max-w-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D9DEE5] bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#1F3A5F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 rounded text-[#667085] hover:text-[#17202A] hover:bg-[#E9EEF3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-full aspect-video rounded overflow-hidden bg-[#17202A] border border-[#D9DEE5] flex items-center justify-center">
            {cameraError ? (
              <div className="p-6 text-center text-xs text-[#B54747]">
                <p className="font-semibold mb-1">Camera Initialization Error</p>
                <p className="text-white/80">{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-3 px-3 py-1.5 rounded bg-[#1F3A5F] text-white font-medium hover:bg-[#182E4B]"
                >
                  Retry Access
                </button>
              </div>
            ) : isInitializing ? (
              <div className="flex items-center gap-2 text-xs text-white/80 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Connecting camera stream...
              </div>
            ) : capturedPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capturedPhoto}
                alt="Captured snapshot"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Clean face alignment guide frame */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-44 h-52 border border-white/60 rounded-full" />
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <p className="text-[11px] text-[#667085] text-center mt-2.5">
            {capturedPhoto
              ? "Confirm snapshot or retake photograph."
              : "Position subject centrally within the guide frame."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#D9DEE5] bg-[#F8FAFC]">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-3.5 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Use Photo
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-3 py-1.5 rounded text-xs font-medium text-[#667085] hover:text-[#17202A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapture}
                disabled={Boolean(cameraError || isInitializing)}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" /> Capture Frame
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
