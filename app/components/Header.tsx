"use client";

import { HelpCircle, Loader2, Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
            className="header-btn inline-flex items-center gap-2 px-4 py-3 text-sm"
          >
            <Loader2 className="header-icon h-4 w-4" />
            Refresh data
          </button>
          <button
            type="button"
            className="header-btn inline-flex items-center gap-2 px-4 py-3 text-sm"
          >
            <HelpCircle className="header-icon h-4 w-4" />
            Help
          </button>
          <NotificationBell />
          <ThemeToggle />
          <span className="live-badge">LIVE</span>
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
