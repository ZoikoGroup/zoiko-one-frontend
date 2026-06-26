export default function Payslips() {
  const payslips = [
    { month: "June 2026",    gross: "₹85,000", deductions: "₹18,500", net: "₹66,500", status: "Generated" },
    { month: "May 2026",     gross: "₹85,000", deductions: "₹18,500", net: "₹66,500", status: "Generated" },
    { month: "April 2026",   gross: "₹82,000", deductions: "₹17,800", net: "₹64,200", status: "Generated" },
    { month: "March 2026",   gross: "₹82,000", deductions: "₹17,800", net: "₹64,200", status: "Generated" },
    { month: "February 2026",gross: "₹80,000", deductions: "₹17,200", net: "₹62,800", status: "Generated" },
    { month: "January 2026", gross: "₹80,000", deductions: "₹17,200", net: "₹62,800", status: "Generated" },
  ];

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>My Payslips</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Download your monthly salary slips.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Last Month CTC",  value: "₹85,000", color: "#4F46E5" },
          { label: "Last Deductions", value: "₹18,500", color: "#DC2626" },
          { label: "Last Net Pay",    value: "₹66,500", color: "#059669" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: "0 0 4px 0" }}>{s.value}</p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Month", "Gross Pay", "Deductions", "Net Pay", "Action"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{p.month}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>{p.gross}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#DC2626" }}>{p.deductions}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: "700", color: "#059669" }}>{p.net}</td>
                <td style={{ padding: "14px 20px" }}>
                  <button style={{ padding: "6px 14px", background: "#EEF2FF", color: "#4F46E5", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}