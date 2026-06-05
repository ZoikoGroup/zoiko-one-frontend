"use client";

import { AlertTriangle, HelpCircle, Loader2, Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-800 bg-[#0A0F1C]/95 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 text-slate-200 transition hover:border-slate-700 hover:bg-slate-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <Loader2 className="h-4 w-4 text-slate-400" />
            Refresh data
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            Help
          </button>
          <NotificationBell />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            7 Alerts
          </button>
          <span className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-xs uppercase tracking-[0.32em] text-emerald-300">LIVE</span>
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
