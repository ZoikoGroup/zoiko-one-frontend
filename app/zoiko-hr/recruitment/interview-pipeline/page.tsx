"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, AlertCircle, Briefcase, Calendar } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialCandidates, type Candidate } from "../mockData";

export default function InterviewPipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const stages: Candidate["stage"][] = [
    "Applied",
    "Phone Screen",
    "Technical",
    "Executive",
    "Offer",
    "Hired",
    "Rejected"
  ];

  const moveCandidate = (id: string, direction: "left" | "right") => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currentIndex = stages.indexOf(c.stage);
        let nextIndex = currentIndex + (direction === "right" ? 1 : -1);
        if (nextIndex < 0 || nextIndex >= stages.length) return c;
        return { ...c, stage: stages[nextIndex] };
      })
    );
  };

  const handleStageChange = (id: string, newStage: Candidate["stage"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
    );
  };

  // Group candidates by stage
  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<Candidate["stage"], Candidate[]>);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Interview Pipeline"
        description="Visualize and manage candidates progression across recruitment stages in a Kanban board."
      />

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {stages.map((stage) => {
          const list = candidatesByStage[stage] || [];
          return (
            <div
              key={stage}
              className="flex flex-col w-72 shrink-0 rounded-[24px] border border-slate-800 bg-[#0B1220] p-4 shadow-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-3">
                <h3 className="text-sm font-semibold text-slate-200">{stage}</h3>
                <span className="rounded-full bg-slate-950 border border-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-400">
                  {list.length}
                </span>
              </div>

              {/* Candidates List */}
              <div className="flex-1 space-y-3 min-h-[350px]">
                {list.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-slate-600 py-10 h-full">
                    <AlertCircle className="h-6 w-6 mb-1 text-slate-700" />
                    <p className="text-xs">No candidates</p>
                  </div>
                ) : (
                  list.map((cand) => (
                    <div
                      key={cand.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow space-y-3 transition hover:border-slate-700"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{cand.name}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <Briefcase className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="truncate">{cand.jobTitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{cand.dateApplied}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-2.5 w-2.5 ${
                                idx < cand.rating ? "fill-amber-400 text-amber-400" : "text-slate-800"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Dropdown Selector for Stages */}
                      <div className="pt-2 border-t border-slate-900">
                        <select
                          value={cand.stage}
                          onChange={(e) => handleStageChange(cand.id, e.target.value as any)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400 outline-none transition focus:border-indigo-600"
                        >
                          {stages.map((stg) => (
                            <option key={stg} value={stg}>
                              {stg}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Move Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          disabled={stages.indexOf(cand.stage) === 0}
                          onClick={() => moveCandidate(cand.id, "left")}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-900 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[9px] uppercase tracking-wider text-slate-650 font-bold">Move</span>
                        <button
                          type="button"
                          disabled={stages.indexOf(cand.stage) === stages.length - 1}
                          onClick={() => moveCandidate(cand.id, "right")}
                          className="rounded-lg p-1 text-slate-500 hover:bg-slate-900 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SuperAdminShell>
  );
}
