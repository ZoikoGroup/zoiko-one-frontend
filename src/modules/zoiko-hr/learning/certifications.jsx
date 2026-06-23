import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getCourses,
  getHrEmployees,
} from "../../../service/hrService";

const ITEMS_PER_PAGE = 8;

const emptyCert = {
  employee_id: "",
  course_id: "",
  certification_name: "",
  issuing_organization: "",
  issue_date: "",
  expiry_date: "",
  credential_url: "",
};

export default function ZoikoHRCertifications({ isTab }) {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyCert });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true);
    setError(null);
    Promise.all([getCertifications(), getCourses(), getHrEmployees()])
      .then(([certs, crs, emps]) => {
        setItems(Array.isArray(certs) ? certs : []);
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
          x.certification_name?.toLowerCase().includes(q) ||
          String(x.employee_id).includes(q) ||
          x.issuing_organization?.toLowerCase().includes(q)
      );
    }
    return r;
  }, [items, search]);

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
    setForm({ ...emptyCert });
    setEditId(null);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      employee_id: String(item.employee_id),
      course_id: item.course_id ? String(item.course_id) : "",
      certification_name: item.certification_name,
      issuing_organization: item.issuing_organization || "",
      issue_date: item.issue_date || "",
      expiry_date: item.expiry_date || "",
      credential_url: item.credential_url || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.certification_name || !form.issue_date) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        course_id: form.course_id ? Number(form.course_id) : null,
        certification_name: form.certification_name,
        issuing_organization: form.issuing_organization || null,
        issue_date: form.issue_date,
        expiry_date: form.expiry_date || null,
        credential_url: form.credential_url || null,
      };

      if (editId) {
        await updateCertification(editId, payload);
      } else {
        await createCertification(payload);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      fetch();
    } catch (e) {
      setError(e.message);
    }
  };

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
        <input
          type="text"
          placeholder="Search certifications..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto"
        >
          + Issue Certification
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">
            {items.length === 0 ? "No certifications yet." : "No matches found."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Certification Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Organization</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Course</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Issued</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Expires</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((c) => {
                  const emp = employeeMap[c.employee_id];
                  const empName = emp ? `${emp.first_name || ""} ${emp.last_name || ""}`.trim() : `#${c.employee_id}`;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{empName}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-700">{c.certification_name}</div>
                        {c.credential_url && (
                          <a
                            href={c.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            View Credential
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.issuing_organization || "-"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {courseMap[c.course_id]?.course_name || courseMap[c.course_id]?.title || (c.course_id ? `#${c.course_id}` : "-")}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.issue_date}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.expiry_date || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(c)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Del
                        </button>
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
              <h2 className="text-lg font-bold">{editId ? "Edit Certification" : "Issue Certification"}</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                  <select
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name || ""} {emp.last_name || ""} ({emp.employee_code || `#${emp.id}`})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <select
                    value={form.course_id}
                    onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course_name || c.title || `#${c.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                <input
                  type="text"
                  value={form.certification_name}
                  onChange={(e) => setForm({ ...form, certification_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={form.issuing_organization}
                  onChange={(e) => setForm({ ...form, issuing_organization: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                  <input
                    type="date"
                    value={form.issue_date}
                    onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                <input
                  type="url"
                  value={form.credential_url}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
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
                  {submitting ? "Saving..." : editId ? "Update" : "Issue"}
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
      <HRPage title="Certifications" subtitle="Manage employee certifications and track validity.">
        {spinner}
      </HRPage>
    );
  }

  if (isTab) return content;

  return (
    <HRPage title="Certifications" subtitle="Manage employee certifications and track validity.">
      {content}
    </HRPage>
  );
}
