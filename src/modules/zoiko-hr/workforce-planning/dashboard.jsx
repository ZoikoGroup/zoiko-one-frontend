import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { fetchList } from "../../../service/hrService.js";

// Inlined helper instead of importing from deleted file
const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/workforce-planning" },
  { label: "Plans", href: "/zoiko-hr/workforce-planning/plans" },
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

export default function WorkforceDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const plans = await fetchList("workforce-planning") || [];
        const headcount = await fetchList("headcount") || [];
        
        const totalBudget = plans.reduce((sum, p) => sum + (p.budget || 0), 0);
        const activePlansCount = plans.filter(p => p.status === "Active" || p.status === "approved").length;
        const totalEmployees = headcount.reduce((sum, h) => sum + (h.current || 0), 0);

        setMetrics({
          totalBudget,
          activePlansCount,
          totalEmployees,
          recentPlans: plans.slice(0, 5)
        });
      } catch (err) {
        console.error("Failed to compile dashboard context:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading || !metrics) {
    return (
      <HRPage title="Workforce Planning" subtitle="Dashboard overview">
        <SubNav />
        <div className="text-center py-10 text-gray-500">Loading metrics...</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Workforce Planning" subtitle="Strategic organizational alignment">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Allocated Budget</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.totalBudget)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Active Plans</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{metrics.activePlansCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Tracked Employees</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{metrics.totalEmployees}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Workforce Initiatives</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="py-2">Plan Name</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Budget Target</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentPlans.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 text-gray-700">
                    <td className="py-2 font-medium">{p.name || p.title}</td>
                    <td className="py-2">{p.department}</td>
                    <td className="py-2">{formatCurrency(p.budget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}