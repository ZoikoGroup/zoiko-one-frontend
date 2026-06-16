import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";

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

const mockSuccessionData = [
  { id: 1, role: "CEO", current: "John Smith", successor: "Alice Johnson", readiness: "High", timeline: "6 months" },
  { id: 2, role: "CTO", current: "Mike Wilson", successor: "Sarah Davis", readiness: "Medium", timeline: "12 months" },
  { id: 3, role: "COO", current: "Lisa Brown", successor: "Tom Miller", readiness: "Low", timeline: "24 months" },
  { id: 4, role: "Marketing Director", current: "Jane Lee", successor: "Robert Clark", readiness: "High", timeline: "3 months" },
  { id: 5, role: "Sales Director", current: "David Kim", successor: "Emma Taylor", readiness: "Medium", timeline: "9 months" },
];

export default function Succession() {
  const [succession] = useState(mockSuccessionData);

  const readinessColors = {
    High: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-red-100 text-red-800",
  };

  const columns = [
    { key: "role", label: "Role", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "current", label: "Current", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "successor", label: "Successor", render: (v) => <span className="font-medium text-teal-600">{v}</span> },
    { key: "readiness", label: "Readiness", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${readinessColors[v]}`}>{v}</span> },
    { key: "timeline", label: "Timeline", render: (v) => <span className="text-gray-500">{v}</span> },
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Manage succession planning and leadership transitions">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Succession Planning</h1>
          <p className="text-sm text-gray-500 mt-1">Manage succession planning and leadership transitions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Succession Matrix</h2>
          <DataTable columns={columns} data={succession} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Readiness Summary</h3>
            <div className="space-y-3">
              {succession.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.role}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${readinessColors[s.readiness]}`}>{s.readiness}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline Overview</h3>
            <div className="space-y-3">
              {succession.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.role}</span>
                  <span className="text-xs text-gray-500">{s.timeline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
