import { useState } from "react";
import { useEvidence } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import StatusBadge from "../components/StatusBadge";
import { formatDate, daysUntil } from "../utils/helpers";
import { FileText, Image, Table, FileCode, Shield, Download, AlertTriangle, CheckCircle, Archive, Eye, Grid3x3, List } from "lucide-react";

export default function EvidenceRepository() {
  const { data: evidence, summary, loading } = useEvidence();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "", sourceProduct: "" });
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const perPage = 24;

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const filtered = (evidence || []).filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.controlCode.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category && e.category !== filters.category) return false;
    if (filters.status && e.status !== filters.status) return false;
    if (filters.sourceProduct && e.sourceProduct !== filters.sourceProduct) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const uniqueSources = [...new Set((evidence || []).map(e => e.sourceProduct))].sort();

  if (loading) return <div className="p-6 text-gray-500">Loading evidence repository...</div>;

  const filterConfig = [
    { key: "category", placeholder: "All Categories", value: filters.category, options: [
      { value: "screenshot", label: "Screenshot" }, { value: "document", label: "Document" },
      { value: "log", label: "Log" }, { value: "report", label: "Report" },
      { value: "configuration", label: "Configuration" }, { value: "certification", label: "Certification" },
    ]},
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "uploaded", label: "Uploaded" }, { value: "reviewed", label: "Reviewed" },
      { value: "expiring", label: "Expiring" }, { value: "expired", label: "Expired" },
      { value: "rejected", label: "Rejected" },
    ]},
    { key: "sourceProduct", placeholder: "All Sources", value: filters.sourceProduct, options: uniqueSources.map(s => ({ value: s, label: s })) },
  ];

  const categoryIcon = (cat) => {
    switch (cat) {
      case "screenshot": return <Image className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "log": return <FileCode className="w-4 h-4" />;
      case "report": return <Table className="w-4 h-4" />;
      case "configuration": return <Archive className="w-4 h-4" />;
      case "certification": return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Evidence Repository</h1>
        <p className="text-sm text-gray-500 mt-1">Store, manage, and retrieve compliance evidence {evidence.length}+ records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Records" value={summary?.total || 500} icon={FileText} />
        <StatsCard title="Reviewed" value={summary?.byStatus?.reviewed || 0} icon={CheckCircle} trend="up" change={5} />
        <StatsCard title="Expiring Soon" value={summary?.expiringSoon || 0} icon={AlertTriangle} trend="up" change={8} />
        <StatsCard title="Expired" value={summary?.byStatus?.expired || 0} icon={Archive} trend="down" change={-3} />
        <StatsCard title="Documents" value={summary?.byCategory?.document || 0} icon={FileText} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("list")} className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${view === "list" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><List className="w-4 h-4" /> List</button>
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 ${view === "grid" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Grid3x3 className="w-4 h-4" /> Grid</button>
        </div>
        <p className="text-xs text-gray-400">{filtered.length} records found</p>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />

      {view === "list" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="divide-y divide-gray-100">
            {paged.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{categoryIcon(e.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm truncate">{e.title}</span>
                    <span className="font-mono text-xs text-gray-400">{e.version}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>Control: {e.controlCode}</span>
                    <span>Source: {e.sourceProduct}</span>
                    <span>{e.fileSize}</span>
                    <span>Expires: {formatDate(e.expiryDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={e.status} />
                  <StatusBadge status={e.category} />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Preview"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Download"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paged.map(e => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">{categoryIcon(e.category)}</div>
                <StatusBadge status={e.status} />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{e.title}</h4>
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <p>Control: <span className="font-mono">{e.controlCode}</span></p>
                <p>Source: {e.sourceProduct}</p>
                <p>Size: {e.fileSize} | Type: {e.fileType}</p>
                <p>Expires: <span className={daysUntil(e.expiryDate) !== null && daysUntil(e.expiryDate) < 30 ? "text-red-500" : ""}>{formatDate(e.expiryDate)}</span></p>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={e.category} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Download"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 text-sm rounded-lg ${page === p ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
