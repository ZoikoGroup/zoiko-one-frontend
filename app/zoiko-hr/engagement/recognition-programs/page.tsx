"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchRecognitionPrograms, type RecognitionProgram } from "../../../lib/workforce-api";

const AWARD_TYPES = ["All", "EMPLOYEE_OF_MONTH", "TEAM_AWARD", "SPOT_AWARD", "MILESTONE"];

export default function RecognitionProgramsPage() {
  const [programs, setPrograms] = useState<RecognitionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [awardFilter, setAwardFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    fetchRecognitionPrograms()
      .then((res) => { if (!cancelled) { setPrograms(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = programs.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (awardFilter !== "All" && p.awardType !== awardFilter) return false;
    return true;
  });

  return (
    <SuperAdminShell>
      <PageHeader title="Recognition Programs" description="Employee recognition programs and award configurations." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search programs..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={awardFilter} onChange={(e) => setAwardFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[180px]">
          {AWARD_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center text-sm text-slate-500">No programs found.</div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-slate-700">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-base font-semibold text-white">{p.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${p.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{p.description ?? "No description."}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <StatusBadge status={p.awardType} />
                  <span>{p.totalAwards} awards given</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </SuperAdminShell>
  );
}
