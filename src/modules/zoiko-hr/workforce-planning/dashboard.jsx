import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { Users, Briefcase, DollarSign, Target, TrendingUp, UserPlus } from "lucide-react";
import { StatsCard, DataTable } from "./StatsCard.jsx";
import { StatusBadge } from "./DataTable.jsx";
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

const mockDashboardData = {
  stats: {
    totalPlans: 24,
    activePlans: 18,
    totalHeadcount: 1250,
    totalBudget: 15000000,
    utilizationRate: 85,
    openPositions: 42,
  },
  departmentBreakdown: [
    { dept: "Engineering", headcount: 450, budget: 8500000 },
    { dept: "Sales", headcount: 320, budget: 4200000 },
    { dept: "Marketing", headcount: 180, budget: 2500000 },
    { dept: "HR", headcount: 95, budget: 1200000 },
    { dept: "Operations", headcount: 205, budget: 2100000 },
  ],
  headcountTrend: [
    { month: "Jan", actual: 1200, planned: 1200 },
    { month: "Feb", actual: 1220, planned: 1250 },
    { month: "Mar", actual: 1240, planned: 1300 },
    { month: "Apr", actual: 1260, planned: 1350 },
    { month: "May", actual: 1280, planned: 1400 },
    { month: "Jun", actual: 1300, planned: 1450 },
  ],
  recentPlans: [
    { id: 1, title: "Q3 Engineering Hiring", department: "Engineering", year: "2025", headcount: 50, targetHeadcount: 60, status: "active" },
    { id: 2, title: "Sales Expansion", department: "Sales", year: "2025", headcount: 30, targetHeadcount: 40, status: "active" },
    { id: 3, title: "Marketing Campaign", department: "Marketing", year: "2025", headcount: 20, targetHeadcount: 25, status: "pending" },
    { id: 4, title: "HR Staffing", department: "HR", year: "2025", headcount: 15, targetHeadcount: 20, status: "active" },
    { id: 5, title: "Ops Automation", department: "Operations", year: "2025", headcount: 25, targetHeadcount: 30, status: "planning" },
  ],
};

export default function WorkforceDashboard() {
  const [dash] = useState(mockDashboardData);

  if (!dash) {
    return (
      <HRPage title="Workforce Planning" subtitle="Overview of workforce planning metrics and trends">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  const { stats, departmentBreakdown, headcountTrend, recentPlans } = dash;

  const statCards = [
    { title: "Total Plans", value: stats.totalPlans, icon: Briefcase, change: 4, trend: "up" },
    { title: "Active Plans", value: stats.activePlans, icon: Target, change: 2, trend: "up" },
    { title: "Total Headcount", value: stats.totalHeadcount, icon: Users, change: 3, trend: "up" },
    { title: "Total Budget", value: formatCurrency(stats.totalBudget), icon: DollarSign, change: 5, trend: "up" },
    { title: "Utilization Rate", value: `${stats.utilizationRate}%`, icon: TrendingUp, change: -1, trend: "down" },
    { title: "Open Positions", value: stats.openPositions, icon: UserPlus, change: 6, trend: "up" },
  ];

  const departmentColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "headcount", label: "Headcount" },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
  ];

  const planColumns = [
    { key: "title", label: "Plan", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    { key: "headcount", label: "Headcount", render: (v, r) => `${v}/${r.targetHeadcount}` },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const maxHC = Math.max(...headcountTrend.map((m) => Math.max(m.planned, m.actual)));

  return (
    <HRPage title="Workforce Planning" subtitle="Overview of workforce planning metrics and trends">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of workforce planning metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Headcount Trend</h2>
            <div className="flex items-end gap-3 h-48">
              {headcountTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{m.actual}</span>
                  <div className="w-full flex flex-col gap-0.5 items-center">
                    <div className="w-full bg-teal-200 rounded-t" style={{ height: `${(m.actual / maxHC) * 100}%` }}>
                      <div className="w-full bg-teal-500 rounded-t h-full" />
                    </div>
                    <div className="w-full bg-blue-200 rounded-t" style={{ height: `${((m.planned - m.actual) / maxHC) * 100}%` }}>
                      <div className="w-full bg-blue-500 rounded-t h-full opacity-70" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-500" /> Actual</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Planned</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
            <DataTable columns={departmentColumns} data={departmentBreakdown} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Workforce Plans</h2>
            <span className="text-xs text-teal-600 font-medium">View all</span>
          </div>
          <DataTable columns={planColumns} data={recentPlans.slice(0, 5)} />
        </div>
      </div>
    </HRPage>
  );
}
