import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useRegulations } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

const CATEGORIES = [
  { value: "data_privacy", label: "Data Privacy" },
  { value: "security", label: "Security" },
  { value: "financial", label: "Financial" },
  { value: "labor", label: "Labor" },
  { value: "other", label: "Other" },
];

export default function Regulations() {
  const { data: regulations, loading } = useRegulations();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    let result = regulations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.jurisdiction.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (categoryFilter) result = result.filter((r) => r.category === categoryFilter);
    return result;
  }, [regulations, search, categoryFilter]);

  const columns = [
    { key: "name", label: "Regulation", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "jurisdiction", label: "Jurisdiction" },
    { key: "category", label: "Category", render: (v) => <span className="capitalize">{v?.replace(/_/g, " ")}</span> },
    { key: "effectiveDate", label: "Effective", render: (v) => formatDate(v) },
    { key: "lastUpdated", label: "Last Updated", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "description", label: "Description", render: (v) => <span className="text-gray-500 max-w-[250px] truncate block">{v}</span> },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading regulations...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search regulations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
