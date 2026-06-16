const invoices = [
  { id: "INV-001", client: "TechNova Inc.", amount: "$12,400.00", date: "2026-06-01", status: "Paid" },
  { id: "INV-002", client: "GreenPath Ltd.", amount: "$4,800.00", date: "2026-06-05", status: "Pending" },
  { id: "INV-003", client: "BridgeCo", amount: "$9,200.00", date: "2026-06-10", status: "Overdue" },
  { id: "INV-004", client: "DataFlow Corp", amount: "$3,600.00", date: "2026-06-12", status: "Draft" },
  { id: "INV-005", client: "CloudBase SA", amount: "$6,750.00", date: "2026-06-14", status: "Pending" },
  { id: "INV-006", client: "NexGen Systems", amount: "$18,200.00", date: "2026-06-15", status: "Paid" },
];

const statusColor = (s) =>
  s === "Paid" ? "#059669" : s === "Pending" ? "#D97706" : s === "Overdue" ? "#DC2626" : "#6B7280";

export default function InvoicingPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Invoicing</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Create, send and manage all your invoices in one place.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Invoices", value: "6", color: "#4F46E5" },
          { label: "Paid", value: "$30,600", color: "#059669" },
          { label: "Outstanding", value: "$14,000", color: "#DC2626" },
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
              {["Invoice", "Client", "Amount", "Date", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{inv.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{inv.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{inv.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{inv.date}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(inv.status), background: `${statusColor(inv.status)}15`,
                  }}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
