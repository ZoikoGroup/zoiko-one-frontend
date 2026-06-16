const creditNotes = [
  { id: "CN-001", customer: "TechNova Inc.", type: "Promotional Credit", amount: "$500.00", used: "$200.00", remaining: "$300.00", issued: "2026-05-01", expires: "2026-08-01", status: "Active" },
  { id: "CN-002", customer: "BridgeCo", type: "Service Adjustment", amount: "$1,000.00", used: "$1,000.00", remaining: "$0.00", issued: "2026-03-15", expires: "2026-06-15", status: "Fully Applied" },
  { id: "CN-003", customer: "GreenPath Ltd.", type: "Referral Bonus", amount: "$250.00", used: "$0.00", remaining: "$250.00", issued: "2026-06-01", expires: "2026-09-01", status: "Active" },
  { id: "CN-004", customer: "DataFlow Corp", type: "Promotional Credit", amount: "$750.00", used: "$350.00", remaining: "$400.00", issued: "2026-04-10", expires: "2026-07-10", status: "Active" },
  { id: "CN-005", customer: "NexGen Systems", type: "Refund", amount: "$1,200.00", used: "$1,200.00", remaining: "$0.00", issued: "2026-02-20", expires: "2026-05-20", status: "Expired" },
  { id: "CN-006", customer: "CloudBase SA", type: "Service Adjustment", amount: "$300.00", used: "$100.00", remaining: "$200.00", issued: "2026-06-10", expires: "2026-09-10", status: "Active" },
  { id: "CN-007", customer: "OmniCorp", type: "Credit Note", amount: "$500.00", used: "$250.00", remaining: "$250.00", issued: "2026-05-05", expires: "2026-08-05", status: "Active" },
  { id: "CN-008", customer: "CloudBase SA", type: "Adjustment", amount: "$150.00", used: "$150.00", remaining: "$0.00", issued: "2026-06-12", expires: "2026-09-12", status: "Fully Applied" },
];

const statusColor = (s) =>
  s === "Active" ? "#059669" : s === "Fully Applied" ? "#6B7280" : s === "Expired" ? "#DC2626" : "#D97706";

export default function CreditNotesPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Credit Notes & Adjustments</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Issue credit notes, manage service adjustments and track refunds.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Issued", value: "$4,650.00", color: "#4F46E5" },
          { label: "Applied / Used", value: "$3,250.00", color: "#D97706" },
          { label: "Available", value: "$1,400.00", color: "#059669" },
          { label: "Expired", value: "$1,200.00", color: "#DC2626" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>By Type</h3>
          {[
            { type: "Promotional Credit", issued: "$1,250.00", available: "$700.00" },
            { type: "Service Adjustment", issued: "$1,300.00", available: "$200.00" },
            { type: "Referral Bonus", issued: "$250.00", available: "$250.00" },
            { type: "Refund", issued: "$1,200.00", available: "$0.00" },
            { type: "Credit Note", issued: "$500.00", available: "$250.00" },
            { type: "Adjustment", issued: "$150.00", available: "$0.00" },
          ].map((ct) => (
            <div key={ct.type} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{ct.type}</span>
              <span style={{ color: "#6B7280" }}>Issued: {ct.issued}</span>
              <span style={{ fontWeight: "600", color: ct.available === "$0.00" ? "#DC2626" : "#059669" }}>{ct.available} avail.</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Expiring Soon</h3>
          {[
            { customer: "DataFlow Corp", amount: "$400.00", expires: "2026-07-10", daysLeft: 24 },
            { customer: "TechNova Inc.", amount: "$300.00", expires: "2026-08-01", daysLeft: 46 },
            { customer: "OmniCorp", amount: "$250.00", expires: "2026-08-05", daysLeft: 50 },
            { customer: "CloudBase SA", amount: "$200.00", expires: "2026-09-10", daysLeft: 86 },
          ].map((ex, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{ex.customer}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>Expires {ex.expires}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{ex.amount}</p>
                <p style={{ margin: 0, color: ex.daysLeft < 30 ? "#DC2626" : "#D97706", fontSize: "12px" }}>{ex.daysLeft} days left</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Note", "Customer", "Type", "Amount", "Used", "Remaining", "Issued", "Expires", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creditNotes.map((cn) => (
              <tr key={cn.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{cn.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{cn.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{cn.type}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{cn.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{cn.used}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: cn.remaining === "$0.00" ? "#DC2626" : "#059669" }}>{cn.remaining}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{cn.issued}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{cn.expires}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(cn.status), background: `${statusColor(cn.status)}15`,
                  }}>{cn.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
