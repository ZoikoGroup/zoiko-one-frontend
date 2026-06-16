import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
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

const mockHeadcountData = [
  { id: 1, department: "Engineering", current: 450, target: 500, gap: 50, percentage: 90 },
  { id: 2, department: "Sales", current: 320, target: 400, gap: 80, percentage: 80 },
  { id: 3, department: "Marketing", current: 180, target: 250, gap: 70, percentage: 72 },
  { id: 4, department: "HR", current: 95, target: 120, gap: 25, percentage: 79 },
  { id: 5, department: "Operations", current: 205, target: 230, gap: 25, percentage: 89 },
  { id: 6, department: "Finance", current: 40, target: 60, gap: 20, percentage: 67 },
  { id: 7, department: "Legal", current: 8, target: 15, gap: 7, percentage: 53 },
  { id: 8, department: "IT", current: 180, target: 250, gap: 70, percentage: 72 },
];

export default function HeadcountPlanning() {
  const [headcount] = useState(mockHeadcountData);

  const totalCurrent = headcount.reduce((sum, h) => sum + h.current, 0);
  const totalTarget = headcount.reduce((sum, h) => sum + h.target, 0);
  const totalGap = totalTarget - totalCurrent;
  const overallUtilization = (totalCurrent / totalTarget) * 100;

  const columns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "current", label: "Current", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "target", label: "Target", render: (v) => <span className="font-medium text-teal-600">{v}</span> },
    { key: "gap", label: "Gap", render: (v) => <span className="text-orange-600 font-medium">{v}</span> },
    { key: "percentage", label: "Utilization", render: (v) => <span className="text-gray-600">{v.toFixed(0)}%</span> },
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Manage headcount targets and workforce allocation">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Headcount Planning</h1>
          <p className="text-sm text-gray-500 mt-1">Manage headcount targets and workforce allocation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Current Headcount</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCurrent}</p>
            <p className="text-xs text-gray-400 mt-1">Total employees</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Target Headcount</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{totalTarget}</p>
            <p className="text-xs text-gray-400 mt-1">Planned workforce</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Gap</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{totalGap}</p>
            <p className="text-xs text-gray-400 mt-1">Positions needed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Utilization Rate</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{overallUtilization.toFixed(0)}%</p>
            <p className="text-xs text-gray-400 mt-1">Current utilization</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Headcount Allocation</h2>
          <DataTable columns={columns} data={headcount} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilization Overview</h2>
          <div className="space-y-3">
            {headcount.map((h) => (
              <div key={h.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{h.dept}</span>
                  <span className="text-gray-500">{h.current}/{h.target}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(h.current / h.target) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
