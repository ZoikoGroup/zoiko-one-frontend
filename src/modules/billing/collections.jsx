const collections = [
  { id: "COL-001", client: "BridgeCo", invoice: "INV-003", amount: "$9,200.00", dueDate: "2026-06-01", daysOverdue: 14, status: "Collection" },
  { id: "COL-002", client: "GreenPath Ltd.", invoice: "INV-002", amount: "$4,800.00", dueDate: "2026-06-15", daysOverdue: 0, status: "Reminder Sent" },
  { id: "COL-003", client: "CloudBase SA", invoice: "INV-005", amount: "$6,750.00", dueDate: "2026-06-20", daysOverdue: 0, status: "On Track" },
  { id: "COL-004", client: "DataFlow Corp", invoice: "INV-004", amount: "$3,600.00", dueDate: "2026-07-01", daysOverdue: 0, status: "Scheduled" },
];

const statusColor = (s) =>
  s === "Collection" ? "#DC2626" : s === "Reminder Sent" ? "#D97706" : s === "On Track" ? "#059669" : "#6B7280";

export default function CollectionsPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Collections</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track overdue invoices, send reminders and manage collections workflows.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "In Collections", value: "$9,200", color: "#DC2626" },
          { label: "Reminders Sent", value: "$4,800", color: "#D97706" },
          { label: "Collection Rate", value: "94%", color: "#059669" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Collection", "Client", "Invoice", "Amount", "Due Date", "Overdue", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{col.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{col.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{col.invoice}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{col.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{col.dueDate}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: col.daysOverdue > 0 ? "#DC2626" : "#6B7280", fontWeight: col.daysOverdue > 0 ? "600" : "400" }}>
                  {col.daysOverdue > 0 ? `${col.daysOverdue}d` : "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(col.status), background: `${statusColor(col.status)}15`,
                  }}>{col.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
