import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        placeholder="Search platform, tenants, users, audits..."
        className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
      />
    </div>
  );
}
