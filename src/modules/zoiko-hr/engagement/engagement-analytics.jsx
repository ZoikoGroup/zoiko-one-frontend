import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/engagement" },
  { label: "Surveys", href: "/zoiko-hr/engagement/surveys" },
  { label: "Analytics", href: "/zoiko-hr/engagement/analytics" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/engagement"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
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

export default function EngagementAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/engagement/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading analytics...</div>;

  return (
    <HRPage title="Employee Engagement" subtitle="Survey management, engagement metrics, and feedback tracking">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Engagement insights and performance metrics</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Score Trends</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current</span>
                <span className="font-bold text-green-600">8.2/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Month</span>
                <span className="font-bold text-orange-600">7.5/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Previous Month</span>
                <span className="font-bold text-blue-600">7.8/10</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Engineering</span>
                <span className="font-bold text-green-600">8.5/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sales</span>
                <span className="font-bold text-orange-600">7.2/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">HR</span>
                <span className="font-bold text-blue-600">9.1/10</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Types</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pulse Surveys</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Culture</span>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfaction</span>
                <span className="font-bold">25%</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-green-500" strokeDasharray="176 176" strokeDashoffset="44" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500">✅</span>
              <div>
                <p className="text-sm font-medium text-gray-900">High Engagement in Engineering</p>
                <p className="text-xs text-gray-600">Engineering team shows 8.5/10 engagement score, up 12% from last quarter.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange-500">⚠️</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Low Response Rate in Sales</p>
                <p className="text-xs text-gray-600">Sales team participation dropped to 65%, needs attention.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500">📈</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Positive Trend Overall</p>
                <p className="text-xs text-gray-600">Company-wide engagement up 8% quarter-over-quarter.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
