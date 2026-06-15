import { useState } from "react";
import { FileText, Download, Calendar, Search } from "lucide-react";
import { useWorkforceReports } from "../hooks/useWorkforce";

export default function WorkforceReports() {
  const { data: reports, loading } = useWorkforceReports();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  const filtered = search
    ? reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    : reports;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download workforce planning reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
          <FileText className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{report.type}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{report.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
              <span>{report.size}</span>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
