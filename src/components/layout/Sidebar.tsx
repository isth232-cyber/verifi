"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  UserCheck,
  Scale,
  Search,
  History,
  BarChart3,
  FileText,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavSection {
  title?: string;
  items: {
    label: string;
    href: string;
    icon: any;
    exact?: boolean;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "VERIFICATION",
    items: [
      { label: "News Verification", href: "/news", icon: Newspaper },
      { label: "Face Verification", href: "/face", icon: UserCheck },
    ],
  },
  {
    title: "ANALYSIS",
    items: [
      { label: "Credibility", href: "/news", icon: Scale },
      { label: "Evidence", href: "/evidence", icon: Search },
    ],
  },
  {
    title: "INTELLIGENCE & AUDIT",
    items: [
      { label: "History", href: "/history", icon: History },
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full bg-[#17202A] border-r border-[#253342] flex flex-col justify-between select-none text-sm">
      {/* Brand Header */}
      <div>
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#253342]">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded bg-[#1F3A5F] border border-[#3B6EA5]/40 flex items-center justify-center text-white font-bold text-xs">
              TV
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-xs tracking-wider text-white">
                  TRUSTVERIFY
                </span>
                <span className="text-[10px] font-mono text-[#8A99AD] font-semibold">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#667085] mt-0.5 tracking-tight">
                Digital Verification
              </p>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#8A99AD] hover:text-white rounded hover:bg-[#253342]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <span className="px-2.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#667085] block mb-1">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#1F3A5F] text-white border-l-2 border-[#3B6EA5] font-semibold"
                        : "text-[#8A99AD] hover:text-white hover:bg-[#1F2B38]"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Status & Analyst Profile */}
      <div className="p-3 border-t border-[#253342] space-y-2.5">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-[#8A99AD]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#287D55]" />
            SOC Online
          </span>
          <span className="font-mono text-[10px] text-[#667085]">v1.0.0</span>
        </div>

        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#101820] border border-[#253342]">
          <div className="w-6 h-6 rounded bg-[#1F3A5F] text-white flex items-center justify-center text-[10px] font-bold">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              Security Analyst
            </p>
            <p className="text-[10px] text-[#8A99AD] truncate font-mono">
              analyst@trustverify.ai
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
