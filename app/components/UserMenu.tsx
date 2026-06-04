import { ChevronDown, UserCircle } from "lucide-react";

export default function UserMenu() {
  return (
    <button
      type="button"
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
  );
}
