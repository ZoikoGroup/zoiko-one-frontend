"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchOnboardingCompletionRate, fetchDeptOnboarding, fetchProbationSummary,
  fetchAssetSummary, fetchMonthlyJoiningTrends,
  type OnboardingCompletionRate, type DeptOnboardingData, type ProbationSummaryData,
  type AssetSummaryData, type MonthlyJoiningTrend,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function OnboardingReportsPage() {
  const [completionRate, setCompletionRate] = useState<OnboardingCompletionRate[]>([]);
  const [deptOnboarding, setDeptOnboarding] = useState<DeptOnboardingData[]>([]);
  const [probationSummary, setProbationSummary] = useState<ProbationSummaryData[]>([]);
  const [assetSummary, setAssetSummary] = useState<AssetSummaryData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyJoiningTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOnboardingCompletionRate(),
      fetchDeptOnboarding(),
      fetchProbationSummary(),
      fetchAssetSummary(),
      fetchMonthlyJoiningTrends(),
    ])
      .then(([crRes, deptRes, probRes, assetRes, trendRes]) => {
        setCompletionRate(crRes.data);
        setDeptOnboarding(deptRes.data);
        setProbationSummary(probRes.data);
        setAssetSummary(assetRes.data);
        setMonthlyTrends(trendRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Onboarding Reports"
        description="Analytics and insights for employee onboarding activities."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading reports...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Onboarding Completion Rate</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {completionRate.length > 0 ? Math.round(completionRate.reduce((a, b) => a + b.rate, 0) / completionRate.length) : 0}%
              </p>
              <p className="mt-1 text-xs text-slate-500">Average across months</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Departments Onboarding</p>
              <p className="mt-2 text-3xl font-bold text-white">{deptOnboarding.length}</p>
              <p className="mt-1 text-xs text-slate-500">Active onboarding departments</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Active Probations</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {probationSummary.filter((p) => p.status === "ACTIVE" || p.status === "EXTENDED").reduce((a, b) => a + b.count, 0)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Employees under probation</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Joinings (YTD)</p>
              <p className="mt-2 text-3xl font-bold text-white">{monthlyTrends.reduce((a, b) => a + b.joinings, 0)}</p>
              <p className="mt-1 text-xs text-slate-500">Year to date</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Onboarding Completion Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} name="Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Department-wise Onboarding</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptOnboarding}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="onboarded" fill="#10b981" radius={[4, 4, 0, 0]} name="Onboarded" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Probation Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={probationSummary} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                    {probationSummary.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Asset Allocation Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="type" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Assigned" />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Monthly Joining Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="joinings" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Joinings" />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
