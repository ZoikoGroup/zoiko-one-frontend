import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getCourses,
  getHrEmployees,
} from "../../../service/hrService";

const ITEMS_PER_PAGE = 8;

const emptyEnrollment = { employee_id: "", course_id: "", notes: "" };

const ENROLL_STATUS_COLORS = {
  enrolled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function ZoikoHREnrollments({ isTab }) {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyEnrollment });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true);
    setError(null);
    Promise.all([getEnrollments(), getCourses(), getHrEmployees()])
      .then(([enrolls, crs, emps]) => {
        setItems(enrolls?.items || (Array.isArray(enrolls) ? enrolls : []));
        setCourses(crs?.items || (Array.isArray(crs) ? crs : []));
        setEmployees(emps?.items || (Array.isArray(emps) ? emps : []));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const courseMap = useMemo(() => {
    const m = {};
    courses.forEach((c) => {
      m[c.id] = c;
    });
    return m;
  }, [courses]);

  const employeeMap = useMemo(() => {
    const m = {};
    employees.forEach((e) => {
      m[e.id] = e;
    });
    return m;
  }, [employees]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (x) =>
          String(x.employee_id).includes(q) ||
          courseMap[x.course_id]?.course_name?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) r = r.filter((x) => x.status === statusFilter);
    return r;
  }, [items, search, statusFilter, courseMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const s = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(s, s + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => {
    setForm({ ...emptyEnrollment });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.course_id) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        course_id: Number(form.course_id),
        notes: form.notes || null,
      };
      if (editId) {
        await updateEnrollment(editId, payload);
      } else {
        await createEnrollment(payload);
      }
      setShowModal(false);
      resetForm();
      fetch();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnrollment(id, { status });
      fetch();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;
    try {
      await deleteEnrollment(id);
      fetch();
    } catch (e) {
      setError(e.message);
    }
  };

  const statusOptions = ["enrolled", "in_progress", "completed", "cancelled"];

  const content = (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search employee/course..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto"
        >
          + Enroll
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">
            {items.length === 0 ? "No enrollments yet." : "No matches found."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Course</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Progress</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((e) => {
                  const emp = employeeMap[e.employee_id];
                  const empName = emp
                    ? `${emp.first_name || ""} ${emp.last_name || ""}`.trim()
                    : `#${e.employee_id}`;
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{empName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {courseMap[e.course_id]?.course_name || courseMap[e.course_id]?.title || `#${e.course_id}`}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            ENROLL_STATUS_COLORS[e.status] || ""
                          }`}
                        >
                          {e.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(e.progress_pct || 0, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{e.progress_pct || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium">{e.score ?? "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          {e.status === "enrolled" && (
                            <button
                              onClick={() => handleStatusChange(e.id, "in_progress")}
                              className="text-green-600 hover:text-green-800 text-xs font-medium px-1"
                            >
                              Start
                            </button>
                          )}
                          {e.status === "in_progress" && (
                            <button
                              onClick={() => handleStatusChange(e.id, "completed")}
                              className="text-green-600 hover:text-green-800 text-xs font-medium px-1"
                            >
                              Complete
                            </button>
                          )}
                          {(e.status === "enrolled" || e.status === "in_progress") && (
                            <button
                              onClick={() => handleStatusChange(e.id, "cancelled")}
                              className="text-red-500 hover:text-red-700 text-xs px-1"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditId(e.id);
                              setForm({
                                employee_id: String(e.employee_id),
                                course_id: String(e.course_id),
                                notes: e.notes || "",
                              });
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-red-400 hover:text-red-600 text-xs px-1"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Page {safePage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 text-xs border rounded ${
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
                  className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">{editId ? "Edit Enrollment" : "New Enrollment"}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course ID *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.course_id}
                    onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
                >
                  {submitting ? "Saving..." : editId ? "Update" : "Enroll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  if (loading && items.length === 0) {
    const spinner = (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
    if (isTab) return spinner;
    return (
      <HRPage title="Enrollments" subtitle="Manage course enrollments and track progress.">
        {spinner}
      </HRPage>
    );
  }

  if (isTab) return content;

  return (
    <HRPage title="Enrollments" subtitle="Manage course enrollments and track progress.">
      {content}
    </HRPage>
  );
}
