"use client";

import { useState } from "react";
import { Plus, X, Calendar, Clock, Video, Phone, User, Users, Trash2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialInterviews, initialCandidates, type Interview } from "../mockData";

export default function InterviewSchedulingPage() {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [candidates] = useState(initialCandidates);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    candidateId: candidates[0]?.id || "",
    interviewer: "",
    date: "",
    time: "",
    format: "Video Call" as const,
    status: "Scheduled" as const
  });

  const handleOpenAdd = () => {
    setFormData({
      candidateId: candidates[0]?.id || "",
      interviewer: "",
      date: "",
      time: "",
      format: "Video Call",
      status: "Scheduled"
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to cancel and remove this scheduled interview?")) {
      setInterviews(interviews.filter((i) => i.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setInterviews(
      interviews.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === formData.candidateId);
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      candidateId: formData.candidateId,
      candidateName: candidate ? candidate.name : "Unknown Candidate",
      jobTitle: candidate ? candidate.jobTitle : "Unknown Job",
      interviewer: formData.interviewer,
      date: formData.date,
      time: formData.time,
      format: formData.format,
      status: formData.status
    };

    setInterviews([newInterview, ...interviews]);
    setShowAddModal(false);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Video Call":
        return <Video className="h-4 w-4 text-indigo-400" />;
      case "Phone Call":
        return <Phone className="h-4 w-4 text-emerald-400" />;
      default:
        return <User className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <SuperAdminShell>
      <PageHeader
        title="Interview Scheduling"
        description="Book and coordinate candidate interviews across hiring managers."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Schedule Call
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Schedules List */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 lg:col-span-2 space-y-5 shadow-lg">
          <h3 className="text-lg font-semibold text-white">Upcoming Interviews</h3>

          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-800 p-12 text-center text-slate-500">
                No interviews scheduled. Click "Schedule Call" to book one.
              </div>
            ) : (
              interviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-slate-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5 shrink-0 text-center min-w-[56px]">
                      <span className="block text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        {new Date(item.date).toLocaleString("default", { month: "short" }) || "Jun"}
                      </span>
                      <span className="block text-xl font-extrabold text-white leading-none mt-0.5">
                        {new Date(item.date).getDate() || "09"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">
                        {item.candidateName} — <span className="text-indigo-400">{item.jobTitle}</span>
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-500" /> {item.interviewer}
                        </span>
                        <span className="text-slate-650">•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-500" /> {item.time}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end border-t border-slate-900/60 pt-3 sm:border-0 sm:pt-0 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-slate-300">
                      {getFormatIcon(item.format)}
                      <span>{item.format}</span>
                    </div>

                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                      className={`rounded-xl border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] outline-none font-bold tracking-wider transition ${
                        item.status === "Scheduled"
                          ? "text-blue-400"
                          : item.status === "Completed"
                          ? "text-emerald-400"
                          : "text-rose-450"
                      }`}
                    >
                      <option value="Scheduled" className="text-blue-400">Scheduled</option>
                      <option value="Completed" className="text-emerald-450">Completed</option>
                      <option value="Cancelled" className="text-rose-450">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-full p-1 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-450"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar and Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-white">Calendar View</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-850 pb-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
              <span className="text-slate-650">1</span>
              <span className="text-slate-650">2</span>
              <span className="text-slate-650">3</span>
              <span className="text-slate-650">4</span>
              <span className="text-slate-300">5</span>
              <span className="text-slate-300">6</span>
              <span className="text-slate-300">7</span>

              <span className="text-slate-300">8</span>
              <span className="bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center mx-auto text-[11px] font-bold">9</span>
              <span className="border border-indigo-500 text-indigo-400 rounded-full h-6 w-6 flex items-center justify-center mx-auto text-[11px] font-bold">10</span>
              <span className="text-slate-300">11</span>
              <span className="text-slate-300">12</span>
              <span className="text-slate-300">13</span>
              <span className="text-slate-300">14</span>

              <span className="text-slate-300">15</span>
              <span className="text-slate-300">16</span>
              <span className="text-slate-300">17</span>
              <span className="text-slate-300">18</span>
              <span className="text-slate-300">19</span>
              <span className="text-slate-300">20</span>
              <span className="text-slate-300">21</span>
            </div>
            <p className="text-[10px] text-slate-550 leading-relaxed pt-2">
              Indigo filled circles represent days with active interviews scheduled.
            </p>
          </div>
        </div>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">Schedule Call</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Candidate *
                </label>
                <select
                  value={formData.candidateId}
                  onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                >
                  {candidates.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.name} ({cand.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Interviewer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  placeholder="e.g. Robert (Lead Architect)"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 14:00 - 15:00"
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Call Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                >
                  <option value="Video Call">Video Call</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Book Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
