"use client";

import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        id="user-menu-trigger"
        onClick={() => setOpen((c) => !c)}
        className="user-menu-btn inline-flex items-center gap-3 px-4 py-3 text-sm"
      >
        <span className="user-menu-avatar inline-flex h-10 w-10 items-center justify-center rounded-3xl">
          <UserCircle className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
        </span>
        <span className="text-left hidden sm:block">
          <span className="user-menu-name block text-sm font-semibold">Super Admin</span>
          <span className="user-menu-email text-xs">zoiko@admin.one</span>
        </span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200"
          style={{
            color: "var(--icon-default)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="user-menu-dropdown absolute right-0 top-full z-20 mt-2 w-56 p-2">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="user-menu-item"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
