"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardStats } from "@/lib/types";
import {
  Shield,
  Activity,
  Scale,
  RefreshCw,
  AlertTriangle,
  Newspaper,
  UserCheck,
} from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Verification Analytics
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Empirical metric distributions across information veracity and biometric checks.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="p-1.5 rounded bg-white text-[#667085] border border-[#D9DEE5] hover:text-[#17202A] hover:bg-[#F4F6F8] transition-colors self-start sm:self-auto"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Top Metric Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Audits"
            value={stats?.totalVerifications ?? 0}
            subtitle="Historical analysis events"
            icon={Shield}
          />
          <StatCard
            title="Avg Credibility"
            value={stats ? `${stats.averageCredibilityScore}/100` : "0/100"}
            subtitle="Multi-factor weighted index"
            icon={Scale}
          />
          <StatCard
            title="High-Risk Findings"
            value={stats?.highRiskFindings ?? 0}
            subtitle="Deceptive / contradicted items"
            icon={AlertTriangle}
          />
          <StatCard
            title="Face Verifications"
            value={stats?.facesVerified ?? 0}
            subtitle="1-to-1 biometric audits"
            icon={UserCheck}
          />
        </div>

        {/* Analytical Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Volume By Day */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#17202A]">Daily Verification Volume</h3>
                <p className="text-[11px] text-[#667085]">Audit throughput over the last 7 days</p>
              </div>
              <span className="text-[10px] font-mono text-[#1F3A5F] px-2 py-0.5 rounded bg-[#F4F6F8] border border-[#D9DEE5]">
                Throughput
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#D9DEE5] pb-2">
              {stats?.activityOverTime && stats.activityOverTime.length > 0 ? (
                stats.activityOverTime.map((item, idx) => {
                  const maxVal = Math.max(1, ...stats.activityOverTime.map((d) => d.total));
                  const barHeight = Math.max(8, (item.total / maxVal) * 130);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <span className="text-[10px] font-mono text-[#667085] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.total}
                      </span>
                      <div className="w-full max-w-[32px] bg-[#F4F6F8] rounded-t h-32 flex flex-col justify-end p-0.5 border border-[#E2E8F0]">
                        <div
                          style={{ height: `${barHeight}px` }}
                          className="w-full bg-[#1F3A5F] rounded-t transition-all hover:bg-[#182E4B]"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#667085] truncate max-w-[42px]">
                        {item.date}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#667085]">
                  No data available.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Credibility Tier Dispersion */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#17202A]">Credibility Tier Dispersion</h3>
                <p className="text-[11px] text-[#667085]">Distribution across the 5 credibility bands</p>
              </div>
              <span className="text-[10px] font-mono text-[#287D55] px-2 py-0.5 rounded bg-[#EAF5EF] border border-[#C2E2D1]">
                5-Tier Standard
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {stats?.credibilityDistribution.map((tier, idx) => {
                const total = stats.newsAnalyzed || 1;
                const pct = Math.round((tier.count / total) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17202A]">{tier.name}</span>
                      <span className="font-mono text-[#667085]">
                        {tier.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: tier.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: News Result Distribution */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#17202A]">Automated Verdict Outcomes</h3>
                <p className="text-[11px] text-[#667085]">Proportion across evaluation classifications</p>
              </div>
              <span className="text-[10px] font-mono text-[#1F3A5F] px-2 py-0.5 rounded bg-[#EFF5FB] border border-[#BED7EE]">
                Verdicts
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {stats?.newsClassificationDistribution.map((item, idx) => {
                const total = stats.newsAnalyzed || 1;
                const pct = Math.round((item.count / total) * 100);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-semibold text-[#17202A]">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#667085]">
                        {item.count} items
                      </span>
                      <span className="text-xs font-mono font-bold text-[#17202A] w-10 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Verification Modality Breakdown */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#17202A]">Verification Modality Breakdown</h3>
                <p className="text-[11px] text-[#667085]">Textual news veracity vs. biometric audits</p>
              </div>
              <span className="text-[10px] font-mono text-[#667085] px-2 py-0.5 rounded bg-[#F4F6F8] border border-[#D9DEE5]">
                Modality
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {stats && (
                <>
                  <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-white text-[#1F3A5F] border border-[#D9DEE5]">
                        <Newspaper className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#17202A]">News Veracity Analyses</p>
                        <p className="text-[10px] text-[#667085] font-mono">
                          Articles, URLs, raw text & document uploads
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#17202A] font-mono">
                      {stats.newsAnalyzed}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-white text-[#3B6EA5] border border-[#D9DEE5]">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#17202A]">Face Biometric Audits</p>
                        <p className="text-[10px] text-[#667085] font-mono">
                          1-to-1 facial landmark embedding comparisons
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#17202A] font-mono">
                      {stats.facesVerified}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
