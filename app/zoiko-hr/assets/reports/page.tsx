"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchAssetUtilization, fetchDeptAllocation, fetchMaintenanceCost, fetchAssetLifecycle,
  type AssetUtilizationData, type DeptAllocationData, type MaintenanceCostData, type AssetLifecycleData,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AssetReportsPage() {
  const [utilization, setUtilization] = useState<AssetUtilizationData[]>([]);
  const [deptAllocation, setDeptAllocation] = useState<DeptAllocationData[]>([]);
  const [maintenanceCost, setMaintenanceCost] = useState<MaintenanceCostData[]>([]);
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
      .then(([utilRes, deptRes, costRes, lifeRes]) => {
        setUtilization(utilRes.data);
        setDeptAllocation(deptRes.data);
        setMaintenanceCost(costRes.data);
        setLifecycle(lifeRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const totalUtilized = utilization.reduce((a, b) => a + b.utilized, 0);
  const totalIdle = utilization.reduce((a, b) => a + b.idle, 0);
  const avgUtilization = (totalUtilized + totalIdle) > 0 ? Math.round((totalUtilized / (totalUtilized + totalIdle)) * 100) : 0;
  const totalMaintenanceCost = maintenanceCost.reduce((a, b) => a + b.cost, 0);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Reports"
        description="Analytics and insights for asset management."
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
              <p className="text-xs uppercase tracking-wider text-slate-400">Avg Asset Utilization</p>
              <p className="mt-2 text-3xl font-bold text-white">{avgUtilization}%</p>
              <p className="mt-1 text-xs text-slate-500">Across all months</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Departments Using Assets</p>
              <p className="mt-2 text-3xl font-bold text-white">{deptAllocation.length}</p>
              <p className="mt-1 text-xs text-slate-500">Active departments</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Maintenance Cost</p>
              <p className="mt-2 text-3xl font-bold text-white">${totalMaintenanceCost}</p>
              <p className="mt-1 text-xs text-slate-500">Year to date</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Active Assets</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {lifecycle.filter((l) => l.status === "ACTIVE").reduce((a, b) => a + b.count, 0)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Currently in use</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Asset Utilization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="utilized" fill="#6366f1" radius={[4, 4, 0, 0]} name="Utilized" />
                  <Bar dataKey="idle" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Idle" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Department-wise Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptAllocation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Assets" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Maintenance Cost Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={maintenanceCost}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} name="Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Asset Lifecycle Report</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={lifecycle} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                    {lifecycle.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
