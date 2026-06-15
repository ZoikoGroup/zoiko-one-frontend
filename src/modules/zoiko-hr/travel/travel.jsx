import React, { useState, useEffect, useMemo } from 'react';
import HRPage from '../../../components/HRPage';
import {
  getTravel,
  getTravelById,
  createTravel,
  updateTravel,
  deleteTravel,
} from '../../../service/hrService';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

const ITEMS_PER_PAGE = 10;

const initialForm = {
  employee_id: '',
  destination: '',
  purpose: '',
  start_date: '',
  end_date: '',
};

export default function Travel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const [editData, setEditData] = useState({
    destination: '',
    purpose: '',
    start_date: '',
    end_date: '',
    status: 'pending',
  });

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTravel();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load travel requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    let result = requests;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.destination?.toLowerCase().includes(q) ||
          r.purpose?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }
    return result;
  }, [requests, search, statusFilter]);

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

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id) errors.employee_id = 'Employee ID is required';
    else if (isNaN(Number(formData.employee_id)) || Number(formData.employee_id) <= 0)
      errors.employee_id = 'Must be a valid employee ID';
    if (!formData.destination.trim()) errors.destination = 'Destination is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date)
      errors.end_date = 'End date must be after start date';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await createTravel({
        employee_id: Number(formData.employee_id),
        destination: formData.destination.trim(),
        purpose: formData.purpose.trim() || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
      });
      setShowCreateModal(false);
      resetForm();
      await fetchRequests();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to create travel request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    setSubmitting(true);
    try {
      const payload = {};
      if (editData.destination !== editItem.destination) payload.destination = editData.destination;
      if (editData.purpose !== (editItem.purpose || '')) payload.purpose = editData.purpose || null;
      if (editData.start_date !== editItem.start_date) payload.start_date = editData.start_date;
      if (editData.end_date !== editItem.end_date) payload.end_date = editData.end_date;
      if (editData.status !== editItem.status) payload.status = editData.status;

      if (Object.keys(payload).length > 0) {
        await updateTravel(editItem.id, payload);
      }
      setShowEditModal(false);
      setEditItem(null);
      await fetchRequests();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to update travel request' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this travel request?')) return;
    try {
      await deleteTravel(id);
      await fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to delete travel request');
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditData({
      destination: item.destination || '',
      purpose: item.purpose || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      status: item.status || 'pending',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const approved = requests.filter((r) => r.status === 'approved').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    return { total, pending, approved, rejected, completed };
  }, [requests]);

  if (loading && requests.length === 0) {
    return (
      <HRPage title="Travel & Expense" subtitle="Authorize travel workflows and manage corporate travel.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading travel requests...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Travel & Expense" subtitle="Authorize travel workflows and manage corporate travel.">
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
              <span className="text-gray-400">Total: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-yellow-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Pending: </span>
              <span className="font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Approved: </span>
              <span className="font-bold text-green-600">{stats.approved}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-red-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Rejected: </span>
              <span className="font-bold text-red-600">{stats.rejected}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Completed: </span>
              <span className="font-bold text-blue-600">{stats.completed}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + New Travel Request
          </button>
        </div>

        {requests.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by destination or purpose..."
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
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">&#x2708;&#xFE0F;</div>
            <p className="text-gray-500 font-medium">
              {requests.length === 0
                ? 'No travel requests yet. Create one to get started.'
                : 'No requests match your search criteria.'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Destination</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Dates</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{r.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">#{r.employee_id}</td>
                      <td className="px-4 py-3 text-gray-700">{r.destination}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.purpose || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {r.start_date} &rarr; {r.end_date}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || STATUS_COLORS.pending}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditModal(r)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 hover:bg-gray-50'
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
              <h2 className="text-lg font-bold text-gray-800">New Travel Request</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className={`w-full border ${formErrors.employee_id ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g. Berlin, DE"
                  className={`w-full border ${formErrors.destination ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.destination && <p className="text-red-500 text-xs mt-1">{formErrors.destination}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  rows={2}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Tech Summit 2026"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={`w-full border ${formErrors.start_date ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.start_date && <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={`w-full border ${formErrors.end_date ? 'border-red-300' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.end_date && <p className="text-red-500 text-xs mt-1">{formErrors.end_date}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Update Travel Request</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-2">
                Editing request <span className="font-mono font-medium text-gray-800">#{editItem.id}</span> &mdash; {editItem.destination}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={editData.destination}
                  onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea
                  rows={2}
                  value={editData.purpose}
                  onChange={(e) => setEditData({ ...editData, purpose: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editData.start_date}
                    onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editData.end_date}
                    onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {editItem.approved_at && (
                <div className="text-xs text-gray-400">
                  Approved at: {new Date(editItem.approved_at).toLocaleString()}
                </div>
              )}
              <div className="text-xs text-gray-400">
                Created: {editItem.created_at ? new Date(editItem.created_at).toLocaleString() : '-'}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditItem(null); }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Updating...' : 'Update Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
