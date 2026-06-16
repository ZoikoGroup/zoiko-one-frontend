import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
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

const appraisals = [
  { id: 1, employee: "Alice J.", year: "2024-2025", status: "submitted", selfScore: 4.5, managerScore: 4.8, finalScore: 4.6 },
  { id: 2, employee: "Bob S.", year: "2024-2025", status: "draft", selfScore: null, managerScore: null, finalScore: null },
  { id: 3, employee: "Carol D.", year: "2024-2025", status: "approved", selfScore: 4.2, managerScore: 4.5, finalScore: 4.4 },
  { id: 4, employee: "David W.", year: "2024-2025", status: "submitted", selfScore: 3.8, managerScore: 4.0, finalScore: 3.9 },
  { id: 5, employee: "Eve M.", year: "2024-2025", status: "draft", selfScore: null, managerScore: null, finalScore: null },
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

function StatusBadge({ status }) {
  const m = { draft: "bg-gray-100 text-gray-800", submitted: "bg-blue-100 text-blue-800", approved: "bg-green-100 text-green-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

export default function Appraisals() {
  const [filter, setFilter] = useState("");
  const filtered = filter ? appraisals.filter((a) => a.status === filter) : appraisals;

  return (
    <HRPage title="Appraisals" subtitle="Annual and periodic appraisal records">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appraisals</h1>
            <p className="text-sm text-gray-500 mt-1">Annual and periodic appraisal records</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> New Appraisal
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["", "draft", "submitted", "approved"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s ? s.replace(/\b\w/g, (l) => l.toUpperCase()) : "All"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Employee", "Period", "Self Score", "Manager Score", "Final Score", "Status", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{a.employee}</td>
                  <td className="px-3 py-3 text-gray-500">{a.year}</td>
                  <td className="px-3 py-3">{a.selfScore ? `${a.selfScore}/5` : "-"}</td>
                  <td className="px-3 py-3">{a.managerScore ? `${a.managerScore}/5` : "-"}</td>
                  <td className="px-3 py-3 font-bold text-gray-900">{a.finalScore ? `${a.finalScore}/5` : "-"}</td>
                  <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-3">
                    <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      <FileText className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No appraisals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
