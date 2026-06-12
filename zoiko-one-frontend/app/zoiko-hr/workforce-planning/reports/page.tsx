"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchWFHeadcountReports, fetchWFForecastReports, fetchWFHiringReports,
  fetchWFSkillGapReports, fetchWFSuccessionReports, fetchWFBudgetReports,
  type WFHeadcountReport, type WFForecastReport, type WFHiringReport,
  type WFSkillGapReport, type WFSuccessionReport, type WFBudgetReport,
} from "../../../lib/workforce-api";

export default function WorkforcePlanningReportsPage() {
  const [headcountReports, setHeadcountReports] = useState<WFHeadcountReport[]>([]);
  const [forecastReports, setForecastReports] = useState<WFForecastReport[]>([]);
  const [hiringReports, setHiringReports] = useState<WFHiringReport[]>([]);
  const [skillGapReports, setSkillGapReports] = useState<WFSkillGapReport[]>([]);
  const [successionReports, setSuccessionReports] = useState<WFSuccessionReport[]>([]);
  const [budgetReports, setBudgetReports] = useState<WFBudgetReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchWFHeadcountReports(),
      fetchWFForecastReports(),
      fetchWFHiringReports(),
      fetchWFSkillGapReports(),
      fetchWFSuccessionReports(),
      fetchWFBudgetReports(),
    ])
      .then(([hc, fc, hr, sg, sc, bg]) => {
        setHeadcountReports(hc.data);
        setForecastReports(fc.data);
        setHiringReports(hr.data);
        setSkillGapReports(sg.data);
        setSuccessionReports(sc.data);
        setBudgetReports(bg.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Workforce Planning Reports" description="Analytics and insights across workforce planning." />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </SuperAdminShell>
    );
  }

  const totalCurrentBudget = budgetReports.reduce((s, b) => s + b.currentBudget, 0);
  const totalForecastBudget = budgetReports.reduce((s, b) => s + b.forecastBudget, 0);

  return (
    <SuperAdminShell>
      <PageHeader title="Workforce Planning Reports" description="Analytics and insights across workforce planning." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Current Headcount</p>
          <p className="mt-1 text-2xl font-bold text-white">{headcountReports.reduce((s, h) => s + h.current, 0)}</p>
          <p className="mt-1 text-xs text-slate-400">Across all departments</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Planned Headcount</p>
          <p className="mt-1 text-2xl font-bold text-white">{headcountReports.reduce((s, h) => s + h.planned, 0)}</p>
          <p className="mt-1 text-xs text-slate-400">Target workforce size</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Current Budget</p>
          <p className="mt-1 text-2xl font-bold text-white">${(totalCurrentBudget / 1000000).toFixed(1)}M</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Forecast Budget</p>
          <p className="mt-1 text-2xl font-bold text-white">${(totalForecastBudget / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={headcountReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="current" name="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="planned" name="Planned" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Workforce Forecast Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="currentWorkforce" name="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="forecastedWorkforce" name="Forecasted" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Hiring Plan Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="filled" name="Filled" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="positions" name="Total Positions" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Skill Gap Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillGapReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="totalGaps" name="Total Gaps" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="criticalGaps" name="Critical" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highPriorityGaps" name="High Priority" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="mt-6">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="mb-4 text-base font-semibold text-white">Budget by Department</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={budgetReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
              <Legend />
              <Bar dataKey="currentBudget" name="Current Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="forecastBudget" name="Forecast Budget" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="mt-6">
        <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h3 className="text-base font-semibold text-white">Succession Readiness</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Current Employee</th>
                  <th className="px-5 py-3 font-semibold">Successor</th>
                  <th className="px-5 py-3 font-semibold">Readiness</th>
                  <th className="px-5 py-3 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {successionReports.map((s, i) => (
                  <tr key={i} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="px-5 py-4"><span className="text-white font-medium">{s.role}</span></td>
                    <td className="px-5 py-4 text-slate-400">{s.currentEmployee}</td>
                    <td className="px-5 py-4 text-slate-400">{s.successor}</td>
                    <td className="px-5 py-4 text-slate-400">{s.readiness}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        s.risk === "CRITICAL" || s.risk === "HIGH" ? "bg-rose-500/20 text-rose-400" :
                        s.risk === "MEDIUM" ? "bg-amber-500/20 text-amber-400" :
                        "bg-emerald-500/20 text-emerald-400"
                      }`}>{s.risk}</span>
                    </td>
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
