"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { createAttendance, type AttendanceRecord } from "../../../lib/workforce-api";

export default function AttendanceEntryPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employeeId: "", date: new Date().toISOString().split("T")[0], checkIn: "", checkOut: "", status: "PRESENT", remarks: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId.trim() || !formData.date) { setFormError("Employee ID and date are required."); return; }
    setSubmitting(true); setFormError("");
    try {
      await createAttendance({ employeeId: formData.employeeId, date: formData.date, checkIn: formData.checkIn || undefined, checkOut: formData.checkOut || undefined, status: formData.status, remarks: formData.remarks || undefined });
      setToast("Attendance record created successfully.");
      setShowForm(false);
      setFormData({ employeeId: "", date: new Date().toISOString().split("T")[0], checkIn: "", checkOut: "", status: "PRESENT", remarks: "" });
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed to create record."); }
    finally { setSubmitting(false); }
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Attendance Entry" description="Manually add attendance records for employees."
        action={<button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"><Plus className="h-4 w-4" /> New Entry</button>}
      />

      {toast && (
        <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">New Attendance Entry</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee ID *</label>
                <input type="text" required value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" placeholder="EMP-001" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Date *</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Check In</label>
                  <input type="time" value={formData.checkIn} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Check Out</label>
                  <input type="time" value={formData.checkOut} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="LATE">Late</option>
                  <option value="WFH">Work From Home</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Remarks</label>
                <textarea rows={2} value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Saving..." : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
