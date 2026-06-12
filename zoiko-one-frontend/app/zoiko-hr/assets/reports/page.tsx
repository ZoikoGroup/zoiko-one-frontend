"use client";

import { useEffect, useState } from "react";
import { BarChart3, PieChart, TrendingUp, Layers, DollarSign, Package } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchAssetUtilization, fetchDeptAllocation, fetchMaintenanceCost, fetchAssetLifecycle, type AssetUtilizationData, type DeptAllocationData, type MaintenanceCostData, type AssetLifecycleData } from "../../../lib/workforce-api";

export default function AssetReportsPage() {
  const [utilization, setUtilization] = useState<AssetUtilizationData[]>([]);
  const [deptAlloc, setDeptAlloc] = useState<DeptAllocationData[]>([]);
  const [maintCost, setMaintCost] = useState<MaintenanceCostData[]>([]);
  const [lifecycle, setLifecycle] = useState<AssetLifecycleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAssetUtilization(),
      fetchDeptAllocation(),
      fetchMaintenanceCost(),
      fetchAssetLifecycle(),
    ])
      .then(([u, d, m, l]) => {
        setUtilization(u.data);
        setDeptAlloc(d.data);
        setMaintCost(m.data);
        setLifecycle(l.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Asset Reports" description="Analytics and insights on asset utilization, allocation, and costs." />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Reports"
        description="Analytics and insights on asset utilization, allocation, and costs."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#141d2f]">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Asset Utilization (Last 6 Months)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Utilized</th>
                  <th className="px-4 py-3 font-semibold">Idle</th>
                  <th className="px-4 py-3 font-semibold">Utilization Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {utilization.map((row) => {
                  const total = row.utilized + row.idle;
                  const rate = total > 0 ? Math.round((row.utilized / total) * 100) : 0;
                  return (
                    <tr key={row.month} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="border-t border-slate-800 px-4 py-3 font-medium text-white">{row.month}</td>
                      <td className="border-t border-slate-800 px-4 py-3 text-slate-300">{row.utilized}</td>
                      <td className="border-t border-slate-800 px-4 py-3 text-slate-300">{row.idle}</td>
                      <td className="border-t border-slate-800 px-4 py-3">
                        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">{rate}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#141d2f]">
              <Layers className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Allocation by Department</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Allocated Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {deptAlloc.map((row) => (
                  <tr key={row.department} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="border-t border-slate-800 px-4 py-3 font-medium text-white">{row.department}</td>
                    <td className="border-t border-slate-800 px-4 py-3 text-slate-300">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#141d2f]">
              <DollarSign className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Maintenance Cost (Last 6 Months)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {maintCost.map((row) => (
                  <tr key={row.month} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="border-t border-slate-800 px-4 py-3 font-medium text-white">{row.month}</td>
                    <td className="border-t border-slate-800 px-4 py-3 text-slate-300">${row.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#141d2f]">
              <PieChart className="h-5 w-5 text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Asset Lifecycle Distribution</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lifecycle.map((row) => (
                  <tr key={row.status} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="border-t border-slate-800 px-4 py-3 font-medium text-white">{row.status.replace(/_/g, " ")}</td>
                    <td className="border-t border-slate-800 px-4 py-3 text-slate-300">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SuperAdminShell>
  );
}
