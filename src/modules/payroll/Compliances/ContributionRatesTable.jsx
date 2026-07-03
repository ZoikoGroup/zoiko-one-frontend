import { useEffect, useState } from "react";
import { fetchContributionRates } from "../../../service/payrollService";

export default function ContributionRatesTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchContributionRates()
      .then((data) => {
        if (active) setRows(data);
      })
      .catch(() => {
        if (active) setError("Failed to load contribution rates.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Statutory Contribution Rates</h3>
        <p className="text-xs text-slate-400 mt-0.5">Live rates from the compliance service</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading contribution rates…</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">No contribution rate data available.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Component</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee Share</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Employer Share</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => (
              <tr key={r.id ?? r.label} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-semibold text-slate-800">{r.label}</td>
                <td className="px-5 py-3.5 text-slate-600">{r.employee}</td>
                <td className="px-5 py-3.5 text-slate-600">{r.employer}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}