"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X, UserCheck } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchCandidates, updateCandidateStage,
  type Candidate, type CandidateStage,
} from "../../../lib/workforce-api";

const STAGES: CandidateStage[] = ["APPLIED", "SCREENING", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED", "REJECTED"];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchCandidates({
        search: search || undefined, stage: stageFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setCandidates(res.data); setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, stageFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStageChange = async (id: string, stage: CandidateStage) => {
    try {
      await updateCandidateStage(id, stage);
      showToast("success", `Candidate moved to ${stage.replace(/_/g, " ")}.`);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update stage.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Candidates"
        description="Track and manage candidates through the recruitment pipeline."
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
          <input type="text" placeholder="Search by name, position, or email..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Candidates <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Candidate Name</th>
                  <th className="px-5 py-3 font-semibold">Position Applied</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Experience</th>
                  <th className="px-5 py-3 font-semibold">Current Stage</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-slate-500">No candidates found.</td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr key={c.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => setSelectedCandidate(c)}
                          className="text-white font-medium hover:text-indigo-400 transition text-left">
                          {c.name}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{c.positionApplied}</td>
                      <td className="px-5 py-4 text-slate-400">{c.email}</td>
                      <td className="px-5 py-4 text-slate-400">{c.phone}</td>
                      <td className="px-5 py-4 text-slate-300">{c.experience} yrs</td>
                      <td className="px-5 py-4"><StatusBadge status={c.currentStage} /></td>
                      <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select value={c.currentStage} onChange={(e) => handleStageChange(c.id, e.target.value as CandidateStage)}
                            className="rounded-3xl border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 max-w-[120px]">
                            {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
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

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Candidate Profile</h3>
              <button type="button" onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xl font-semibold text-white">{selectedCandidate.name}</p>
                <p className="text-sm text-slate-400">{selectedCandidate.positionApplied}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-950 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Email</p>
                  <p className="text-sm text-white">{selectedCandidate.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedCandidate.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Experience</p>
                  <p className="text-sm text-white">{selectedCandidate.experience} years</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Source</p>
                  <p className="text-sm text-white">{selectedCandidate.source || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Applied Date</p>
                  <p className="text-sm text-white">{new Date(selectedCandidate.appliedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Current Stage</p>
                  <StatusBadge status={selectedCandidate.currentStage} />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-300">{selectedCandidate.notes || "No notes."}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Move to Stage</p>
                <select value={selectedCandidate.currentStage}
                  onChange={(e) => {
                    const newStage = e.target.value as CandidateStage;
                    handleStageChange(selectedCandidate.id, newStage);
                    setSelectedCandidate({ ...selectedCandidate, currentStage: newStage });
                  }}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setSelectedCandidate(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
