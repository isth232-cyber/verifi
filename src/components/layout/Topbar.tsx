"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; section: string }> = {
  "/dashboard": { title: "Dashboard", section: "Overview" },
  "/news": { title: "News Verification", section: "Verification" },
  "/face": { title: "Face Verification", section: "Verification" },
  "/evidence": { title: "Evidence & Sources", section: "Analysis" },
  "/history": { title: "Verification History", section: "Intelligence & Audit" },
  "/analytics": { title: "Analytics", section: "Intelligence & Audit" },
  "/reports": { title: "Verification Reports", section: "Intelligence & Audit" },
  "/settings": { title: "Settings", section: "System" },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const routeInfo =
    ROUTE_TITLES[pathname] ||
    (pathname.startsWith("/news/")
      ? { title: "Verification Result", section: "News Analysis" }
      : pathname.startsWith("/reports/")
      ? { title: "Audit Certificate", section: "Reports" }
      : { title: "TRUSTVERIFY AI", section: "Platform" });

  const mockNotifications = [
    {
      id: 1,
      title: "Model Baseline Verified",
      desc: "Multimodal verification pipeline online with 100% heuristic coverage.",
      time: "10m ago",
      type: "success",
    },
    {
      id: 2,
      title: "Disinformation Alert",
      desc: "Arctic Ice antiviral cure claim flagged with 14/100 credibility.",
      time: "2h ago",
      type: "warning",
    },
  ];

  return (
    <header className="h-14 bg-white border-b border-[#D9DEE5] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Mobile Toggle + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded text-[#667085] hover:text-[#17202A] hover:bg-[#F4F6F8]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#667085] font-medium hidden sm:inline">
            {routeInfo.section}
          </span>
          <span className="text-[#D9DEE5] hidden sm:inline">/</span>
          <h1 className="font-semibold text-[#17202A] text-xs sm:text-sm">
            {routeInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Status, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Compact Search */}
        <div className="relative hidden md:block w-56">
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-8 pr-3 py-1 bg-[#F4F6F8] border border-[#D9DEE5] rounded text-xs text-[#17202A] placeholder-[#667085] focus:outline-none focus:border-[#1F3A5F] focus:bg-white transition-colors"
          />
        </div>

        {/* System Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EAF5EF] text-[#287D55] border border-[#C2E2D1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#287D55]" />
          System Active
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded text-[#667085] hover:text-[#17202A] hover:bg-[#F4F6F8] border border-transparent hover:border-[#D9DEE5] relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#3B6EA5]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D9DEE5] rounded-lg shadow-lg p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE5] mb-2 px-1">
                <span className="text-xs font-bold text-[#17202A] uppercase tracking-wider">
                  Audit & Security Alerts
                </span>
                <span className="text-[10px] text-[#3B6EA5] font-mono">2 notices</span>
              </div>
              <div className="space-y-1.5">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#17202A] flex items-center gap-1.5">
                        {notif.type === "success" ? (
                          <CheckCircle2 className="w-3 h-3 text-[#287D55]" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-[#B7791F]" />
                        )}
                        {notif.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#667085]">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-0.5 leading-snug">
                      {notif.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <Link
          href="/settings"
          className="flex items-center gap-2 p-1 rounded hover:bg-[#F4F6F8] transition-colors"
        >
          <div className="w-7 h-7 rounded bg-[#1F3A5F] text-white flex items-center justify-center text-xs font-bold font-mono">
            A
          </div>
        </Link>
      </div>
    </header>
  );
};
