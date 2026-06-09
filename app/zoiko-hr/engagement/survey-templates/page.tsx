"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchSurveyTemplates, type SurveyTemplate } from "../../../lib/workforce-api";

const SURVEY_TYPES = ["All", "EMPLOYEE_SATISFACTION", "WORKPLACE_CULTURE", "MANAGER_FEEDBACK", "EXIT_FEEDBACK", "TRAINING_FEEDBACK"];

export default function SurveyTemplatesPage() {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    fetchSurveyTemplates({ search: search || undefined, surveyType: typeFilter !== "All" ? typeFilter : undefined })
      .then((res) => { if (!cancelled) { setTemplates(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, typeFilter]);

  return (
    <SuperAdminShell>
      <PageHeader title="Survey Templates" description="Pre-built survey templates for common engagement scenarios." />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search templates..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[180px]">
          {SURVEY_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.length === 0 ? (
            <div className="col-span-full py-20 text-center text-sm text-slate-500">No templates found.</div>
          ) : (
            templates.map((t) => (
              <div key={t.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-slate-700">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-base font-semibold text-white">{t.name}</h3>
                  <StatusBadge status={t.surveyType} />
                </div>
                <p className="text-sm text-slate-400">{t.description ?? "No description."}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>{t.questionCount} questions</span>
                  <span>Used {t.usageCount} times</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </SuperAdminShell>
  );
}
