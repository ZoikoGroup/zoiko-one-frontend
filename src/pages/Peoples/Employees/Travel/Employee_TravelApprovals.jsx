export default function TravelApprovals() {
  const approvals = [
    { id: "TR-001", destination: "Mumbai", requestedOn: "Jun 20, 2026", approver: "Rahul Sharma", status: "Approved", note: "Approved for 2 nights hotel." },
    { id: "TR-002", destination: "Delhi",  requestedOn: "Jun 24, 2026", approver: "Priya Mehta",  status: "Pending",  note: "Awaiting manager sign-off." },
    { id: "TR-003", destination: "Pune",   requestedOn: "Jun 5, 2026",  approver: "Rahul Sharma", status: "Approved", note: "Day trip approved." },
  ];

  const statusColor = {
    Approved: { color: "#059669", bg: "#ECFDF5" },
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
    Rejected: { color: "#DC2626", bg: "#FEF2F2" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Travel Approvals</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>View the approval status of your travel requests.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {approvals.map((a) => (
          <div key={a.id} style={{ padding: "22px 24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#9CA3AF" }}>{a.id}</span>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>{a.destination}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px 0" }}>Approver: <strong>{a.approver}</strong></p>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px 0" }}>Requested: {a.requestedOn}</p>
                <p style={{ fontSize: "13px", color: "#374151", margin: 0, fontStyle: "italic" }}>{a.note}</p>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 14px", borderRadius: "999px", color: statusColor[a.status].color, background: statusColor[a.status].bg }}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}