import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { getPerformanceReviews } from "../../../service/hrService";

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

const MOCK_REVIEWS = [
  { id: 1, employee: "Alice J.", reviewer: "Carol D.", type: "Quarterly", dueDate: "2025-03-15", status: "in_progress", score: null },
  { id: 2, employee: "Bob S.", reviewer: "Carol D.", type: "Quarterly", dueDate: "2025-03-15", status: "pending", score: null },
  { id: 3, employee: "Carol D.", reviewer: "Sarah M.", type: "Annual", dueDate: "2025-04-01", status: "in_progress", score: null },
  { id: 4, employee: "David W.", reviewer: "Tom K.", type: "Quarterly", dueDate: "2025-03-15", status: "completed", score: 4.5 },
  { id: 5, employee: "Eve M.", reviewer: "Lisa P.", type: "Quarterly", dueDate: "2025-03-15", status: "completed", score: 3.5 },
  { id: 6, employee: "Frank L.", reviewer: "Mike R.", type: "Quarterly", dueDate: "2025-03-15", status: "pending", score: null },
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
  const m = { pending: "bg-yellow-100 text-yellow-800", in_progress: "bg-purple-100 text-purple-800", completed: "bg-green-100 text-green-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function PerformanceReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPerformanceReviews()
      .then((res) => { if (mounted) setItems(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => { if (mounted) setItems(MOCK_REVIEWS); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <HRPage title="Performance Reviews" subtitle="Review cycles and submissions"><SubNav /><div className="p-6 text-gray-400">Loading...</div></HRPage>;

  const data = items.length > 0 ? items : MOCK_REVIEWS;

  return (
    <HRPage title="Performance Reviews" subtitle="Review cycles and submissions">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Performance review cycles and submissions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <p className="text-xs text-blue-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-blue-700">{data.filter((r) => r.status === "pending").length}</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <p className="text-xs text-purple-600 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-purple-700">{data.filter((r) => r.status === "in_progress").length}</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <p className="text-xs text-green-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-700">{data.filter((r) => r.status === "completed").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Employee", "Reviewer", "Type", "Due Date", "Status", "Score", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={r.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{r.employee}</td>
                  <td className="px-3 py-3 text-gray-500">{r.reviewer || "-"}</td>
                  <td className="px-3 py-3">{r.type}</td>
                  <td className="px-3 py-3 text-xs">{formatDate(r.dueDate)}</td>
                  <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-3 font-medium">{r.score ? `${r.score}/5` : "-"}</td>
                  <td className="px-3 py-3">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      {r.status === "pending" ? "Start Review" : r.status === "in_progress" ? "Continue" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
