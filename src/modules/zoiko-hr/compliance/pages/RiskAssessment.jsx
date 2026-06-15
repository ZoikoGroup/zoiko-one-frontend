import { useState, useMemo } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useRiskAssessments } from "../hooks/useCompliance";

const riskColor = (score) => {
  if (score >= 15) return "border-red-500 bg-red-50";
  if (score >= 8) return "border-orange-500 bg-orange-50";
  if (score >= 4) return "border-yellow-500 bg-yellow-50";
  return "border-emerald-500 bg-emerald-50";
};

const riskLabel = (score) => {
  if (score >= 15) return "Critical";
  if (score >= 8) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

export default function RiskAssessment() {
  const { data: risks, loading } = useRiskAssessments();
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    if (!statusFilter) return risks;
    return risks.filter((r) => r.status === statusFilter);
  }, [risks, statusFilter]);

  const columns = [
    { key: "title", label: "Risk", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "category", label: "Category", render: (v) => <span className="capitalize">{v?.replace(/_/g, " ")}</span> },
    { key: "likelihood", label: "Likelihood", render: (v) => <span>{v}/5</span> },
    { key: "impact", label: "Impact", render: (v) => <span>{v}/5</span> },
    { key: "riskScore", label: "Risk Score", render: (v) => <StatusBadge status={riskLabel(v)} /> },
    { key: "mitigation", label: "Mitigation", render: (v) => <span className="text-gray-500 max-w-[200px] truncate block">{v}</span> },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading risk assessments...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Risk Matrix</h2>
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="mitigated">Mitigated</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((risk) => (
          <div key={risk.id} className={`rounded-xl border-2 p-4 ${riskColor(risk.riskScore)}`}>
            <div className="flex items-start justify-between">
              <div className="p-1.5 bg-white rounded-full shadow-sm">
                <AlertTriangle size={18} className={
                  risk.riskScore >= 15 ? "text-red-600" : risk.riskScore >= 8 ? "text-orange-600" : risk.riskScore >= 4 ? "text-yellow-600" : "text-emerald-600"
                } />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-3">{risk.title}</p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">{risk.category?.replace(/_/g, " ")}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
              <span>L: {risk.likelihood}/5</span>
              <span>I: {risk.impact}/5</span>
              <span className="font-bold">{risk.riskScore}</span>
            </div>
            <div className="mt-2">
              <StatusBadge status={riskLabel(risk.riskScore)} />
            </div>
            <div className="mt-2">
              <StatusBadge status={risk.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mitigation Plans</h2>
        <DataTable columns={columns} data={filtered} />
      </div>
    </div>
  );
}
