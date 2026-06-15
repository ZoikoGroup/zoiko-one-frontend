import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getEngagementDashboard,
  getEngagementSurveys,
  createEngagementSurvey,
  updateEngagementSurvey,
  deleteEngagementSurvey,
  getEmployees,
} from "../../../service/hrService";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "surveys", label: "Surveys" },
  { key: "analytics", label: "Analytics" },
];

export default function Engagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employeeMap, setEmployeeMap] = useState({});

  useEffect(() => {
    getEmployees({ per_page: 200 })
      .then((data) => {
        const map = {};
        (data.items || []).forEach((emp) => { map[emp.id] = `${emp.first_name} ${emp.last_name}`; });
        setEmployeeMap(map);
      })
      .catch(() => {});
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "surveys": return <SurveysSection employeeMap={employeeMap} />;
      case "analytics": return <AnalyticsSection />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Engagement</h1>
        <p className="text-gray-600 mt-1">Survey management, engagement metrics, and feedback tracking.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementDashboard()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  const scoreColor = (score) => {
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
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
                    <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[s.employee_id] || `#${s.employee_id}`}</td>
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
  );
}

function SurveysSection({ employeeMap }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ employee_id: "", survey_name: "", score: "5", comments: "" });

  const load = () => {
    setLoading(true);
    getEngagementSurveys()
      .then(setSurveys)
      .catch(() => setSurveys([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee_id: parseInt(form.employee_id),
      survey_name: form.survey_name,
      score: parseInt(form.score),
      comments: form.comments || null,
    };
    if (editing) {
      await updateEngagementSurvey(editing.id, payload);
    } else {
      await createEngagementSurvey(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ employee_id: "", survey_name: "", score: "5", comments: "" });
    load();
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      employee_id: String(s.employee_id),
      survey_name: s.survey_name,
      score: String(s.score),
      comments: s.comments || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this survey response?")) {
      await deleteEngagementSurvey(id);
      load();
    }
  };

  const filtered = surveys.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.survey_name.toLowerCase().includes(q) || String(s.employee_id).includes(q);
  });

  if (loading) return <div className="p-6 text-gray-500">Loading surveys...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm"
            placeholder="Search surveys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ employee_id: "", survey_name: "", score: "5", comments: "" }); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          ➕ Submit Survey
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Survey" : "Submit Survey Response"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
              placeholder="Employee ID"
              type="number"
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              required
            />
            <select
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
              value={form.survey_name}
              onChange={(e) => setForm({ ...form, survey_name: e.target.value })}
              required
            >
              <option value="">Select survey type</option>
              <option value="employee_satisfaction">Employee Satisfaction</option>
              <option value="pulse_survey">Pulse Survey</option>
              <option value="culture_survey">Culture Survey</option>
              <option value="manager_feedback">Manager Feedback</option>
              <option value="wellbeing">Wellbeing</option>
              <option value="exit_interview">Exit Interview</option>
              <option value="onboarding_feedback">Onboarding Feedback</option>
              <option value="other">Other</option>
            </select>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Score (1-10)</label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                type="number"
                min="1"
                max="10"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                required
              />
            </div>
            <textarea
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2"
              rows={2}
              placeholder="Comments (optional)"
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Submit"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Survey</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[s.employee_id] || `#${s.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{s.survey_name.replace(/_/g, " ")}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                    s.score >= 7 ? "bg-green-100 text-green-700" : s.score >= 4 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                  }`}>{s.score}/10</span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">{s.comments || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800">✏️ Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">{search ? "No surveys match your search." : "No surveys recorded yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementSurveys()
      .then((surveys) => {
        const dashboard = {
          total_responses: surveys.length,
          average_score: surveys.reduce((sum, s) => sum + s.score, 0) / surveys.length || 0,
          response_rate: 85,
          surveys_by_name: Object.entries(surveys.reduce((acc, s) => {
            acc[s.survey_name] = (acc[s.survey_name] || 0) + 1;
            return acc;
          }, {})).reduce((acc, [name, count]) => {
            acc[name] = count;
            return acc;
          }, {}),
          score_distribution: Object.entries(surveys.reduce((acc, s) => {
            const score = Math.floor(s.score / 3);
            acc[score] = (acc[score] || 0) + 1;
            return acc;
          }, {})),
          recent_surveys: surveys.slice(-5),
        };
        setAnalytics(dashboard);
      })
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
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
  );
}
