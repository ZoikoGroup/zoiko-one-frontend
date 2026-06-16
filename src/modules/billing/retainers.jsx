const retainerList = [
  { id: "RTN-001", client: "NexGen Systems", type: "Monthly", amount: "$5,000.00", balance: "$3,200.00", startDate: "2026-01-01", status: "Active" },
  { id: "RTN-002", client: "BridgeCo", type: "Quarterly", amount: "$12,000.00", balance: "$8,500.00", startDate: "2026-03-01", status: "Active" },
  { id: "RTN-003", client: "TechNova Inc.", type: "Monthly", amount: "$8,000.00", balance: "$1,200.00", startDate: "2026-02-15", status: "Active" },
  { id: "RTN-004", client: "DataFlow Corp", type: "Annual", amount: "$36,000.00", balance: "$24,000.00", startDate: "2026-04-01", status: "Active" },
  { id: "RTN-005", client: "CloudBase SA", type: "Monthly", amount: "$3,000.00", balance: "$0.00", startDate: "2026-05-01", status: "Depleted" },
  { id: "RTN-006", client: "GreenPath Ltd.", type: "Quarterly", amount: "$6,000.00", balance: "$4,500.00", startDate: "2026-04-15", status: "Active" },
  { id: "RTN-007", client: "OmniCorp", type: "Monthly", amount: "$10,000.00", balance: "$0.00", startDate: "2026-01-10", status: "Expired" },
];

const statusColor = (s) =>
  s === "Active" ? "#059669" : s === "Depleted" ? "#D97706" : "#DC2626";

export default function RetainersPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Retainers</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Manage retainer agreements, track balances and monitor utilization.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Active Retainers", value: "5", color: "#059669" },
          { label: "Total Retainer Value", value: "$80,000", color: "#4F46E5" },
          { label: "Unused Balance", value: "$41,400", color: "#D97706" },
          { label: "Utilization Rate", value: "48%", color: "#0891B2" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Retainer by Type</h3>
          {[
            { type: "Monthly", count: 3, value: "$16,000", pct: 20 },
            { type: "Quarterly", count: 2, value: "$18,000", pct: 23 },
            { type: "Annual", count: 1, value: "$36,000", pct: 45 },
          ].map((rt) => (
            <div key={rt.type} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ color: "#374151" }}>{rt.type}</span>
                <span style={{ color: "#6B7280" }}>{rt.count} retainers</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>{rt.value}</span>
              </div>
              <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${rt.pct}%`, height: "100%", background: "#4F46E5", borderRadius: "999px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Recent Activity</h3>
          {[
            { action: "Retainer drawn", client: "TechNova Inc.", amount: "$800.00", date: "2026-06-15" },
            { action: "Retainer topped up", client: "BridgeCo", amount: "$12,000.00", date: "2026-06-10" },
            { action: "Retainer expired", client: "OmniCorp", amount: "$0.00", date: "2026-06-08" },
            { action: "Retainer drawn", client: "NexGen Systems", amount: "$500.00", date: "2026-06-05" },
            { action: "New retainer", client: "DataFlow Corp", amount: "$36,000.00", date: "2026-06-01" },
          ].map((act, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{act.action}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{act.client}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{act.amount}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{act.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Retainer", "Client", "Type", "Amount", "Remaining", "Start Date", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retainerList.map((rtn) => (
              <tr key={rtn.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{rtn.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{rtn.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{rtn.type}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{rtn.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: rtn.balance === "$0.00" ? "#DC2626" : "#059669" }}>{rtn.balance}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{rtn.startDate}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(rtn.status), background: `${statusColor(rtn.status)}15`,
                  }}>{rtn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
