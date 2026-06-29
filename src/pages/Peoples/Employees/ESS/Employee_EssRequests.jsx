import { useState } from "react";

export default function EssRequests() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Pending", "Approved", "Rejected"];

  const requests = [
    { id: "REQ-001", type: "Leave Request",    raised: "Jun 20, 2026", description: "Annual leave for personal work",    status: "Pending" },
    { id: "REQ-002", type: "Document Request", raised: "Jun 18, 2026", description: "Experience letter requested",       status: "Approved" },
    { id: "REQ-003", type: "Travel Request",   raised: "Jun 15, 2026", description: "Client visit – Hyderabad to Pune", status: "Approved" },
    { id: "REQ-004", type: "Asset Request",    raised: "Jun 10, 2026", description: "Laptop charger replacement",        status: "Rejected" },
    { id: "REQ-005", type: "WFH Request",      raised: "Jun 08, 2026", description: "Work from home – Jun 9 & 10",      status: "Approved" },
    { id: "REQ-006", type: "Leave Request",    raised: "Jun 25, 2026", description: "Sick leave – 1 day",               status: "Pending" },
  ];

  const filtered = activeTab === "All" ? requests : requests.filter((r) => r.status === activeTab);

  const statusColor = {
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
    Approved: { color: "#059669", bg: "#ECFDF5" },
    Rejected: { color: "#DC2626", bg: "#FEF2F2" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>My Requests</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track all your submitted requests and their approval status.</p>
        </div>
        <button style={{ padding: "10px 20px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          + New Request
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
            background: activeTab === t ? "#4F46E5" : "white",
            color: activeTab === t ? "white" : "#6B7280",
            border: activeTab === t ? "none" : "1.5px solid #E5E7EB",
          }}>{t}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((r) => (
          <div key={r.id} style={{ padding: "20px 24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#6B7280" }}>{r.id}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>{r.type}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px 0" }}>{r.description}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Raised on {r.raised}</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "999px", color: statusColor[r.status].color, background: statusColor[r.status].bg }}>
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}