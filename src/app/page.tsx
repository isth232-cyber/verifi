import React from "react";
import Link from "next/link";
import {
  Shield,
  Newspaper,
  UserCheck,
  Scale,
  ArrowRight,
  Lock,
  Check,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#17202A] flex flex-col justify-between">
      {/* Enterprise Header */}
      <header className="border-b border-[#D9DEE5] bg-white sticky top-0 z-40 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#1F3A5F] flex items-center justify-center text-white font-bold text-xs">
              TV
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-sm tracking-wider text-[#17202A]">
                TRUSTVERIFY
              </span>
              <span className="text-[10px] font-mono text-[#667085] font-semibold">
                AI
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#667085]">
            <Link href="#capabilities" className="hover:text-[#17202A] transition-colors">
              Capabilities
            </Link>
            <Link href="#pipeline" className="hover:text-[#17202A] transition-colors">
              How It Works
            </Link>
            <Link href="#governance" className="hover:text-[#17202A] transition-colors">
              Data Privacy & Safety
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors"
            >
              SOC Dashboard
            </Link>
            <Link
              href="/news"
              className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors shadow-sm flex items-center gap-1.5"
            >
              Start Verification
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-white border-b border-[#D9DEE5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#EFF5FB] text-[#3B6EA5] border border-[#BED7EE] mb-6">
            <Shield className="w-3.5 h-3.5 text-[#3B6EA5]" />
            Enterprise Digital Verification Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17202A] tracking-tight leading-tight">
            Verify Before You Trust.
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#667085] max-w-2xl mx-auto leading-relaxed">
            AI-powered news verification, face verification, and credibility analysis in one secure platform. Designed for digital forensics, institutional research, and information integrity.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/news"
              className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Start Verification
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-semibold text-[#17202A] bg-white hover:bg-[#F4F6F8] border border-[#D9DEE5] transition-colors flex items-center justify-center gap-2"
            >
              Explore Dashboard
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-[#8A99AD] font-mono">
            * Probabilistic algorithmic assessment. Does not claim infallible determinations of truth.
          </p>
        </div>
      </section>

      {/* Verification Pipeline Flow */}
      <section id="pipeline" className="py-14 border-b border-[#D9DEE5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#667085]">
              Verification Workflow
            </span>
            <h2 className="text-xl font-bold text-[#17202A] mt-1">
              How The Platform Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: "01", name: "INPUT", desc: "Text, Article URL, File/PDF, or Reference Face" },
              { step: "02", name: "AI ANALYSIS", desc: "Claim extraction & linguistic marker detection" },
              { step: "03", name: "EVIDENCE", desc: "Corroboration cross-check & domain signals" },
              { step: "04", name: "CREDIBILITY SCORE", desc: "6-factor weighted multi-signal engine" },
              { step: "05", name: "VERIFICATION RESULT", desc: "Explainable verdict with audit report" },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="bg-white border border-[#D9DEE5] rounded-lg p-4 text-center shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#F4F6F8] text-[#1F3A5F] border border-[#D9DEE5]">
                    {item.step}
                  </span>
                  <h3 className="text-xs font-bold text-[#17202A] mt-2.5">{item.name}</h3>
                  <p className="text-[11px] text-[#667085] mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
                {idx < 4 && (
                  <div className="hidden sm:block mt-2 text-[#D9DEE5]">
                    <ChevronRight className="w-4 h-4 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities */}
      <section id="capabilities" className="py-14 bg-white border-b border-[#D9DEE5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#667085]">
              Core Modules
            </span>
            <h2 className="text-xl font-bold text-[#17202A] mt-1">
              Platform Verification Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Fake News Detection */}
            <div className="bg-[#F8FAFC] border border-[#D9DEE5] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-white border border-[#D9DEE5] text-[#1F3A5F] flex items-center justify-center mb-3.5 shadow-xs">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#17202A] mb-1.5">
                  Fake News Detection
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Extract testable claims from articles, live URLs, or documents. Detect sensationalism, conspiratorial framing, and linguistic markers with granular confidence percentages.
                </p>

                <ul className="mt-3.5 space-y-1.5 text-xs text-[#17202A]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Automated claim extraction & status
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Domain reputation registry & TLS check
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Supporting & contradicting citations
                  </li>
                </ul>
              </div>

              <Link
                href="/news"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#1F3A5F] hover:text-[#3B6EA5] transition-colors"
              >
                Analyze News Article
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Feature 2: Face Verification */}
            <div className="bg-[#F8FAFC] border border-[#D9DEE5] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-white border border-[#D9DEE5] text-[#1F3A5F] flex items-center justify-center mb-3.5 shadow-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#17202A] mb-1.5">
                  Face Verification
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Compare reference photographs with probe snapshots or camera inputs. Evaluates image quality, lighting adequacy, and cosine similarity with strict biometric privacy.
                </p>

                <ul className="mt-3.5 space-y-1.5 text-xs text-[#17202A]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Live webcam or dual-file upload
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Single-face validation & lighting check
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Configurable similarity threshold
                  </li>
                </ul>
              </div>

              <Link
                href="/face"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#1F3A5F] hover:text-[#3B6EA5] transition-colors"
              >
                Launch Face Verification
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Feature 3: Credibility Scoring */}
            <div className="bg-[#F8FAFC] border border-[#D9DEE5] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-white border border-[#D9DEE5] text-[#1F3A5F] flex items-center justify-center mb-3.5 shadow-xs">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#17202A] mb-1.5">
                  Credibility Scoring
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  A transparent 6-factor mathematical weighting model distinguishing Credibility Assessment from AI Confidence metrics with auditable component breakdowns.
                </p>

                <ul className="mt-3.5 space-y-1.5 text-xs text-[#17202A]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Source Signals (20%) + Evidence (25%)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Claim Consistency (20%) + Quality (15%)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#287D55]" />
                    Print-ready official audit certificates
                  </li>
                </ul>
              </div>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#1F3A5F] hover:text-[#3B6EA5] transition-colors"
              >
                View Dashboard Analytics
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Data Governance & Privacy Guarantee */}
      <section id="governance" className="py-12 border-b border-[#D9DEE5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex p-2 rounded bg-white border border-[#D9DEE5] text-[#1F3A5F] mb-3 shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#17202A]">
            Biometric Data Governance & Zero Storage
          </h3>
          <p className="mt-1.5 text-xs text-[#667085] leading-relaxed">
            Uploaded face images and raw biometric descriptors are processed strictly in volatile memory and purged immediately. No open-ended surveillance or biometric retention is executed.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white text-xs text-[#667085]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17202A]">TRUSTVERIFY AI</span>
            <span>&mdash; Academic Project Edition</span>
          </div>
          <p className="text-[11px] text-[#8A99AD]">
            Enterprise Digital Verification & Forensics Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
