export default function TravelDashboard() {
  const stats = [
    { label: "Total Trips", value: "7", color: "#4F46E5" },
    { label: "Pending Approval", value: "1", color: "#D97706" },
    { label: "Expenses Claimed", value: "₹42,500", color: "#059669" },
    { label: "Upcoming Trips", value: "2", color: "#0EA5E9" },
  ];

  const trips = [
    { dest: "Mumbai", date: "Jul 5–7, 2026", purpose: "Client Meeting", status: "Approved" },
    { dest: "Bangalore", date: "Jul 14, 2026", purpose: "Tech Conference", status: "Pending" },
    { dest: "Pune", date: "Jun 15, 2026", purpose: "Project Kickoff", status: "Completed" },
  ];

  const statusColor = {
    Approved:  { color: "#4F46E5", bg: "#EEF2FF" },
    Pending:   { color: "#D97706", bg: "#FFFBEB" },
    Completed: { color: "#059669", bg: "#ECFDF5" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Travel Dashboard</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Overview of your business travel and reimbursements.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Recent Trips</h3>
        {trips.map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid #F3F4F6" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>{t.dest}</p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 2px 0" }}>{t.purpose}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{t.date}</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "999px", color: statusColor[t.status].color, background: statusColor[t.status].bg }}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}