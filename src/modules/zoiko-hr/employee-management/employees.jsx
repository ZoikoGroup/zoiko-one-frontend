import { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeById } from "../../../service/hrService";
import { User, Edit, Trash2, Plus, Search, Filter, X, CheckCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Eye, UserCheck, UserX, FileText } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/employee-management" },
  { label: "Employees", href: "/zoiko-hr/employee-management/employees" },
  { label: "Organization Structure", href: "/zoiko-hr/employee-management/organization" },
  { label: "Employee Lifecycle", href: "/zoiko-hr/employee-management/lifecycle" },
  { label: "Reports", href: "/zoiko-hr/employee-management/reports" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/employee-management"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  on_leave: "bg-yellow-100 text-yellow-800",
  terminated: "bg-gray-100 text-gray-800",
  resigned: "bg-orange-100 text-orange-800",
};

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
  { value: "resigned", label: "Resigned" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
  { value: "probation", label: "Probation" },
];

const DEPARTMENT_COLORS = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-red-500", "bg-teal-500", "bg-cyan-500", "bg-indigo-500",
];

const ITEMS_PER_PAGE = 10;

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  job_title: "",
  employment_type: "full_time",
  status: "active",
  department_id: "",
  basic_salary: "",
  date_of_joining: "",
  address: "",
};

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees({
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        search: search,
        status: statusFilter,
        department_id: departmentFilter,
      });
      setEmployees(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, search, statusFilter, departmentFilter, employmentTypeFilter]);

  const departments = useMemo(() => {
    const seen = new Set();
    const depts = [];
    employees.forEach((e) => {
      const key = e.department_id;
      const name = e.department_name || e.department?.name || e.department || "";
      if (key && !seen.has(key)) {
        seen.add(key);
        depts.push({ id: key, name });
      }
    });
    return depts;
  }, [employees]);

  const filtered = useMemo(() => {
    let result = employees;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.first_name?.toLowerCase().includes(q) ||
          e.last_name?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.employee_code?.toLowerCase().includes(q) ||
          e.job_title?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((e) => e.status === statusFilter);
    }
    if (departmentFilter) {
      result = result.filter((e) => String(e.department_id) === departmentFilter);
    }
    if (employmentTypeFilter) {
      result = result.filter((e) => e.employment_type === employmentTypeFilter);
    }
    return result;
  }, [employees, search, statusFilter, departmentFilter, employmentTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => {
    setFormData({ ...initialForm });
    setFormErrors({});
    setEditId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = async (employee) => {
    setEditId(employee.id);
    try {
      const fullEmployee = await getEmployeeById(employee.id);
      setFormData({
        first_name: fullEmployee.first_name || "",
        last_name: fullEmployee.last_name || "",
        email: fullEmployee.email || "",
        password: "",
        phone: fullEmployee.phone || "",
        job_title: fullEmployee.job_title || "",
        employment_type: fullEmployee.employment_type || "full_time",
        status: fullEmployee.status || "active",
        department_id: fullEmployee.department_id ? String(fullEmployee.department_id) : "",
        basic_salary: fullEmployee.basic_salary ? String(fullEmployee.basic_salary) : "",
        date_of_joining: fullEmployee.date_of_joining || "",
        address: fullEmployee.address || "",
      });
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to load employee details" });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = "First name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email";
    if (!formData.job_title.trim()) errors.job_title = "Job title is required";
    if (!formData.password && !editId) errors.password = "Password is required for new employees";
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!formData.date_of_joining && !editId) errors.date_of_joining = "Date of joining is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password || undefined,
        phone: formData.phone.trim() || null,
        job_title: formData.job_title.trim(),
        employment_type: formData.employment_type,
        status: formData.status,
        department_id: formData.department_id ? Number(formData.department_id) : null,
        basic_salary: formData.basic_salary ? Number(formData.basic_salary) : null,
        date_of_joining: formData.date_of_joining || null,
        address: formData.address.trim() || null,
      };
      if (editId) {
        await updateEmployee(editId, payload);
      } else {
        await createEmployee(payload);
      }
      setShowModal(false);
      resetForm();
      await fetchEmployees();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save employee" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee? This action cannot be undone.")) return;
    try {
      await deleteEmployee(id);
      await fetchEmployees();
    } catch (err) {
      setError(err.message || "Failed to delete employee");
    }
  };

  const handleExport = () => {
    setExporting(true);
    try {
      const headers = ["Employee ID", "First Name", "Last Name", "Email", "Phone", "Job Title", "Department", "Employment Type", "Status", "Joining Date", "Basic Salary"];
      const rows = filtered.map((e) => [
        e.employee_code || "",
        e.first_name || "",
        e.last_name || "",
        e.email || "",
        e.phone || "",
        e.job_title || "",
        e.department_name || e.department?.name || "",
        EMPLOYMENT_TYPE_OPTIONS.find((opt) => opt.value === e.employment_type)?.label || e.employment_type || "",
        STATUS_OPTIONS.find((opt) => opt.value === e.status)?.label || e.status || "",
        e.date_of_joining || "",
        e.basic_salary || "",
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Failed to export employees");
    } finally {
      setExporting(false);
    }
  };

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "ACTIVE").length;
    const onLeave = employees.filter((e) => e.status === "ON_LEAVE").length;
    const inactive = employees.filter((e) => e.status === "INACTIVE" || e.status === "RESIGNED").length;
    return { total, active, onLeave, inactive };
  }, [employees]);

  if (loading && employees.length === 0) {
    return (
      <HRPage title="Employees" subtitle="Manage employee directory and records.">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading employees...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Employees" subtitle="Manage employee directory and records.">
      <SubNav />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-lg font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <p className="text-xs text-gray-400">Active</p>
            <p className="text-lg font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <p className="text-xs text-gray-400">On Leave</p>
            <p className="text-lg font-bold text-yellow-600">{stats.onLeave}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
            <p className="text-xs text-gray-400">Inactive</p>
            <p className="text-lg font-bold text-red-600">{stats.inactive}</p>
          </div>
          {STATUS_OPTIONS.map((s) => (
            <div key={s.value} className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-lg font-bold ${s.value === "ACTIVE" ? "text-green-600" : s.value === "INACTIVE" || s.value === "RESIGNED" ? "text-red-600" : s.value === "ON_LEAVE" ? "text-yellow-600" : "text-blue-600"}`}>
                {employees.filter((e) => e.status === s.value).length}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, code..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-8"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name || `Dept #${d.id}`}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={employmentTypeFilter}
                onChange={(e) => { setEmploymentTypeFilter(e.target.value); setCurrentPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
              >
                <option value="">All Types</option>
                {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={exporting || filtered.length === 0}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> {exporting ? "Exporting..." : "Export CSV"}
            </button>
            <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          </div>
        </div>

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              {employees.length === 0 ? "No employees found yet." : "No employees match your search."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="w-8 px-2 py-3"></th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Employee</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Contact</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Position</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Department</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-3 py-3 font-semibold text-gray-600">Joined</th>
                    <th className="text-right px-3 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-3">
                        <button
                          onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                          className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                          {expandedId === e.id ? "▼" : "▶"}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">{e.first_name?.charAt(0)}{e.last_name?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{e.first_name} {e.last_name}</p>
                            <p className="text-xs text-gray-500">{e.employee_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-sm text-gray-700">{e.email}</p>
                        <p className="text-xs text-gray-500">{e.phone}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-sm text-gray-700 font-medium">{e.job_title}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[e.department_id % DEPARTMENT_COLORS.length]} text-white`}>{e.department_name || e.department?.name || "-"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-600">{EMPLOYMENT_TYPE_OPTIONS.find((opt) => opt.value === e.employment_type)?.label || e.employment_type}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[e.status] || ""}`}>{STATUS_OPTIONS.find((opt) => opt.value === e.status)?.label || e.status}</span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs text-gray-500">{e.date_of_joining ? new Date(e.date_of_joining).toLocaleDateString() : "-"}</p>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <button onClick={() => navigate(`/zoiko-hr/employee-management/employees/${e.id}`)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(e)} className="text-green-600 hover:text-green-800 text-xs font-medium px-1" title="Edit">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {e.status === "ACTIVE" && (
                            <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 text-xs px-1" title="Deactivate">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {e.status !== "ACTIVE" && (
                            <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-600 text-xs px-1" title="Delete">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Page {safePage} of {totalPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-xs border rounded ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-xs border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editId ? "Edit Employee" : "Add New Employee"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.submit && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.submit}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className={`w-full border ${formErrors.first_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {formErrors.first_name && <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className={`w-full border ${formErrors.last_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {formErrors.last_name && <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full border ${formErrors.email ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input type="text" value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className={`w-full border ${formErrors.job_title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {formErrors.job_title && <p className="text-red-500 text-xs mt-1">{formErrors.job_title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                  <input type="number" min="1" value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                  <input type="number" min="0" step="0.01" value={formData.basic_salary} onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                  <input type="date" value={formData.date_of_joining} onChange={(e) => setFormData({ ...formData, date_of_joining: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={`w-full border ${formErrors.password ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}