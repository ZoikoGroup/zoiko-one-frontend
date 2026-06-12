"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Calendar, UserCheck } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchInterviews, createInterview, updateInterviewStatus,
  type Interview, type InterviewStatus,
} from "../../../lib/workforce-api";

const INTERVIEW_STATUSES: InterviewStatus[] = ["SCHEDULED", "COMPLETED", "RESCHEDULED", "CANCELLED"];
const VIEW_MODES = ["List", "Calendar"] as const;

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [viewMode, setViewMode] = useState<"List" | "Calendar">("List");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    candidateId: "", candidateName: "", position: "",
    interviewer: "", date: todayStr(), time: "09:00", type: "Technical",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchInterviews({
        search: search || undefined, status: statusFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setInterviews(res.data); setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load interviews.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, statusFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setFormData({ candidateId: "", candidateName: "", position: "", interviewer: "", date: todayStr(), time: "09:00", type: "Technical" });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.candidateName || !formData.interviewer || !formData.date) {
      setFormError("Candidate name, Interviewer, and Date are required.");
      return;
    }
    setSaving(true);
    try {
      await createInterview(formData);
      showToast("success", "Interview scheduled successfully.");
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to schedule interview.");
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: InterviewStatus) => {
    try {
      await updateInterviewStatus(id, status);
      showToast("success", `Interview ${status.toLowerCase()}.`);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update interview status.");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedInterview) return;
    try {
      await updateInterviewStatus(selectedInterview.id, "COMPLETED", feedbackText, rating || undefined);
      showToast("success", "Feedback submitted successfully.");
      setSelectedInterview(null);
      setFeedbackText("");
      setRating(0);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to submit feedback.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  const calendarDays = interviews.filter((i) => i.status === "SCHEDULED" || i.status === "RESCHEDULED");

  return (
    <SuperAdminShell>
      <PageHeader
        title="Interviews"
        description="Schedule and manage candidate interviews."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> Schedule Interview
          </button>
        }
      />

      {toast && (
        <div className={`mb-4 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
        }`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by candidate, position, or interviewer..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          {INTERVIEW_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <div className="flex rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden">
          {VIEW_MODES.map((mode) => (
            <button key={mode} type="button" onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs font-medium transition ${
                viewMode === mode ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : viewMode === "Calendar" ? (
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Upcoming Interviews</h2>
          </div>
          <div className="p-5">
            {calendarDays.length === 0 ? (
              <p className="text-center py-8 text-slate-400">No upcoming interviews scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarDays.map((i) => (
                  <div key={i.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 hover:border-indigo-500/50 transition cursor-pointer"
                    onClick={() => {
                      setSelectedInterview(i);
                      setFeedbackText(i.feedback ?? "");
                      setRating(i.rating ?? 0);
                    }}>
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge status={i.status} />
                      <span className="text-xs text-slate-500"><Calendar className="inline h-3 w-3 mr-1" />{new Date(i.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{i.candidateName}</p>
                    <p className="text-xs text-slate-400 mt-1">{i.position}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span>{i.time}</span>
                      <span>•</span>
                      <span>{i.interviewer}</span>
                      <span>•</span>
                      <span>{i.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Interviews <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Candidate</th>
                  <th className="px-5 py-3 font-semibold">Position</th>
                  <th className="px-5 py-3 font-semibold">Interviewer</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {interviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-slate-500">No interviews found.</td>
                  </tr>
                ) : (
                  interviews.map((i) => (
                    <tr key={i.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => {
                          setSelectedInterview(i);
                          setFeedbackText(i.feedback ?? "");
                          setRating(i.rating ?? 0);
                        }} className="text-white font-medium hover:text-indigo-400 transition text-left">
                          {i.candidateName}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{i.position}</td>
                      <td className="px-5 py-4 text-slate-400">{i.interviewer}</td>
                      <td className="px-5 py-4 text-slate-400">{new Date(i.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-slate-400">{i.time}</td>
                      <td className="px-5 py-4"><StatusBadge status={i.type} /></td>
                      <td className="px-5 py-4"><StatusBadge status={i.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select value={i.status} onChange={(e) => handleStatusChange(i.id, e.target.value as InterviewStatus)}
                            className="rounded-3xl border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 max-w-[120px]">
                            {INTERVIEW_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}–{end} of {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Schedule Interview</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Candidate Name *</label>
                  <input type="text" value={formData.candidateName} onChange={(e) => setFormData((f) => ({ ...f, candidateName: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Candidate ID</label>
                  <input type="text" value={formData.candidateId} onChange={(e) => setFormData((f) => ({ ...f, candidateId: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Position</label>
                <input type="text" value={formData.position} onChange={(e) => setFormData((f) => ({ ...f, position: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Interviewer *</label>
                <input type="text" value={formData.interviewer} onChange={(e) => setFormData((f) => ({ ...f, interviewer: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Date *</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData((f) => ({ ...f, time: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Type</label>
                <select value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  <option value="Technical">Technical</option>
                  <option value="HR">HR</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Cultural">Cultural Fit</option>
                  <option value="Panel">Panel</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><Calendar className="h-4 w-4 animate-spin" /> Saving...</> : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Interview Details</h3>
              <button type="button" onClick={() => setSelectedInterview(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-950 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Candidate</p>
                  <p className="text-sm text-white">{selectedInterview.candidateName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Position</p>
                  <p className="text-sm text-white">{selectedInterview.position}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Interviewer</p>
                  <p className="text-sm text-white">{selectedInterview.interviewer}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Status</p>
                  <StatusBadge status={selectedInterview.status} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Date</p>
                  <p className="text-sm text-white">{new Date(selectedInterview.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Time</p>
                  <p className="text-sm text-white">{selectedInterview.time}</p>
                </div>
              </div>

              {selectedInterview.feedback && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Feedback</p>
                  <p className="text-sm text-slate-300">{selectedInterview.feedback}</p>
                </div>
              )}

              {selectedInterview.rating ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Rating</p>
                  <p className="text-sm text-amber-400 font-semibold">{selectedInterview.rating}/5</p>
                </div>
              ) : null}

              {selectedInterview.status === "SCHEDULED" && (
                <>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Feedback</label>
                    <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={3}
                      className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none"
                      placeholder="Enter interview feedback..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setRating(n)}
                          className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
                            rating >= n ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-500 hover:text-slate-300"
                          }`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={handleSubmitFeedback}
                      className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition inline-flex items-center gap-2">
                      <UserCheck className="h-4 w-4" /> Submit Feedback
                    </button>
                  </div>
                </>
              )}

              {selectedInterview.notes && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Notes</p>
                  <p className="text-sm text-slate-300">{selectedInterview.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setSelectedInterview(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
