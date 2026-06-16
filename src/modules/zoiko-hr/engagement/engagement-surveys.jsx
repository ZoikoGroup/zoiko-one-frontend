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

export default function EngagementSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ employee_id: "", survey_name: "", score: "5", comments: "" });

  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setSurveys([
        { id: 1, employee_id: 101, employee_name: "Alice Johnson", survey_name: "employee_satisfaction", score: 8, comments: "Great work environment", created_at: "2025-03-15T10:00:00Z" },
        { id: 2, employee_id: 102, employee_name: "Bob Smith", survey_name: "pulse_survey", score: 6, comments: "Could be better", created_at: "2025-03-16T14:30:00Z" },
        { id: 3, employee_id: 103, employee_name: "Carol Davis", survey_name: "culture_survey", score: 9, comments: "Love the team culture", created_at: "2025-03-17T09:15:00Z" },
        { id: 4, employee_id: 104, employee_name: "David Lee", survey_name: "manager_feedback", score: 4, comments: "Needs improvement", created_at: "2025-03-18T11:45:00Z" },
      ]);
      setLoading(false);
    }, 300);
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
      setSurveys((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...payload } : s)));
    } else {
      const newSurvey = {
        id: Date.now(),
        ...payload,
        employee_name: "New Employee",
        created_at: new Date().toISOString(),
      };
      setSurveys((prev) => [newSurvey, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ employee_id: "", survey_name: "", score: "5", comments: "" });
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

  const handleDelete = (id) => {
    if (confirm("Delete this survey response?")) {
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filtered = surveys.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.survey_name.toLowerCase().includes(q) || String(s.employee_id).includes(q);
  });

  if (loading) return <div className="p-6 text-gray-500">Loading surveys...</div>;

  return (
    <HRPage title="Employee Engagement" subtitle="Survey management, engagement metrics, and feedback tracking">
      <SubNav />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
            <p className="text-sm text-gray-500 mt-1">Manage survey submissions and responses</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ employee_id: "", survey_name: "", score: "5", comments: "" }); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
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
              <button type="submit" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">{editing ? "Update" : "Submit"}</button>
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
                  <td className="px-4 py-4 text-sm text-gray-900">{s.employee_name || `#${s.employee_id}`}</td>
                  <td className="px-4 py-4 text-sm capitalize text-gray-700">{s.survey_name.replace(/_/g, " ")}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      s.score >= 7 ? "bg-green-100 text-green-700" : s.score >= 4 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                    }`}>{s.score}/10</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">{s.comments || "—"}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-4 text-sm space-x-2">
                    <button onClick={() => handleEdit(s)} className="text-orange-600 hover:text-orange-800">✏️ Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {search ? "No surveys match your search." : "No surveys recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
