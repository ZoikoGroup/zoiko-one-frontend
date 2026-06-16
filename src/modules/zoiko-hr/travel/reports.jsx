import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { FileText, Download } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Itineraries", href: "/zoiko-hr/travel/itineraries" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Reports", href: "/zoiko-hr/travel/reports" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
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

export default function TravelReports() {
  const [reports] = useState([
    { id: 1, name: "Monthly Travel Report", type: "PDF", generatedAt: "2025-03-31", size: "2.4 MB", department: "Operations" },
    { id: 2, name: "Quarterly Expenses Summary", type: "Excel", generatedAt: "2025-03-28", size: "1.8 MB", department: "Finance" },
    { id: 3, name: "Travel Compliance Report", type: "PDF", generatedAt: "2025-03-25", size: "1.2 MB", department: "Compliance" },
    { id: 4, name: "Employee Travel Analytics", type: "Excel", generatedAt: "2025-03-20", size: "956 KB", department: "Analytics" },
    { id: 5, name: "Annual Travel Budget Report", type: "PDF", generatedAt: "2025-03-15", size: "3.1 MB", department: "Management" },
  ]);

  return (
    <HRPage title="Travel" subtitle="Generate and download travel reports">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download travel reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{r.name}</h3>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{r.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Department: {r.department}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Generated: {r.generatedAt}</span>
                    <span className="text-xs text-gray-400">Size: {r.size}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8" />
                      </svg>
                      Generate
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
