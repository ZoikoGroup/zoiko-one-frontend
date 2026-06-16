const taxRecords = [
  { id: "TAX-001", client: "TechNova Inc.", jurisdiction: "US — California", rate: "8.75%", taxableAmount: "$12,400.00", taxAmount: "$1,085.00", period: "Jun 2026", status: "Filed" },
  { id: "TAX-002", client: "BridgeCo", jurisdiction: "US — Texas", rate: "6.25%", taxableAmount: "$9,200.00", taxAmount: "$575.00", period: "Jun 2026", status: "Pending" },
  { id: "TAX-003", client: "GreenPath Ltd.", jurisdiction: "UK — VAT", rate: "20.00%", taxableAmount: "$4,800.00", taxAmount: "$960.00", period: "Jun 2026", status: "Filed" },
  { id: "TAX-004", client: "DataFlow Corp", jurisdiction: "US — New York", rate: "4.00%", taxableAmount: "$3,600.00", taxAmount: "$144.00", period: "Jun 2026", status: "Pending" },
  { id: "TAX-005", client: "CloudBase SA", jurisdiction: "EU — VAT", rate: "19.00%", taxableAmount: "$6,750.00", taxAmount: "$1,282.50", period: "Jun 2026", status: "Filed" },
  { id: "TAX-006", client: "NexGen Systems", jurisdiction: "US — Delaware", rate: "0.00%", taxableAmount: "$18,200.00", taxAmount: "$0.00", period: "Jun 2026", status: "Exempt" },
  { id: "TAX-007", client: "OmniCorp", jurisdiction: "AU — GST", rate: "10.00%", taxableAmount: "$5,500.00", taxAmount: "$550.00", period: "Jun 2026", status: "Pending" },
];

const statusColor = (s) =>
  s === "Filed" ? "#059669" : s === "Pending" ? "#D97706" : s === "Exempt" ? "#0891B2" : "#6B7280";

export default function TaxPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Tax</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Manage tax rates, jurisdictions, filings and compliance across regions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Tax Collected", value: "$4,596.50", color: "#4F46E5" },
          { label: "Filed", value: "$3,327.50", color: "#059669" },
          { label: "Pending Filing", value: "$1,269.00", color: "#D97706" },
          { label: "Jurisdictions", value: "6", color: "#0891B2" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Tax by Jurisdiction</h3>
          {[
            { juris: "US — California", collected: "$1,085.00", rate: "8.75%" },
            { juris: "EU — VAT", collected: "$1,282.50", rate: "19.00%" },
            { juris: "UK — VAT", collected: "$960.00", rate: "20.00%" },
            { juris: "AU — GST", collected: "$550.00", rate: "10.00%" },
            { juris: "US — Texas", collected: "$575.00", rate: "6.25%" },
          ].map((j) => (
            <div key={j.juris} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{j.juris}</span>
              <span style={{ color: "#6B7280" }}>{j.rate}</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{j.collected}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Upcoming Filings</h3>
          {[
            { juris: "US — New York", due: "Jul 15, 2026", amount: "$144.00" },
            { juris: "US — Texas", due: "Jul 20, 2026", amount: "$575.00" },
            { juris: "AU — GST", due: "Jul 28, 2026", amount: "$550.00" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{f.juris}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>Due {f.due}</p>
              </div>
              <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{f.amount}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Record", "Client", "Jurisdiction", "Rate", "Taxable Amount", "Tax Amount", "Period", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taxRecords.map((tax) => (
              <tr key={tax.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{tax.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{tax.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{tax.jurisdiction}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{tax.rate}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{tax.taxableAmount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{tax.taxAmount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{tax.period}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(tax.status), background: `${statusColor(tax.status)}15`,
                  }}>{tax.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
