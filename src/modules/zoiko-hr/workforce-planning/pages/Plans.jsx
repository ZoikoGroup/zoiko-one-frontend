import { useState, useMemo } from "react";
import { Plus, Search, Eye, Edit3, Trash2, X } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useWorkforcePlans } from "../hooks/useWorkforce";
import { formatCurrency, formatDate } from "../utils/helpers";

const ITEMS_PER_PAGE = 10;

const emptyForm = {
  title: "", department: "", year: new Date().getFullYear(),
  headcount: "", targetHeadcount: "", budget: "", status: "draft", description: "",
};

export default function WorkforcePlans() {
  const { data: plans, loading } = useWorkforcePlans();
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  const filtered = useMemo(() => {
    let r = plans;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((p) => p.title.toLowerCase().includes(q) || p.department.toLowerCase().includes(q));
    }
    if (yearFilter) r = r.filter((p) => String(p.year) === yearFilter);
    if (statusFilter) r = r.filter((p) => p.status === statusFilter);
    return r;
  }, [plans, search, yearFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: plans.length,
    active: plans.filter((p) => p.status === "active").length,
    totalBudget: plans.reduce((s, p) => s + (p.budget || 0), 0),
    totalTarget: plans.reduce((s, p) => s + (p.targetHeadcount || 0), 0),
  }), [plans]);

  const validate = (d) => {
    const e = {};
    if (!d.title) e.title = "Title is required";
    if (!d.department) e.department = "Department is required";
    if (!d.headcount || isNaN(Number(d.headcount))) e.headcount = "Valid headcount required";
    if (!d.budget || isNaN(Number(d.budget))) e.budget = "Valid budget required";
    return e;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setShowCreate(false);
    setForm({ ...emptyForm });
    setFormErrors({});
  };

  const openDetail = (plan) => { setDetailItem(plan); setShowDetail(true); };

  const columns = [
    { key: "title", label: "Plan", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    { key: "headcount", label: "Headcount", render: (v, r) => `${v}/${r.targetHeadcount}` },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    {
      key: "actions", label: "", render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); openDetail(row); }} className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye className="w-4 h-4 text-gray-500" /></button>
          <button onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-gray-100 rounded" title="Edit"><Edit3 className="w-4 h-4 text-gray-500" /></button>
          <button onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading plans...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workforce Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage workforce plans</p>
        </div>
        <button onClick={() => { setForm({ ...emptyForm }); setShowCreate(true); }} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Plans" value={stats.total} />
        <StatsCard title="Active Plans" value={stats.active} />
        <StatsCard title="Total Budget" value={formatCurrency(stats.totalBudget)} />
        <StatsCard title="Target Headcount" value={stats.totalTarget} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search plans..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
        </div>
        <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
          <option value="">All Years</option>
          {[...new Set(plans.map((p) => p.year))].sort().map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <DataTable columns={columns} data={paginated} onRowClick={openDetail} />

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-teal-600 text-white border-teal-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Create Workforce Plan</h2>
              <button onClick={() => { setShowCreate(false); setFormErrors({}); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`w-full border ${formErrors.title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500`} />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={`w-full border ${formErrors.department ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500`} />
                  {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Headcount *</label>
                  <input type="number" value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} className={`w-full border ${formErrors.headcount ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500`} />
                  {formErrors.headcount && <p className="text-red-500 text-xs mt-1">{formErrors.headcount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Headcount</label>
                  <input type="number" value={form.targetHeadcount} onChange={(e) => setForm({ ...form, targetHeadcount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget *</label>
                  <input type="number" step="0.01" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={`w-full border ${formErrors.budget ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500`} />
                  {formErrors.budget && <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="draft">Draft</option>
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreate(false); setFormErrors({}); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Create Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Plan Details</h2>
              <button onClick={() => { setShowDetail(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plan ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{detailItem.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                  <p className="text-sm text-gray-900">{detailItem.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{detailItem.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
                  <p className="text-sm text-gray-900 font-mono">{detailItem.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Headcount</label>
                  <p className="text-sm text-gray-900">{detailItem.headcount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Target Headcount</label>
                  <p className="text-sm text-gray-900">{detailItem.targetHeadcount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Budget</label>
                  <p className="text-sm text-gray-900">{formatCurrency(detailItem.budget)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <StatusBadge status={detailItem.status} />
                </div>
              </div>
              {detailItem.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-sm text-gray-700">{detailItem.description}</p>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Metadata</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Created by: {detailItem.createdBy}</div>
                  <div>Created: {formatDate(detailItem.createdDate)}</div>
                  {detailItem.notes && <div>Notes: {detailItem.notes}</div>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => { setShowDetail(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
