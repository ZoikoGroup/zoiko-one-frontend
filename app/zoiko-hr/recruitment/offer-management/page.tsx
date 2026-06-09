"use client";

import { useState } from "react";
import { Plus, X, FileText, CheckCircle2, XCircle, AlertCircle, DollarSign, Calendar, Trash2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialOffers, initialCandidates, type Offer } from "../mockData";

export default function OfferManagementPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [candidates] = useState(initialCandidates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    candidateId: candidates[0]?.id || "",
    salary: "",
    startDate: "",
    status: "Draft" as const
  });

  const handleOpenAdd = () => {
    setFormData({
      candidateId: candidates[0]?.id || "",
      salary: "",
      startDate: "",
      status: "Draft"
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this offer record?")) {
      setOffers(offers.filter((o) => o.id !== id));
      if (selectedOffer?.id === id) {
        setSelectedOffer(null);
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setOffers(
      offers.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOffer?.id === id) {
      setSelectedOffer({ ...selectedOffer, status: newStatus });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === formData.candidateId);
    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      candidateId: formData.candidateId,
      candidateName: candidate ? candidate.name : "Unknown Candidate",
      jobTitle: candidate ? candidate.jobTitle : "Unknown Job",
      salary: formData.salary,
      startDate: formData.startDate,
      status: formData.status
    };

    setOffers([newOffer, ...offers]);
    setShowAddModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "Declined":
        return <XCircle className="h-4 w-4 text-rose-450" />;
      case "Sent":
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <SuperAdminShell>
      <PageHeader
        title="Offer Management"
        description="Generate, approve, and track employment offers sent to selected candidates."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Generate Offer
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Offers Table */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg lg:col-span-2">
          <div className="overflow-x-auto rounded-[20px] border border-slate-850">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Job Title</th>
                  <th className="px-4 py-3">Salary Details</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No offers generated. Click "Generate Offer" to create one.
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer)}
                      className={`cursor-pointer transition duration-200 hover:bg-slate-900/60 ${
                        selectedOffer?.id === offer.id ? "bg-slate-900/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-white">{offer.candidateName}</td>
                      <td className="px-4 py-3.5 text-slate-300">{offer.jobTitle}</td>
                      <td className="px-4 py-3.5 text-slate-400">
                        <p>{offer.salary}</p>
                        <p className="text-[10px] text-slate-500">Starts {offer.startDate}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(offer.status)}
                          <span
                            className={`font-semibold ${
                              offer.status === "Accepted"
                                ? "text-emerald-450"
                                : offer.status === "Declined"
                                ? "text-rose-450"
                                : offer.status === "Sent"
                                ? "text-blue-450"
                                : "text-slate-400"
                            }`}
                          >
                            {offer.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleDelete(offer.id)}
                          className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-450"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Offer Detail Card */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg">
          {selectedOffer ? (
            <div className="space-y-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-650/15 text-indigo-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Offer Letter Details</h3>
                <p className="text-xs text-slate-400 mt-1">Generated for {selectedOffer.candidateName}</p>
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Position:</span>
                  <span className="text-white font-semibold">{selectedOffer.jobTitle}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Compensation:</span>
                  <span className="text-white font-semibold">{selectedOffer.salary}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Expected Start:</span>
                  <span className="text-white font-semibold">{selectedOffer.startDate}</span>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Update Offer Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOffer.id, "Accepted")}
                    className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 text-xs font-semibold hover:bg-emerald-500/20 transition"
                  >
                    Accept Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOffer.id, "Declined")}
                    className="rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 px-3 py-2 text-xs font-semibold hover:bg-rose-500/20 transition"
                  >
                    Decline Offer
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedOffer.id, "Sent")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 font-semibold hover:bg-slate-900 transition"
                >
                  Mark as Sent / Pending
                </button>
              </div>

              <div className="border-t border-slate-850 pt-5 text-center">
                <button
                  type="button"
                  onClick={() =>
                    alert(`Drafting and showing PDF Template for ${selectedOffer.candidateName}`)
                  }
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Preview Document &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-16">
              <FileText className="h-12 w-12 text-slate-700 mb-3" />
              <p className="text-sm">Select an generated offer to view salary metrics, update signing state, and download document PDFs.</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">Generate Offer</h3>
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
                  Target Candidate *
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
                  Base Salary *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. 135,000 / year"
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Expected Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Offer Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent / Pending</option>
                  <option value="Accepted">Accepted</option>
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
                  Generate Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
