"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchSalaryDistribution, fetchBenefitEnrollment, type SalaryDistributionData, type BenefitEnrollmentData } from "../../../lib/workforce-api";

export default function CompensationReportsPage() {
  const [salaryDist, setSalaryDist] = useState<SalaryDistributionData[]>([]);
  const [benefitData, setBenefitData] = useState<BenefitEnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSalaryDistribution(),
      fetchBenefitEnrollment(),
    ]).then(([s, b]) => {
      setSalaryDist(s.data);
      setBenefitData(b.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Compensation Reports" description="View compensation analytics and reports." />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <PageHeader title="Compensation Reports" description="Compensation analytics, salary distribution, and benefit enrollment." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" /> Salary Distribution by Grade
          </h2>
          <div className="space-y-3">
            {salaryDist.map((s) => (
              <div key={s.grade} className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{s.grade}</p>
                  <p className="text-xs text-slate-400">{s.count} employees</p>
                </div>
                <p className="text-sm text-slate-300">{formatCurrency(s.avgSalary)}</p>
              </div>
            ))}
            {salaryDist.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No salary data available.</p>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" /> Benefit Enrollment Overview
          </h2>
          <div className="space-y-3">
            {benefitData.map((b) => (
              <div key={b.benefit} className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{b.benefit}</p>
                  <p className="text-xs text-slate-400">{b.enrolled} / {b.total} enrolled</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${b.total > 0 ? (b.enrolled / b.total) * 100 : 0}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">{b.total > 0 ? Math.round((b.enrolled / b.total) * 100) : 0}%</span>
                </div>
              </div>
            ))}
            {benefitData.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No benefit enrollment data available.</p>
            )}
          </div>
        </section>
      </div>
    </SuperAdminShell>
  );
}
