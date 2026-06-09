"use client";

import { useState } from "react";
import { Plus, Search, X, User, Mail, Phone, Briefcase, Star, Trash2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialCandidates, initialJobs, type Candidate } from "../mockData";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [jobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobId: "",
    stage: "Applied" as const,
    rating: 3
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      jobId: jobs[0]?.id || "",
      stage: "Applied",
      rating: 3
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this candidate application?")) {
      setCandidates(candidates.filter((c) => c.id !== id));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
      }
    }
  };

  const handleStageChange = (id: string, newStage: any) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
    );
    if (selectedCandidate?.id === id) {
      setSelectedCandidate({ ...selectedCandidate, stage: newStage });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedJob = jobs.find((j) => j.id === formData.jobId);
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      jobId: formData.jobId,
      jobTitle: selectedJob ? selectedJob.title : "Unknown Job",
      stage: formData.stage as any,
      dateApplied: new Date().toISOString().split("T")[0],
      resumeName: `${formData.name.replace(/\s+/g, "_")}_Resume.pdf`,
      rating: formData.rating
    };

    setCandidates([newCandidate, ...candidates]);
    setShowAddModal(false);
  };

  const filteredCandidates = candidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(search.toLowerCase()) ||
      cand.email.toLowerCase().includes(search.toLowerCase()) ||
      cand.phone.includes(search);
    const matchesStage = stageFilter === "All" || cand.stage === stageFilter;
    const matchesJob = jobFilter === "All" || cand.jobId === jobFilter;
    return matchesSearch && matchesStage && matchesJob;
  });

  const stages = ["Applied", "Phone Screen", "Technical", "Executive", "Offer", "Hired", "Rejected"];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Candidates"
        description="Track candidate profiles, reviews, and progression through the recruitment lifecycle."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Add Candidate
          </button>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Candidates Table List */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg lg:col-span-2">
          {/* Filters */}
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
              />
            </div>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Stages</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-[20px] border border-slate-850">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Applied For</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`cursor-pointer transition duration-200 hover:bg-slate-900/60 ${
                        selectedCandidate?.id === cand.id ? "bg-slate-900/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{cand.name}</p>
                        <p className="text-[10px] text-slate-500">{cand.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">
                        <p>{cand.jobTitle}</p>
                        <p className="text-[10px] text-slate-500">Applied {cand.dateApplied}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                            cand.stage === "Hired"
                              ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                              : cand.stage === "Rejected"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : cand.stage === "Offer"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-indigo-550/10 text-indigo-400 border-indigo-500/20"
                          }`}
                        >
                          {cand.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${
                                idx < cand.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleDelete(cand.id)}
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

        {/* Selected Candidate Details Panel */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg">
          {selectedCandidate ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-slate-200">
                  {selectedCandidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{selectedCandidate.name}</h3>
                <p className="text-xs text-indigo-400 mt-1">{selectedCandidate.jobTitle}</p>
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Details</h4>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span>{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    <span>Applied on {selectedCandidate.dateApplied}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stage Management</h4>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Set Pipeline Stage</label>
                  <select
                    value={selectedCandidate.stage}
                    onChange={(e) => handleStageChange(selectedCandidate.id, e.target.value as any)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Application Attachments</h4>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded bg-indigo-650/15 p-1.5 text-xs text-indigo-400 font-bold">PDF</div>
                    <span className="text-xs text-slate-300 truncate max-w-[150px]">{selectedCandidate.resumeName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading resume: ${selectedCandidate.resumeName}`)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-16">
              <User className="h-12 w-12 text-slate-700 mb-3" />
              <p className="text-sm">Select a candidate from the list to view profile, documents, and manage stages.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">Add Candidate Application</h3>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7700 900077"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Job Position *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Initial Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Rating (1-5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Star</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                  </select>
                </div>
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
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
