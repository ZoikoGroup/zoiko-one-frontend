import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const ITEMS_PER_PAGE = 8;

const SALARY_DATA = [
  { department: "Engineering", headcount: 45, avg_salary: 85000, total_salary: 3825000, min: 45000, max: 200000 },
  { department: "HR", headcount: 12, avg_salary: 65000, total_salary: 780000, min: 35000, max: 120000 },
  { department: "Sales", headcount: 30, avg_salary: 72000, total_salary: 2160000, min: 38000, max: 180000 },
];

const BENEFITS_DATA = [
  { benefit_type: "Health Insurance", enrolled: 45, cost_per_employee: 8000, total_cost: 360000 },
  { benefit_type: "Life Insurance", enrolled: 60, cost_per_employee: 2000, total_cost: 120000 },
  { benefit_type: "Gym", enrolled: 25, cost_per_employee: 3000, total_cost: 75000 },
];

const PAYROLL_DATA = [
  { month: "Jan", year: 2026, total_basic: 2500000, total_allowances: 1000000, total_deductions: 400000, total_net: 3100000, employee_count: 60 },
  { month: "Feb", year: 2026, total_basic: 2520000, total_allowances: 1020000, total_deductions: 410000, total_net: 3130000, employee_count: 61 },
];

const SUB_TABS = [
  { key: "salary", label: "Salary Report" },
  { key: "benefits", label: "Benefits Summary" },
  { key: "payroll", label: "Payroll Summary" },
];

export default function CompensationReports() {
  const [activeSubTab, setActiveSubTab] = useState("salary");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <HRPage title="Compensation Reports" subtitle="View salary, benefits, and payroll summaries.">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveSubTab(tab.key); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
                activeSubTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === "salary" && <SalaryReportTab />}
        {activeSubTab === "benefits" && <BenefitsSummaryTab />}
        {activeSubTab === "payroll" && <PayrollSummaryTab />}
      </div>
    </HRPage>
  );
}

function SalaryReportTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setData(SALARY_DATA);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalEmployees = data.reduce((s, d) => s + d.headcount, 0);
    const avgSalary = data.length ? Math.round(data.reduce((s, d) => s + d.avg_salary, 0) / data.length) : 0;
    const totalSalaryCost = data.reduce((s, d) => s + d.total_salary, 0);
    return { totalEmployees, avgSalary, totalSalaryCost };
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((d) => d.department.toLowerCase().includes(q));
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading salary report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Total Employees: </span>
          <span className="font-bold text-gray-800">{stats.totalEmployees}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Avg Salary: </span>
          <span className="font-bold text-blue-600">${stats.avgSalary.toLocaleString()}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Total Salary Cost: </span>
          <span className="font-bold text-purple-600">${stats.totalSalaryCost.toLocaleString()}</span>
        </div>
      </div>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="Search by department..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No records match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Department</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Headcount</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Avg Salary</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Total Salary</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Min</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{d.department}</td>
                      <td className="px-4 py-3 text-gray-700">{d.headcount}</td>
                      <td className="px-4 py-3 text-gray-700">${d.avg_salary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">${d.total_salary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">${d.min?.toLocaleString() || "-"}</td>
                      <td className="px-4 py-3 text-gray-700">${d.max?.toLocaleString() || "-"}</td>
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
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BenefitsSummaryTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setData(BENEFITS_DATA);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalCost = data.reduce((s, d) => s + d.total_cost, 0);
    const avgCostPerEmployee = data.length ? Math.round(data.reduce((s, d) => s + d.cost_per_employee, 0) / data.length) : 0;
    return { totalCost, avgCostPerEmployee };
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((d) => d.benefit_type.toLowerCase().includes(q));
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading benefits summary...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Total Benefits Cost: </span>
          <span className="font-bold text-gray-800">${stats.totalCost.toLocaleString()}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Avg Cost/Employee: </span>
          <span className="font-bold text-green-600">${stats.avgCostPerEmployee.toLocaleString()}</span>
        </div>
      </div>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="Search by benefit type..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No records match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Benefit</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Enrolled</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Cost/Employee</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{d.benefit_type}</td>
                      <td className="px-4 py-3 text-gray-700">{d.enrolled}</td>
                      <td className="px-4 py-3 text-gray-700">${d.cost_per_employee.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">${d.total_cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PayrollSummaryTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setData(PAYROLL_DATA);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalNet = data.reduce((s, d) => s + d.total_net, 0);
    const avgMonthly = data.length ? Math.round(totalNet / data.length) : 0;
    return { totalNet, avgMonthly };
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((d) => d.month.toLowerCase().includes(q));
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading payroll summary...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">YTD Total: </span>
          <span className="font-bold text-gray-800">${stats.totalNet.toLocaleString()}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-teal-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Avg Monthly: </span>
          <span className="font-bold text-teal-600">${stats.avgMonthly.toLocaleString()}</span>
        </div>
      </div>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="Search by month..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No records match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Basic</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Allowances</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Deductions</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Net Pay</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Employees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{d.month} {d.year}</td>
                      <td className="px-4 py-3 text-gray-700">${d.total_basic.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">${d.total_allowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">${d.total_deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">${d.total_net.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">{d.employee_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
