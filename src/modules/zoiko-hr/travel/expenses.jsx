import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
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

const mockExpensesData = [
  { id: 1, employee: "Alice Johnson", destination: "New York", amount: 1500, category: "Travel", status: "approved", submittedDate: "2025-03-28", approvedBy: "John Smith" },
  { id: 2, employee: "Bob Smith", destination: "London", amount: 2500, category: "Accommodation", status: "approved", submittedDate: "2025-03-25", approvedBy: "Jane Doe" },
  { id: 3, employee: "Carol Davis", destination: "Paris", amount: 3000, category: "Travel", status: "pending", submittedDate: "2025-03-24", approvedBy: null },
  { id: 4, employee: "David Lee", destination: "Tokyo", amount: 4000, category: "Meals", status: "approved", submittedDate: "2025-03-23", approvedBy: "Mike Johnson" },
  { id: 5, employee: "Eva Martinez", destination: "Singapore", amount: 5000, category: "Transport", status: "approved", submittedDate: "2025-03-22", approvedBy: "Sarah Williams" },
  { id: 6, employee: "Frank Wilson", destination: "Berlin", amount: 800, category: "Travel", status: "pending", submittedDate: "2025-03-21", approvedBy: null },
  { id: 7, employee: "Grace Kim", destination: "Sydney", amount: 3500, category: "Accommodation", status: "approved", submittedDate: "2025-03-20", approvedBy: "David Lee" },
  { id: 8, employee: "Henry Brown", destination: "Dubai", amount: 2000, category: "Meals", status: "rejected", submittedDate: "2025-03-19", approvedBy: "Emma Taylor" },
];

export default function TravelExpenses() {
  const [expenses] = useState(mockExpensesData);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);
  const rejectedExpenses = expenses.filter((e) => e.status === "rejected").reduce((sum, e) => sum + e.amount, 0);

  const categoryData = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "amount", label: "Amount", render: (v) => <span className="font-medium text-gray-900">{formatCurrency(v)}</span> },
    { key: "category", label: "Category", render: (v) => <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{v}</span> },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v === "approved" ? "bg-green-100 text-green-800" : v === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{v}</span> },
    { key: "submittedDate", label: "Submitted", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "approvedBy", label: "Approved By", render: (v) => <span className="text-gray-700">{v || "-"}</span> },
  ];

  return (
    <HRPage title="Travel" subtitle="Manage travel expenses and reimbursements">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage travel expenses and reimbursements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">All expenses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Approved Expenses</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(approvedExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">Approved amount</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Pending Expenses</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(pendingExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">Pending approval</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Rejected Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(rejectedExpenses)}</p>
            <p className="text-xs text-gray-400 mt-1">Rejected amount</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Expenses</h2>
          <DataTable columns={columns} data={expenses} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(categoryData).map(([category, amount]) => (
              <div key={category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{category}</span>
                  <span className="text-gray-500">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(amount / totalExpenses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
