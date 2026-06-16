import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { getPerformanceKpis } from "../../../service/hrService";

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

const MOCK_KPIS = [
  { id: 1, name: "Revenue Growth", target: 25, current: 22, status: "on_track", owner: "Sarah M." },
  { id: 2, name: "Customer Satisfaction", target: 4.5, current: 4.3, status: "on_track", owner: "Tom K." },
  { id: 3, name: "Employee Retention", target: 95, current: 92, status: "at_risk", owner: "Jane D." },
  { id: 4, name: "Product Quality", target: 10, current: 7, status: "on_track", owner: "Mike R." },
  { id: 5, name: "Time to Market", target: 45, current: 52, status: "at_risk", owner: "Lisa P." },
  { id: 6, name: "Support Response Time", target: 4, current: 3.2, status: "completed", owner: "Tom K." },
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

export default function KpiTracking() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPerformanceKpis()
      .then((res) => { if (mounted) setItems(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => { if (mounted) setItems(MOCK_KPIS); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <HRPage title="KPI Tracking" subtitle="Monitor key performance indicators"><SubNav /><div className="p-6 text-gray-400">Loading...</div></HRPage>;

  const data = items.length > 0 ? items : MOCK_KPIS;

  return (
    <HRPage title="KPI Tracking" subtitle="Monitor key performance indicators">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPI Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor key performance indicators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <p className="text-xs text-green-600 font-medium">On Track</p>
            <p className="text-2xl font-bold text-green-700">{data.filter((k) => k.status === "on_track" || k.status === "completed").length}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
            <p className="text-xs text-yellow-600 font-medium">At Risk</p>
            <p className="text-2xl font-bold text-yellow-700">{data.filter((k) => k.status === "at_risk").length}</p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <p className="text-xs text-red-600 font-medium">Off Track</p>
            <p className="text-2xl font-bold text-red-700">{data.filter((k) => k.status === "not_started" || k.status === "pending").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["KPI", "Target", "Current", "Status", "Owner"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((k, i) => (
                <tr key={k.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{k.name}</td>
                  <td className="px-3 py-3">{k.target}</td>
                  <td className="px-3 py-3">
                    <span className={`font-mono font-medium ${k.current >= k.target ? "text-green-600" : k.current < k.target * 0.8 ? "text-red-600" : "text-yellow-600"}`}>{k.current}</span>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={k.status} /></td>
                  <td className="px-3 py-3 text-gray-500">{k.owner}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">No KPIs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
