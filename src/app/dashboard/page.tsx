"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardStats, HistoryRecord } from "@/lib/types";
import { formatDateRelative } from "@/lib/utils/formatters";
import {
  Shield,
  Newspaper,
  UserCheck,
  Scale,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Check,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/history?limit=6"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      if (historyRes.ok) {
        const histData = await historyRes.json();
        setRecentHistory(histData.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9DEE5]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Monitor verification activity and credibility assessments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-1.5 rounded bg-white text-[#667085] border border-[#D9DEE5] hover:text-[#17202A] hover:bg-[#F4F6F8] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/news"
              className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1F3A5F] hover:bg-[#182E4B] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Newspaper className="w-3.5 h-3.5" />
              Analyze News
            </Link>
            <Link
              href="/face"
              className="px-3 py-1.5 rounded text-xs font-semibold text-[#17202A] bg-white border border-[#D9DEE5] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#3B6EA5]" />
              Verify Face
            </Link>
          </div>
        </div>

        {/* Metric Row: Compact Metric Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Verifications"
            value={stats?.totalVerifications ?? 0}
            subtitle="Combined audit events"
            icon={Shield}
          />
          <StatCard
            title="News Analyses"
            value={stats?.newsAnalyzed ?? 0}
            subtitle="Evaluated submissions"
            icon={Newspaper}
          />
          <StatCard
            title="Face Verifications"
            value={stats?.facesVerified ?? 0}
            subtitle="1-to-1 biometric audits"
            icon={UserCheck}
          />
          <StatCard
            title="Average Credibility"
            value={stats ? `${stats.averageCredibilityScore}/100` : "0/100"}
            subtitle="Aggregate veracity score"
            icon={Scale}
          />
        </div>

        {/* Charts & Distribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart: Verification Activity Over Time */}
          <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D9DEE5]">
              <div>
                <h3 className="text-sm font-bold text-[#17202A]">
                  Verification Activity
                </h3>
                <p className="text-[11px] text-[#667085]">
                  Daily volume over the last 7 calendar days
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#1F3A5F] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#1F3A5F]" /> News
                </span>
                <span className="flex items-center gap-1 text-[#3B6EA5] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#3B6EA5]" /> Face
                </span>
              </div>
            </div>

            {/* Clean Professional Bar Histogram */}
            <div className="h-52 flex items-end justify-between gap-3 pt-4 px-2 border-b border-[#D9DEE5] pb-2">
              {stats?.activityOverTime && stats.activityOverTime.length > 0 ? (
                stats.activityOverTime.map((item, idx) => {
                  const maxVal = Math.max(1, ...stats.activityOverTime.map((d) => d.total));
                  const newsHeight = (item.news / maxVal) * 140;
                  const faceHeight = (item.face / maxVal) * 140;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <span className="text-[10px] font-mono text-[#667085] opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.total}
                      </span>
                      <div className="w-full max-w-[32px] flex flex-col justify-end gap-0.5 bg-[#F4F6F8] rounded-t overflow-hidden h-36 border border-[#E2E8F0]">
                        <div
                          style={{ height: `${Math.max(item.face > 0 ? 6 : 0, faceHeight)}px` }}
                          className="w-full bg-[#3B6EA5] transition-all hover:bg-[#2F5885]"
                          title={`Face: ${item.face}`}
                        />
                        <div
                          style={{ height: `${Math.max(item.news > 0 ? 6 : 0, newsHeight)}px` }}
                          className="w-full bg-[#1F3A5F] transition-all hover:bg-[#182E4B]"
                          title={`News: ${item.news}`}
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
                  No verification activity logged yet.
                </div>
              )}
            </div>
          </div>

          {/* Credibility Distribution Card */}
          <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#17202A]">
                Credibility Distribution
              </h3>
              <p className="text-[11px] text-[#667085] mb-4 pb-2 border-b border-[#D9DEE5]">
                Breakdown across standard assessment tiers
              </p>

              <div className="space-y-3">
                {stats?.credibilityDistribution.map((bucket, idx) => {
                  const totalNews = stats.newsAnalyzed || 1;
                  const pct = Math.round((bucket.count / totalNews) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#17202A] font-medium">{bucket.name}</span>
                        <span className="font-mono text-[#667085]">
                          {bucket.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F4F6F8] rounded-full overflow-hidden border border-[#E2E8F0]">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: bucket.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D9DEE5] flex items-center justify-between text-xs">
              <span className="text-[#667085]">Credible Threshold</span>
              <span className="font-mono font-semibold text-[#287D55]">
                &ge; 70 / 100
              </span>
            </div>
          </div>
        </div>

        {/* Recent Verification Table */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#D9DEE5] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#17202A]">
                Recent Verifications
              </h3>
              <p className="text-[11px] text-[#667085]">
                Audited records from the local verification repository
              </p>
            </div>
            <Link
              href="/history"
              className="text-xs font-semibold text-[#1F3A5F] hover:text-[#3B6EA5] inline-flex items-center gap-1 transition-colors"
            >
              View Full History
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentHistory.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No Verification History"
                description="Start by evaluating a news article or performing a face verification."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17202A]">
                <thead className="bg-[#F8FAFC] text-[11px] uppercase font-semibold font-mono text-[#667085] border-b border-[#D9DEE5]">
                  <tr>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Input Summary</th>
                    <th className="px-4 py-2.5">Result</th>
                    <th className="px-4 py-2.5">Score</th>
                    <th className="px-4 py-2.5">Confidence</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE5]">
                  {recentHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                            item.type === "news"
                              ? "bg-[#EFF5FB] text-[#1F3A5F] border-[#BED7EE]"
                              : "bg-[#F4F6F8] text-[#3B6EA5] border-[#D9DEE5]"
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-semibold text-[#17202A] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#667085] truncate">
                          {item.inputSummary}
                        </p>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] border ${
                            item.statusTag === "Verified"
                              ? "bg-[#EAF5EF] text-[#287D55] border-[#C2E2D1]"
                              : item.statusTag === "High Risk"
                              ? "bg-[#FDF2F2] text-[#B54747] border-[#F5C7C7]"
                              : "bg-[#FEF7EC] text-[#B7791F] border-[#F7DEBA]"
                          }`}
                        >
                          {item.statusTag === "Verified" ? (
                            <Check className="w-3 h-3" />
                          ) : item.statusTag === "High Risk" ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {item.result}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-[#17202A]">
                        {item.score}/100
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[#667085]">
                        {item.confidence}%
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-[#667085] text-[11px]">
                        {formatDateRelative(item.createdAt)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link
                          href={
                            item.type === "news"
                              ? `/news/${item.targetId}`
                              : `/face`
                          }
                          className="inline-flex items-center gap-1 text-[#1F3A5F] hover:text-[#3B6EA5] font-semibold transition-colors"
                        >
                          Inspect
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
