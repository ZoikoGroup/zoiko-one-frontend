import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Building2, FileText, CheckCircle, Clock, AlertTriangle, PieChart, Landmark } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getTravel } from "../../../service/hrService.js";
import {api} from "../../../service/api"; // for direct endpoint queries like expenses

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-200">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel"}
          className={({ isActive }) =>
            `whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real data from FastAPI endpoints
        const travelRes = await getTravel();
        const requests = travelRes?.data || travelRes || [];
        
        const expenseResponse = await api.get("/hr/travel/expenses");
        const expenses = expenseResponse?.data || [];

        const pending = requests.filter(r => r.status?.toLowerCase() === "pending");
        const approved = requests.filter(r => r.status?.toLowerCase() === "approved");
        const totalExpAmt = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
        
        const byCategory = expenses.reduce((acc, e) => {
          if (e.category) acc[e.category] = (acc[e.category] || 0) + (parseFloat(e.amount) || 0);
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
      } catch (err) {
        console.error("Dashboard compilation failed:", err);
        setError("Unable to sync metrics with live servers. Please retry.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardMetrics();
  }, []);

  if (loading) {
    return (
      <HRPage title="Travel" subtitle="Manage travel requests and expenses">
        <SubNav />
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Retrieving operational records...</p>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Travel" subtitle="Manage travel requests and expenses">
        <SubNav />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-xl mx-auto my-10">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-md font-bold text-gray-800">Connection Interrupted</h3>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Travel" subtitle="Manage travel requests and expenses">
      <SubNav />
      <div className="space-y-8">
        {/* Metric Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{data.totalRequests}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Building2 className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Awaiting Action</p>
                <p className="text-3xl font-black text-yellow-600 mt-2">{data.pendingApprovals}</p>
              </div>
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirmed Trips</p>
                <p className="text-3xl font-black text-green-600 mt-2">{data.approvedRequests}</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Disbursed Expenses</p>
                <p className="text-3xl font-black text-purple-600 mt-2">{formatCurrency(data.totalExpenses)}</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Landmark className="w-5 h-5" /></div>
            </div>
          </div>
        </div>

        {/* Dynamic Categorization Tables and Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Recent Itinerary Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold bg-gray-50/50">
                    <th className="py-3 px-4 rounded-l-lg">Employee</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Estimated Outlay</th>
                    <th className="py-3 px-4 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {data.recentRequests.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-gray-900">{r.employee || r.employee_name || `ID: ${r.employee_id}`}</td>
                      <td className="py-3.5 px-4 text-gray-600">{r.destination}</td>
                      <td className="py-3.5 px-4 text-gray-900">{formatCurrency(r.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${
                          r.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>{r.status || 'Pending'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-500" /> Expense Aggregations</h3>
            <div className="space-y-4">
              {Object.keys(data.expenseSummary.byCategory).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No structured classifications found.</p>
              ) : (
                Object.entries(data.expenseSummary.byCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-600 capitalize">{category}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</span>
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