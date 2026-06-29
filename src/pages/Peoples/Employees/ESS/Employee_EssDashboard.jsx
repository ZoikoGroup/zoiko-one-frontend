 
 export default function EssDashboard() {
  const stats = [
    { label: "Leave Balance", value: "12 Days", sub: "Annual leave remaining", color: "#4F46E5" },
    { label: "Attendance", value: "96%", sub: "This month", color: "#059669" },
    { label: "Pending Requests", value: "3", sub: "Awaiting approval", color: "#D97706" },
    { label: "Documents", value: "8", sub: "Files uploaded", color: "#0EA5E9" },
  ];

  const recentActivity = [
    { action: "Leave request submitted", date: "Jun 24, 2026", status: "Pending" },
    { action: "Attendance marked", date: "Jun 25, 2026", status: "Done" },
    { action: "Document uploaded", date: "Jun 23, 2026", status: "Done" },
    { action: "Travel request raised", date: "Jun 20, 2026", status: "Approved" },
  ];

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>
          Employee Self Service
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
          Welcome back! Here's your personal overview for today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: "0 0 4px 0" }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Recent Activity</h3>
        {recentActivity.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{a.action}</p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{a.date}</p>
            </div>
            <span style={{
              fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px",
              color: a.status === "Done" ? "#059669" : a.status === "Approved" ? "#4F46E5" : "#D97706",
              background: a.status === "Done" ? "#ECFDF5" : a.status === "Approved" ? "#EEF2FF" : "#FFFBEB",
            }}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}