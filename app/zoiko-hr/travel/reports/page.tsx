"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Building2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchTravelExpenseReports, fetchTravelDeptData, type TravelExpenseReportData, type TravelDeptData } from "../../../lib/workforce-api";

export default function TravelReportsPage() {
  const [reportData, setReportData] = useState<TravelExpenseReportData[]>([]);
  const [deptData, setDeptData] = useState<TravelDeptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTravelExpenseReports(), fetchTravelDeptData()])
      .then(([r, d]) => { setReportData(r.data); setDeptData(d.data); })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(val);

  const maxTravel = Math.max(...reportData.map((r) => r.travel), 1);
  const maxExpense = Math.max(...reportData.map((r) => r.expense), 1);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Travel & Expense Reports"
        description="Analytics and insights for travel and expense management."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Monthly Travel & Expense Trends
              </h2>
            </div>
            <div className="p-5">
              <div className="mb-4 flex items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-indigo-500" /> Travel Costs</span>
                <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Expense Claims</span>
                <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-amber-500" /> Reimbursed</span>
              </div>
              <div className="space-y-3">
                {reportData.map((r) => (
                  <div key={r.month} className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-400">{r.month}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-500">Travel</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(r.travel / maxTravel) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right text-xs text-slate-300">{formatCurrency(r.travel)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-500">Expense</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(r.expense / maxExpense) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right text-xs text-slate-300">{formatCurrency(r.expense)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-16 text-xs text-slate-500">Reimbursed</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${(r.reimbursed / maxTravel) * 100}%` }} />
                        </div>
                        <span className="w-20 text-right text-xs text-slate-300">{formatCurrency(r.reimbursed)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Building2 className="h-5 w-5 text-indigo-400" />
                Travel & Expense by Department
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Travel Requests</th>
                    <th className="px-5 py-3 font-semibold">Expense Claims</th>
                    <th className="px-5 py-3 font-semibold">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {deptData.map((d) => {
                    const maxAmount = Math.max(...deptData.map((x) => x.totalAmount), 1);
                    return (
                      <tr key={d.department} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="px-5 py-4 text-white font-medium">{d.department}</td>
                        <td className="px-5 py-4 text-slate-300">{d.travelCount}</td>
                        <td className="px-5 py-4 text-slate-300">{d.expenseCount}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(d.totalAmount / maxAmount) * 100}%` }} />
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{formatCurrency(d.totalAmount)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </SuperAdminShell>
  );
}
