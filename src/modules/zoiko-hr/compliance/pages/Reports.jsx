import { useState, useMemo } from "react";
import { Download, FileText, FileSpreadsheet, Search } from "lucide-react";
import { useComplianceReports } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

const TYPE_ICONS = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
};

export default function ComplianceReports() {
  const { data: reports, loading } = useComplianceReports();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    let result = reports;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (typeFilter) result = result.filter((r) => r.type === typeFilter);
    return result;
  }, [reports, search, typeFilter]);

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="PDF">PDF</option>
          <option value="XLSX">XLSX</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => {
          const Icon = TYPE_ICONS[report.type] || FileText;
          const iconColor = report.type === "PDF" ? "text-red-500" : "text-emerald-600";
          const bgColor = report.type === "PDF" ? "bg-red-50" : "bg-emerald-50";
          return (
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 ${bgColor} rounded-lg`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Download size={18} />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mt-4">{report.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</p>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                <span>{report.type}</span>
                <span>{report.size}</span>
                <span>{formatDate(report.date)}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 text-sm">No reports found.</div>
        )}
      </div>
    </div>
  );
}
