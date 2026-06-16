import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { FileText, Download } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/workforce-planning" },
  { label: "Plans", href: "/zo-iko-hr/workforce-planning/plans" },
  { label: "Headcount", href: "/zoiko-hr/workforce-planning/headcount" },
  { label: "Succession", href: "/zoiko-hr/workforce-planning/succession" },
  { label: "Scenario Planning", href: "/zoiko-hr/workforce-planning/scenarios" },
  { label: "Reports", href: "/zoiko-hr/workforce-planning/reports" },
  { label: "Settings", href: "/zoiko-hr/workforce-planning/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/workforce-planning"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const mockReportsData = [
  { id: 1, name: "Monthly Headcount Report", type: "PDF", generatedAt: "2025-03-31", size: "2.4 MB", department: "HR" },
  { id: 2, name: "Annual Budget Forecast", type: "Excel", generatedAt: "2025-03-28", size: "1.8 MB", department: "Finance" },
  { id: 3, name: "Workforce Utilization Report", type: "PDF", generatedAt: "2025-03-25", size: "1.2 MB", department: "Operations" },
  { id: 4, name: "Succession Planning Summary", type: "Excel", generatedAt: "2025-03-20", size: "956 KB", department: "HR" },
  { id: 5, name: "Quarter 1 Workforce Trends", type: "PDF", generatedAt: "2025-03-15", size: "3.1 MB", department: "Analytics" },
];

export default function WorkforceReports() {
  const [reports] = useState(mockReportsData);

  return (
    <HRPage title="Workforce Planning" subtitle="Generate and download workforce reports">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download workforce reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-teal-50">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{r.name}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{r.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{r.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Generated: {r.generatedAt}</span>
                    <span className="text-xs text-gray-400">Size: {r.size}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">Department: {r.department}</span>
                    <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPage>
  );
}
