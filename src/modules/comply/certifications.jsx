import { useState, useEffect } from "react";
import { getCertifications } from "../../service/complyService";
import DataTable from "../../components/comply/DataTable";
import StatusBadge from "../../components/comply/StatusBadge";
import { formatDate } from "../../components/comply/helpers";
import { Award, FileCheck, AlertTriangle } from "lucide-react";

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCertifications().then(setCertifications).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading certifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
        <p className="text-sm text-gray-500 mt-1">Manage compliance certifications and accreditation status</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Certifications</p>
              <p className="text-lg font-bold text-gray-900">{certifications.filter(c => c.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">In Progress</p>
              <p className="text-lg font-bold text-gray-900">{certifications.filter(c => c.status === "in_progress").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Expiring Soon</p>
              <p className="text-lg font-bold text-gray-900">{certifications.filter(c => c.expiryDate && new Date(c.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "name", label: "Certification", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "standard", label: "Standard", render: (v) => <span className="text-sm text-gray-600">{v}</span> },
            { key: "issuedDate", label: "Issued", render: (v) => formatDate(v) },
            { key: "expiryDate", label: "Expiry", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            { key: "auditor", label: "Auditor" },
          ]}
          data={certifications}
        />
      </div>
    </div>
  );
}
