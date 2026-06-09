"use client";

import { ArrowUpDown, UserPlus, UserX, Users } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";

const lifecycleStats = {
  totalActive: 284,
  onboardedThisMonth: 12,
  pendingTransfers: 5,
  offboardedThisMonth: 3,
};

const recentOnboardings = [
  { id: "1", name: "Alice Cooper", position: "Frontend Developer", department: "Engineering", startDate: "2026-06-01", status: "IN_PROGRESS" },
  { id: "2", name: "Bob Martinez", position: "DevOps Engineer", department: "Engineering", startDate: "2026-05-25", status: "COMPLETED" },
  { id: "3", name: "Carol White", position: "HR Coordinator", department: "Human Resources", startDate: "2026-05-18", status: "COMPLETED" },
];

const recentTransfers = [
  { id: "1", name: "David Kim", from: "Frontend Developer", to: "Senior Frontend Developer", department: "Engineering", effectiveDate: "2026-06-15", status: "APPROVED" },
  { id: "2", name: "Eva Green", from: "HR Associate", to: "HR Manager", department: "Human Resources", effectiveDate: "2026-05-30", status: "COMPLETED" },
  { id: "3", name: "Frank Liu", from: "Engineering", to: "Product", department: "Product Management", effectiveDate: "2026-05-20", status: "COMPLETED" },
];

const recentOffboardings = [
  { id: "1", name: "Grace Hopper", position: "Data Analyst", department: "Analytics", exitDate: "2026-06-10", status: "PENDING" },
  { id: "2", name: "Hank Miller", position: "QA Engineer", department: "Engineering", exitDate: "2026-05-28", status: "COMPLETED" },
];

export default function EmployeeLifecyclePage() {
  return (
    <SuperAdminShell>
      <PageHeader
        title="Employee Lifecycle Management"
        description="Track employees through the full lifecycle — onboarding, promotions, transfers, and offboarding."
      />

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Employees", value: lifecycleStats.totalActive, icon: <Users className="h-6 w-6" />, gradient: "from-indigo-600/40 to-indigo-900/20" },
            { label: "Onboarded This Month", value: lifecycleStats.onboardedThisMonth, icon: <UserPlus className="h-6 w-6" />, gradient: "from-emerald-600/40 to-emerald-900/20" },
            { label: "Pending Transfers", value: lifecycleStats.pendingTransfers, icon: <ArrowUpDown className="h-6 w-6" />, gradient: "from-amber-600/40 to-amber-900/20" },
            { label: "Offboarded This Month", value: lifecycleStats.offboardedThisMonth, icon: <UserX className="h-6 w-6" />, gradient: "from-rose-600/40 to-rose-900/20" },
          ].map((card) => (
            <div key={card.label} className={`relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] bg-gradient-to-br ${card.gradient} p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]`}>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                <span className="text-slate-500">{card.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Onboardings */}
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Recent Onboardings</h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">{lifecycleStats.onboardedThisMonth} this month</span>
          </div>
          <div className="divide-y divide-slate-800">
            {recentOnboardings.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                <div>
                  <p className="text-sm font-medium text-white">{o.name}</p>
                  <p className="text-xs text-slate-500">{o.position} &middot; {o.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{new Date(o.startDate).toLocaleDateString()}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Transfers */}
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Recent Transfers</h2>
            </div>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">{lifecycleStats.pendingTransfers} pending</span>
          </div>
          <div className="divide-y divide-slate-800">
            {recentTransfers.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.from} &rarr; {t.to}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{new Date(t.effectiveDate).toLocaleDateString()}</span>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Offboardings */}
      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-rose-400" />
            <h2 className="text-lg font-semibold text-white">Recent Offboardings</h2>
          </div>
          <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-400">{lifecycleStats.offboardedThisMonth} this month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Position</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Exit Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentOffboardings.map((o) => (
                <tr key={o.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="px-5 py-4 text-white font-medium">{o.name}</td>
                  <td className="px-5 py-4 text-slate-300">{o.position}</td>
                  <td className="px-5 py-4 text-slate-300">{o.department}</td>
                  <td className="px-5 py-4 text-slate-400">{new Date(o.exitDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SuperAdminShell>
  );
}
