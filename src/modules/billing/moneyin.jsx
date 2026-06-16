const transactions = [
  { id: "TXN-001", source: "Invoice INV-001", customer: "TechNova Inc.", amount: "$12,400.00", date: "2026-06-02", method: "Bank Transfer", status: "Cleared" },
  { id: "TXN-002", source: "Invoice INV-006", customer: "NexGen Systems", amount: "$18,200.00", date: "2026-06-16", method: "Credit Card", status: "Cleared" },
  { id: "TXN-003", source: "Subscription SUB-001", customer: "TechNova Inc.", amount: "$599.00", date: "2026-06-01", method: "ACH", status: "Cleared" },
  { id: "TXN-004", source: "Subscription SUB-003", customer: "BridgeCo", amount: "$800.00", date: "2026-05-10", method: "Wire Transfer", status: "Cleared" },
  { id: "TXN-005", source: "Invoice INV-002", customer: "GreenPath Ltd.", amount: "$4,800.00", date: "2026-06-05", method: "Credit Card", status: "Pending" },
  { id: "TXN-006", source: "Subscription SUB-004", customer: "DataFlow Corp", amount: "$599.00", date: "2026-06-12", method: "ACH", status: "Failed" },
  { id: "TXN-007", source: "Invoice INV-005", customer: "CloudBase SA", amount: "$6,750.00", date: "2026-06-15", method: "Bank Transfer", status: "Pending" },
  { id: "TXN-008", source: "Subscription SUB-002", customer: "GreenPath Ltd.", amount: "$0.00", date: "2026-06-05", method: "—", status: "Cleared" },
  { id: "TXN-009", source: "Manual Payment", customer: "BridgeCo", amount: "$9,200.00", date: "2026-06-18", method: "Wire Transfer", status: "Cleared" },
  { id: "TXN-010", source: "Invoice INV-004", customer: "DataFlow Corp", amount: "$3,600.00", date: "2026-06-13", method: "Credit Card", status: "Pending" },
  { id: "TXN-011", source: "Subscription SUB-005", customer: "CloudBase SA", amount: "$0.00", date: "2026-06-14", method: "—", status: "Cancelled" },
  { id: "TXN-012", source: "Refund", customer: "NexGen Systems", amount: "($1,200.00)", date: "2026-06-17", method: "ACH", status: "Cleared" },
];

const statusColor = (s) =>
  s === "Cleared" ? "#059669" : s === "Pending" ? "#D97706" : s === "Failed" ? "#DC2626" : "#6B7280";

export default function MoneyInPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Money In</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track all incoming payments from invoices, subscriptions and other revenue streams.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Received (MTD)", value: "$55,349", color: "#059669" },
          { label: "Pending Clearance", value: "$15,150", color: "#D97706" },
          { label: "Failed/Cancelled", value: "$599", color: "#DC2626" },
          { label: "Net Collected", value: "$40,199", color: "#4F46E5" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>By Payment Method</h3>
          {[
            { method: "Bank Transfer", count: 3, total: "$28,350" },
            { method: "Credit Card", count: 4, total: "$27,400" },
            { method: "ACH", count: 3, total: "$598" },
            { method: "Wire Transfer", count: 2, total: "$10,000" },
          ].map((pm) => (
            <div key={pm.method} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{pm.method}</span>
              <span style={{ color: "#6B7280" }}>{pm.count} txns</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{pm.total}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>By Revenue Stream</h3>
          {[
            { stream: "Invoices", amount: "$40,950", pct: "74%" },
            { stream: "Subscriptions", amount: "$1,998", pct: "4%" },
            { stream: "Manual Payments", amount: "$9,200", pct: "17%" },
            { stream: "Refunds", amount: "($1,200)", pct: "-2%" },
          ].map((rs) => (
            <div key={rs.stream} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{rs.stream}</span>
              <span style={{ color: "#6B7280" }}>{rs.pct}</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{rs.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Transaction", "Source", "Customer", "Amount", "Date", "Method", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{txn.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{txn.source}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{txn.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: txn.amount.startsWith("(") ? "#DC2626" : "#111827" }}>{txn.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{txn.date}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{txn.method}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(txn.status), background: `${statusColor(txn.status)}15`,
                  }}>{txn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
