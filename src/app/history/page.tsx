"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { HistoryRecord } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/formatters";
import {
  Search,
  Check,
  X,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileCode,
} from "lucide-react";

export default function VerificationHistoryPage() {
  const [items, setItems] = useState<HistoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        type: selectedType,
        filter: selectedFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/history?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.items || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, selectedType, selectedFilter, searchQuery]);

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Permanently delete this verification record?")) {
      return;
    }

    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        "DATA PRIVACY PURGE: Are you sure you want to permanently delete all analysis records, verification history, and stored audit logs?"
      )
    ) {
      return;
    }

    setIsDeletingAll(true);
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setItems([]);
        setTotal(0);
        setPage(1);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleExportJson = (item: HistoryRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrustVerify-Audit-${item.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DEE5] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Verification History
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Audited record log of past news veracity assessments and biometric comparisons.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isDeletingAll || items.length === 0}
              className="px-3 py-1.5 rounded text-xs font-medium text-[#B54747] hover:bg-[#FDF2F2] border border-[#F5C7C7] transition-colors flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Analysis Data
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#D9DEE5] shadow-sm">
          {/* Search query input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, summary, or outcome..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F4F6F8] border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:bg-white transition-colors"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#F4F6F8] p-1 rounded border border-[#E2E8F0]">
              {[
                { id: "all", label: "All Types" },
                { id: "news", label: "News" },
                { id: "face", label: "Face" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedType(t.id);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedType === t.id
                      ? "bg-white text-[#17202A] shadow-xs"
                      : "text-[#667085] hover:text-[#17202A]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[#F4F6F8] p-1 rounded border border-[#E2E8F0]">
              {[
                { id: "all", label: "All Status" },
                { id: "verified", label: "Verified" },
                { id: "high_risk", label: "High Risk" },
                { id: "unverified", label: "Unverified" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFilter(f.id);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedFilter === f.id
                      ? "bg-white text-[#17202A] shadow-xs"
                      : "text-[#667085] hover:text-[#17202A]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Records Table */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#1F3A5F]" />
              <p className="text-xs font-mono text-[#667085]">Loading audit log...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No History Found"
                description="No records matched your search parameters. Try adjusting filters or perform a new verification."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17202A]">
                <thead className="bg-[#F8FAFC] text-[11px] uppercase font-semibold font-mono text-[#667085] border-b border-[#D9DEE5]">
                  <tr>
                    <th className="px-4 py-2.5">Audit ID</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Input Summary</th>
                    <th className="px-4 py-2.5">Result</th>
                    <th className="px-4 py-2.5">Score</th>
                    <th className="px-4 py-2.5">Confidence</th>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE5]">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-[#667085]">
                        {item.id}
                      </td>

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
                        {formatDateTime(item.createdAt)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={
                              item.type === "news"
                                ? `/news/${item.targetId}`
                                : `/face`
                            }
                            className="p-1 rounded text-[#1F3A5F] hover:text-[#3B6EA5] hover:bg-[#F4F6F8] transition-colors"
                            title="Inspect Record"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleExportJson(item)}
                            className="p-1 rounded text-[#667085] hover:text-[#17202A] hover:bg-[#F4F6F8] transition-colors"
                            title="Export JSON"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded text-[#B54747] hover:bg-[#FDF2F2] transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-[#D9DEE5] flex items-center justify-between text-xs text-[#667085] bg-[#F8FAFC]">
              <span>
                Page {page} of {totalPages} ({total} total audits)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded bg-white hover:bg-[#F4F6F8] border border-[#D9DEE5] disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded bg-white hover:bg-[#F4F6F8] border border-[#D9DEE5] disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
