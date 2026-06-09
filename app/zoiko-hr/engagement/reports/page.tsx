"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchSurveyReports, fetchEngagementReports, fetchRecognitionReports, fetchParticipationReports,
  type SurveyReport, type EngagementReport, type RecognitionReport, type ParticipationReport,
} from "../../../lib/workforce-api";

export default function EngagementReportsPage() {
  const [surveyReports, setSurveyReports] = useState<SurveyReport[]>([]);
  const [engagementReports, setEngagementReports] = useState<EngagementReport[]>([]);
  const [recognitionReports, setRecognitionReports] = useState<RecognitionReport[]>([]);
  const [participationReports, setParticipationReports] = useState<ParticipationReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSurveyReports(),
      fetchEngagementReports(),
      fetchRecognitionReports(),
      fetchParticipationReports(),
    ])
      .then(([s, e, r, p]) => {
        setSurveyReports(s.data);
        setEngagementReports(e.data);
        setRecognitionReports(r.data);
        setParticipationReports(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Engagement Reports" description="Analytics and insights across surveys, engagement, recognition, and participation." />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <PageHeader title="Engagement Reports" description="Analytics and insights across surveys, engagement, recognition, and participation." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {engagementReports.map((r, i) => (
          <div key={i} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{r.metric}</p>
            <p className="mt-1 text-2xl font-bold text-white">{r.current}{r.metric.includes("Rate") ? "%" : ""}</p>
            <p className={`mt-1 text-xs ${r.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {r.change >= 0 ? "+" : ""}{r.change}% from previous
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Survey Completion Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={surveyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="surveyName" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#818cf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgScore" name="Avg Score (%)" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Recognition Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recognitionReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="awardType" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="count" name="Awards Given" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="mt-6">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Participation by Department</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={participationReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="eligible" name="Eligible" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="participated" name="Participated" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </SuperAdminShell>
  );
}
