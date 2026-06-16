import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { StatsCard, DataTable } from "./StatsCard.jsx";
import { StatusBadge } from "./DataTable.jsx";
import { FilterBar } from "./FilterBar.jsx";
import { formatCurrency } from "./helpers.js";

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

const mockPlansData = [
  { id: 1, title: "Q3 Engineering Hiring", department: "Engineering", year: "2025", headcount: 50, targetHeadcount: 60, status: "active", budget: 2500000 },
  { id: 2, title: "Sales Expansion", department: "Sales", year: "2025", headcount: 30, targetHeadcount: 40, status: "active", budget: 1200000 },
  { id: 3, title: "Marketing Campaign", department: "Marketing", year: "2025", headcount: 20, targetHeadcount: 25, status: "pending", budget: 800000 },
  { id: 4, title: "HR Staffing", department: "HR", year: "2025", headcount: 15, targetHeadcount: 20, status: "active", budget: 600000 },
  { id: 5, title: "Ops Automation", department: "Operations", year: "2025", headcount: 25, targetHeadcount: 30, status: "planning", budget: 1500000 },
  { id: 6, title: "Q4 Finance", department: "Finance", year: "2025", headcount: 10, targetHeadcount: 15, status: "pending", budget: 500000 },
  { id: 7, title: "Legal Team", department: "Legal", year: "2025", headcount: 8, targetHeadcount: 12, status: "active", budget: 400000 },
  { id: 8, title: "IT Infrastructure", department: "IT", year: "2025", headcount: 40, targetHeadcount: 50, status: "active", budget: 3000000 },
];

export default function WorkforcePlans() {
  const [plans] = useState(mockPlansData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const filtered = plans.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.department.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (departmentFilter && p.department !== departmentFilter) return false;
    return true;
  });

  const departments = ["All", "Engineering", "Sales", "Marketing", "HR", "Operations", "Finance", "Legal", "IT"];

  const columns = [
    { key: "title", label: "Plan", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department", render: (v) => <span className="text-teal-600 font-medium">{v}</span> },
    { key: "year", label: "Year", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "headcount", label: "Headcount", render: (v, r) => <span className="font-medium">{v}/{r.targetHeadcount}</span> },
    { key: "budget", label: "Budget", render: (v) => <span className="text-gray-700">{formatCurrency(v)}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Create and manage workforce plans and headcount allocations">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workforce Plans</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage workforce plans and headcount allocations</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Plan
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="planning">Planning</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              {departments.map((d) => (
                <option key={d} value={d === "All" ? "" : d}>{d}</option>
              ))}
            </select>
          </div>

          <DataTable columns={columns} data={filtered} />
        </div>
      </div>
    </HRPage>
  );
}
