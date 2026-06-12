"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchAttendanceReport } from "../../../lib/workforce-api";

export default function AttendanceReportsPage() {
  const [type, setType] = useState("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!startDate || !endDate) { setError("Start and end dates are required."); return; }
    setLoading(true); setError(""); setReport(null);
    try {
      const res = await fetchAttendanceReport({ type, startDate, endDate });
      setReport(res);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to generate report."); }
    finally { setLoading(false); }
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Attendance Reports" description="Generate and view attendance reports." />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
      )}

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Report Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
          </div>
          <button type="button" onClick={handleGenerate} disabled={loading}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
            <FileText className="h-4 w-4" /> {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {report && (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Report Summary</h2>
            <button type="button" className="inline-flex items-center gap-2 rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5">
            <div className="rounded-2xl bg-slate-900/50 p-4 text-center">
              <p className="text-2xl font-bold text-white">{report.summary?.total ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Total Records</p>
            </div>
            <div className="rounded-2xl bg-emerald-900/20 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{report.summary?.present ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Present</p>
            </div>
            <div className="rounded-2xl bg-rose-900/20 p-4 text-center">
              <p className="text-2xl font-bold text-rose-400">{report.summary?.absent ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Absent</p>
            </div>
            <div className="rounded-2xl bg-amber-900/20 p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{report.summary?.halfDay ?? 0}</p>
              <p className="text-xs text-slate-400 mt-1">Half Day</p>
            </div>
          </div>
        </section>
      )}
    </SuperAdminShell>
  );
}
