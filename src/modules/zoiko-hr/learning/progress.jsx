import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getEmployeeLearningProgress,
  getEnrollments,
} from "../../../service/hrService";

const PROGRESS_STATUS_COLORS = {
  enrolled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const ITEMS_PER_PAGE = 10;

export default function ZoikoHRProgress() {
  const [progress, setProgress] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEmployeeProgress = async (empId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployeeLearningProgress(empId);
      setProgress(data);
      setEnrollments([]);
    } catch (err) {
      setError(err.message || "Failed to load employee progress");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEnrollments();
      setEnrollments(Array.isArray(data) ? data : []);
      setProgress(null);
    } catch (err) {
      setError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId.trim()) {
      fetchEmployeeProgress(employeeId.trim());
    } else {
      fetchEnrollments();
    }
  }, []);

  const handleTrack = () => {
    setCurrentPage(1);
    setSearch("");
    setStatusFilter("");
    if (employeeId.trim()) {
      fetchEmployeeProgress(employeeId.trim());
    } else {
      fetchEnrollments();
    }
  };

  const kpiCards = useMemo(() => {
    if (!progress || !progress.enrollments) return null;
    const enrolls = Array.isArray(progress.enrollments) ? progress.enrollments : [];
    const total = enrolls.length;
    const completed = enrolls.filter((e) => e.status === "completed").length;
    const inProgress = enrolls.filter((e) => e.status === "in_progress").length;
    const avgProgress = total > 0
      ? Math.round(enrolls.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / total)
      : 0;
    return { total, completed, inProgress, avgProgress };
  }, [progress]);

  const filtered = useMemo(() => {
    let result = enrollments;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          String(e.employee_id).includes(q) ||
          String(e.course_id).includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }
    return result;
  }, [enrollments, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const enrollEnrties = useMemo(() => {
    if (!progress || !progress.enrollments) return [];
    return Array.isArray(progress.enrollments) ? progress.enrollments : [];
  }, [progress]);

  const eTotalPages = Math.max(1, Math.ceil(enrollEnrties.length / ITEMS_PER_PAGE));
  const eSafePage = Math.min(currentPage, eTotalPages);
  const ePaginated = useMemo(() => {
    const start = (eSafePage - 1) * ITEMS_PER_PAGE;
    return enrollEnrties.slice(start, start + ITEMS_PER_PAGE);
  }, [enrollEnrties, eSafePage]);

  const statusOptions = ["enrolled", "in_progress", "completed", "cancelled"];

  return (
    <HRPage title="Progress Tracking" subtitle="Track employee learning progress and enrollment status.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Enter Employee ID to track..."
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleTrack(); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTrack}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {employeeId.trim() ? "Track Employee" : "Show All Enrollments"}
          </button>
          {progress && (
            <button
              onClick={() => { setEmployeeId(""); setCurrentPage(1); fetchEnrollments(); }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Clear
            </button>
          )}
        </div>

        {loading && !progress && enrollments.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading progress data...</span>
          </div>
        )}

        {progress && !loading && (
          <>
            {kpiCards && (
              <div className="flex flex-wrap gap-3">
                <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
                  <span className="text-gray-400">Total Courses: </span>
                  <span className="font-bold text-gray-800">{kpiCards.total}</span>
                </div>
                <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
                  <span className="text-gray-400">Completed: </span>
                  <span className="font-bold text-green-600">{kpiCards.completed}</span>
                </div>
                <div className="bg-white px-4 py-2 border border-yellow-100 rounded-lg shadow-sm text-sm">
                  <span className="text-gray-400">In Progress: </span>
                  <span className="font-bold text-yellow-600">{kpiCards.inProgress}</span>
                </div>
                <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
                  <span className="text-gray-400">Avg Progress: </span>
                  <span className="font-bold text-blue-600">{kpiCards.avgProgress}%</span>
                </div>
              </div>
            )}

            {kpiCards && kpiCards.total > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full transition-all" style={{ width: `${Math.min(kpiCards.avgProgress, 100)}%` }} />
                  </div>
                  <span className="text-lg font-bold text-gray-800">{kpiCards.avgProgress}%</span>
                </div>
              </div>
            )}

            {enrollEnrties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">No enrollments found for this employee.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Course</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Progress %</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Enrolled</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-600">Completed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ePaginated.map((e) => (
                          <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{e.course_id}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PROGRESS_STATUS_COLORS[e.status] || ""}`}>
                                {e.status?.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(e.progress_percent || 0, 100)}%` }} />
                                </div>
                                <span className="text-xs font-medium">{e.progress_percent || 0}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : <span className="text-gray-300">-</span>}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{e.completed_at ? new Date(e.completed_at).toLocaleDateString() : <span className="text-gray-300">-</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {eTotalPages > 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Showing {(eSafePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(eSafePage * ITEMS_PER_PAGE, enrollEnrties.length)} of {enrollEnrties.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={eSafePage <= 1}
                        className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                      >
                        Prev
                      </button>
                      {Array.from({ length: eTotalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`px-3 py-1 text-sm border rounded-lg ${
                            p === eSafePage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(eTotalPages, p + 1))}
                        disabled={eSafePage >= eTotalPages}
                        className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!progress && !loading && enrollments.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search by employee or course..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Course</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-600">Progress</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{e.employee_id}</td>
                        <td className="px-4 py-3 text-gray-600">{e.course_id}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PROGRESS_STATUS_COLORS[e.status] || ""}`}>
                            {e.status?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(e.progress_percent || 0, 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium">{e.progress_percent || 0}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium">{e.score ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        p === safePage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!progress && !loading && enrollments.length === 0 && !employeeId.trim() && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              Enter an Employee ID above to track progress, or click "Show All Enrollments" to view all.
            </p>
          </div>
        )}
      </div>
    </HRPage>
  );
}
