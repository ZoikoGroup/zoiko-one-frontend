import { useEffect, useState } from "react";
import { fetchTaxSlabs } from "../../../service/payrollService";

export default function TaxSlabTable() {
  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchTaxSlabs()
      .then((data) => {
        if (active) setSlabs(data);
      })
      .catch(() => {
        if (active) setError("Failed to load tax slabs.");
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
        <h3 className="font-bold text-slate-800">Income Tax Slabs</h3>
        <p className="text-xs text-slate-400 mt-0.5">Live slabs from the compliance service</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">Loading tax slabs…</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      ) : slabs.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">No tax slab data available.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Min (₹)</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Max (₹)</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tax Calculation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {slabs.map((s, i) => (
              <tr
                key={s.id ?? i}
                className={`hover:bg-slate-50 ${s.rate === "Nil" || s.rate === "0%" ? "bg-emerald-50/50" : ""}`}
              >
                <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{s.min}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{s.max}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      s.rate === "Nil" || s.rate === "0%" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {s.rate}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600">{s.tax}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}