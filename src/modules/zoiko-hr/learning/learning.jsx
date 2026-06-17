import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getLearningDashboard,
  getCourses, createCourse, updateCourse, deleteCourse,
  getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment,
  getLearningPaths, createLearningPath, updateLearningPath, deleteLearningPath,
  addPathItem, removePathItem,
  getCertifications, createCertification, deleteCertification,
  getSkills, createSkill, updateSkill, deleteSkill,
  getEmployees,
} from "../../../service/hrService";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "courses", label: "Courses" },
  { key: "enrollments", label: "Enrollments" },
  { key: "paths", label: "Paths" },
  { key: "certifications", label: "Certifications" },
  { key: "skills", label: "Skills" },
];

const ITEMS_PER_PAGE = 8;

const emptyCourse = { course_name: "", description: "", course_type: "", category: "", provider: "", duration_hours: "", cost: "" };
const emptyEnrollment = { employee_id: "", course_id: "", notes: "" };
const emptyPath = { name: "", description: "" };
const emptyCert = { employee_id: "", certification_name: "", issuing_organization: "", issue_date: "", expiry_date: "", credential_url: "" };
const emptySkill = { employee_id: "", skill_name: "", category: "", proficiency_level: "3" };

const ENROLL_STATUS_COLORS = {
  enrolled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function Learning() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <HRPage title="Learning & Development" subtitle="Course catalog, enrollments, paths, certifications, and skills.">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "courses" && <CoursesTab />}
      {activeTab === "enrollments" && <EnrollmentsTab />}
      {activeTab === "paths" && <PathsTab />}
      {activeTab === "certifications" && <CertificationsTab />}
      {activeTab === "skills" && <SkillsTab />}
    </HRPage>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLearningDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{error}</div>;
  if (!stats) return <div className="text-gray-400 py-8 text-center">No data available.</div>;

  const cards = [
    { label: "Total Courses", value: stats.total_courses, color: "text-blue-600" },
    { label: "Active Courses", value: stats.active_courses, color: "text-indigo-600" },
    { label: "Total Enrollments", value: stats.total_enrollments, color: "text-yellow-600" },
    { label: "Completed", value: stats.completed_enrollments, color: "text-green-600" },
    { label: "Completion Rate", value: stats.completion_rate != null ? `${stats.completion_rate}%` : "N/A", color: "text-teal-600" },
    { label: "Certifications", value: stats.total_certifications, color: "text-purple-600" },
    { label: "Skills Tracked", value: stats.total_skills, color: "text-cyan-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyCourse });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getCourses().then((d) => setItems(d?.items || (Array.isArray(d) ? d : []))).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const categories = useMemo(() => [...new Set(items.map((c) => c.category).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.course_name?.toLowerCase().includes(q) || x.provider?.toLowerCase().includes(q)); }
    if (catFilter) r = r.filter((x) => x.category === catFilter);
    return r;
  }, [items, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyCourse }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      course_name: item.course_name, description: item.description || "", course_type: item.course_type || "",
      category: item.category || "", provider: item.provider || "", duration_hours: item.duration_hours || "",
      cost: item.cost || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_name) return;
    setSubmitting(true);
    try {
      const payload = {
        course_name: form.course_name, description: form.description || null, course_type: form.course_type || null,
        category: form.category || null, provider: form.provider || null, duration_hours: form.duration_hours ? Number(form.duration_hours) : null,
        cost: form.cost ? Number(form.cost) : null,
      };
      if (editId) await updateCourse(editId, payload);
      else await createCourse(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await deleteCourse(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <LoadingSpinner />;

  return (
    <Section error={error} onClearError={() => setError(null)}
      toolbar={
        <>
          <input type="text" placeholder="Search courses..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto">+ New Course</button>
        </>
      }
      empty={items.length === 0 ? "No courses yet." : "No matches."}
      totalPages={totalPages} safePage={safePage} onPageChange={setCurrentPage}
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Course Name</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Category</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Duration</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Cost</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Type</th>
            <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 font-medium text-gray-800">{c.course_name}</td>
              <td className="px-3 py-3"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{c.category || "-"}</span></td>
              <td className="px-3 py-3 text-xs text-gray-500">{c.duration_hours ? `${c.duration_hours}h` : "-"}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{c.cost != null ? `$${c.cost}` : "-"}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{c.course_type || "-"}</td>
              <td className="px-3 py-3 text-right">
                <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} title={editId ? "Edit Course" : "New Course"} onClose={() => { setShowModal(false); resetForm(); }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
            <input type="text" value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input type="text" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
              <select value={form.course_type} onChange={(e) => setForm({ ...form, course_type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                <option value="online">Online</option>
                <option value="in_person">In Person</option>
                <option value="hybrid">Hybrid</option>
                <option value="self_paced">Self Paced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
              <input type="number" min="0" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input type="number" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}

function EnrollmentsTab() {
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
    setLoading(true); setError(null);
    Promise.all([
      getEnrollments(),
      getCourses(),
      getEmployees(),
    ]).then(([enrolls, crs, emps]) => {
      setItems(enrolls?.items || (Array.isArray(enrolls) ? enrolls : []));
      setCourses(crs?.items || (Array.isArray(crs) ? crs : []));
      setEmployees(emps?.items || (Array.isArray(emps) ? emps : []));
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const courseMap = useMemo(() => {
    const m = {}; courses.forEach((c) => { m[c.id] = c; }); return m;
  }, [courses]);

  const employeeMap = useMemo(() => {
    const m = {}; employees.forEach((e) => { m[e.id] = e; }); return m;
  }, [employees]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => String(x.employee_id).includes(q) || courseMap[x.course_id]?.course_name?.toLowerCase().includes(q)); }
    if (statusFilter) r = r.filter((x) => x.status === statusFilter);
    return r;
  }, [items, search, statusFilter, courseMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptyEnrollment }); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.course_id) return;
    setSubmitting(true);
    try {
      const payload = { employee_id: Number(form.employee_id), course_id: Number(form.course_id), notes: form.notes || null };
      if (editId) {
        await updateEnrollment(editId, payload);
      } else {
        await createEnrollment(payload);
      }
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateEnrollment(id, { status }); fetch(); }
    catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;
    try { await deleteEnrollment(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <LoadingSpinner />;

  const statusOptions = ["enrolled", "in_progress", "completed", "cancelled"];

  return (
    <Section error={error} onClearError={() => setError(null)}
      toolbar={
        <>
          <input type="text" placeholder="Search employee/course..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto">+ Enroll</button>
        </>
      }
      empty={items.length === 0 ? "No enrollments yet." : "No matches."}
      totalPages={totalPages} safePage={safePage} onPageChange={setCurrentPage}
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Course</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-600">Progress</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-600">Score</th>
            <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 font-medium text-gray-800">{employeeMap[e.employee_id] ? `${employeeMap[e.employee_id].first_name || ""} ${employeeMap[e.employee_id].last_name || ""}`.trim() || `#${e.employee_id}` : `#${e.employee_id}`}</td>
              <td className="px-3 py-3 text-gray-600">{courseMap[e.course_id]?.course_name || courseMap[e.course_id]?.title || `#${e.course_id}`}</td>
              <td className="px-3 py-3">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ENROLL_STATUS_COLORS[e.status] || ""}`}>{e.status?.replace("_", " ")}</span>
              </td>
              <td className="px-3 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(e.progress_pct || 0, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium">{e.progress_pct || 0}%</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-medium">{e.score ?? "-"}</td>
              <td className="px-3 py-3 text-right">
                <div className="flex items-center justify-end gap-1 flex-wrap">
                  {e.status === "enrolled" && <button onClick={() => handleStatusChange(e.id, "in_progress")} className="text-green-600 hover:text-green-800 text-xs font-medium px-1">Start</button>}
                  {e.status === "in_progress" && <button onClick={() => handleStatusChange(e.id, "completed")} className="text-green-600 hover:text-green-800 text-xs font-medium px-1">Complete</button>}
                  {(e.status === "enrolled" || e.status === "in_progress") && <button onClick={() => handleStatusChange(e.id, "cancelled")} className="text-red-500 hover:text-red-700 text-xs px-1">Cancel</button>}
                  <button onClick={() => {
                    setEditId(e.id);
                    setForm({ employee_id: String(e.employee_id), course_id: String(e.course_id), notes: e.notes || "" });
                    setShowModal(true);
                  }} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1">Edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 text-xs px-1">Del</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} title={editId ? "Edit Enrollment" : "New Enrollment"} onClose={() => { setShowModal(false); resetForm(); }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course ID *</label>
              <input type="number" min="1" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Enroll"}</button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}

function PathsTab() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyPath });
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newItemCourse, setNewItemCourse] = useState("");

  const fetch = () => {
    setLoading(true); setError(null);
    Promise.all([getLearningPaths(), getCourses()])
      .then(([paths, crs]) => {
        setItems(Array.isArray(paths) ? paths : []);
        setCourses(crs?.items || (Array.isArray(crs) ? crs : []));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => { setForm({ ...emptyPath }); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSubmitting(true);
    try {
      const payload = { name: form.name, description: form.description || null };
      if (editId) await updateLearningPath(editId, payload);
      else await createLearningPath(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this learning path?")) return;
    try { await deleteLearningPath(id); fetch(); if (expandedId === id) setExpandedId(null); }
    catch (e) { setError(e.message); }
  };

  const handleAddItem = async (pathId) => {
    if (!newItemCourse) return;
    try { await addPathItem(pathId, { course_id: Number(newItemCourse), sort_order: 0 }); setNewItemCourse(""); fetch(); }
    catch (e) { setError(e.message); }
  };

  const handleRemoveItem = async (pathId, itemId) => {
    try { await removePathItem(pathId, itemId); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <LoadingSpinner />;

  return (
    <Section error={error} onClearError={() => setError(null)}
      toolbar={
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto">+ New Path</button>
      }
      empty={items.length === 0 ? "No learning paths yet." : undefined}
    >
      <div className="divide-y divide-gray-100">
        {items.map((p) => (
          <div key={p.id}>
            <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="text-gray-400 hover:text-gray-600 text-xs">{expandedId === p.id ? "\u25BC" : "\u25B6"}</button>
                <div>
                  <span className="font-medium text-gray-800">{p.name}</span>
                  {p.description && <span className="text-xs text-gray-400 ml-2">{p.description}</span>}
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{p.items?.length || 0} courses</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditId(p.id); setForm({ name: p.name, description: p.description || "" }); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
              </div>
            </div>
            {expandedId === p.id && (
              <div className="bg-gray-50 px-8 py-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Courses in this path:</div>
                {(!p.items || p.items.length === 0) ? (
                  <div className="text-xs text-gray-400 mb-2">No courses added yet.</div>
                ) : (
                  <ul className="space-y-1 mb-3">
                    {p.items.map((item) => {
                      const found = courses.find((c) => c.id === item.course_id);
                      return (
                        <li key={item.id} className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">{item.sort_order}.</span>
                          <span className="text-gray-700">{found?.course_name || found?.title || `Course #${item.course_id}`}</span>
                          {item.required && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">required</span>}
                          <button onClick={() => handleRemoveItem(p.id, item.id)} className="text-red-400 hover:text-red-600 text-xs ml-auto">&times;</button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="flex gap-2 items-center">
                  <input type="number" min="1" placeholder="Course ID" value={newItemCourse} onChange={(e) => setNewItemCourse(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddItem(p.id); } }} />
                  <button onClick={() => handleAddItem(p.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-medium">Add</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal show={showModal} title={editId ? "Edit Path" : "New Learning Path"} onClose={() => { setShowModal(false); resetForm(); }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}

function CertificationsTab() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyCert });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    Promise.all([getCertifications(), getCourses()])
      .then(([certs, crs]) => {
        setItems(Array.isArray(certs) ? certs : []);
        setCourses(crs?.items || (Array.isArray(crs) ? crs : []));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const courseMap = useMemo(() => { const m = {}; courses.forEach((c) => { m[c.id] = c; }); return m; }, [courses]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.certification_name?.toLowerCase().includes(q) || String(x.employee_id).includes(q)); }
    return r;
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_id || !form.certification_name || !form.issue_date) return;
    setSubmitting(true);
    try {
      await createCertification({
        employee_id: Number(form.employee_id),
        certification_name: form.certification_name,
        issuing_organization: form.issuing_organization,
        issue_date: form.issue_date,
        expiry_date: form.expiry_date || null,
        credential_url: form.credential_url || null,
      });
      setShowModal(false); setForm({ ...emptyCert }); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try { await deleteCertification(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <LoadingSpinner />;

  return (
    <Section error={error} onClearError={() => setError(null)}
      toolbar={
        <>
          <input type="text" placeholder="Search certifications..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => { setForm({ ...emptyCert }); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto">+ Issue Certification</button>
        </>
      }
      empty={items.length === 0 ? "No certifications yet." : "No matches."}
      totalPages={totalPages} safePage={safePage} onPageChange={setCurrentPage}
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Certification</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Course</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Issued</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Expires</th>
            <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 font-medium text-gray-800">{c.employee_id}</td>
              <td className="px-3 py-3 text-gray-700">{c.certification_name}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{courseMap[c.course_id]?.course_name || courseMap[c.course_id]?.title || (c.course_id ? `#${c.course_id}` : "-")}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{c.issue_date}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{c.expiry_date || "-"}</td>
              <td className="px-3 py-3 text-right">
                <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} title="Issue Certification" onClose={() => { setShowModal(false); setForm({ ...emptyCert }); }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
              <input type="text" value={form.issuing_organization} onChange={(e) => setForm({ ...form, issuing_organization: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
            <input type="text" value={form.certification_name} onChange={(e) => setForm({ ...form, certification_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
              <input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
            <input type="url" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); setForm({ ...emptyCert }); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : "Issue"}</button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}

function SkillsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptySkill });
  const [submitting, setSubmitting] = useState(false);

  const fetch = () => {
    setLoading(true); setError(null);
    getSkills().then((d) => setItems(Array.isArray(d) ? d : [])).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const categories = useMemo(() => [...new Set(items.map((s) => s.category).filter(Boolean))], [items]);

  const filtered = useMemo(() => {
    let r = items;
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((x) => x.skill_name?.toLowerCase().includes(q)); }
    if (catFilter) r = r.filter((x) => x.category === catFilter);
    return r;
  }, [items, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => { const s = (safePage - 1) * ITEMS_PER_PAGE; return filtered.slice(s, s + ITEMS_PER_PAGE); }, [filtered, safePage]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => { setForm({ ...emptySkill }); setEditId(null); };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm({ employee_id: String(item.employee_id), skill_name: item.skill_name, category: item.category || "", proficiency_level: String(item.proficiency_level) });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skill_name || !form.employee_id) return;
    setSubmitting(true);
    try {
      const payload = {
        employee_id: Number(form.employee_id),
        skill_name: form.skill_name,
        category: form.category || null,
        proficiency_level: Number(form.proficiency_level),
      };
      if (editId) await updateSkill(editId, payload);
      else await createSkill(payload);
      setShowModal(false); resetForm(); fetch();
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try { await deleteSkill(id); fetch(); }
    catch (e) { setError(e.message); }
  };

  if (loading && items.length === 0) return <LoadingSpinner />;

  return (
    <Section error={error} onClearError={() => setError(null)}
      toolbar={
        <>
          <input type="text" placeholder="Search skills..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setCurrentPage(1); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg ml-auto">+ Add Skill</button>
        </>
      }
      empty={items.length === 0 ? "No skills tracked yet." : "No matches."}
      totalPages={totalPages} safePage={safePage} onPageChange={setCurrentPage}
    >
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Skill</th>
            <th className="text-left px-3 py-3 font-semibold text-gray-600">Category</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-600">Level</th>
            <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 font-medium text-gray-800">{s.employee_id}</td>
              <td className="px-3 py-3 text-gray-700">{s.skill_name}</td>
              <td className="px-3 py-3 text-xs text-gray-500">{s.category || "-"}</td>
              <td className="px-3 py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= s.proficiency_level ? "text-yellow-400" : "text-gray-200"}`}>&#9733;</span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-3 text-right">
                <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 text-xs">Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} title={editId ? "Edit Skill" : "Add Skill"} onClose={() => { setShowModal(false); resetForm(); }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input type="number" min="1" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
              <input type="text" value={form.skill_name} onChange={(e) => setForm({ ...form, skill_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
              <select value={form.proficiency_level} onChange={(e) => setForm({ ...form, proficiency_level: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>{l} - {l === 1 ? "Beginner" : l === 2 ? "Elementary" : l === 3 ? "Intermediate" : l === 4 ? "Advanced" : "Expert"}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">{submitting ? "Saving..." : editId ? "Update" : "Add"}</button>
          </div>
        </form>
      </Modal>
    </Section>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
}

function Modal({ show, title, children, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Section({ error, onClearError, toolbar, children, empty, totalPages, safePage, onPageChange }) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={onClearError} className="font-bold">&times;</button>
        </div>
      )}
      <div className="flex flex-wrap justify-between items-center gap-3">{toolbar}</div>
      {empty ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">{empty}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {children}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => onPageChange((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
