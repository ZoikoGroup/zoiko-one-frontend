import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText, Download, Calendar, Search,
  BarChart3, Users, Clock, AlertTriangle,
  Sun, Moon, UserX, Shield,
  Eye, X, Loader2, FileSpreadsheet
} from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getAttendance,
  getDailyReport,
  getMonthlyReport,
  getDepartmentReport,
  getShiftReport,
  getLateArrivalReport,
  getOvertimeReport,
  getAbsenteeReport,
  getComplianceReport,
  exportAttendanceCsv,
  exportAttendanceExcel,
} from "../../../service/hrService";





const REPORT_TYPES = [
  {
    id: "daily",
    title: "Daily Report",
    description: "Day-wise attendance summary with check-in/out times and status",
    icon: Calendar,
    fetch: getDailyReport,
    type: "Daily",
  },
  {
    id: "monthly",
    title: "Monthly Report",
    description: "Monthly attendance summary with totals, averages and trends",
    icon: BarChart3,
    fetch: getMonthlyReport,
    type: "Monthly",
  },
  {
    id: "department",
    title: "Department Report",
    description: "Attendance breakdown by department with comparative analysis",
    icon: Users,
    fetch: getDepartmentReport,
    type: "Department",
  },
  {
    id: "shift",
    title: "Shift Report",
    description: "Shift-wise attendance tracking and coverage summary",
    icon: Clock,
    fetch: getShiftReport,
    type: "Shift",
  },
  {
    id: "late_arrival",
    title: "Late Arrival Report",
    description: "Late arrival incidents, patterns and frequency analysis",
    icon: AlertTriangle,
    fetch: getLateArrivalReport,
    type: "Late Arrival",
  },
  {
    id: "overtime",
    title: "Overtime Report",
    description: "Overtime hours breakdown by employee and department",
    icon: Sun,
    fetch: getOvertimeReport,
    type: "Overtime",
  },
  {
    id: "absentee",
    title: "Absentee Report",
    description: "Absenteeism trends, frequency distribution and patterns",
    icon: UserX,
    fetch: getAbsenteeReport,
    type: "Absentee",
  },
  {
    id: "compliance",
    title: "Compliance Report",
    description: "Policy compliance tracking and attendance exception summary",
    icon: Shield,
    fetch: getComplianceReport,
    type: "Compliance",
  },
];

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatReportDate(dateStr) {
  if (!dateStr) return new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

async function downloadFromApi(fetchFn, filename, extension) {
  const response = await fetchFn();
  const blob = response instanceof Blob ? response : new Blob([JSON.stringify(response)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${extension}`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AttendanceReports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getAttendance()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch((err) => { if (mounted) setError(err.message || "Failed to load reports"); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const reports = useMemo(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString("en-US", { month: "long", year: "numeric" });
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;

    return REPORT_TYPES.map((rt) => ({
      ...rt,
      date: formatReportDate(dateRange || now.toISOString()),
      size: formatFileSize(Math.floor(Math.random() * 3000000) + 500000),
      summary: {
        total,
        present,
        absent,
        late,
      },
    }));
  }, [records, dateRange]);

  const filtered = useMemo(() => {
    if (!search) return reports;
    const q = search.toLowerCase();
    return reports.filter((r) =>
      r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.type.toLowerCase().includes(q)
    );
  }, [reports, search]);

  const fetchReportData = useCallback(async (report) => {
    setSelectedReport(report);
    setReportLoading(true);
    setReportError(null);
    setReportData(null);
    try {
      const data = await report.fetch({ date: dateRange || undefined });
      setReportData(data);
    } catch (err) {
      setReportError(err.message || "Failed to load report data");
    } finally {
      setReportLoading(false);
    }
  }, [dateRange]);

  const closePreview = useCallback(() => {
    setSelectedReport(null);
    setReportData(null);
    setReportError(null);
  }, []);

  const handleExportCsv = useCallback(async (report) => {
    try {
      await downloadFromApi(
        () => exportAttendanceCsv({ type: report.id, date: dateRange }),
        `${report.id}_report_${new Date().toISOString().split("T")[0]}`,
        "csv"
      );
    } catch (err) {
      setReportError(err.message || "Export failed");
    }
  }, [dateRange]);

  const handleExportExcel = useCallback(async (report) => {
    try {
      await downloadFromApi(
        () => exportAttendanceExcel({ type: report.id, date: dateRange }),
        `${report.id}_report_${new Date().toISOString().split("T")[0]}`,
        "xlsx"
      );
    } catch (err) {
      setReportError(err.message || "Export failed");
    }
  }, [dateRange]);

  const renderPreviewTable = () => {
    if (reportLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-sm">Loading report data...</span>
        </div>
      );
    }

    if (reportError) {
      return (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {reportError}
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mb-2" />
          <span className="text-sm">No data available</span>
        </div>
      );
    }

    const data = Array.isArray(reportData) ? reportData : reportData.data || reportData.records || [];

    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mb-2" />
          <span className="text-sm">No records found for this report</span>
        </div>
      );
    }

    const columns = data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "id") : [];

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr key={row.id ?? i} className="hover:bg-indigo-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {String(row[col] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <HRPage title="Attendance Reports" subtitle="Generate, view and download attendance reports">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading reports...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Attendance Reports" subtitle="Generate, view and download attendance reports">
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">Error: {error}</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Reports" subtitle="Generate, view and download attendance reports">
            <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Generate, view and download attendance reports</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <input type="month" value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">No reports found</span>
            <span className="text-xs mt-1">Try adjusting your search criteria</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{report.type}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 flex-1">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                    <span>{report.size}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <button onClick={() => fetchReportData(report)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex-1">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button onClick={() => handleExportCsv(report)} title="Download CSV"
                      className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleExportExcel(report)} title="Download Excel"
                      className="p-2 border border-gray-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedReport && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  {(() => { const Icon = selectedReport.icon; return <Icon className="w-4 h-4 text-indigo-600" />; })()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedReport.title} Preview</h2>
                  <p className="text-xs text-gray-400">{selectedReport.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleExportCsv(selectedReport)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                </button>
                <button onClick={() => handleExportExcel(selectedReport)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-green-600 hover:bg-green-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
                <button onClick={closePreview}
                  className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {renderPreviewTable()}
          </div>
        )}
      </div>
    </HRPage>
  );
}

