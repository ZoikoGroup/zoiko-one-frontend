import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Download, FileText, BarChart3, Users, Calendar } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/recruitment" },
  { label: "Job Requisitions", href: "/zoiko-hr/recruitment/job-requisitions" },
  { label: "Open Positions", href: "/zoiko-hr/recruitment/open-positions" },
  { label: "Candidates", href: "/zoiko-hr/recruitment/candidates" },
  { label: "Interview Pipeline", href: "/zoiko-hr/recruitment/interview-pipeline" },
  { label: "Offer Management", href: "/zoiko-hr/recruitment/offers" },
  { label: "Hiring Schedule", href: "/zoiko-hr/recruitment/hiring-schedule" },
  { label: "Analytics", href: "/zoiko-hr/recruitment/analytics" },
  { label: "Reports", href: "/zoiko-hr/recruitment/reports" },
  { label: "Settings", href: "/zoiko-hr/recruitment/settings" },
];

const reports = [
  { id: 1, title: "Monthly Hiring Report", type: "PDF", date: "2025-03-31", description: "Summary of all hiring activities for March 2025", size: "2.4 MB", icon: "file" },
  { id: 2, title: "Candidate Pipeline Analysis", type: "Excel", date: "2025-03-28", description: "Detailed breakdown of candidates at each pipeline stage", size: "1.8 MB", icon: "bar" },
  { id: 3, title: "Source Effectiveness Report", type: "PDF", date: "2025-03-25", description: "Analysis of candidate sourcing channel performance", size: "1.2 MB", icon: "users" },
  { id: 4, title: "Time-to-Hire Report", type: "Excel", date: "2025-03-20", description: "Average time-to-hire metrics by department and role", size: "956 KB", icon: "calendar" },
  { id: 5, title: "Quarterly Recruitment Summary", type: "PDF", date: "2025-03-15", description: "Q1 2025 recruitment overview with key achievements", size: "3.1 MB", icon: "file" },
  { id: 6, title: "Offer Acceptance Analysis", type: "Excel", date: "2025-03-10", description: "Offer acceptance rates and negotiation patterns", size: "1.5 MB", icon: "bar" },
  { id: 7, title: "Diversity Hiring Report", type: "PDF", date: "2025-03-05", description: "Diversity metrics across the hiring pipeline", size: "2.1 MB", icon: "users" },
  { id: 8, title: "Department Hiring Forecast", type: "Excel", date: "2025-03-01", description: "Projected hiring needs for Q2 2025", size: "1.1 MB", icon: "calendar" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/recruitment"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function Reports() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? reports.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
    : reports;

  const iconMap = { file: FileText, bar: BarChart3, users: Users, calendar: Calendar };

  return (
    <HRPage title="Recruitment Reports" subtitle="Generate and download recruitment reports">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-500 mt-1">View and export recruitment reports</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
              <FileText className="w-4 h-4" /> Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => {
            const Icon = iconMap[report.icon] || FileText;
            return (
              <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{report.title}</h3>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{report.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{formatDate(report.date)}</span>
                        <span>{report.size}</span>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium">
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </HRPage>
  );
}
