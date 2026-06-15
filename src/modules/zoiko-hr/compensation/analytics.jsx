import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const ITEMS_PER_PAGE = 8;

const COST_DATA = [
  { category: "Salaries", amount: 5000000, percentage: 65, previous: 4800000 },
  { category: "Bonuses", amount: 500000, percentage: 6.5, previous: 450000 },
  { category: "Benefits", amount: 800000, percentage: 10.4, previous: 750000 },
  { category: "Allowances", amount: 1000000, percentage: 13, previous: 950000 },
  { category: "Incentives", amount: 400000, percentage: 5.2, previous: 350000 },
];

const TREND_DATA = [
  { month: "Jan", salary_cost: 420000, benefits_cost: 65000, bonus_cost: 0 },
  { month: "Feb", salary_cost: 425000, benefits_cost: 66000, bonus_cost: 50000 },
  { month: "Mar", salary_cost: 430000, benefits_cost: 67000, bonus_cost: 0 },
  { month: "Apr", salary_cost: 428000, benefits_cost: 68000, bonus_cost: 75000 },
  { month: "May", salary_cost: 432000, benefits_cost: 69000, bonus_cost: 0 },
  { month: "Jun", salary_cost: 435000, benefits_cost: 70000, bonus_cost: 60000 },
];

const SUB_TABS = [
  { key: "cost", label: "Cost Analysis" },
  { key: "trends", label: "Trends" },
];

export default function CompensationAnalytics() {
  const [activeSubTab, setActiveSubTab] = useState("cost");

  return (
    <HRPage title="Compensation Analytics" subtitle="Analyze costs, trends, and compensation breakdowns.">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
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

        {activeSubTab === "cost" && <CostAnalysisTab />}
        {activeSubTab === "trends" && <TrendsTab />}
      </div>
    </HRPage>
  );
}

function CostAnalysisTab() {
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
        setData(COST_DATA);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalCost = data.reduce((s, d) => s + d.amount, 0);
    const totalPrevious = data.reduce((s, d) => s + d.previous, 0);
    const yoyChange = totalPrevious ? ((totalCost - totalPrevious) / totalPrevious * 100).toFixed(1) : "0";
    return { totalCost, yoyChange };
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((d) => d.category.toLowerCase().includes(q));
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
        <span className="ml-3 text-gray-500">Loading cost analysis...</span>
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
          <span className="text-gray-400">Total Cost: </span>
          <span className="font-bold text-gray-800">${stats.totalCost.toLocaleString()}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">YoY Change: </span>
          <span className={`font-bold ${parseFloat(stats.yoyChange) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {parseFloat(stats.yoyChange) >= 0 ? "+" : ""}{stats.yoyChange}%
          </span>
        </div>
      </div>

      {data.length > 0 && (
        <input
          type="text"
          placeholder="Search by category..."
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">% of Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Vs Previous</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((d, i) => {
                    const diff = d.amount - d.previous;
                    const isUp = diff >= 0;
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{d.category}</td>
                        <td className="px-4 py-3 text-gray-700">${d.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">{d.percentage}%</td>
                        <td className="px-4 py-3 text-gray-700">${d.previous.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {isUp ? "\u2191" : "\u2193"} ${Math.abs(diff).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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

function TrendsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setData(TREND_DATA);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    if (!data.length) return { avgMonthly: 0, highestMonth: null, highestTotal: 0 };
    const totals = data.map((d) => d.salary_cost + d.benefits_cost + d.bonus_cost);
    const avg = Math.round(totals.reduce((s, v) => s + v, 0) / totals.length);
    const maxIdx = totals.indexOf(Math.max(...totals));
    return { avgMonthly: avg, highestMonth: data[maxIdx]?.month, highestTotal: totals[maxIdx] };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, safePage]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading trends...</span>
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
          <span className="text-gray-400">Average Monthly: </span>
          <span className="font-bold text-gray-800">${stats.avgMonthly.toLocaleString()}</span>
        </div>
        <div className="bg-white px-4 py-2 border border-amber-100 rounded-lg shadow-sm text-sm">
          <span className="text-gray-400">Highest Month: </span>
          <span className="font-bold text-amber-600">{stats.highestMonth} (${stats.highestTotal.toLocaleString()})</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Salary Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Benefits Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Bonus Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((d, i) => {
                const total = d.salary_cost + d.benefits_cost + d.bonus_cost;
                const isHighest = d.month === stats.highestMonth;
                return (
                  <tr key={i} className={`hover:bg-gray-50 transition-colors ${isHighest ? "bg-amber-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-gray-800">{d.month}</td>
                    <td className="px-4 py-3 text-gray-700">${d.salary_cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">${d.benefits_cost.toLocaleString()}</td>
                    <td className={`px-4 py-3 ${d.bonus_cost > 0 ? "text-green-600 font-medium" : "text-gray-400"}`}>
                      {d.bonus_cost > 0 ? `$${d.bonus_cost.toLocaleString()}` : "$0"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">${total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, data.length)} of {data.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
