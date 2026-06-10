"use client";

import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className="inline-flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white transition hover:border-slate-700 hover:bg-slate-900"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-800">
          <UserCircle className="h-5 w-5 text-slate-300" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-semibold text-white">Super Admin</span>
          <span className="text-xs text-slate-500">zoiko@admin.one</span>
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
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
