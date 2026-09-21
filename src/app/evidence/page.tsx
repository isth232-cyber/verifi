"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EvidenceCard } from "@/components/ui/EvidenceCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EvidenceItem } from "@/lib/types";
import {
  Search,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function EvidenceSourcesPage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/history?type=news&limit=20");
        if (res.ok) {
          const json = await res.json();
          const items: EvidenceItem[] = [];

          for (const hist of json.items) {
            const detailRes = await fetch(`/api/history/${hist.targetId}`);
            if (detailRes.ok) {
              const detailJson = await detailRes.json();
              if (detailJson.data?.evidence) {
                items.push(...detailJson.data.evidence);
              }
            }
          }

          const seen = new Set<string>();
          const deduped = items.filter((item) => {
            if (seen.has(item.title)) return false;
            seen.add(item.title);
            return true;
          });

          setEvidenceList(deduped);
        }
      } catch (err) {
        console.error("Failed to load evidence:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesType = selectedType === "all" || item.evidenceType.toLowerCase() === selectedType.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="border-b border-[#D9DEE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              Evidence & Sources
            </h1>
            <p className="text-xs text-[#667085] mt-0.5">
              Review corroborating datasets, wire reports, and verified domain references.
            </p>
          </div>
        </div>

        {/* Domain Reputation Banner */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1F3A5F]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
              Domain Reputation Methodology
            </h3>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed">
            The system references authenticated primary publishers (e.g. NIST, WHO, Reuters, AP News) without penalizing unindexed websites with arbitrary scores. Unfamiliar domains are objectively cataloged as <strong>&ldquo;Unknown&rdquo;</strong> rather than untrustworthy.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#D9DEE5] shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence citations, sources, or keywords..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F4F6F8] border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#8A99AD] focus:outline-none focus:border-[#1F3A5F] focus:bg-white transition-colors"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {["all", "supporting", "contradicting", "contextual"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? "bg-[#1F3A5F] text-white"
                    : "bg-[#F4F6F8] text-[#667085] hover:text-[#17202A] hover:bg-[#E9EEF3]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Grid */}
        {isLoading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#1F3A5F]" />
            <p className="text-xs text-[#667085] font-mono">Loading evidence directory...</p>
          </div>
        ) : filteredEvidence.length === 0 ? (
          <EmptyState
            title="No Evidence Citations Found"
            description="No items match your filter criteria or no analyses have been performed yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvidence.map((item) => (
              <EvidenceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
