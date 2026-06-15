import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import { getLearningDashboard } from "../../../service/hrService";

const KPI_CONFIG = [
  { key: "total_courses", label: "Total Courses", color: "text-blue-600" },
  { key: "total_enrollments", label: "Total Enrollments", color: "text-indigo-600" },
  { key: "active_enrollments", label: "Active Enrollments", color: "text-yellow-600" },
  { key: "completed_enrollments", label: "Completed", color: "text-green-600" },
  { key: "total_certifications", label: "Certifications", color: "text-purple-600" },
  { key: "total_skills", label: "Skills Tracked", color: "text-teal-600" },
  { key: "total_paths", label: "Learning Paths", color: "text-cyan-600" },
  { key: "total_training_programs", label: "Training Programs", color: "text-pink-600" },
  { key: "total_assessments", label: "Assessments", color: "text-orange-600" },
  { key: "avg_progress", label: "Avg Progress", color: "text-rose-600" },
];

export default function LearningDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLearningDashboard();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <HRPage title="Learning Dashboard" subtitle="Overview of learning and development KPIs.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Learning Dashboard" subtitle="Overview of learning and development KPIs.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        {!data ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500 font-medium">No dashboard data available.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {KPI_CONFIG.map((kpi) => {
                const val = data[kpi.key];
                const display = kpi.key === "avg_progress" && val != null ? `${val}%` : (val ?? "-");
                return (
                  <div key={kpi.key} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
                    <p className="text-xs text-gray-400">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{display}</p>
                  </div>
                );
              })}
            </div>
            {data.avg_progress != null && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Average Course Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${Math.min(data.avg_progress, 100)}%` }} />
                  </div>
                  <span className="text-lg font-bold text-gray-800">{data.avg_progress}%</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HRPage>
  );
}
