import { useState } from "react";
import { FileText, Search, Download, Mail, Eye, X } from "lucide-react";
import { usePayroll } from "../PayrollContext";

export default function Payslips() {
  const { employees, runs, addToast } = usePayroll();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);

  // Generate payslips list dynamically from all Paid/Closed runs
  const paidRuns = runs.filter((r) => r.status === "Paid" || r.status === "Closed");
  
  const generatedPayslips = [];
  paidRuns.forEach((run) => {
    employees.forEach((emp, i) => {
      // Calculate individual net pay
      const gross = emp.salary;
      const tax = Math.round(gross * 0.1);
      const pf = Math.round(gross * 0.4 * 0.12);
      const esi = Math.round(gross * 0.0075);
      const pt = 200;
      const ded = pf + esi + pt;
      const net = gross - (tax + ded);

      generatedPayslips.push({
        id: `PS-${run.id.slice(3)}-00${i + 1}`,
        employee: emp.name,
        period: run.period,
        gross: `₹${gross.toLocaleString()}`,
        net: `₹${net.toLocaleString()}`,
        date: run.payDate,
        empDetails: emp,
        calculations: { gross, tax, pf, esi, pt, ded, net }
      });
    });
  });

  // Base mock payslips if list is empty, to ensure rich visual contents
  if (generatedPayslips.length === 0) {
    generatedPayslips.push(
      { id: "PS-0041-001", employee: "Arjun Nair", period: "May 16–31, 2026", gross: "₹1,20,000", net: "₹88,800", date: "2026-05-31", calculations: { gross: 120000, tax: 12000, pf: 5760, esi: 900, pt: 200, ded: 6860, net: 88800 } },
      { id: "PS-0041-002", employee: "Priya Sharma", period: "May 16–31, 2026", gross: "₹95,000", net: "₹70,300", date: "2026-05-31", calculations: { gross: 95000, tax: 9500, pf: 4560, esi: 712, pt: 200, ded: 5472, net: 70300 } },
      { id: "PS-0040-001", employee: "Arjun Nair", period: "May 1–15, 2026", gross: "₹1,20,000", net: "₹88,800", date: "2026-05-15", calculations: { gross: 120000, tax: 12000, pf: 5760, esi: 900, pt: 200, ded: 6860, net: 88800 } }
    );
  }

  const filtered = generatedPayslips.filter(
    (p) =>
      p.employee.toLowerCase().includes(search.toLowerCase()) ||
      p.period.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (slipId) => {
    addToast(`Payslip ${slipId} downloaded successfully!`, "success");
  };

  const handleEmail = (slipId, recipient) => {
    addToast(`Payslip ${slipId} emailed to ${recipient.toLowerCase().replace(" ", ".")}@zoiko.io`, "success");
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent border border-indigo-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Payslips</h1>
            <p className="text-slate-500 text-sm">View, download, or email employee payslips</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by employee name or period..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 transition"
        />
      </div>

      {/* Payslips Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Payslip ID", "Employee", "Pay Period", "Gross Earnings", "Net Payout", "Pay Date", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((slip) => (
              <tr key={slip.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-400 font-bold">{slip.id}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{slip.employee}</td>
                <td className="px-5 py-4 text-slate-600">{slip.period}</td>
                <td className="px-5 py-4 text-slate-700">{slip.gross}</td>
                <td className="px-5 py-4 font-bold text-slate-800">{slip.net}</td>
                <td className="px-5 py-4 text-slate-550">{slip.date}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewing(slip)}
                      className="rounded-lg p-1.5 text-slate-450 hover:bg-indigo-50 hover:text-indigo-650 transition"
                      title="View Payslip Breakdown"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDownload(slip.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleEmail(slip.id, slip.employee)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Email to Employee"
                    >
                      <Mail size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payslip Viewer Modal */}
      {viewing && viewing.calculations && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewing(null)}>
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Payslip Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-75 font-mono font-bold">{viewing.id}</p>
                    <p className="text-lg font-extrabold mt-1">{viewing.employee}</p>
                    <p className="text-xs opacity-75">{viewing.period}</p>
                  </div>
                  <button onClick={() => setViewing(null)} className="rounded-xl p-1.5 bg-white/10 hover:bg-white/20 transition">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Earnings */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Earnings Breakdown</p>
                  {[
                    { label: "Basic Salary (40%)", val: `₹${(viewing.calculations.gross * 0.4).toLocaleString()}` },
                    { label: "House Rent Allowance (20%)", val: `₹${(viewing.calculations.gross * 0.2).toLocaleString()}` },
                    { label: "Special Allowance (40%)", val: `₹${(viewing.calculations.gross * 0.4).toLocaleString()}` },
                  ].map((e) => (
                    <div key={e.label} className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">{e.label}</span>
                      <span className="font-semibold text-slate-800">{e.val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm py-2 font-bold text-slate-850">
                    <span>Total Gross Earnings</span>
                    <span>{viewing.gross}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Statutory Deductions</p>
                  {[
                    { label: "Provident Fund (PF) (12% of Basic)", val: `₹${viewing.calculations.pf.toLocaleString()}` },
                    { label: "ESI (0.75% of Gross)", val: `₹${viewing.calculations.esi.toLocaleString()}` },
                    { label: "Professional Tax (PT)", val: `₹${viewing.calculations.pt.toLocaleString()}` },
                    { label: "TDS / Income Tax (10%)", val: `₹${viewing.calculations.tax.toLocaleString()}` },
                  ].map((d) => (
                    <div key={d.label} className="flex justify-between text-xs py-1.5 border-b border-slate-50">
                      <span className="text-slate-550">{d.label}</span>
                      <span className="font-semibold text-red-600">-{d.val}</span>
                    </div>
                  ))}
                </div>

                {/* Net Pay */}
                <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-5 py-4 flex justify-between items-center">
                  <span className="font-bold text-slate-850">Net Take-Home Pay</span>
                  <span className="text-xl font-extrabold text-indigo-700">{viewing.net}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleDownload(viewing.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button
                    onClick={() => handleEmail(viewing.id, viewing.employee)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    <Mail size={14} /> Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
