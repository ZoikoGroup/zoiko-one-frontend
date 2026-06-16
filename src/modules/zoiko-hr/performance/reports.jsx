import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Download, Calendar } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/performance" },
  { label: "Goals & OKRs", href: "/zoiko-hr/performance/goals" },
  { label: "Performance Reviews", href: "/zoiko-hr/performance/reviews" },
  { label: "Appraisals", href: "/zoiko-hr/performance/appraisals" },
  { label: "Feedback", href: "/zoiko-hr/performance/feedback" },
  { label: "360 Reviews", href: "/zoiko-hr/performance/360-reviews" },
  { label: "KPI Tracking", href: "/zoiko-hr/performance/kpis" },
  { label: "Competencies", href: "/zoiko-hr/performance/competencies" },
  { label: "Analytics", href: "/zoiko-hr/performance/analytics" },
  { label: "Reports", href: "/zoiko-hr/performance/reports" },
  { label: "Settings", href: "/zoiko-hr/performance/settings" },
];

const reports = [
  { id: 1, title: "Quarterly Performance Summary", description: "Overall performance metrics for Q1 2025", type: "PDF", date: "2025-04-01", size: "2.1 MB" },
  { id: 2, title: "Goal Completion Report", description: "OKR progress and completion rates", type: "Excel", date: "2025-03-28", size: "980 KB" },
  { id: 3, title: "Review Completion Report", description: "Performance review completion status", type: "PDF", date: "2025-03-25", size: "1.2 MB" },
  { id: 4, title: "360 Feedback Summary", description: "Multi-source feedback analysis", type: "PDF", date: "2025-03-20", size: "1.8 MB" },
  { id: 5, title: "Appraisal Results Report", description: "Annual appraisal scores and ratings", type: "Excel", date: "2025-03-15", size: "750 KB" },
  { id: 6, title: "Team Performance Comparison", description: "Cross-department performance benchmarking", type: "PDF", date: "2025-03-10", size: "3.5 MB" },
  { id: 7, title: "High Potential Employee Report", description: "Identification of top talent", type: "Excel", date: "2025-03-05", size: "620 KB" },
  { id: 8, title: "Training Impact Report", description: "Correlation between training and performance", type: "PDF", date: "2025-02-28", size: "1.4 MB" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/performance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function PerformanceReports() {
  const [search, setSearch] = useState("");
  const filtered = search ? reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase())) : reports;

  return (
    <HRPage title="Performance Reports" subtitle="Generate and download performance reports">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Generate and download performance reports</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <FileText className="w-4 h-4" /> Generate Report
          </button>
        </div>

        <div className="relative max-w-sm">
          <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg"><FileText className="w-5 h-5 text-blue-600" /></div>
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
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No reports found</div>
          )}
        </div>
      </div>
    </HRPage>
  );
}
