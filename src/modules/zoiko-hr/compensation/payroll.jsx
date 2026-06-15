import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const STATUS_COLORS = {
  processed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
};

const STATUS_OPTIONS = [
  { value: "processed", label: "Processed" },
  { value: "pending", label: "Pending" },
  { value: "draft", label: "Draft" },
];

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  month: "",
  year: "",
  basic: "",
  allowances: "",
  deductions: "",
  status: "draft",
};

const mockPayroll = [
  { id: 1, employee_id: 1, month: "June", year: 2026, basic: 50000, allowances: 25000, deductions: 12000, net_pay: 63000, status: "processed", processed_date: "2026-06-01" },
  { id: 2, employee_id: 2, month: "June", year: 2026, basic: 70000, allowances: 35000, deductions: 18000, net_pay: 87000, status: "pending", processed_date: null },
  { id: 3, employee_id: 3, month: "June", year: 2026, basic: 45000, allowances: 15000, deductions: 8000, net_pay: 52000, status: "draft", processed_date: null },
];

export default function ZoikOHRPayroll() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [editForm, setEditForm] = useState({ ...initialForm });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setItems([...mockPayroll]);
    } catch (err) {
      setError(err.message || "Failed to load payroll data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const stats = useMemo(() => {
    const totalPayroll = items.reduce((s, i) => s + (parseFloat(i.net_pay) || 0), 0);
    const avgNetPay = items.length > 0 ? totalPayroll / items.length : 0;
    return { totalPayroll, avgNetPay };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          String(i.employee_id).includes(q) ||
          i.month?.toLowerCase().includes(q) ||
          String(i.year).includes(q) ||
          i.status?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (monthFilter) {
      result = result.filter((i) => i.month === monthFilter);
    }
    if (yearFilter) {
      result = result.filter((i) => String(i.year) === yearFilter);
    }
    return result;
  }, [items, search, statusFilter, monthFilter, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => setFormData({ ...initialForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.employee_id) errors.employee_id = "Employee ID is required";
    if (!data.month) errors.month = "Month is required";
    if (!data.year) errors.year = "Year is required";
    if (!data.basic || isNaN(parseFloat(data.basic))) errors.basic = "Valid basic salary is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const basic = parseFloat(formData.basic);
      const allowances = parseFloat(formData.allowances) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      const newItem = {
        id: Math.max(0, ...items.map((i) => i.id)) + 1,
        employee_id: parseInt(formData.employee_id),
        month: formData.month,
        year: parseInt(formData.year),
        basic,
        allowances,
        deductions,
        net_pay: basic + allowances - deductions,
        status: formData.status,
        processed_date: formData.status === "processed" ? new Date().toISOString().slice(0, 10) : null,
      };
      setItems((prev) => [...prev, newItem]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: String(item.employee_id || ""),
      month: item.month || "",
      year: String(item.year || ""),
      basic: item.basic || "",
      allowances: item.allowances || "",
      deductions: item.deductions || "",
      status: item.status || "draft",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    const errors = validateForm(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const basic = parseFloat(editForm.basic);
      const allowances = parseFloat(editForm.allowances) || 0;
      const deductions = parseFloat(editForm.deductions) || 0;
      setItems((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? {
                ...i,
                employee_id: parseInt(editForm.employee_id),
                month: editForm.month,
                year: parseInt(editForm.year),
                basic,
                allowances,
                deductions,
                net_pay: basic + allowances - deductions,
                status: editForm.status,
                processed_date: editForm.status === "processed" && !i.processed_date ? new Date().toISOString().slice(0, 10) : i.processed_date,
              }
            : i
        )
      );
      setShowEditModal(false);
      setEditItem(null);
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll entry?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const openDetailModal = (item) => {
    setDetailItem(item);
    setShowDetailModal(true);
  };

  if (loading && items.length === 0) {
    return (
      <HRPage title="Payroll Integration" subtitle="Manage payroll processing, payslips, and salary disbursement.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading payroll data...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Payroll Integration" subtitle="Manage payroll processing, payslips, and salary disbursement.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {formErrors.submit && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{formErrors.submit}</div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Payroll: </span>
              <span className="font-bold text-gray-800">${stats.totalPayroll.toLocaleString()}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Avg Net Pay: </span>
              <span className="font-bold text-purple-600">${stats.avgNetPay.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Payroll Entry
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by employee, month, or status..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No payroll entries yet. Add your first entry to get started."
                : "No entries match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Month/Year</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Basic</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Allowances</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Deductions</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Net Pay</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Processed Date</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">#{i.employee_id}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <button
                            onClick={() => openDetailModal(i)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {i.month} {i.year}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(i.basic).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(i.allowances).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(i.deductions).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">${parseFloat(i.net_pay).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[i.status] || STATUS_COLORS.draft}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{i.processed_date || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(i)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(i.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <h2 className="text-lg font-bold text-gray-800">Add Payroll Entry</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="number"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className={`w-full border ${formErrors.month ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select month</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {formErrors.month && <p className="text-red-500 text-xs mt-1">{formErrors.month}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className={`w-full border ${formErrors.year ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select year</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                  {formErrors.year && <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basic}
                  onChange={(e) => setFormData({ ...formData, basic: e.target.value })}
                  className={`w-full border ${formErrors.basic ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.basic && <p className="text-red-500 text-xs mt-1">{formErrors.basic}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Update Payroll Entry</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.month} {editItem.year}</span> (Employee #{editItem.employee_id})
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="number"
                  value={editForm.employee_id}
                  onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })}
                  className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
                  <select
                    value={editForm.month}
                    onChange={(e) => setEditForm({ ...editForm, month: e.target.value })}
                    className={`w-full border ${formErrors.month ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select month</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {formErrors.month && <p className="text-red-500 text-xs mt-1">{formErrors.month}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className={`w-full border ${formErrors.year ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select year</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                  {formErrors.year && <p className="text-red-500 text-xs mt-1">{formErrors.year}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.basic}
                  onChange={(e) => setEditForm({ ...editForm, basic: e.target.value })}
                  className={`w-full border ${formErrors.basic ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.basic && <p className="text-red-500 text-xs mt-1">{formErrors.basic}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.allowances}
                    onChange={(e) => setEditForm({ ...editForm, allowances: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.deductions}
                    onChange={(e) => setEditForm({ ...editForm, deductions: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Payslip Breakdown</h2>
              <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Payslip</h3>
                <p className="text-sm text-gray-500">{detailItem.month} {detailItem.year} - Employee #{detailItem.employee_id}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Basic Salary</span>
                  <span className="font-medium text-gray-900">${parseFloat(detailItem.basic).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Allowances</span>
                  <span className="font-medium text-green-600">+${parseFloat(detailItem.allowances).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deductions</span>
                  <span className="font-medium text-red-600">-${parseFloat(detailItem.deductions).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-gray-800">Net Pay</span>
                  <span className="text-blue-600">${parseFloat(detailItem.net_pay).toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[detailItem.status] || STATUS_COLORS.draft}`}>
                    {detailItem.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processed Date</span>
                  <span>{detailItem.processed_date || <span className="text-gray-300">Not processed</span>}</span>
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
