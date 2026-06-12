"use client";

import { useEffect, useState } from "react";
import { Award, Trophy, Sparkles, WalletCards, Gift } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { fetchRewardsDashboard, RewardsDashboardStats } from "../../lib/workforce-api";

export default function RewardsDashboardPage() {
  const [data, setData] = useState<RewardsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchRewardsDashboard();
        setData(res.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader
          title="Rewards & Recognition"
          description="Track employee awards, recognition programs, reward points, and achievements across the organization."
        />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  if (error) {
    return (
      <SuperAdminShell>
        <PageHeader
          title="Rewards & Recognition"
          description="Track employee awards, recognition programs, reward points, and achievements across the organization."
        />
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
      </SuperAdminShell>
    );
  }

  if (!data) return null;

  const recentAwards = data.recentAwards.map((a) => ({
    ...a,
    employeeName: a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "",
  }));

  const recentAchievements = data.topAchievements.map((a) => ({
    ...a,
    employeeName: a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "",
  }));

  return (
    <SuperAdminShell>
      <PageHeader
        title="Rewards & Recognition"
        description="Track employee awards, recognition programs, reward points, and achievements across the organization."
      />

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Awards Given", value: data.totalAwardsGiven, icon: <Trophy className="h-6 w-6" />, gradient: "from-amber-600/40 to-amber-900/20" },
            { label: "Active Programs", value: data.activePrograms, icon: <Sparkles className="h-6 w-6" />, gradient: "from-violet-600/40 to-violet-900/20" },
            { label: "Points Issued", value: data.totalPointsIssued.toLocaleString(), icon: <WalletCards className="h-6 w-6" />, gradient: "from-blue-600/40 to-blue-900/20" },
            { label: "Achievements Unlocked", value: data.totalAchievementsUnlocked, icon: <Award className="h-6 w-6" />, gradient: "from-emerald-600/40 to-emerald-900/20" },
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
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Top Performers</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {data.topPerformers.map((p, i) => (
              <div key={p.employeeId} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? "bg-amber-500/20 text-amber-300" : i === 1 ? "bg-slate-300/20 text-slate-300" : i === 2 ? "bg-orange-500/20 text-orange-300" : "bg-slate-800 text-slate-400"
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><WalletCards className="h-3 w-3" /> {p.points.toLocaleString()} pts</span>
                  <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {p.awards} awards</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Awards</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {recentAwards.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3 transition hover:bg-slate-900/80">
                <div>
                  <p className="text-sm font-medium text-white">{a.awardName}</p>
                  <p className="text-xs text-slate-500">{a.employeeName} &middot; {new Date(a.dateAwarded).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.category} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Achievements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Achievement</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Date Unlocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentAchievements.map((a) => (
                <tr key={a.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="px-5 py-4 text-white">{a.employeeName}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-amber-400" />
                      <span className="text-white font-medium">{a.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={a.category} /></td>
                  <td className="px-5 py-4 text-slate-400">{new Date(a.unlockDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SuperAdminShell>
  );
}
