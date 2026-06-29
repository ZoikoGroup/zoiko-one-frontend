export default function MyLeave() {
  const leaveTypes = [
    { type: "Annual Leave",    total: 18, used: 6,  remaining: 12, color: "#4F46E5" },
    { type: "Sick Leave",      total: 10, used: 3,  remaining: 7,  color: "#059669" },
    { type: "Casual Leave",    total: 6,  used: 2,  remaining: 4,  color: "#0EA5E9" },
    { type: "Unpaid Leave",    total: 0,  used: 1,  remaining: 0,  color: "#DC2626" },
  ];

  const history = [
    { type: "Annual Leave", from: "Jun 10", to: "Jun 11", days: 2, status: "Approved" },
    { type: "Sick Leave",   from: "May 22", to: "May 22", days: 1, status: "Approved" },
    { type: "Casual Leave", from: "Apr 14", to: "Apr 14", days: 1, status: "Approved" },
  ];

  const statusColor = {
    Approved: { color: "#059669", bg: "#ECFDF5" },
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
    Rejected: { color: "#DC2626", bg: "#FEF2F2" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>My Leave</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>View your leave balances and request history.</p>
      </div>

      {/* Leave Balances */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {leaveTypes.map((l) => (
          <div key={l.type} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", margin: "0 0 10px 0" }}>{l.type}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: l.color, margin: "0 0 4px 0" }}>{l.remaining}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>of {l.total} days remaining</p>
            <div style={{ marginTop: "10px", height: "4px", borderRadius: "999px", background: "#F3F4F6" }}>
              <div style={{ height: "4px", borderRadius: "999px", background: l.color, width: `${l.total ? (l.remaining / l.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Leave History */}
      <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Leave History</h3>
        {history.map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 2px 0" }}>{h.type}</p>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{h.from} → {h.to} · {h.days} day(s)</p>
            </div>
            <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[h.status].color, background: statusColor[h.status].bg }}>{h.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}