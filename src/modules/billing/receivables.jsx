const receivables = [
  { id: "AR-001", customer: "BridgeCo", invoice: "INV-003", amount: "$9,200.00", dueDate: "2026-06-01", age: 14, status: "Overdue" },
  { id: "AR-002", customer: "GreenPath Ltd.", invoice: "INV-002", amount: "$4,800.00", dueDate: "2026-06-15", age: 0, status: "Current" },
  { id: "AR-003", customer: "CloudBase SA", invoice: "INV-005", amount: "$6,750.00", dueDate: "2026-06-20", age: 0, status: "Current" },
  { id: "AR-004", customer: "DataFlow Corp", invoice: "INV-004", amount: "$3,600.00", dueDate: "2026-07-01", age: 0, status: "Future" },
  { id: "AR-005", customer: "TechNova Inc.", invoice: "INV-001", amount: "$12,400.00", dueDate: "2026-05-15", age: 32, status: "Overdue" },
  { id: "AR-006", customer: "OmniCorp", invoice: "INV-007", amount: "$5,500.00", dueDate: "2026-05-28", age: 18, status: "Overdue" },
  { id: "AR-007", customer: "NexGen Systems", invoice: "INV-006", amount: "$18,200.00", dueDate: "2026-07-15", age: 0, status: "Future" },
  { id: "AR-008", customer: "DataFlow Corp", invoice: "INV-008", amount: "$2,100.00", dueDate: "2026-06-25", age: 0, status: "Current" },
];

const statusColor = (s) =>
  s === "Current" ? "#059669" : s === "Overdue" ? "#DC2626" : "#6B7280";

export default function ReceivablesPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Receivables</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track accounts receivable, aging analysis and outstanding balances.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Receivables", value: "$62,550", color: "#4F46E5" },
          { label: "Current", value: "$13,650", color: "#059669" },
          { label: "Overdue", value: "$14,700", color: "#DC2626" },
          { label: "Future", value: "$21,800", color: "#0891B2" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Aging Analysis</h3>
          {[
            { bucket: "0–30 days", amount: "$13,650.00", pct: 22 },
            { bucket: "31–60 days", amount: "$9,200.00", pct: 15 },
            { bucket: "61–90 days", amount: "$5,500.00", pct: 9 },
            { bucket: "90+ days", amount: "$0.00", pct: 0 },
            { bucket: "Future Dated", amount: "$21,800.00", pct: 35 },
          ].map((bucket) => (
            <div key={bucket.bucket} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ color: "#374151" }}>{bucket.bucket}</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>{bucket.amount}</span>
              </div>
              <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${bucket.pct}%`, height: "100%", background: bucket.bucket.includes("90+") ? "#DC2626" : bucket.bucket === "Future Dated" ? "#0891B2" : "#4F46E5", borderRadius: "999px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Top Outstanding</h3>
          {[
            { customer: "NexGen Systems", amount: "$18,200.00", inv: "INV-006", status: "Future" },
            { customer: "TechNova Inc.", amount: "$12,400.00", inv: "INV-001", status: "Overdue" },
            { customer: "BridgeCo", amount: "$9,200.00", inv: "INV-003", status: "Overdue" },
            { customer: "CloudBase SA", amount: "$6,750.00", inv: "INV-005", status: "Current" },
          ].map((top) => (
            <div key={top.inv} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{top.customer}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{top.inv}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{top.amount}</p>
                <p style={{ margin: 0, color: statusColor(top.status), fontSize: "12px" }}>{top.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["AR ID", "Customer", "Invoice", "Amount", "Due Date", "Age (Days)", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {receivables.map((ar) => (
              <tr key={ar.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{ar.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{ar.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{ar.invoice}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{ar.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{ar.dueDate}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: ar.age > 0 ? "#DC2626" : "#6B7280", fontWeight: ar.age > 0 ? "600" : "400" }}>
                  {ar.age > 0 ? `${ar.age}d` : "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(ar.status), background: `${statusColor(ar.status)}15`,
                  }}>{ar.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
