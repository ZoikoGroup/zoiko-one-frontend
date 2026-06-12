import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative max-w-2xl">
      <Search className="search-icon pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
      <input
        type="search"
        placeholder="Search platform, tenants, users, audits..."
        className="search-input w-full py-3 pl-11 pr-4 text-sm"
      />
    </div>
  );
}
