import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { fetchList } from "../../../service/hrService.js";

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

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

export default function TravelDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        setLoading(true);
        const requests = await fetchList("travel") || [];
        const expenses = await fetchList("travel/expenses") || [];

        const pending = requests.filter(r => r.status?.toLowerCase() === "pending");
        const approved = requests.filter(r => r.status?.toLowerCase() === "approved");
        const totalExpAmt = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        
        const byCategory = expenses.reduce((acc, e) => {
          if (e.category) acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {});

        setData({
          totalRequests: requests.length,
          pendingApprovals: pending.length,
          approvedRequests: approved.length,
          totalExpenses: totalExpAmt,
          recentRequests: requests.slice(0, 5),
          expenseSummary: { total: totalExpAmt, byCategory },
          upcomingItineraries: requests.filter(r => r.status?.toLowerCase() === "approved").slice(0, 3)
        });
      } catch (error) {
        console.error("Dashboard compilation failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardMetrics();
  }, []);

  if (loading || !data) {
    return (
      <HRPage title="Travel" subtitle="Manage travel requests and expenses">
        <SubNav />
        <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Travel" subtitle="Manage travel requests and expenses">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalRequests}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{data.pendingApprovals}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Approved Requests</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{data.approvedRequests}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(data.totalExpenses)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="py-2">Employee</th>
                    <th className="py-2">Destination</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentRequests.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 text-gray-700">
                      <td className="py-2 font-medium">{r.employee || r.employee_name}</td>
                      <td className="py-2">{r.destination}</td>
                      <td className="py-2">{formatCurrency(r.amount)}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h2>
            <div className="space-y-3">
              {Object.keys(data.expenseSummary.byCategory).length === 0 ? (
                <p className="text-sm text-gray-400">No structured categories identified.</p>
              ) : (
                Object.entries(data.expenseSummary.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-gray-500">{category}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}