"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Calendar, TrendingUp, Users, Clock, Percent } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";

// Mock analytics data
const applicationVolumeData = [
  { month: "Jan", applications: 35 },
  { month: "Feb", applications: 48 },
  { month: "Mar", applications: 62 },
  { month: "Apr", applications: 85 },
  { month: "May", applications: 78 },
  { month: "Jun", applications: 95 }
];

const sourceData = [
  { name: "LinkedIn", value: 55 },
  { name: "Referrals", value: 30 },
  { name: "Careers Page", value: 15 }
];

const timeToHireData = [
  { dept: "Engineering", days: 28 },
  { dept: "Product", days: 22 },
  { dept: "Design", days: 18 },
  { dept: "Operations", days: 25 }
];

const COLORS = ["#6366f1", "#10b981", "#a855f7"];

export default function RecruitmentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6 Months");

  return (
    <SuperAdminShell>
      <PageHeader
        title="Recruitment Analytics"
        description="Monitor application volume, pipeline conversion rates, time-to-hire, and sourcing channel ROI."
        action={
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-[#0B1220] px-4 py-2 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
          >
            <option value="30 Days">Last 30 Days</option>
            <option value="6 Months">Last 6 Months</option>
            <option value="12 Months">Last 12 Months</option>
          </select>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Avg Time-To-Hire</p>
            <h3 className="mt-2 text-2xl font-bold text-white">24 Days</h3>
            <p className="mt-1 text-xs text-emerald-450">-3 days from last month</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Offer Acceptance</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-400">87.5%</h3>
            <p className="mt-1 text-xs text-slate-400">+2.4% historical average</p>
          </div>
          <div className="rounded-2xl bg-emerald-550/10 p-3 text-emerald-400">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sourced Candidates</p>
            <h3 className="mt-2 text-2xl font-bold text-white">182 Prospects</h3>
            <p className="mt-1 text-xs text-slate-400">+25 new this month</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Application Velocity</p>
            <h3 className="mt-2 text-2xl font-bold text-indigo-400">+15.8%</h3>
            <p className="mt-1 text-xs text-emerald-450">Trending upward</p>
          </div>
          <div className="rounded-2xl bg-indigo-650/10 p-3 text-indigo-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Application Volume Trend */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-semibold text-white">Application Volume Trend</h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "16px", fontSize: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sourcing Channels Breakdown */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-semibold text-white">Sourcing Channels Breakdown</h3>
          <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-around">
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "16px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 shrink-0">
              {sourceData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-slate-400">{item.name}</span>
                  <span className="text-white font-bold ml-1">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Avg Time-To-Hire by Department */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg space-y-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Average Time-to-Hire by Department (Days)</h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToHireData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: "Days", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "16px", fontSize: "12px" }}
                />
                <Bar dataKey="days" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
