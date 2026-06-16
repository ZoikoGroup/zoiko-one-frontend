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

export default function EngagementDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/engagement/dashboard");
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  const scoreColor = (score) => {
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <HRPage title="Employee Engagement" subtitle="Survey management, engagement metrics, and feedback tracking">
      <SubNav />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-sm text-gray-500 mt-1">Survey management, engagement metrics, and feedback tracking.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Total Responses</span>
              <span>📊</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{stats?.total_responses ?? "—"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Average Score</span>
              <span>⭐</span>
            </div>
            <p className={`mt-4 text-3xl font-semibold ${scoreColor(stats?.average_score || 0)}`}>
              {stats?.average_score != null ? `${stats.average_score}/10` : "—"}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Response Rate</span>
              <span>👥</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{stats?.response_rate != null ? `${stats.response_rate}%` : "—"}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Survey Types</span>
              <span>📋</span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">{stats?.surveys_by_name ? Object.keys(stats.surveys_by_name).length : "—"}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {stats?.score_distribution && Object.keys(stats.score_distribution).length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.score_distribution).sort(([a], [b]) => Number(a) - Number(b)).map(([score, count]) => {
                  const maxCount = Math.max(...Object.values(stats.score_distribution));
                  const pct = (count / maxCount) * 100;
                  return (
                    <div key={score} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-6">{score}</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            Number(score) >= 7 ? "bg-green-500" : Number(score) >= 4 ? "bg-orange-400" : "bg-red-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stats?.surveys_by_name && Object.keys(stats.surveys_by_name).length > 0 && (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Surveys by Type</h3>
              <div className="space-y-3">
                {Object.entries(stats.surveys_by_name).map(([name, count]) => {
                  const maxCount = Math.max(...Object.values(stats.surveys_by_name));
                  const pct = (count / maxCount) * 100;
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 capitalize flex-1">{name.replace(/_/g, " ")}</span>
                      <div className="w-32 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {stats?.recent_surveys && stats.recent_surveys.length > 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Survey</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Comments</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_surveys.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">{s.employee_name || `#${s.employee_id}`}</td>
                      <td className="px-4 py-4 text-sm capitalize text-gray-700">{s.survey_name.replace(/_/g, " ")}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          s.score >= 7 ? "bg-green-100 text-green-700" : s.score >= 4 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                        }`}>{s.score}/10</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">{s.comments || "—"}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!stats && (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            No engagement data available yet. Start by submitting surveys.
          </div>
        )}
      </div>
    </HRPage>
  );
}
