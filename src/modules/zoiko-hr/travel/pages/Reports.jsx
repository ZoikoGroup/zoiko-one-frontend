import { useState, useMemo } from "react";
import { Download, Calendar, FileText } from "lucide-react";
import { useTravelReports } from "../hooks/useTravel";
import { formatDate } from "../utils/helpers";

const TYPE_OPTIONS = [
  { value: "monthly", label: "Monthly Spend" },
  { value: "department", label: "Department" },
  { value: "employee", label: "Employee" },
  { value: "custom", label: "Custom" },
];

export default function TravelReports() {
  const { data: reports, loading } = useTravelReports();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    let result = reports;
    if (typeFilter) result = result.filter((r) => r.type === typeFilter);
    if (dateFrom) result = result.filter((r) => r.date >= dateFrom);
    if (dateTo) result = result.filter((r) => r.date <= dateTo);
    return result;
  }, [reports, typeFilter, dateFrom, dateTo]);

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and download travel reports</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{report.type}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{report.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{report.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
              <span>{formatDate(report.date)}</span>
              <span>{report.size}</span>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No reports found matching your filters</div>
      )}
    </div>
  );
}
