import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Landmark, TrendingUp, Clock, AlertOctagon, BarChart3, Receipt } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {api} from "../../../service/api"; // backend base connectivity layer

const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" }
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel/expenses"}
          className={({ isActive }) =>
            `whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function TravelExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveExpenses() {
      try {
        setLoading(true);
        const response = await api.get("/hr/travel/expenses");
        setExpenses(response?.data || response || []);
      } catch (err) {
        console.error("Error connecting with expenses catalog schema:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const approvedExpenses = expenses.filter((e) => e.status?.toLowerCase() === "approved").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const pendingExpenses = expenses.filter((e) => e.status?.toLowerCase() === "pending").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const rejectedExpenses = expenses.filter((e) => e.status?.toLowerCase() === "rejected").reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const categoryData = expenses.reduce((acc, e) => {
    if (e.category) acc[e.category] = (acc[e.category] || 0) + (parseFloat(e.amount) || 0);
    return acc;
  }, {});

  return (
    <HRPage title="Travel" subtitle="Manage travel expenses and reimbursements">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Travel Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Live aggregated expense summary tracking schemas</p>
        </div>

        {/* Analytic Metrics Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Disbursed</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Approved Value</p>
            <p className="text-2xl font-black text-green-600 mt-2">{formatCurrency(approvedExpenses)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Pending Audit</p>
            <p className="text-2xl font-black text-yellow-600 mt-2">{formatCurrency(pendingExpenses)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Rejected Outlay</p>
            <p className="text-2xl font-black text-red-600 mt-2">{formatCurrency(rejectedExpenses)}</p>
          </div>
        </div>

        {/* Structured Grid Splitter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-blue-500" /> Transaction Audit Stream</h2>
            {loading ? (
              <p className="text-center py-6 text-gray-400 font-medium animate-pulse">Syncing transactions...</p>
            ) : expenses.length === 0 ? (
              <p className="text-center py-6 text-gray-400 text-sm">No expenses submitted in current database node.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold bg-gray-50/50">
                      <th className="p-3">Claimant</th>
                      <th className="p-3">Classification</th>
                      <th className="p-3">Outlay</th>
                      <th className="p-3">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {expenses.map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-3 font-semibold text-gray-900">{row.employee_name || row.employee || `Emp ID: ${row.employee_id}`}</td>
                        <td className="p-3 capitalize">{row.category || "General"}</td>
                        <td className="p-3 font-semibold text-gray-900">{formatCurrency(row.amount)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            row.status === "approved" ? "bg-green-100 text-green-800" : row.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                          }`}>{row.status || "Pending"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Allocation Breakdown Component */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-500" /> Allocation Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(categoryData).map(([category, amount]) => (
                <div key={category} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1 capitalize">
                    <span>{category}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}