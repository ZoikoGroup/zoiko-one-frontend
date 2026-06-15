import { useState, useMemo } from "react";
import { Plus, Plane } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useTravelRequests } from "../hooks/useTravel";
import { formatDate, formatCurrency } from "../utils/helpers";
import { createTravelRequest, updateTravelRequest, deleteTravelRequest } from "../services/travelService";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const initialForm = { employee: "", destination: "", purpose: "", startDate: "", endDate: "", budget: "", notes: "" };

export default function TravelRequests() {
  const { data: requests, loading } = useTravelRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    let result = requests;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.destination?.toLowerCase().includes(q) || r.employee?.toLowerCase().includes(q) || r.purpose?.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [requests, search, statusFilter]);

  const openCreate = () => { setEditing(null); setForm({ ...initialForm }); setError(""); setShowModal(true); };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      employee: row.employee || "",
      destination: row.destination || "",
      purpose: row.purpose || "",
      startDate: row.startDate || "",
      endDate: row.endDate || "",
      budget: row.budget?.toString() || "",
      notes: row.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.destination.trim() || !form.startDate || !form.endDate) {
      setError("Destination, start date, and end date are required");
      return;
    }
    try {
      const payload = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
      };
      if (editing) {
        await updateTravelRequest(editing.id, payload);
      } else {
        await createTravelRequest(payload);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this travel request?")) return;
    try {
      await deleteTravelRequest(id);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination" },
    { key: "purpose", label: "Purpose" },
    { key: "startDate", label: "Start", render: (v) => formatDate(v) },
    { key: "endDate", label: "End", render: (v) => formatDate(v) },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "actions", label: "Actions", render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="text-purple-600 hover:text-purple-800 text-xs font-medium">Edit</button>
        <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
      </div>
    )},
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading travel requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage travel requests</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        onFilterChange={(key, val) => setStatusFilter(val)}
        filters={[{ key: "status", placeholder: "All Statuses", options: STATUS_OPTIONS, value: statusFilter }]}
      />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "Edit Travel Request" : "New Travel Request"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <input type="text" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea rows={2} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">{editing ? "Update" : "Create"} Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
