"use client";

import { useEffect, useState } from "react";
import { SmilePlus, Meh, Frown } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchSentimentAnalysis, type SentimentAnalysis } from "../../../lib/workforce-api";

export default function SentimentAnalysisPage() {
  const [sentiments, setSentiments] = useState<SentimentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSentimentAnalysis()
      .then((res) => { if (!cancelled) { setSentiments(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const sentimentConfig: Record<string, { icon: React.ReactNode; border: string; bg: string }> = {
    POSITIVE: { icon: <SmilePlus className="h-8 w-8 text-emerald-400" />, border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    NEUTRAL: { icon: <Meh className="h-8 w-8 text-amber-400" />, border: "border-amber-500/20", bg: "bg-amber-500/5" },
    NEGATIVE: { icon: <Frown className="h-8 w-8 text-rose-400" />, border: "border-rose-500/20", bg: "bg-rose-500/5" },
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Sentiment Analysis" description="Employee sentiment breakdown and insights from surveys and feedback." />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {sentiments.length === 0 ? (
            <div className="col-span-full py-20 text-center text-sm text-slate-500">No sentiment data available.</div>
          ) : (
            sentiments.map((s, i) => {
              const cfg = sentimentConfig[s.type] ?? sentimentConfig.NEUTRAL;
              return (
                <div key={i} className={`rounded-[28px] border ${cfg.border} ${cfg.bg} p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]`}>
                  <div className="flex items-center gap-4">
                    {cfg.icon}
                    <div>
                      <p className="text-lg font-semibold text-white">{s.type.charAt(0) + s.type.slice(1).toLowerCase()}</p>
                      <p className="text-2xl font-bold text-white">{s.percentage}%</p>
                      <p className="text-xs text-slate-400">{s.count} responses</p>
                    </div>
                  </div>
                  {s.insights.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Insights</p>
                      {s.insights.map((insight, j) => (
                        <p key={j} className="text-sm text-slate-300">&bull; {insight}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </SuperAdminShell>
  );
}
