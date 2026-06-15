import { useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";

const reports = [
  { id: 1, title: "Monthly Hiring Report", description: "Summary of all hiring activities for the month", type: "PDF", date: "2025-03-01", size: "2.4 MB" },
  { id: 2, title: "Candidate Pipeline Report", description: "Overview of candidates by stage and source", type: "Excel", date: "2025-02-28", size: "1.1 MB" },
  { id: 3, title: "Time-to-Hire Analysis", description: "Average time to hire broken down by department", type: "PDF", date: "2025-02-25", size: "890 KB" },
  { id: 4, title: "Offer Acceptance Report", description: "Offer acceptance and rejection trends", type: "Excel", date: "2025-02-20", size: "650 KB" },
  { id: 5, title: "Source Effectiveness Report", description: "Performance of different hiring sources", type: "PDF", date: "2025-02-15", size: "1.5 MB" },
  { id: 6, title: "Quarterly Recruitment Summary", description: "Comprehensive Q1 2025 recruitment analysis", type: "PDF", date: "2025-04-01", size: "3.2 MB" },
  { id: 7, title: "Diversity Hiring Report", description: "Diversity metrics across the hiring pipeline", type: "Excel", date: "2025-03-15", size: "780 KB" },
  { id: 8, title: "Cost-per-Hire Analysis", description: "Cost analysis for each hire by department", type: "PDF", date: "2025-03-10", size: "1.8 MB" },
];

export default function RecruitmentReports() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    : reports;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download recruitment reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <FileText className="w-4 h-4" /> Generate Report
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text" placeholder="Search reports..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
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
