"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchComplianceTrends, fetchViolationByCategory, fetchAuditCompletionData,
  fetchDeptComplianceStats, fetchPolicyAdherenceTrends,
  type ComplianceTrendData, type ViolationByCategoryData, type AuditCompletionData,
  type DeptComplianceData, type PolicyAdherenceTrendData,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function ComplianceReportsPage() {
  const [complianceTrends, setComplianceTrends] = useState<ComplianceTrendData[]>([]);
  const [violationByCat, setViolationByCat] = useState<ViolationByCategoryData[]>([]);
  const [auditCompletion, setAuditCompletion] = useState<AuditCompletionData[]>([]);
  const [deptStats, setDeptStats] = useState<DeptComplianceData[]>([]);
  const [adherenceTrends, setAdherenceTrends] = useState<PolicyAdherenceTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchComplianceTrends(),
      fetchViolationByCategory(),
      fetchAuditCompletionData(),
      fetchDeptComplianceStats(),
      fetchPolicyAdherenceTrends(),
    ])
      .then(([trendsRes, violRes, auditRes, deptRes, adhereRes]) => {
        setComplianceTrends(trendsRes.data);
        setViolationByCat(violRes.data);
        setAuditCompletion(auditRes.data);
        setDeptStats(deptRes.data);
        setAdherenceTrends(adhereRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const totalViolations = violationByCat.reduce((sum, v) => sum + v.count, 0);
  const avgAdherence = adherenceTrends.length > 0
    ? Math.round(adherenceTrends.reduce((sum, a) => sum + a.adherenceRate, 0) / adherenceTrends.length)
    : 0;
  const totalAudits = auditCompletion.reduce((sum, a) => sum + a.total, 0);
  const completedAudits = auditCompletion.reduce((sum, a) => sum + a.completed, 0);

  return (
    <SuperAdminShell>
      <PageHeader title="Compliance Reports" description="Analytics and insights for compliance and policy management." />
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
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Violations</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalViolations}</p>
              <p className="mt-1 text-xs text-slate-500">Across all categories</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Avg Policy Adherence</p>
              <p className="mt-2 text-3xl font-bold text-white">{avgAdherence}%</p>
              <p className="mt-1 text-xs text-slate-500">Organization-wide</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Audits</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalAudits}</p>
              <p className="mt-1 text-xs text-slate-500">Audits conducted</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Audits Completed</p>
              <p className="mt-2 text-3xl font-bold text-white">{completedAudits}/{totalAudits}</p>
              <p className="mt-1 text-xs text-slate-500">Completed audits</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Compliance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Line type="monotone" dataKey="complianceScore" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} name="Compliance Score" />
                  <Line type="monotone" dataKey="violationCount" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} name="Violations" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Violations by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={violationByCat} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ payload, percent }) => `${(payload as ViolationByCategoryData | undefined)?.category ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {violationByCat.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Audit Completion</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={auditCompletion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="quarter" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Department Compliance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis type="category" dataKey="department" tick={{ fill: "#94a3b8", fontSize: 11 }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="complianceRate" fill="#6366f1" radius={[0, 4, 4, 0]} name="Compliance Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Policy Adherence Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={adherenceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Line type="monotone" dataKey="adherenceRate" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} name="Adherence Rate" />
                  <Line type="monotone" dataKey="acknowledgementRate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} name="Acknowledgement Rate" />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
