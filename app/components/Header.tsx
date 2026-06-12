"use client";

import { HelpCircle, Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Briefly animate the loading spinner before triggering browser reload
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="header-root sticky top-0 z-20">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="header-btn inline-flex h-12 w-12 items-center justify-center lg:hidden"
        >
          <Menu className="header-icon h-5 w-5" />
        </button>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="uiverse-button disabled:opacity-50"
          >
            <div className="button-outer">
              <div className="uiverse-button-inner">
                <Loader2 className={`h-4 w-4 text-slate-800 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>{isRefreshing ? "Refreshing..." : "Refresh data"}</span>
              </div>
            </div>
          </button>
          <button
            type="button"
            className="uiverse-button"
          >
            <div className="button-outer">
              <div className="uiverse-button-inner">
                <HelpCircle className="h-4 w-4 text-slate-800" />
                <span>Help</span>
              </div>
            </div>
          </button>
          <NotificationBell />
          <div className="inline-flex items-center justify-center self-center">
            <ThemeToggle />
          </div>
          <span className="live-badge">LIVE</span>
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
