"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchRecruitmentFunnel, fetchTimeToHire, fetchOfferAcceptanceRate,
  fetchHiringByDepartment, fetchMonthlyRecruitmentActivity,
  type RecruitmentFunnelData, type TimeToHireData, type DepartmentHireData, type MonthlyActivityData,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function RecruitmentReportsPage() {
  const [funnel, setFunnel] = useState<RecruitmentFunnelData[]>([]);
  const [timeToHire, setTimeToHire] = useState<TimeToHireData[]>([]);
  const [acceptanceRate, setAcceptanceRate] = useState(0);
  const [deptHires, setDeptHires] = useState<DepartmentHireData[]>([]);
  const [activity, setActivity] = useState<MonthlyActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchRecruitmentFunnel(),
      fetchTimeToHire(),
      fetchOfferAcceptanceRate(),
      fetchHiringByDepartment(),
      fetchMonthlyRecruitmentActivity(),
    ])
      .then(([funnelRes, tthRes, acceptRes, deptRes, actRes]) => {
        setFunnel(funnelRes.data);
        setTimeToHire(tthRes.data);
        setAcceptanceRate(acceptRes.data);
        setDeptHires(deptRes.data);
        setActivity(actRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Recruitment Reports"
        description="Analytics and insights for recruitment activities."
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
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Candidates</p>
              <p className="mt-2 text-3xl font-bold text-white">{funnel.reduce((a, b) => a + b.count, 0)}</p>
              <p className="mt-1 text-xs text-slate-500">In recruitment pipeline</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Avg Time to Hire</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {timeToHire.length > 0 ? Math.round(timeToHire.reduce((a, b) => a + b.days, 0) / timeToHire.length) : 0} days
              </p>
              <p className="mt-1 text-xs text-slate-500">Average across all positions</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Offer Acceptance Rate</p>
              <p className="mt-2 text-3xl font-bold text-white">{acceptanceRate}%</p>
              <p className="mt-1 text-xs text-slate-500">Offers accepted vs sent</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Departments Hiring</p>
              <p className="mt-2 text-3xl font-bold text-white">{deptHires.length}</p>
              <p className="mt-1 text-xs text-slate-500">Active hiring departments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Recruitment Funnel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stage" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => v.replace(/_/g, " ")} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Time to Hire (Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeToHire}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="days" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Hiring by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={deptHires} dataKey="hires" nameKey="department" cx="50%" cy="50%" outerRadius={100} label>
                    {deptHires.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Monthly Recruitment Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
                  <Bar dataKey="interviews" fill="#10b981" radius={[4, 4, 0, 0]} name="Interviews" />
                  <Bar dataKey="offers" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
