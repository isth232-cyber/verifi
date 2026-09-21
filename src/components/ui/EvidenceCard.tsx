import React from "react";
import { EvidenceItem } from "@/lib/types";
import { ExternalLink, Check, AlertTriangle, Info, HelpCircle } from "lucide-react";

interface EvidenceCardProps {
  item: EvidenceItem;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ item }) => {
  const typeConfig = {
    Supporting: {
      badge: "text-[#287D55] bg-[#EAF5EF] border-[#C2E2D1]",
      icon: Check,
    },
    Contradicting: {
      badge: "text-[#B54747] bg-[#FDF2F2] border-[#F5C7C7]",
      icon: AlertTriangle,
    },
    Contextual: {
      badge: "text-[#3B6EA5] bg-[#EFF5FB] border-[#BED7EE]",
      icon: Info,
    },
    Unverified: {
      badge: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]",
      icon: HelpCircle,
    },
  }[item.evidenceType] || {
    badge: "text-[#667085] bg-[#F4F6F8] border-[#D9DEE5]",
    icon: Info,
  };

  const Icon = typeConfig.icon;

  return (
    <div className="bg-white rounded-lg p-4 border border-[#D9DEE5] shadow-sm hover:border-[#B8C2CC] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${typeConfig.badge}`}
          >
            <Icon className="w-3 h-3" />
            {item.evidenceType}
          </span>
          <span className="text-xs font-mono text-[#667085]">
            Relevance: <strong className="text-[#17202A]">{item.relevance}%</strong>
          </span>
        </div>

        {item.date && (
          <span className="text-[11px] font-mono text-[#667085]">{item.date}</span>
        )}
      </div>

      <h5 className="text-sm font-semibold text-[#17202A] mt-2 line-clamp-1">
        {item.title}
      </h5>

      <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
        {item.snippet}
      </p>

      <div className="mt-3 pt-2.5 border-t border-[#D9DEE5] flex items-center justify-between text-xs">
        <span className="text-[#667085]">
          Source: <strong className="text-[#17202A] font-medium">{item.source}</strong>
        </span>

        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#3B6EA5] hover:text-[#1F3A5F] font-medium text-[11px] transition-colors"
          >
            View Reference
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#8A99AD] text-[11px] italic">
            Citation reference
          </span>
        )}
      </div>
    </div>
  );
};
