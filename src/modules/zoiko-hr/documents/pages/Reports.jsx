import { useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";

const reports = [
  { id: 1, title: "Document Inventory Report", description: "Complete inventory of all documents in the system", type: "PDF", date: "2025-04-01", size: "3.2 MB" },
  { id: 2, title: "Expiry Report", description: "Documents expiring in the next 30 days", type: "Excel", date: "2025-03-28", size: "520 KB" },
  { id: 3, title: "Compliance Status Report", description: "Compliance document status and gaps", type: "PDF", date: "2025-03-25", size: "1.5 MB" },
  { id: 4, title: "Approval Workflow Report", description: "Approval times and bottlenecks", type: "Excel", date: "2025-03-20", size: "890 KB" },
  { id: 5, title: "Document Usage Report", description: "Most accessed and downloaded documents", type: "PDF", date: "2025-03-15", size: "1.1 MB" },
  { id: 6, title: "Template Usage Analysis", description: "Template usage patterns and popular templates", type: "PDF", date: "2025-03-10", size: "780 KB" },
  { id: 7, title: "Department Document Audit", description: "Document completeness by department", type: "Excel", date: "2025-03-05", size: "2.1 MB" },
  { id: 8, title: "Storage Utilization Report", description: "Storage usage and optimization opportunities", type: "PDF", date: "2025-02-28", size: "640 KB" },
];

export default function DocumentsReports() {
  const [search, setSearch] = useState("");
  const filtered = search ? reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase())) : reports;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download document reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <FileText className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="relative max-w-sm">
        <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{r.type}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{r.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
              <span>{r.size}</span>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
