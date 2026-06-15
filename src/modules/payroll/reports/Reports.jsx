import { useState } from "react";
import { BarChart3, Download } from "lucide-react";
import { usePayroll } from "../PayrollContext";

const reportTypes = [
  { id: "payroll-register", label: "Payroll Register", desc: "Full breakdown per employee per period" },
  { id: "payroll-summary", label: "Payroll Summary", desc: "Aggregated totals by department" },
  { id: "variance", label: "Variance Report", desc: "Period-over-period pay changes" },
  { id: "tax-liability", label: "Tax Liability Report", desc: "TDS, PF, ESI obligations" },
  { id: "employer-cost", label: "Employer Cost Report", desc: "Total CTC breakdown" },
  { id: "dept-cost", label: "Department Cost Report", desc: "Cost allocation by team" },
];

export default function Reports() {
  const { employees, runs, addToast } = usePayroll();
  const [selectedReport, setSelectedReport] = useState("payroll-summary");
  const [selectedPeriod, setSelectedPeriod] = useState("Jun 1–15, 2026");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  // Dynamically calculate department breakdown based on active employees list
  const departments = Array.from(new Set(employees.map((e) => e.dept)));

  const deptData = departments.map((deptName) => {
    const deptEmployees = employees.filter((e) => e.dept === deptName);
    let grossSum = 0;
    let taxSum = 0;
    let netSum = 0;

    deptEmployees.forEach((emp) => {
      const gross = emp.salary;
      const tax = Math.round(gross * 0.1);
      const pf = Math.round(gross * 0.4 * 0.12);
      const esi = Math.round(gross * 0.0075);
      const pt = 200;
      const net = gross - (tax + pf + esi + pt);

      grossSum += gross;
      taxSum += tax;
      netSum += net;
    });

    return {
      dept: deptName,
      employees: deptEmployees.length,
      gross: grossSum,
      taxes: taxSum,
      net: netSum,
    };
  });

  // Filter department rows if a specific department is chosen
  const filteredRows = selectedDept === "All Departments"
    ? deptData
    : deptData.filter((r) => r.dept === selectedDept);

  // Compute Grand Totals
  const totalEmployeesCount = filteredRows.reduce((sum, r) => sum + r.employees, 0);
  const totalGross = filteredRows.reduce((sum, r) => sum + r.gross, 0);
  const totalTaxes = filteredRows.reduce((sum, r) => sum + r.taxes, 0);
  const totalNet = filteredRows.reduce((sum, r) => sum + r.net, 0);

  const handleExport = (format) => {
    const reportLabel = reportTypes.find((r) => r.id === selectedReport)?.label || "Report";
    addToast(`Exporting ${reportLabel} in ${format} format...`, "info");
    setTimeout(() => {
      addToast(`Downloaded ${reportLabel}.${format.toLowerCase()}`, "success");
    }, 1500);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent border border-teal-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Reports</h1>
            <p className="text-slate-500 text-sm">Export payroll analytics and registers</p>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Available Reports
          </p>
          {reportTypes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`w-full text-left rounded-2xl border px-4 py-3.5 transition-all ${
                selectedReport === r.id
                  ? "border-teal-400 bg-teal-50 text-teal-700 font-semibold"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold">{r.label}</p>
              <p className="text-xs opacity-75 mt-0.5 font-normal">{r.desc}</p>
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 flex-wrap">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Period Selection</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400"
              >
                {runs.map((r) => (
                  <option key={r.id} value={r.period}>{r.period}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Department Filter</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-teal-400"
              >
                <option>All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {["PDF", "Excel", "CSV"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-teal-400 hover:text-teal-650 transition shadow-sm"
                >
                  <Download size={12} /> {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-850">
                {reportTypes.find((r) => r.id === selectedReport)?.label}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{selectedPeriod}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Department", "Employees", "Gross CTC", "Tax Deducted", "Net Disbursements"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRows.map((row) => (
                  <tr key={row.dept} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-850">{row.dept}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{row.employees}</td>
                    <td className="px-5 py-3.5 text-slate-700">₹{row.gross.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-red-600">₹{row.taxes.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">₹{row.net.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50/80">
                  <td className="px-5 py-3 font-bold text-slate-800">TOTAL</td>
                  <td className="px-5 py-3 font-bold text-slate-800">{totalEmployeesCount}</td>
                  <td className="px-5 py-3 font-bold text-slate-850">₹{totalGross.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold text-red-650">₹{totalTaxes.toLocaleString()}</td>
                  <td className="px-5 py-3 font-extrabold text-slate-900">₹{totalNet.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
