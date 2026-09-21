"use client";

import React, { useRef, useState } from "react";
import { Upload, File, X, Check } from "lucide-react";

interface UploadZoneProps {
  label: string;
  accept?: string;
  maxSizeBytes?: number;
  isImage?: boolean;
  value?: string | null;
  fileName?: string | null;
  onFileLoaded: (data: { base64?: string; text?: string; fileName: string; fileSize: number }) => void;
  onClear: () => void;
  previewUrl?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  label,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeBytes = 5 * 1024 * 1024,
  isImage = true,
  value,
  fileName,
  onFileLoaded,
  onClear,
  previewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit.`);
      return;
    }

    const reader = new FileReader();
    if (isImage) {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onFileLoaded({
          base64,
          fileName: file.name,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoaded({
          text,
          fileName: file.name,
          fileSize: file.size,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider">
          {label}
        </label>
        {fileName && (
          <span className="text-[11px] font-mono text-[#287D55] flex items-center gap-1 font-semibold">
            <Check className="w-3 h-3" /> Ready
          </span>
        )}
      </div>

      {previewUrl || value ? (
        <div className="rounded-lg border border-[#D9DEE5] bg-white p-3 shadow-sm">
          {isImage ? (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-44 rounded overflow-hidden bg-[#F4F6F8] flex items-center justify-center border border-[#E2E8F0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl || value || ""}
                  alt="Uploaded preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-2.5 w-full flex items-center justify-between text-xs text-[#667085] px-1">
                <span className="truncate max-w-[200px] font-mono text-[#17202A] font-medium">
                  {fileName || "Image loaded"}
                </span>
                <button
                  type="button"
                  onClick={onClear}
                  className="text-[#B54747] hover:text-[#8C3636] inline-flex items-center gap-1 text-[11px] font-semibold transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-[#1F3A5F]" />
                <div>
                  <p className="text-xs font-semibold text-[#17202A] truncate max-w-[240px]">
                    {fileName}
                  </p>
                  <span className="text-[11px] text-[#667085]">Document loaded</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="text-[#B54747] hover:text-[#8C3636] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
            isDragging
              ? "border-[#1F3A5F] bg-[#EFF5FB]"
              : "border-[#D9DEE5] bg-white hover:bg-[#F8FAFC] hover:border-[#3B6EA5]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />

          <div className="p-2 rounded bg-[#F4F6F8] text-[#1F3A5F] mb-2 border border-[#E2E8F0]">
            <Upload className="w-4 h-4" />
          </div>

          <p className="text-xs font-semibold text-[#17202A]">
            Select or drag file to upload
          </p>
          <p className="text-[11px] text-[#667085] mt-0.5">
            {isImage ? "JPEG, PNG, or WebP up to 5MB" : "Text (.txt) or Markdown up to 5MB"}
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-[#B54747] mt-1.5 font-medium flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
};
