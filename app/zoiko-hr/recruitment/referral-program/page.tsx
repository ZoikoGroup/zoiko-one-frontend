"use client";

import { useState } from "react";
import { Plus, X, Award, CheckCircle, Clock, Trash2, Send, DollarSign } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialReferrals, initialJobs, type Referral } from "../mockData";

export default function ReferralProgramPage() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [jobs] = useState(initialJobs);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    jobId: jobs[0]?.id || "",
    referrerName: "Super Admin", // Mocking current user
    notes: ""
  });

  const handleOpenAdd = () => {
    setFormData({
      candidateName: "",
      email: "",
      jobId: jobs[0]?.id || "",
      referrerName: "Super Admin",
      notes: ""
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this referral record?")) {
      setReferrals(referrals.filter((r) => r.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedJob = jobs.find((j) => j.id === formData.jobId);
    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      candidateName: formData.candidateName,
      email: formData.email,
      jobTitle: selectedJob ? selectedJob.title : "Unknown Job",
      referrerName: formData.referrerName,
      status: "In Review",
      rewardAmount: "$1,000", // Standard reward
      rewardStatus: "Pending"
    };

    setReferrals([newReferral, ...referrals]);
    setShowAddModal(false);
  };

  const totalReferrals = referrals.length;
  const hiredCount = referrals.filter((r) => r.status === "Hired").length;
  const paidRewards = referrals
    .filter((r) => r.rewardStatus === "Paid")
    .reduce((sum, r) => sum + parseInt(r.rewardAmount.replace("$", "").replace(",", "")), 0);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Referral Program"
        description="Recommend talented candidates and track referral program rewards and employee milestones."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Refer Candidate
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Submitted Referrals</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{totalReferrals}</h3>
            <p className="mt-1 text-xs text-slate-400">Total recommendations</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Send className="h-6 w-6" />
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Successful Hires</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-400">{hiredCount}</h3>
            <p className="mt-1 text-xs text-slate-400">Hired from referrals</p>
          </div>
          <div className="rounded-2xl bg-emerald-550/10 p-3 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Bonuses Received</p>
            <h3 className="mt-2 text-3xl font-bold text-indigo-400">${paidRewards.toLocaleString()}</h3>
            <p className="mt-1 text-xs text-slate-400">Disbursed to referrers</p>
          </div>
          <div className="rounded-2xl bg-indigo-650/10 p-3 text-indigo-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Referrals Tracking List */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-white">Active Referral Progress</h3>

          <div className="overflow-x-auto rounded-[20px] border border-slate-850">
            <table className="w-full min-w-[550px] text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Referral Role</th>
                  <th className="px-4 py-3">Pipeline State</th>
                  <th className="px-4 py-3">Reward Details</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {referrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{item.candidateName}</p>
                      <p className="text-[10px] text-slate-500">Recommended by {item.referrerName}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">{item.jobTitle}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          item.status === "Hired"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white">{item.rewardAmount}</p>
                      <p
                        className={`text-[9px] uppercase tracking-wide font-bold ${
                          item.rewardStatus === "Paid" ? "text-emerald-450" : "text-amber-450"
                        }`}
                      >
                        {item.rewardStatus}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-450"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard panel */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg space-y-6">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-650/10 text-indigo-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">Referral Leaderboard</h3>
            <p className="text-xs text-slate-400 mt-1">Milestones of employees placing talent.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-850 p-3.5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🥇</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Alice Johnson</h4>
                  <p className="text-[10px] text-slate-500">Engineering Team</p>
                </div>
              </div>
              <span className="text-xs text-indigo-400 font-extrabold">5 Hires ($7,500)</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-850 p-3.5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🥈</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Bob Williams</h4>
                  <p className="text-[10px] text-slate-500">Design Lead</p>
                </div>
              </div>
              <span className="text-xs text-indigo-400 font-extrabold">3 Hires ($4,500)</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-850 p-3.5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🥉</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Clara Oswald</h4>
                  <p className="text-[10px] text-slate-500">Product Analyst</p>
                </div>
              </div>
              <span className="text-xs text-indigo-400 font-extrabold">2 Hires ($2,000)</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/60 border border-slate-850 p-3.5 flex gap-2">
            <Clock className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-normal">
              Referral reward bonus is processed automatically and deposited directly into salary payroll accounts within 30 days of the referee starting.
            </p>
          </div>
        </div>
      </div>

      {/* Refer Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">Refer Candidate</h3>
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
                  Candidate Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Candidate Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Position / Role *
                </label>
                <select
                  value={formData.jobId}
                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Recommendation Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Why is this candidate a great fit for Zoiko?"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none"
                />
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
                  Submit Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
