import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
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

const goals = [
  { id: 1, title: "Increase product adoption by 20%", owner: "Sarah M.", quarter: "Q1 2025", progress: 75, status: "on_track", dueDate: "2025-03-31" },
  { id: 2, title: "Reduce customer churn to under 5%", owner: "Mike R.", quarter: "Q1 2025", progress: 60, status: "on_track", dueDate: "2025-03-31" },
  { id: 3, title: "Launch mobile app v2.0", owner: "Tom K.", quarter: "Q2 2025", progress: 25, status: "on_track", dueDate: "2025-06-30" },
  { id: 4, title: "Complete SOC 2 certification", owner: "Jane D.", quarter: "Q1 2025", progress: 90, status: "at_risk", dueDate: "2025-03-15" },
  { id: 5, title: "Hire 10 new engineers", owner: "Lisa P.", quarter: "Q1 2025", progress: 100, status: "completed", dueDate: "2025-03-31" },
  { id: 6, title: "Improve NPS score to 50+", owner: "Sarah M.", quarter: "Q2 2025", progress: 10, status: "not_started", dueDate: "2025-06-30" },
  { id: 7, title: "Launch partner program", owner: "Jane D.", quarter: "Q2 2025", progress: 0, status: "not_started", dueDate: "2025-06-30" },
  { id: 8, title: "Migrate to cloud infrastructure", owner: "Mike R.", quarter: "Q1 2025", progress: 85, status: "on_track", dueDate: "2025-03-31" },
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
  const m = { not_started: "bg-gray-100 text-gray-800", on_track: "bg-green-100 text-green-800", at_risk: "bg-red-100 text-red-800", completed: "bg-blue-100 text-blue-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function GoalsOKRs() {
  const [filter, setFilter] = useState("");
  const filtered = filter ? goals.filter((g) => g.status === filter) : goals;

  return (
    <HRPage title="Goals & OKRs" subtitle="Track team objectives and key results">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Goals & OKRs</h1>
            <p className="text-sm text-gray-500 mt-1">Track team objectives and key results</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> New Goal
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {["", "not_started", "on_track", "at_risk", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s ? s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "All"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Objective", "Owner", "Quarter", "Progress", "Status", "Due Date"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g, i) => (
                <tr key={g.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{g.title}</td>
                  <td className="px-3 py-3 text-gray-500">{g.owner}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{g.quarter}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${g.status === "completed" ? "bg-green-500" : g.status === "at_risk" ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{g.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={g.status} /></td>
                  <td className="px-3 py-3 text-xs text-gray-500">{formatDate(g.dueDate)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">No goals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
