import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { formatCurrency } from "./helpers.js";

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

const mockDashboardData = {
  totalRequests: 156,
  pendingApprovals: 23,
  approvedRequests: 134,
  totalExpenses: 45678,
  averageRequestValue: 293,
  upcomingItineraries: 12,
  recentRequests: [
    { id: 1, employee: "Alice Johnson", destination: "New York", purpose: "Business Meeting", status: "approved", amount: 1500 },
    { id: 2, employee: "Bob Smith", destination: "London", purpose: "Conference", status: "pending", amount: 2500 },
    { id: 3, employee: "Carol Davis", destination: "Paris", purpose: "Client Visit", status: "approved", amount: 3000 },
    { id: 4, employee: "David Lee", destination: "Tokyo", purpose: "Training", status: "pending", amount: 4000 },
    { id: 5, employee: "Eva Martinez", destination: "Singapore", purpose: "Partnership", status: "approved", amount: 5000 },
  ],
  expenseSummary: {
    total: 45678,
    byCategory: {
      Travel: 25000,
      Accommodation: 12000,
      Meals: 5000,
      Transport: 3678,
    },
  },
  upcomingItineraries: [
    { id: 1, employee: "Frank Wilson", destination: "Berlin", startDate: "2025-04-01", endDate: "2025-04-05", purpose: "Business Trip" },
    { id: 2, employee: "Grace Kim", destination: "Sydney", startDate: "2025-04-02", endDate: "2025-04-06", purpose: "Conference" },
    { id: 3, employee: "Henry Brown", destination: "Dubai", startDate: "2025-04-03", endDate: "2025-04-07", purpose: "Client Meeting" },
  ],
};

export default function TravelDashboard() {
  const [dashboard] = useState(mockDashboardData);

  if (!dashboard) {
    return (
      <HRPage title="Travel" subtitle="Manage travel requests and expenses">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Travel" subtitle="Manage travel requests and expenses">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage travel requests and expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard.totalRequests}</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{dashboard.pendingApprovals}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Approved Requests</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{dashboard.approvedRequests}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(dashboard.totalExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">All expenses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Avg Request Value</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(dashboard.averageRequestValue)}</p>
            <p className="text-xs text-gray-400 mt-1">Per request</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h2>
            <div className="space-y-3">
              {dashboard.recentRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.employee}</p>
                    <p className="text-xs text-gray-500">{r.destination} - {r.purpose}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "approved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>{r.status}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(r.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Itineraries</h2>
            <div className="space-y-3">
              {dashboard.upcomingItineraries.map((i) => (
                <div key={i.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{i.employee}</p>
                    <p className="text-xs text-gray-500">{i.destination} - {i.startDate} to {i.endDate}</p>
                  </div>
                  <span className="text-xs text-gray-400">{i.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dashboard.expenseSummary.byCategory).map(([category, amount]) => (
              <div key={category} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{category.substring(0, 3)}</span>
                </div>
                <p className="text-xs text-gray-500">{category}</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
