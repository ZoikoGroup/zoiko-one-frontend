"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Filter, PieChart } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchAttendanceReport, type AttendanceReport } from "../../../lib/workforce-api";

const REPORT_TYPES = ["Daily", "Weekly", "Monthly", "Department", "Employee"] as const;

export default function AttendanceReportsPage() {
  const [reportType, setReportType] = useState<string>("Monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<AttendanceReport | null>(null);

  const handleGenerate = async () => {
    if (!startDate || !endDate) { setError("Please select a date range."); return; }
    setLoading(true); setError(""); setReport(null);
    try {
      const data = await fetchAttendanceReport({
        type: reportType.toUpperCase(),
        startDate,
        endDate,
        departmentId: departmentId.trim() || undefined,
        employeeId: employeeId.trim() || undefined,
      });
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;
    const headers = ["Employee", "Date", "Check In", "Check Out", "Hours", "Status"];
    const rows = report.records.map((r) => [
      r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId,
      new Date(r.date).toLocaleDateString(),
      r.checkIn ?? "—",
      r.checkOut ?? "—",
      r.workingHours != null ? r.workingHours.toFixed(2) : "—",
      r.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "attendance-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = report
    ? [
        { label: "Total Records", value: report.summary.total },
        { label: "Present", value: report.summary.present },
        { label: "Absent", value: report.summary.absent },
        { label: "Half Day", value: report.summary.halfDay },
        { label: "WFH", value: report.summary.wfh },
        { label: "On Leave", value: report.summary.onLeave },
        { label: "Holiday", value: report.summary.holiday },
        { label: "Total Working Hours", value: report.summary.totalWorkingHours.toFixed(2) },
        { label: "Total Overtime Hours", value: report.summary.totalOvertimeHours.toFixed(2) },
      ]
    : [];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Attendance Reports"
        description="Generate and export attendance reports."
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Report Type</label>
            <div className="flex flex-wrap gap-2">
              {REPORT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setReportType(t)}
                  className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${
                    reportType === t
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  {t === "Daily" && <Calendar className="mr-1.5 inline h-3.5 w-3.5" />}
                  {t === "Weekly" && <Calendar className="mr-1.5 inline h-3.5 w-3.5" />}
                  {t === "Monthly" && <Calendar className="mr-1.5 inline h-3.5 w-3.5" />}
                  {t === "Department" && <Filter className="mr-1.5 inline h-3.5 w-3.5" />}
                  {t === "Employee" && <PieChart className="mr-1.5 inline h-3.5 w-3.5" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Department</label>
            <input
              type="text"
              placeholder="Optional"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 w-40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Employee</label>
            <input
              type="text"
              placeholder="Optional"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 w-40"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-[28px] border border-rose-800 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center rounded-[28px] border border-slate-800 bg-[#0b1220] p-12 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            Generating report...
          </div>
        </div>
      )}

      {report && (
        <>
          <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Summary</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
                >
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
                <button
                  type="button"
                  onClick={() => alert("PDF export coming soon")}
                  className="inline-flex items-center gap-1.5 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
                >
                  <FileText className="h-3.5 w-3.5" /> PDF
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 backdrop-blur-sm"
                >
                  <p className="text-xs uppercase tracking-wider text-slate-500">{card.label}</p>
                  <p className="mt-1.5 text-2xl font-semibold text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Records <span className="ml-2 text-sm font-normal text-slate-400">({report.records.length})</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Check In</th>
                    <th className="px-5 py-3 font-semibold">Check Out</th>
                    <th className="px-5 py-3 font-semibold">Hours</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {report.records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No records found for the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    report.records.map((r) => (
                      <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="border-t border-slate-800 px-5 py-4">
                          <p className="text-white">
                            {r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId}
                          </p>
                          {r.employee && (
                            <p className="text-xs text-slate-500">{r.employee.employeeId}</p>
                          )}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {r.checkIn ?? "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {r.checkOut ?? "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {r.workingHours != null ? `${r.workingHours.toFixed(2)}h` : "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </SuperAdminShell>
  );
}
