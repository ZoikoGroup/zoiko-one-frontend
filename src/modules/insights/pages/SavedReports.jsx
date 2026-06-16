import { useState } from "react";
import { useSavedReports } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/helpers.js";
import { FileText, Star, Clock, Download, Eye, Trash2 } from "lucide-react";

export default function SavedReports() {
  const { data, loading } = useSavedReports();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", format: "" });

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { reports, recentGenerations } = data;

  const stats = [
    { title: "Saved Reports", value: reports.length, change: 3, trend: "up", icon: FileText, subtitle: `${reports.filter(r => r.starred).length} starred` },
    { title: "Starred", value: reports.filter(r => r.starred).length, change: 1, trend: "up", icon: Star, subtitle: "Favorites" },
    { title: "Scheduled", value: reports.filter(r => r.frequency !== "One-time").length, change: 2, trend: "up", icon: Clock, subtitle: "Auto-generated" },
    { title: "Recent (30d)", value: recentGenerations.length, change: 5, trend: "up", icon: Eye, subtitle: "Last 30 days" },
  ];

  const columns = [
    { key: "name", label: "Report", render: (v, r) => (
      <div className="flex items-center gap-2">
        {r.starred && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
        <div>
          <span className="font-medium">{v}</span>
          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
            <span>{r.type}</span>
            {r.tags.map((t, i) => <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{t}</span>)}
          </div>
        </div>
      </div>
    )},
    { key: "format", label: "Format", render: (v) => <StatusBadge status={v} /> },
    { key: "generatedAt", label: "Generated", render: (v) => formatDate(v) },
    { key: "generatedBy", label: "By" },
    { key: "size", label: "Size" },
    { key: "frequency", label: "Frequency" },
    { key: "lastViewed", label: "Last Viewed", render: (v) => formatDate(v) },
  ];

  let filtered = [...reports];
  if (search) filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
  if (filters.format) filtered = filtered.filter(r => r.format === filters.format);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Reports</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage generated reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Generations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentGenerations.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-lg p-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{r.name}</span>
                <StatusBadge status={r.format} />
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(r.generatedAt)}</span>
                <span>{r.size}</span>
                {r.scheduled && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">Scheduled</span>}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"><Eye className="w-3 h-3" /> Preview</button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"><Download className="w-3 h-3" /> Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">All Saved Reports</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filters={[
            { key: "type", placeholder: "All Types", value: filters.type, options: ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"].map(t => ({ value: t, label: t })) },
            { key: "format", placeholder: "All Formats", value: filters.format, options: ["pdf", "excel", "csv"].map(f => ({ value: f, label: f.toUpperCase() })) },
          ]}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
