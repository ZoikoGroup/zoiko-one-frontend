export default function TaxCompliance() {
  const taxDocs = [
    { name: "Form 16 – FY 2025-26",     year: "2025-26", type: "Form 16",   status: "Available" },
    { name: "Form 16 – FY 2024-25",     year: "2024-25", type: "Form 16",   status: "Available" },
    { name: "Investment Declaration",    year: "2025-26", type: "IT Filing", status: "Submitted" },
    { name: "Proof Submission Receipt",  year: "2025-26", type: "Proof",     status: "Available" },
    { name: "TDS Certificate Q1",        year: "2025-26", type: "TDS",       status: "Available" },
    { name: "TDS Certificate Q4",        year: "2024-25", type: "TDS",       status: "Available" },
  ];

  const statusColor = {
    Available: { color: "#059669", bg: "#ECFDF5" },
    Submitted: { color: "#4F46E5", bg: "#EEF2FF" },
    Pending:   { color: "#D97706", bg: "#FFFBEB" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Tax & Compliance</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Access your Form 16, TDS certificates, and investment declarations.</p>
      </div>

      {/* Info Banner */}
      <div style={{ padding: "16px 20px", borderRadius: "10px", background: "#EEF2FF", border: "1px solid #C7D2FE", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "18px" }}>ℹ️</span>
        <p style={{ fontSize: "13px", color: "#3730A3", margin: 0 }}>Form 16 for FY 2025-26 will be available by July 15, 2026. Please consult your tax advisor for filing.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {taxDocs.map((d, i) => (
          <div key={i} style={{ padding: "18px 24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 4px 0" }}>{d.name}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>FY {d.year}</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>·</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280" }}>{d.type}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[d.status].color, background: statusColor[d.status].bg }}>{d.status}</span>
              <button style={{ padding: "7px 14px", background: "#F3F4F6", color: "#374151", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}