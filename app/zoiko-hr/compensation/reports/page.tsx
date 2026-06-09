"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchSalaryDistribution, fetchBenefitEnrollment, fetchDeptCompCost, fetchReviewOutcomes,
  type SalaryDistributionData, type BenefitEnrollmentData, type DeptCompCostData, type ReviewOutcomeData,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(val);

export default function CompReportsPage() {
  const [salaryDist, setSalaryDist] = useState<SalaryDistributionData[]>([]);
  const [benefitEnroll, setBenefitEnroll] = useState<BenefitEnrollmentData[]>([]);
  const [deptCost, setDeptCost] = useState<DeptCompCostData[]>([]);
  const [reviewOutcomes, setReviewOutcomes] = useState<ReviewOutcomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSalaryDistribution(),
      fetchBenefitEnrollment(),
      fetchDeptCompCost(),
      fetchReviewOutcomes(),
    ])
      .then(([sdRes, beRes, dcRes, roRes]) => {
        setSalaryDist(sdRes.data);
        setBenefitEnroll(beRes.data);
        setDeptCost(dcRes.data);
        setReviewOutcomes(roRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const totalCompCost = deptCost.reduce((sum, d) => sum + d.cost, 0);
  const totalHeadcount = deptCost.reduce((sum, d) => sum + d.headcount, 0);
  const totalEnrolled = benefitEnroll.reduce((sum, b) => sum + b.enrolled, 0);
  const totalApproved = reviewOutcomes.reduce((sum, r) => sum + r.approved, 0);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Compensation & Benefits Reports"
        description="Analytics and insights for compensation, benefits, and salary trends."
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
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Compensation</p>
              <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(totalCompCost)}</p>
              <p className="mt-1 text-xs text-slate-500">Annual cost across departments</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Headcount</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalHeadcount}</p>
              <p className="mt-1 text-xs text-slate-500">Employees in compensation data</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Benefits Enrolled</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalEnrolled.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-500">Total benefit plan enrollments</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Reviews Approved</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalApproved}</p>
              <p className="mt-1 text-xs text-slate-500">YTD approved reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Salary Distribution by Grade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="grade" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Benefit Enrollment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={benefitEnroll}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="benefit" tick={{ fill: "#94a3b8", fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="enrolled" fill="#10b981" radius={[4, 4, 0, 0]} name="Enrolled" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Department-wise Compensation Cost</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptCost}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Review Outcomes by Month</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reviewOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
                  <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Average Salary by Grade</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="grade" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Line type="monotone" dataKey="avgSalary" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} name="Avg Salary ($)" />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
