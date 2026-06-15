import { useState } from "react";
import { Plus, Edit3, Trash2, X, Check } from "lucide-react";
import { useLeaveTypes } from "../hooks/useLeave";

const initialForm = {
  name: "", code: "", default_days: 10, carry_forward: false,
  min_notice: 1, max_consecutive: 15, requires_approval: true,
};

export default function LeaveTypes() {
  const { data, loading } = useLeaveTypes();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  const openAdd = () => {
    setForm({ ...initialForm });
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name,
      code: item.code,
      default_days: item.default_days,
      carry_forward: item.carry_forward,
      min_notice: item.min_notice,
      max_consecutive: item.max_consecutive,
      requires_approval: item.requires_approval,
    });
    setEditingId(item.id);
    setErrors({});
    setShowModal(true);
  };

  const validate = (d) => {
    const errs = {};
    if (!d.name?.trim()) errs.name = "Required";
    if (!d.code?.trim()) errs.code = "Required";
    if (!d.default_days || d.default_days < 1) errs.default_days = "Must be at least 1";
    if (d.min_notice < 0) errs.min_notice = "Cannot be negative";
    if (d.max_consecutive < 1) errs.max_consecutive = "Must be at least 1";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading leave types...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Types</h1>
          <p className="text-sm text-gray-500 mt-1">Configure leave types and entitlements</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Leave Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <span className="text-xs text-gray-400 uppercase">{item.code}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {item.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Default Days</span>
                <span className="font-medium text-gray-900">{item.default_days}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Carry Forward</span>
                <span className="font-medium text-gray-900">{item.carry_forward ? <Check className="w-4 h-4 text-green-600 inline" /> : <X className="w-4 h-4 text-red-400 inline" />}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min Notice</span>
                <span className="font-medium text-gray-900">{item.min_notice} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Consecutive</span>
                <span className="font-medium text-gray-900">{item.max_consecutive} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requires Approval</span>
                <span className="font-medium text-gray-900">{item.requires_approval ? "Yes" : "No"}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
              <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? "Edit Leave Type" : "Add Leave Type"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.name ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.code ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Days *</label>
                  <input
                    type="number" min="1" value={form.default_days}
                    onChange={(e) => setForm({ ...form, default_days: parseInt(e.target.value) || 0 })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.default_days ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.default_days && <p className="text-xs text-red-500 mt-1">{errors.default_days}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Consecutive *</label>
                  <input
                    type="number" min="1" value={form.max_consecutive}
                    onChange={(e) => setForm({ ...form, max_consecutive: parseInt(e.target.value) || 0 })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.max_consecutive ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.max_consecutive && <p className="text-xs text-red-500 mt-1">{errors.max_consecutive}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Notice (days)</label>
                  <input
                    type="number" min="0" value={form.min_notice}
                    onChange={(e) => setForm({ ...form, min_notice: parseInt(e.target.value) || 0 })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.min_notice ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.min_notice && <p className="text-xs text-red-500 mt-1">{errors.min_notice}</p>}
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox" checked={form.carry_forward}
                      onChange={(e) => setForm({ ...form, carry_forward: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Carry Forward</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={form.requires_approval}
                    onChange={(e) => setForm({ ...form, requires_approval: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Requires Approval</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
