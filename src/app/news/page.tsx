"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { VerificationStepper } from "@/components/ui/VerificationStepper";
import { UploadZone } from "@/components/ui/UploadZone";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  FileText,
  Link2,
  Upload,
  Type,
  Shield,
  BookOpen,
} from "lucide-react";

type InputTab = "article" | "url" | "file" | "headline_content";

export default function NewsVerificationPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<InputTab>("article");
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  // Stepper state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Preset sample data for demonstration
  const loadSample = (type: "credible" | "misleading") => {
    if (type === "credible") {
      setHeadline("NASA Space Telescope Detects Atmospheric Water Vapor on Habitable-Zone Exoplanet");
      setContent(
        "Astronomers analyzing spectroscopic transmission datasets from the James Webb Space Telescope have reported atmospheric signatures consistent with water vapor and methane on exoplanet K2-18b. The peer-reviewed study, published in the Astrophysical Journal Letters, details absorption bands at 1.4 and 1.9 microns. Principal investigators cautioned that further observations are necessary to establish the absolute partial pressures and photochemical equilibrium of the observed planetary atmosphere."
      );
      setSourceUrl("https://nasa.gov/missions/webb");
    } else {
      setHeadline("Secret Energy Crystal Discovered Underground Replaces All Power Plants Overnight");
      setContent(
        "A whistleblower from a clandestine energy laboratory revealed today that a subterranean crystalline ore produces infinite electricity with zero fuel or emissions. International energy conglomerates and governments are aggressively suppressing the discovery to maintain multi-billion-dollar utility monopolies. Download the classified schematics immediately before this transmission is permanently taken offline."
      );
      setSourceUrl("");
    }
    setError(null);
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim() && activeTab !== "url") {
      setError("Please provide article text or content to analyze.");
      return;
    }

    if (activeTab === "url" && !sourceUrl.trim()) {
      setError("Please enter a valid article URL.");
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const response = await fetch("/api/news/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: headline.trim(),
          content: content.trim() || `Submitted verification article URL: ${sourceUrl}`,
          sourceUrl: sourceUrl.trim(),
          inputType: activeTab,
        }),
      });

      clearInterval(stepInterval);
      setCurrentStep(5);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed to complete.");
      }

      setTimeout(() => {
        router.push(`/news/${result.data.id}`);
      }, 400);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setError(err.message || "An unexpected error occurred during verification.");
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="border-b border-[#D9DEE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              News Verification
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Analyze content and review the available evidence.
            </p>
          </div>

          {/* Demonstration Sample Helpers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadSample("credible")}
              className="px-2.5 py-1 rounded text-xs font-medium text-[#287D55] bg-[#EAF5EF] border border-[#C2E2D1] hover:bg-[#D6ECE0] transition-colors"
            >
              Load Credible Sample
            </button>
            <button
              type="button"
              onClick={() => loadSample("misleading")}
              className="px-2.5 py-1 rounded text-xs font-medium text-[#B54747] bg-[#FDF2F2] border border-[#F5C7C7] hover:bg-[#FBE4E4] transition-colors"
            >
              Load Misleading Sample
            </button>
          </div>
        </div>

        {/* Verification Progress Stepper */}
        {isAnalyzing ? (
          <div className="py-4 space-y-4">
            <VerificationStepper currentStep={currentStep} />
            <p className="text-xs text-center text-[#667085] font-mono">
              Running multi-factor linguistic and source credibility evaluation...
            </p>
          </div>
        ) : (
          /* Form Section */
          <form onSubmit={handleStartAnalysis} className="space-y-6">
            {/* Input Method Navigation Tabs */}
            <div className="flex border-b border-[#D9DEE5] space-x-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("article")}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "article"
                    ? "border-[#1F3A5F] text-[#1F3A5F]"
                    : "border-transparent text-[#667085] hover:text-[#17202A]"
                }`}
              >
                <FileText className="w-4 h-4" />
                Paste Article
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "url"
                    ? "border-[#1F3A5F] text-[#1F3A5F]"
                    : "border-transparent text-[#667085] hover:text-[#17202A]"
                }`}
              >
                <Link2 className="w-4 h-4" />
                Article URL
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "file"
                    ? "border-[#1F3A5F] text-[#1F3A5F]"
                    : "border-transparent text-[#667085] hover:text-[#17202A]"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("headline_content")}
                className={`pb-2.5 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === "headline_content"
                    ? "border-[#1F3A5F] text-[#1F3A5F]"
                    : "border-transparent text-[#667085] hover:text-[#17202A]"
                }`}
              >
                <Type className="w-4 h-4" />
                Headline & Body
              </button>
            </div>

            {/* Input Workspace Card */}
            <div className="bg-white border border-[#D9DEE5] rounded-lg p-6 shadow-sm space-y-4">
              {/* Optional Headline */}
              <div>
                <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                  Article Headline (Optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Clean Energy Generation Surpasses Annual Targets"
                  className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all"
                />
              </div>

              {/* TAB 1: Paste Article */}
              {activeTab === "article" && (
                <div>
                  <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                    Article Full Text <span className="text-[#B54747]">*</span>
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the full text of the article or news passage to analyze..."
                    className="w-full p-3 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all leading-relaxed"
                    required
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#667085] mt-1 font-mono">
                    <span>Minimum 15 characters</span>
                    <span>{content.length} characters</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Enter URL */}
              {activeTab === "url" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                      Article URL <span className="text-[#B54747]">*</span>
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        placeholder="https://example.com/news/article"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                      Article Excerpt (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste excerpt or leave blank for automated URL evaluation..."
                      className="w-full p-3 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Upload Text/PDF */}
              {activeTab === "file" && (
                <div className="space-y-3">
                  <UploadZone
                    label="Upload Article Document (.txt or Markdown)"
                    accept=".txt,.md,.text"
                    isImage={false}
                    fileName={fileName}
                    value={content}
                    onFileLoaded={(data) => {
                      if (data.text) {
                        setContent(data.text);
                        setFileName(data.fileName);
                      }
                    }}
                    onClear={() => {
                      setContent("");
                      setFileName(null);
                    }}
                  />
                  {content && (
                    <div className="p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0] max-h-36 overflow-y-auto">
                      <span className="text-[10px] uppercase font-mono text-[#667085] block mb-1">
                        Loaded Content Preview
                      </span>
                      <p className="text-xs text-[#17202A] font-mono whitespace-pre-wrap line-clamp-3">
                        {content}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Paste Headline + Content */}
              {activeTab === "headline_content" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                      Body Content <span className="text-[#B54747]">*</span>
                    </label>
                    <textarea
                      rows={7}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter the body paragraphs of the article..."
                      className="w-full p-3 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Optional Origin Source URL for non-URL tabs */}
              {activeTab !== "url" && (
                <div>
                  <label className="text-xs font-semibold text-[#17202A] uppercase tracking-wider block mb-1">
                    Originating Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://reuters.com/world/article"
                    className="w-full px-3 py-2 bg-white border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:ring-1 focus:ring-[#1F3A5F] transition-all font-mono"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <ErrorState
                title="Verification Failed"
                message={error}
                onRetry={() => setError(null)}
              />
            )}

            {/* Submit Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-[#667085] text-xs">
                <Shield className="w-4 h-4 text-[#1F3A5F]" />
                <span>Deterministic multi-factor audit. Zero fabricated citations.</span>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-6 py-2 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Analyze Article
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
