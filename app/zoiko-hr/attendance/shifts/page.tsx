"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Clock, Edit2, Trash2, Users } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchShifts,
  createShift,
  updateShift,
  deleteShift,
  type ShiftRecord,
} from "../../../lib/workforce-api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const defaultForm = {
  name: "",
  startTime: "09:00",
  endTime: "18:00",
  gracePeriod: "",
  weeklyOff: [] as string[],
};

export default function ShiftListPage() {
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetchShifts({
      search: search || undefined,
      skip: page * pageSize,
      take: pageSize,
      orderBy: "createdAt",
      orderDir: "desc",
    })
      .then((res) => {
        setShifts(res.data);
        setTotal(res.total);
        setLoaded(true);
      })
      .catch(() => {});
  }, [search, page, refreshKey]);

  const openAddForm = () => {
    setEditId(null);
    setFormData(defaultForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (s: ShiftRecord) => {
    setEditId(s.id);
    setFormData({
      name: s.name,
      startTime: s.startTime,
      endTime: s.endTime,
      gracePeriod: String(s.gracePeriod),
      weeklyOff: s.weeklyOff ?? [],
    });
    setFormError("");
    setShowForm(true);
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      weeklyOff: prev.weeklyOff.includes(day)
        ? prev.weeklyOff.filter((d) => d !== day)
        : [...prev.weeklyOff, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const body = {
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        gracePeriod: formData.gracePeriod ? Number(formData.gracePeriod) : undefined,
        weeklyOff: formData.weeklyOff.length ? formData.weeklyOff : undefined,
      };
      if (editId) {
        await updateShift(editId, body);
        setToast("Shift updated successfully.");
      } else {
        await createShift(body);
        setToast("Shift created successfully.");
      }
      setShowForm(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save shift.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteShift(id);
      setDeleteId(null);
      setToast("Shift deleted successfully.");
      setRefreshKey((k) => k + 1);
    } catch (err) { setToast("Failed to delete shift."); }
    setDeleting(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      {toast && (
        <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <PageHeader
        title="Shift Management"
        description="Create and manage work shifts."
        action={
          <button type="button" onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Shift
          </button>
        }
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search shifts..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">All Shifts <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Start Time</th>
                <th className="px-5 py-3 font-semibold">End Time</th>
                <th className="px-5 py-3 font-semibold">Grace Period</th>
                <th className="px-5 py-3 font-semibold">Weekly Off</th>
                <th className="px-5 py-3 font-semibold">Assigned Employees</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading shifts...</td></tr>
              ) : shifts.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No shifts found.</td></tr>
              ) : shifts.map((s) => (
                <tr key={s.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 text-white font-medium">{s.name}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{s.startTime}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{s.endTime}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{s.gracePeriod} min</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {s.weeklyOff?.length ? s.weeklyOff.join(", ") : "—"}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      <Users className="h-3 w-3" />
                      {s.assignments?.length ?? 0}
                    </span>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEditForm(s)}
                        className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20">
                        <Edit2 className="mr-1 inline-block h-3 w-3" /> Edit
                      </button>
                      <button type="button" onClick={() => setDeleteId(s.id)}
                        className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20">
                        <Trash2 className="mr-1 inline-block h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editId ? "Edit Shift" : "Add Shift"}
              </h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Start Time *</label>
                  <input type="time" required value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">End Time *</label>
                  <input type="time" required value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Grace Period (minutes)</label>
                <input type="number" min={0} value={formData.gracePeriod}
                  onChange={(e) => setFormData({ ...formData, gracePeriod: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Weekly Off</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <label key={day}
                      className={`flex items-center gap-1.5 rounded-3xl border px-3 py-1.5 text-xs cursor-pointer transition ${
                        formData.weeklyOff.includes(day)
                          ? "border-indigo-500 bg-indigo-600/10 text-indigo-300"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                      }`}>
                      <input type="checkbox" checked={formData.weeklyOff.includes(day)}
                        onChange={() => toggleDay(day)} className="sr-only" />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this shift?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
              <button type="button" disabled={deleting} onClick={() => handleDelete(deleteId)}
                className="rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
