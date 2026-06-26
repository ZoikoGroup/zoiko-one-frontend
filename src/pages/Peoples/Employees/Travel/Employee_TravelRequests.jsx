import { useState } from "react";

export default function TravelRequests() {
  const [showForm, setShowForm] = useState(false);

  const requests = [
    { id: "TR-001", destination: "Mumbai", from: "Jun 25", to: "Jun 27", purpose: "Client Demo", status: "Approved" },
    { id: "TR-002", destination: "Delhi",  from: "Jul 5",  to: "Jul 5",  purpose: "HR Summit",   status: "Pending" },
    { id: "TR-003", destination: "Pune",   from: "Jun 10", to: "Jun 11", purpose: "Kickoff Meet", status: "Completed" },
  ];

  const statusColor = {
    Approved:  { color: "#059669", bg: "#ECFDF5" },
    Pending:   { color: "#D97706", bg: "#FFFBEB" },
    Completed: { color: "#4F46E5", bg: "#EEF2FF" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Travel Requests</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Raise and track your business travel requests.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          + New Request
        </button>
      </div>

      {showForm && (
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #4F46E5", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>New Travel Request</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[["Destination", "text", "e.g. Mumbai"], ["Purpose", "text", "e.g. Client Meeting"], ["Travel Date From", "date", ""], ["Travel Date To", "date", ""]].map(([label, type, placeholder]) => (
              <div key={label}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>{label}</label>
                <input type={type} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "9px 20px", background: "white", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            <button style={{ padding: "9px 20px", background: "#4F46E5", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Submit</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {requests.map((r) => (
          <div key={r.id} style={{ padding: "20px 24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#9CA3AF" }}>{r.id}</span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{r.destination}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 2px 0" }}>{r.purpose}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{r.from} → {r.to}</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "999px", color: statusColor[r.status].color, background: statusColor[r.status].bg }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}