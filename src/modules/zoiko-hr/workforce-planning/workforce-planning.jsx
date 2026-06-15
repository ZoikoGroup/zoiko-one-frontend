import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getWorkforcePlans,
  createWorkforcePlan,
  getWorkforceSummary,
} from "../../../service/hrService";

const STATUS_COLORS = {
  planned: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};

const ITEMS_PER_PAGE = 10;

const initialPlanForm = {
  department_id: "",
  year: new Date().getFullYear(),
  headcount_target: "",
  current_headcount: "",
  vacancies: "",
  budget: "",
  status: "planned",
};

export default function WorkforcePlanning() {
  const [plans, setPlans] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ ...initialPlanForm });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWorkforcePlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load workforce plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await getWorkforceSummary();
      setSummary(data);
    } catch (err) {
      console.error("Failed to load workforce summary:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSummary();
  }, []);

  const stats = useMemo(() => {
    const total = plans.length;
    const active = plans.filter((p) => p.status === "active").length;
    const planned = plans.filter((p) => p.status === "planned").length;
    const onHold = plans.filter((p) => p.status === "on_hold").length;
    const totalHeadcount = plans.reduce((sum, p) => sum + (p.current_headcount || 0), 0);
    const totalTarget = plans.reduce((sum, p) => sum + (p.headcount_target || 0), 0);
    const totalBudget = plans.reduce((sum, p) => sum + (p.budget || 0), 0);
    const utilizationRate = totalTarget > 0 ? (totalHeadcount / totalTarget * 100) : 0;

    return {
      total,
      active,
      planned,
      onHold,
      totalHeadcount,
      totalTarget,
      totalBudget,
      utilizationRate,
    };
  }, [plans]);

  const filtered = useMemo(() => {
    let result = plans;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.department_name?.toLowerCase().includes(q) ||
          p.year?.toString().includes(q)
      );
    }
    if (yearFilter) {
      result = result.filter((p) => p.year === parseInt(yearFilter));
    }
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    return result;
  }, [plans, search, yearFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => setFormData({ ...initialPlanForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.department_id) errors.department_id = "Department is required";
    if (!data.year) errors.year = "Year is required";
    if (!data.headcount_target) errors.headcount_target = "Headcount target is required";
    if (data.headcount_target && (isNaN(Number(data.headcount_target)) || Number(data.headcount_target) < 0))
      errors.headcount_target = "Must be a valid positive number";
    if (!data.budget) errors.budget = "Budget is required";
    if (data.budget && (isNaN(Number(data.budget)) || Number(data.budget) < 0))
      errors.budget = "Must be a valid positive number";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      await createWorkforcePlan({
        department_id: parseInt(formData.department_id),
        year: parseInt(formData.year),
        headcount_target: parseInt(formData.headcount_target),
        current_headcount: parseInt(formData.current_headcount) || 0,
        vacancies: parseInt(formData.vacancies) || 0,
        budget: parseFloat(formData.budget),
        status: formData.status,
      });
      setShowCreateModal(false);
      resetForm();
      await fetchPlans();
      await fetchSummary();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create workforce plan" });
    } finally {
      setSubmitting(false);
    }
  };

  const openDetailModal = (plan) => {
    setDetailItem(plan);
    setShowDetailModal(true);
  };

  if (loading && plans.length === 0) {
    return (
      <HRPage title="Workforce Structure Planning" subtitle="Forecast headcount limits, review upcoming department allocations, and handle budget approvals.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading workforce plans...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Workforce Structure Planning" subtitle="Forecast headcount limits, review upcoming department allocations, and handle budget approvals.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {formErrors?.submit && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{formErrors.submit}</div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Plans: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Active: </span>
              <span className="font-bold text-blue-600">{stats.active}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Planned: </span>
              <span className="font-bold text-green-600">{stats.planned}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Utilization: </span>
              <span className="font-bold text-purple-600">{stats.utilizationRate.toFixed(1)}%</span>
            </div>
            <div className="bg-white px-4 py-2 border border-orange-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Budget: </span>
              <span className="font-bold text-orange-600">${stats.totalBudget.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Workforce Plan
          </button>
        </div>

        {plans.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by department or year..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-gray-500 font-medium">
              {plans.length === 0
                ? "No workforce plans yet. Add your first plan to get started."
                : "No workforce plans match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm truncate">{p.department_name}</h3>
                      <p className="text-xs text-gray-500 font-mono">{p.year}</p>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || STATUS_COLORS.planned}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-medium">{p.headcount_target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span className="font-medium">{p.current_headcount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vacancies:</span>
                      <span className="font-medium">{p.vacancies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">${parseFloat(p.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilization:</span>
                      <span className="font-medium">{(p.current_headcount / p.headcount_target * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => openDetailModal(p)}
                      className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-1.5 rounded text-xs transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => { resetForm(); setFormData({ ...initialPlanForm, department_id: p.department_id.toString(), year: p.year, headcount_target: p.headcount_target.toString(), current_headcount: p.current_headcount.toString(), vacancies: p.vacancies.toString(), budget: p.budget.toString(), status: "active" }); setShowCreateModal(true); }}
                      className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1.5 rounded text-xs transition-colors"
                    >
                      Edit Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        p === safePage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add Workforce Plan</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input
                  type="number"
                  placeholder="Department ID"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className={`w-full border ${formErrors?.department_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors?.department_id && <p className="text-red-500 text-xs mt-1">{formErrors.department_id}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="number"
                    min="2024"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className={`w-full border ${formErrors?.year ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors?.year && <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headcount Target *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.headcount_target}
                    onChange={(e) => setFormData({ ...formData, headcount_target: e.target.value })}
                    className={`w-full border ${formErrors?.headcount_target ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors?.headcount_target && <p className="text-red-500 text-xs mt-1">{formErrors.headcount_target}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Headcount</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_headcount}
                    onChange={(e) => setFormData({ ...formData, current_headcount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className={`w-full border ${formErrors?.budget ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors?.budget && <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Workforce Plan Details</h2>
              <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plan ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{detailItem.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{detailItem.department_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
                  <p className="text-sm text-gray-900 font-mono">{detailItem.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[detailItem.status] || STATUS_COLORS.planned}`}>
                    {detailItem.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Headcount Target</label>
                  <p className="text-sm text-gray-900">{detailItem.headcount_target}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Headcount</label>
                  <p className="text-sm text-gray-900">{detailItem.current_headcount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Vacancies</label>
                  <p className="text-sm text-gray-900">{detailItem.vacancies}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Budget</label>
                  <p className="text-sm text-gray-900">${parseFloat(detailItem.budget).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Utilization Rate</label>
                  <p className="text-sm text-gray-900">{(detailItem.current_headcount / detailItem.headcount_target * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Created: {detailItem.created_at ? new Date(detailItem.created_at).toLocaleString() : <span className="text-gray-400">-</span>}</div>
                  <div>Updated: {detailItem.updated_at ? new Date(detailItem.updated_at).toLocaleString() : <span className="text-gray-400">-</span>}</div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HRPage>
  );
}
