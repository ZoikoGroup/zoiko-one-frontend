"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchLearningProgress, fetchCertificationReports, fetchCourseCompletionData,
  fetchDeptLearningStats, fetchSkillTrends,
  type LearningProgressData, type CertificationReportData, type CourseCompletionData,
  type DeptLearningData, type SkillTrendData,
} from "../../../lib/workforce-api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function LearningReportsPage() {
  const [learningProgress, setLearningProgress] = useState<LearningProgressData[]>([]);
  const [certReports, setCertReports] = useState<CertificationReportData[]>([]);
  const [courseCompletion, setCourseCompletion] = useState<CourseCompletionData[]>([]);
  const [deptStats, setDeptStats] = useState<DeptLearningData[]>([]);
  const [skillTrends, setSkillTrends] = useState<SkillTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchLearningProgress(),
      fetchCertificationReports(),
      fetchCourseCompletionData(),
      fetchDeptLearningStats(),
      fetchSkillTrends(),
    ])
      .then(([lpRes, certRes, ccRes, deptRes, stRes]) => {
        setLearningProgress(lpRes.data);
        setCertReports(certRes.data);
        setCourseCompletion(ccRes.data);
        setDeptStats(deptRes.data);
        setSkillTrends(stRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const avgCompletion = courseCompletion.length > 0
    ? Math.round(courseCompletion.reduce((sum, c) => sum + c.completionRate, 0) / courseCompletion.length)
    : 0;
  const totalEnrolled = courseCompletion.reduce((sum, c) => sum + c.enrolled, 0);
  const totalCompleted = courseCompletion.reduce((sum, c) => sum + c.completed, 0);
  const activeCerts = certReports.reduce((sum, c) => sum + c.active, 0);
  const totalLearners = deptStats.reduce((sum, d) => sum + d.enrolled, 0);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Learning & Development Reports"
        description="Analytics and insights for learning activities."
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
              <p className="text-xs uppercase tracking-wider text-slate-400">Avg Completion Rate</p>
              <p className="mt-2 text-3xl font-bold text-white">{avgCompletion}%</p>
              <p className="mt-1 text-xs text-slate-500">Across all courses</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Enrolled</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalEnrolled}</p>
              <p className="mt-1 text-xs text-slate-500">Learners enrolled</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Completed Courses</p>
              <p className="mt-2 text-3xl font-bold text-white">{totalCompleted}/{totalEnrolled}</p>
              <p className="mt-1 text-xs text-slate-500">Courses completed</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">Active Certifications</p>
              <p className="mt-2 text-3xl font-bold text-white">{activeCerts}</p>
              <p className="mt-1 text-xs text-slate-500">Currently valid</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Learning Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={learningProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="employee" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Bar dataKey="progress" fill="#6366f1" radius={[4, 4, 0, 0]} name="Progress (%)" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Certification Reports</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={certReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="certification" tick={{ fill: "#94a3b8", fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="issued" fill="#6366f1" radius={[4, 4, 0, 0]} name="Issued" />
                  <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} name="Active" />
                  <Bar dataKey="expired" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expired" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Course Completion Analytics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseCompletion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="courseName" tick={{ fill: "#94a3b8", fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} name="Enrolled" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Department-wise Learning</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="department" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Bar dataKey="enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} name="Enrolled" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Skill Development Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={skillTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
                  <Line type="monotone" dataKey="beginners" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} name="Beginner" />
                  <Line type="monotone" dataKey="intermediate" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} name="Intermediate" />
                  <Line type="monotone" dataKey="advanced" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} name="Advanced" />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
