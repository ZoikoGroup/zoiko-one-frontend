import { useState, useEffect } from "react";
import { Download, TrendingUp, Clock, User2, DollarSign, Settings2 } from "lucide-react";
import * as hr from "../../../service/hrService";

const mockCurrentUser = {
  name: "Alice Johnson",
  role: "standard", // change to "admin" to see HR administrator view
};

export default function ZoikoHRCompensation() {
  const [user, setUser] = useState(mockCurrentUser);
  const [payslips, setPayslips] = useState([]);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [selectedAdjustment, setSelectedAdjustment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([hr.fetchList("compensation"), hr.fetchList("payrollSummary")])
      .then(([compensationData, summaryData]) => {
        if (!mounted) return;
        setPayslips(compensationData);
        setPayrollSummary(summaryData);
        setSelectedAdjustment(
          summaryData?.employees?.reduce((acc, employee) => {
            acc[employee.id] = employee.proposedAdjustment || 0;
            return acc;
          }, {}) || {}
        );
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load compensation data");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const handleAdjustmentChange = (employeeId, value) => {
    setSelectedAdjustment((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const handleApplyAdjustment = (employeeId) => {
    const value = Number(selectedAdjustment[employeeId]);
    setPayrollSummary((prev) => ({
      ...prev,
      employees: prev.employees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, proposedAdjustment: value, adjustedSalary: employee.baseSalary + value }
          : employee
      ),
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">Loading payroll data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-700">Error loading compensation dashboard: {error}</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compensation & Payroll</h1>
            <p className="text-gray-600 mt-1">
              {user.role === "admin"
                ? "HR payroll summary and salary adjustment tools"
                : "Your monthly payslip history and download options."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <DollarSign size={18} />
            {user.role === "admin" ? "HR Administrator" : "Standard User"}
          </div>
        </div>
      </div>

      {user.role === "admin" ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Total Monthly Payout</span>
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  ${payrollSummary?.totalMonthlyPayout.toLocaleString()}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Pending Bonuses</span>
                  <Clock size={18} className="text-orange-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  ${payrollSummary?.pendingBonuses.toLocaleString()}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Employee Count</span>
                  <User2 size={18} className="text-blue-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-gray-900">
                  {payrollSummary?.employeeCount}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Salary Adjustment Panel</h2>
                  <p className="text-sm text-gray-500 mt-1">Apply basic salary adjustments per employee.</p>
                </div>
                <Settings2 size={20} className="text-gray-500" />
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Base Salary</th>
                      <th className="px-4 py-3">Adjustment</th>
                      <th className="px-4 py-3">Adjusted Salary</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollSummary?.employees?.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">{employee.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">${employee.baseSalary.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={selectedAdjustment[employee.id] ?? 0}
                            onChange={(e) => handleAdjustmentChange(employee.id, e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">${(employee.baseSalary + (employee.proposedAdjustment ?? 0)).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleApplyAdjustment(employee.id)}
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Payroll notes</h2>
            <p className="text-sm text-gray-500 mt-2">
              Adjusting salary proposals updates the projected payout. Save changes in the payroll system once confirmed.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-blue-700">Keep total payouts within budget and review bonus allocations monthly.</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-green-700">Employee salary adjustments here are for planning only; connect to payroll for final execution.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payslip History</h2>
              <p className="text-sm text-gray-500 mt-1">Review your monthly pay statements and download them as PDF.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <Download size={16} />
              Download available
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Gross Pay</th>
                  <th className="px-4 py-3">Net Pay</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((payslip) => (
                  <tr key={payslip.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{payslip.month}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">${payslip.grossPay.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">${payslip.netPay.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-green-700">{payslip.status}</td>
                    <td className="px-4 py-4">
                      <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        <Download size={16} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
