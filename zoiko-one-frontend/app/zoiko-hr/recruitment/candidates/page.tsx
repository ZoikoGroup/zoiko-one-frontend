"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X, UserCheck, Briefcase, Mail, Phone, Award } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchCandidates, updateCandidateStage,
  type Candidate, type CandidateStage,
} from "../../../lib/workforce-api";

const STAGES: CandidateStage[] = ["APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "OFFERED", "HIRED", "REJECTED", "WITHDRAWN"];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [stageUpdating, setStageUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const pageSize = 20;

  const loadCandidates = () => {
    setLoading(true);
    setError("");
    fetchCandidates({
      search: search || undefined,
      stage: stageFilter || undefined,
      skip: page * pageSize,
      take: pageSize,
    })
      .then((res) => {
        setCandidates(res.data);
        setTotal(res.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load candidates."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCandidates(); }, [search, stageFilter, page]);

  const handleStageChange = async (id: string, stage: CandidateStage) => {
    setStageUpdating(id);
    try {
      const res = await updateCandidateStage(id, stage);
      setCandidates((prev) => prev.map((c) => c.id === id ? res.data : c));
      setToast({ type: "success", message: `Candidate moved to ${stage.replace(/_/g, " ")}` });
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Failed to update stage." });
    } finally {
      setStageUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Candidates"
        description="Track and manage job candidates throughout the hiring pipeline."
      />

      {toast && (
        <div className={`mb-4 flex items-center justify-between rounded-2xl px-5 py-3 text-sm font-medium border ${
          toast.type === "success"
            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
            : "bg-rose-500/15 text-rose-300 border-rose-500/20"
        }`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by name, position, or email..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Stages</option>
            {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Candidates <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Position</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Experience</th>
                <th className="px-5 py-3 font-semibold">Stage</th>
                <th className="px-5 py-3 font-semibold">Applied</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No candidates found.</td></tr>
              ) : candidates.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-900/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-indigo-400" />
                      <span className="text-white font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-200">{c.positionApplied}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-slate-400"><Mail className="h-3 w-3" />{c.email}</span>
                      <span className="flex items-center gap-1 text-slate-400"><Phone className="h-3 w-3" />{c.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-slate-300"><Award className="h-3.5 w-3.5 text-amber-400" />{c.experience} yrs</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.currentStage} />
                  </td>
                  <td className="px-5 py-4 text-slate-400">{c.appliedDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={c.currentStage}
                        disabled={stageUpdating === c.id}
                        onChange={(e) => handleStageChange(c.id, e.target.value as CandidateStage)}
                        className="rounded-3xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none transition focus:border-indigo-500"
                      >
                        {STAGES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
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
    </SuperAdminShell>
  );
}
