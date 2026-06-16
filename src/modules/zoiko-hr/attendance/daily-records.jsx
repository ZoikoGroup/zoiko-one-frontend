import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Download, Search } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAttendance } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/attendance" },
  { label: "Daily Records", href: "/zoiko-hr/attendance/daily" },
  { label: "My Attendance", href: "/zoiko-hr/attendance/my-attendance" },
  { label: "Corrections", href: "/zoiko-hr/attendance/corrections" },
  { label: "Schedule", href: "/zoiko-hr/attendance/schedule" },
  { label: "Reports", href: "/zoiko-hr/attendance/reports" },
  { label: "Settings", href: "/zoiko-hr/attendance/settings" },
];

const STATUS_COLORS = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-orange-100 text-orange-800",
  on_leave: "bg-blue-100 text-blue-800",
  wfh: "bg-purple-100 text-purple-800",
  half_day: "bg-yellow-100 text-yellow-800",
  holiday: "bg-pink-100 text-pink-800",
};

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/attendance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "-";
  const d = new Date(timeStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function DailyRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", department: "", date: "" });

  useEffect(() => {
    let mounted = true;
    getAttendance()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    let result = records;
    if (filters.status) result = result.filter((r) => r.status === filters.status);
    if (filters.department) result = result.filter((r) => r.department === filters.department);
    if (filters.date) result = result.filter((r) => r.work_date === filters.date || r.date === filters.date);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q) ||
        (r.department || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [records, search, filters]);

  if (loading) {
    return (
      <HRPage title="Daily Records" subtitle="View and manage daily attendance logs">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading records...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Daily Records" subtitle="View and manage daily attendance logs">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Records</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage daily attendance logs</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="on_leave">On Leave</option>
            <option value="wfh">WFH</option>
          </select>
          <select value={filters.department} onChange={(e) => handleFilterChange("department", e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
          <input type="date" value={filters.date} onChange={(e) => handleFilterChange("date", e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.employee_name || row.employee || `Employee #${row.employee_id}`}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.department || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(row.work_date || row.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatTime(row.clock_in)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatTime(row.clock_out)}</td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
