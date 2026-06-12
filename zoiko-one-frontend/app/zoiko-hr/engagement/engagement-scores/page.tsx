"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchEngagementScores, type EngagementScore } from "../../../lib/workforce-api";

export default function EngagementScoresPage() {
  const [scores, setScores] = useState<EngagementScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchEngagementScores()
      .then((res) => { if (!cancelled) { setScores(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const TrendIcon = ({ trend }: { trend: "UP" | "DOWN" | "STABLE" }) => {
    if (trend === "UP") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (trend === "DOWN") return <TrendingDown className="h-4 w-4 text-rose-400" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Engagement Scores" description="Department-level employee engagement scores and trends." />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Department Scores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Score</th>
                  <th className="px-5 py-3 font-semibold">Previous Score</th>
                  <th className="px-5 py-3 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {scores.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">No scores found.</td></tr>
                ) : (
                  scores.map((s, i) => (
                    <tr key={i} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4"><span className="text-white font-medium">{s.department}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          s.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                          s.score >= 60 ? "bg-amber-500/20 text-amber-400" :
                          "bg-rose-500/20 text-rose-400"
                        }`}>
                          {s.score}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{s.previousScore}%</td>
                      <td className="px-5 py-4"><TrendIcon trend={s.trend} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </SuperAdminShell>
  );
}
