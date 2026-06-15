import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getPerformanceDashboard,
  getReviewCycles, createReviewCycle, updateReviewCycle, deleteReviewCycle,
  getPerformanceGoals, createPerformanceGoal, updatePerformanceGoal, deletePerformanceGoal,
  getPerformanceKpis, createPerformanceKpi, updatePerformanceKpi, deletePerformanceKpi,
  getPerformanceReviews, createPerformanceReview, updatePerformanceReview, deletePerformanceReview,
  getPeerFeedback, createPeerFeedback, deletePeerFeedback,
  getImprovementPlans, createImprovementPlan, updateImprovementPlan, deleteImprovementPlan,
} from "../../../service/hrService";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "cycles", label: "Cycles" },
  { key: "reviews", label: "Reviews" },
  { key: "goals", label: "Goals" },
  { key: "kpis", label: "KPIs" },
  { key: "feedback", label: "Feedback" },
  { key: "pips", label: "Improvement Plans" },
];

const REVIEW_STEP_COLORS = {
  pending: "bg-gray-100 text-gray-700",
  self_review: "bg-purple-100 text-purple-700",
  manager_review: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const GOAL_STATUS_COLORS = {
  not_started: "bg-gray-100 text-gray-600",
  on_track: "bg-green-100 text-green-700",
  at_risk: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-400",
};

const PIP_STATUS_COLORS = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

const ITEMS_PER_PAGE = 8;

const emptyReview = { employee_id: "", reviewer_id: "", cycle_id: "", cycle: "", rating: "", self_rating: "", manager_rating: "", comments: "", self_comments: "", manager_comments: "" };
const emptyGoal = { employee_id: "", title: "", description: "", category: "", target_value: "", current_value: "", deadline: "" };
const emptyKpi = { employee_id: "", name: "", target: "", actual: "", weight: "", period: "monthly" };
const emptyCycle = { name: "", start_date: "", end_date: "", status: "draft" };
const emptyFeedback = { employee_id: "", reviewer_id: "", review_id: "", category: "", comments: "", rating: "" };
const emptyPip = { employee_id: "", review_id: "", title: "", description: "", actions: "", target_date: "" };

export default function Performance() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <HRPage title="Performance Management" subtitle="Goals, reviews, KPIs, feedback, and improvement plans.">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "cycles" && <CyclesTab />}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "goals" && <GoalsTab />}
      {activeTab === "kpis" && <KpisTab />}
      {activeTab === "feedback" && <FeedbackTab />}
      {activeTab === "pips" && <PipsTab />}
    </HRPage>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPerformanceDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{error}</div>;
  if (!stats) return <div className="text-gray-400 py-8 text-center">No data available.</div>;

  const cards = [
    { label: "Total Reviews", value: stats.total_reviews, color: "text-blue-600" },
    { label: "Pending", value: stats.pending_reviews, color: "text-gray-500" },
    { label: "Self Review", value: stats.self_reviews, color: "text-purple-600" },
    { label: "Manager Review", value: stats.manager_reviews, color: "text-blue-600" },
    { label: "Completed", value: stats.completed_reviews, color: "text-green-600" },
    { label: "Total Goals", value: stats.total_goals, color: "text-indigo-600" },
    { label: "Goals Done", value: stats.completed_goals, color: "text-green-600" },
    { label: "Total KPIs", value: stats.total_kpis, color: "text-teal-600" },
    { label: "Open PIPs", value: stats.open_pips, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      {stats.active_review_cycle && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-sm">
          <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Active Review Cycle</p>
          <p className="text-xl font-bold mt-1">{stats.active_review_cycle}</p>
          <p className="text-sm opacity-90 mt-1">Avg Rating: {stats.avg_rating ?? "N/A"} / 5</p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
      {stats.avg_rating && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">Average Rating</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${(stats.avg_rating / 5) * 100}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-800">{stats.avg_rating}/5</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CyclesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyCycle });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getReviewCycles()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => { setForm({ ...emptyCycle }); setEditId(null); setError(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, start_date: item.start_date || "", end_date: item.end_date || "", status: item.status });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.start_date || !form.end_date) return;
    setSubmitting(true);
    try {
      const payload = { name: form.name, start_date: form.start_date, end_date: form.end_date, status: form.status };
      if (editId) await updateReviewCycle(editId, payload);
      else await createReviewCycle(payload);
      setShowModal(false);
      resetForm();
      fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review cycle?")) return;
    try { await deleteReviewCycle(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex justify-end">
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Cycle</button>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">No review cycles yet.</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Start</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">End</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === "active" ? "bg-green-100 text-green-700" : c.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.start_date}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.end_date}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit Cycle" : "New Cycle"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start *</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End *</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyReview });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true);
    setError(null);
    getPerformanceReviews()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => String(x.employee_id).includes(q) || x.cycle?.toLowerCase().includes(q)); }
    if (statusFilter) r = r.filter((x) => x.status === statusFilter);
    return r;
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyReview }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      employee_id: String(item.employee_id),
      reviewer_id: item.reviewer_id ? String(item.reviewer_id) : "",
      cycle_id: item.cycle_id ? String(item.cycle_id) : "",
      cycle: item.cycle,
      rating: item.rating ?? "",
      self_rating: item.self_rating ?? "",
      manager_rating: item.manager_rating ?? "",
      comments: item.comments || "",
      self_comments: item.self_comments || "",
      manager_comments: item.manager_comments || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        reviewer_id: form.reviewer_id ? Number(form.reviewer_id) : null,
        cycle_id: form.cycle_id ? Number(form.cycle_id) : null,
        cycle: form.cycle || "Q",
        rating: form.rating ? Number(form.rating) : null,
        self_rating: form.self_rating ? Number(form.self_rating) : null,
        manager_rating: form.manager_rating ? Number(form.manager_rating) : null,
        comments: form.comments || null,
        self_comments: form.self_comments || null,
        manager_comments: form.manager_comments || null,
      };
      if (editId) await updatePerformanceReview(editId, payload);
      else await createPerformanceReview(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updatePerformanceReview(id, { status }); fetch(); }
    catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try { await deletePerformanceReview(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const stepOptions = ["pending", "self_review", "manager_review", "completed"];
  const nextSteps = (current) => { const idx = stepOptions.indexOf(current); return idx >= 0 && idx < stepOptions.length - 1 ? [stepOptions[idx + 1]] : []; };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3">
          <input type="text" placeholder="Search by employee/cycle..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            {stepOptions.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Review</button>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">{items.length === 0 ? "No reviews yet." : "No matches."}</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Reviewer</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Cycle</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Rating</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Self</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Mgr</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{r.employee_id}</td>
                  <td className="px-3 py-3 text-gray-500">{r.reviewer_id || "-"}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{r.cycle}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${REVIEW_STEP_COLORS[r.status] || ""}`}>{r.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-medium">{r.rating ?? "-"}</td>
                  <td className="px-3 py-3 text-center">{r.self_rating ?? "-"}</td>
                  <td className="px-3 py-3 text-center">{r.manager_rating ?? "-"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                      {nextSteps(r.status).map((ns) => (
                        <button key={ns} onClick={() => handleStatusChange(r.id, ns)} className="text-green-600 hover:text-green-800 text-xs px-1 font-medium">
                          {ns === "self_review" ? "Self Review" : ns === "manager_review" ? "Mgr Review" : ns === "completed" ? "Complete" : ns}
                        </button>
                      ))}
                      <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit Review" : "New Review"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer ID</label>
                  <input type="number" min="1" value={form.reviewer_id} onChange={(e) => setForm({ ...form, reviewer_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cycle</label>
                  <input type="text" value={form.cycle} placeholder="e.g. Q3 2026" onChange={(e) => setForm({ ...form, cycle: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Self Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.self_rating} onChange={(e) => setForm({ ...form, self_rating: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.manager_rating} onChange={(e) => setForm({ ...form, manager_rating: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                <textarea rows={2} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Self Comments</label>
                  <textarea rows={2} value={form.self_comments} onChange={(e) => setForm({ ...form, self_comments: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager Comments</label>
                  <textarea rows={2} value={form.manager_comments} onChange={(e) => setForm({ ...form, manager_comments: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyGoal });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getPerformanceGoals()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const categories = useMemo(() => [...new Set(items.map((g) => g.category).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.title?.toLowerCase().includes(q)); }
    if (catFilter) r = r.filter((x) => x.category === catFilter);
    return r;
  }, [items, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyGoal }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      employee_id: String(item.employee_id),
      title: item.title,
      description: item.description || "",
      category: item.category || "",
      target_value: item.target_value || "",
      current_value: item.current_value || "",
      deadline: item.deadline || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        target_value: form.target_value || null,
        current_value: form.current_value || null,
        deadline: form.deadline || null,
      };
      if (editId) await updatePerformanceGoal(editId, payload);
      else await createPerformanceGoal(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updatePerformanceGoal(id, { status }); fetch(); }
    catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try { await deletePerformanceGoal(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const goalStatuses = ["not_started", "on_track", "at_risk", "completed", "cancelled"];

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3">
          <input type="text" placeholder="Search goals..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Goal</button>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">{items.length === 0 ? "No goals yet." : "No matches."}</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Progress</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Deadline</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{g.title}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{g.category || "-"}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${GOAL_STATUS_COLORS[g.status] || ""}`}>{g.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-600">
                    {g.target_value ? `${g.current_value || "0"}/${g.target_value}` : "-"}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{g.deadline || "-"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button onClick={() => openEdit(g)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                      {g.status !== "completed" && g.status !== "cancelled" && (
                        <button onClick={() => handleStatusChange(g.id, "completed")} className="text-green-600 hover:text-green-800 text-xs px-1 font-medium">Done</button>
                      )}
                      {g.status === "on_track" && (
                        <button onClick={() => handleStatusChange(g.id, "at_risk")} className="text-red-500 hover:text-red-700 text-xs px-1">Flag</button>
                      )}
                      {g.status === "not_started" && (
                        <button onClick={() => handleStatusChange(g.id, "on_track")} className="text-green-600 hover:text-green-800 text-xs px-1">Start</button>
                      )}
                      <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit Goal" : "New Goal"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input type="text" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current</label>
                  <input type="text" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KpisTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyKpi });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getPerformanceKpis()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.name?.toLowerCase().includes(q)); }
    if (periodFilter) r = r.filter((x) => x.period === periodFilter);
    return r;
  }, [items, search, periodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyKpi }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      employee_id: String(item.employee_id),
      name: item.name,
      target: String(item.target),
      actual: item.actual ? String(item.actual) : "",
      weight: item.weight ? String(item.weight) : "",
      period: item.period,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.target) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        name: form.name,
        target: Number(form.target),
        actual: form.actual ? Number(form.actual) : null,
        weight: form.weight ? Number(form.weight) : null,
        period: form.period,
      };
      if (editId) await updatePerformanceKpi(editId, payload);
      else await createPerformanceKpi(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this KPI?")) return;
    try { await deletePerformanceKpi(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3">
          <input type="text" placeholder="Search KPIs..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={periodFilter} onChange={(e) => { setPeriodFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Periods</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New KPI</button>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">{items.length === 0 ? "No KPIs yet." : "No matches."}</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Period</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Target</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Actual</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Achv %</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Weight</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((k) => {
                const pct = k.target > 0 ? Math.round((k.actual || 0) / k.target * 100) : 0;
                return (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-gray-800">{k.name}</td>
                    <td className="px-3 py-3 text-xs text-gray-500">{k.period}</td>
                    <td className="px-3 py-3 text-center">{k.target}</td>
                    <td className="px-3 py-3 text-center">{k.actual ?? "-"}</td>
                    <td className="px-3 py-3 text-center">
                      {k.actual != null ? (
                        <span className={`text-xs font-medium ${pct >= 100 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-600"}`}>{pct}%</span>
                      ) : "-"}
                    </td>
                    <td className="px-3 py-3 text-center text-xs">{k.weight ?? "-"}</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => openEdit(k)} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                      <button onClick={() => handleDelete(k.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit KPI" : "New KPI"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
                  <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target *</label>
                  <input type="number" step="0.01" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual</label>
                  <input type="number" step="0.01" value={form.actual} onChange={(e) => setForm({ ...form, actual: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input type="number" min="1" max="100" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyFeedback });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getPeerFeedback()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.reviewer_id || !form.rating) return;
    setSubmitting(true);
    try {
      await createPeerFeedback({
        employee_id: Number(form.employee_id),
        reviewer_id: Number(form.reviewer_id),
        review_id: form.review_id ? Number(form.review_id) : null,
        category: form.category || null,
        comments: form.comments || null,
        rating: Number(form.rating),
      });
      setShowModal(false);
      setForm({ ...emptyFeedback });
      fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try { await deletePeerFeedback(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex justify-end">
        <button onClick={() => { setForm({ ...emptyFeedback }); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New Feedback</button>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">No peer feedback yet.</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Reviewer</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Rating</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Comments</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{f.employee_id}</td>
                  <td className="px-3 py-3 text-gray-500">{f.reviewer_id}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{f.category || "-"}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-bold text-blue-600">{f.rating}/5</span>
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs max-w-xs truncate">{f.comments || "-"}</td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">New Peer Feedback</h2>
              <button onClick={() => { setShowModal(false); setForm({ ...emptyFeedback }); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer ID *</label>
                  <input type="number" min="1" value={form.reviewer_id} onChange={(e) => setForm({ ...form, reviewer_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category} placeholder="e.g. teamwork" onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review ID</label>
                  <input type="number" min="1" value={form.review_id} onChange={(e) => setForm({ ...form, review_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                <textarea rows={2} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setForm({ ...emptyFeedback }); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PipsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyPip });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getImprovementPlans()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.title?.toLowerCase().includes(q)); }
    if (statusFilter) r = r.filter((x) => x.status === statusFilter);
    return r;
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyPip }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      employee_id: String(item.employee_id),
      review_id: item.review_id ? String(item.review_id) : "",
      title: item.title,
      description: item.description || "",
      actions: item.actions || "",
      target_date: item.target_date || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        review_id: form.review_id ? Number(form.review_id) : null,
        title: form.title,
        description: form.description || null,
        actions: form.actions || null,
        target_date: form.target_date || null,
      };
      if (editId) await updateImprovementPlan(editId, payload);
      else await createImprovementPlan(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateImprovementPlan(id, { status }); fetch(); }
    catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this improvement plan?")) return;
    try { await deleteImprovementPlan(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const pipStatuses = ["open", "in_progress", "completed", "closed"];
  const pipNext = (current) => {
    const idx = pipStatuses.indexOf(current);
    if (idx >= 0 && idx < pipStatuses.length - 1) return [{ status: pipStatuses[idx + 1], label: pipStatuses[idx + 1].replace("_", " ") }];
    return [];
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{error}</span><button onClick={() => setError(null)} className="font-bold">&times;</button></div>}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3">
          <input type="text" placeholder="Search PIPs..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            {pipStatuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">+ New PIP</button>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"><p className="text-gray-500">{items.length === 0 ? "No improvement plans yet." : "No matches."}</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Target Date</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Actions</th>
                <th className="text-right px-3 py-3 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-3 py-3 text-gray-500">{p.employee_id}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PIP_STATUS_COLORS[p.status] || ""}`}>{p.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{p.target_date || "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                      {pipNext(p.status).map((ns) => (
                        <button key={ns.status} onClick={() => handleStatusChange(p.id, ns.status)} className="text-green-600 hover:text-green-800 text-xs px-1 font-medium">{ns.label}</button>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit PIP" : "New Improvement Plan"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review ID</label>
                  <input type="number" min="1" value={form.review_id} onChange={(e) => setForm({ ...form, review_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                <textarea rows={2} value={form.actions} onChange={(e) => setForm({ ...form, actions: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
