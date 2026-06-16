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

const mockScenarioData = [
  { id: 1, scenario: "Base Case", probability: 60, impact: "Medium", budget: 5000000, headcount: 100 },
  { id: 2, scenario: "Optimistic", probability: 25, impact: "High", budget: 7500000, headcount: 150 },
  { id: 3, scenario: "Pessimistic", probability: 15, impact: "Low", budget: 3000000, headcount: 80 },
];

export default function ScenarioPlanning() {
  const [scenarios] = useState(mockScenarioData);

  const impactColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  const columns = [
    { key: "scenario", label: "Scenario", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "probability", label: "Probability", render: (v) => <span className="text-gray-700">{v}%</span> },
    { key: "impact", label: "Impact", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${impactColors[v]}`}>{v}</span> },
    { key: "budget", label: "Budget", render: (v) => <span className="text-gray-700">{formatCurrency(v)}</span> },
    { key: "headcount", label: "Headcount", render: (v) => <span className="font-medium text-teal-600">{v}</span> },
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Analyze and plan for different workforce scenarios">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Planning</h1>
          <p className="text-sm text-gray-500 mt-1">Analyze and plan for different workforce scenarios</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scenario Matrix</h2>
          <DataTable columns={columns} data={scenarios} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Probability Distribution</h3>
            <div className="space-y-3">
              {scenarios.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.scenario}</span>
                  <span className="text-xs text-gray-500">{s.probability}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Summary</h3>
            <div className="space-y-3">
              {scenarios.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.scenario}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${impactColors[s.impact]}`}>{s.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
