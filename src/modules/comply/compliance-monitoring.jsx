import { useState, useEffect } from "react";
import { getObligations, getEvidence, uploadEvidence } from "../../service/complyService";
import StatsCard from "../../components/comply/StatsCard";
import DataTable from "../../components/comply/DataTable";
import FilterBar from "../../components/comply/FilterBar";
import StatusBadge from "../../components/comply/StatusBadge";
import { formatDate } from "../../components/comply/helpers";
import { CalendarDays, Upload, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function ComplianceMonitoring() {
  const [activeTab, setActiveTab] = useState("obligations");
  const [obligations, setObligations] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "" });

  useEffect(() => {
    setLoading(true);
    const p = activeTab === "obligations" ? getObligations() : getEvidence();
    p.then(setEvidence).catch(() => {}).finally(() => setLoading(false));
    if (activeTab === "obligations") getObligations().then(setObligations).catch(() => {});
  }, [activeTab]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const [selectedObligation, setSelectedObligation] = useState(null);

  const filtered = ((activeTab === "obligations" ? obligations : evidence) || []).filter(item => {
    if (search && !(item.title || item.name || "").toLowerCase().includes(search.toLowerCase()) && !(item.owner || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.type && item.type !== filters.type) return false;
    return true;
  });

  const filterConfig = activeTab === "obligations" ? [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "pending", label: "Pending" }, { value: "in_progress", label: "In Progress" },
      { value: "completed", label: "Completed" }, { value: "overdue", label: "Overdue" },
    ]},
    { key: "type", placeholder: "All Types", value: filters.type, options: [
      { value: "regulatory", label: "Regulatory" }, { value: "contractual", label: "Contractual" },
      { value: "internal", label: "Internal" },
    ]},
  ] : [
    { key: "status", placeholder: "All Statuses", value: filters.status, options: [
      { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ]},
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadEvidence({ name: file.name, type: file.type, size: file.size });
    setEvidence(prev => [...prev, { id: Date.now(), name: file.name, status: "pending", uploadedBy: "Current User", uploadedDate: new Date().toISOString().split("T")[0] }]);
    e.target.value = "";
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  const tabContent = activeTab === "obligations" ? (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Obligations" value={obligations.length} icon={CalendarDays} />
        <StatsCard title="Overdue" value={obligations.filter(o => o.status === "overdue").length} icon={AlertTriangle} trend="down" change={0} />
        <StatsCard title="In Progress" value={obligations.filter(o => o.status === "in_progress").length} icon={Clock} />
        <StatsCard title="Completed" value={obligations.filter(o => o.status === "completed").length} icon={CheckCircle} trend="up" change={5} />
      </div>
      <FilterBar search={search} onSearchChange={setSearch} filters={filterConfig} onFilterChange={updateFilter} />
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "title", label: "Obligation", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "type", label: "Type", render: (v) => <StatusBadge status={v} /> },
            { key: "owner", label: "Owner" },
            { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          onRowClick={(row) => setSelectedObligation(row)}
          data={filtered}
        />
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100">
            <Upload className="w-4 h-4" /> Upload Evidence
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          columns={[
            { key: "name", label: "File Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
            { key: "uploadedBy", label: "Uploaded By" },
            { key: "uploadedDate", label: "Date", render: (v) => formatDate(v) },
            { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
          ]}
          data={filtered}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Track obligations and manage evidence repository</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab("obligations")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "obligations" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Obligations</button>
        <button onClick={() => setActiveTab("evidence")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "evidence" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Evidence Repository</button>
      </div>

      {tabContent}
    </div>
  );
}
