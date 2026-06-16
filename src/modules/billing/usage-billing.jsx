const usageRecords = [
  { id: "USG-001", customer: "TechNova Inc.", service: "API Calls", unit: "1.2M", rate: "$0.001/call", amount: "$1,200.00", period: "Jun 2026", status: "Billed" },
  { id: "USG-002", customer: "BridgeCo", service: "Storage (GB)", unit: "500 GB", rate: "$0.10/GB", amount: "$50.00", period: "Jun 2026", status: "Billed" },
  { id: "USG-003", customer: "DataFlow Corp", service: "SMS Sent", unit: "45K", rate: "$0.02/SMS", amount: "$900.00", period: "Jun 2026", status: "Pending" },
  { id: "USG-004", customer: "CloudBase SA", service: "Bandwidth", unit: "2.8 TB", rate: "$0.05/GB", amount: "$143.36", period: "Jun 2026", status: "Pending" },
  { id: "USG-005", customer: "NexGen Systems", service: "Compute Hours", unit: "720 hrs", rate: "$0.50/hr", amount: "$360.00", period: "Jun 2026", status: "Billed" },
  { id: "USG-006", customer: "GreenPath Ltd.", service: "Email Volume", unit: "12K", rate: "$0.005/email", amount: "$60.00", period: "Jun 2026", status: "Pending" },
  { id: "USG-007", customer: "TechNova Inc.", service: "AI Tokens", unit: "850K", rate: "$0.002/token", amount: "$1,700.00", period: "Jun 2026", status: "Billed" },
  { id: "USG-008", customer: "BridgeCo", service: "Database Queries", unit: "3.5M", rate: "$0.0005/query", amount: "$1,750.00", period: "Jun 2026", status: "Pending" },
];

const statusColor = (s) =>
  s === "Billed" ? "#059669" : s === "Pending" ? "#D97706" : "#6B7280";

export default function UsageBillingPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Usage Billing</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track metered usage, compute consumption and volume-based charges across services.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Usage (MTD)", value: "$6,163.36", color: "#4F46E5" },
          { label: "Billed", value: "$3,310.00", color: "#059669" },
          { label: "Pending", value: "$2,853.36", color: "#D97706" },
          { label: "Avg per Customer", value: "$770.42", color: "#0891B2" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Usage by Service</h3>
          {[
            { service: "Database Queries", usage: "3.5M", amount: "$1,750.00", pct: 28 },
            { service: "AI Tokens", usage: "850K", amount: "$1,700.00", pct: 27 },
            { service: "API Calls", usage: "1.2M", amount: "$1,200.00", pct: 19 },
            { service: "SMS Sent", usage: "45K", amount: "$900.00", pct: 15 },
            { service: "Compute Hours", usage: "720 hrs", amount: "$360.00", pct: 6 },
          ].map((svc) => (
            <div key={svc.service} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ color: "#374151" }}>{svc.service}</span>
                <span style={{ color: "#6B7280" }}>{svc.usage}</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>{svc.amount}</span>
              </div>
              <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `${svc.pct}%`, height: "100%", background: "#4F46E5", borderRadius: "999px" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Top Customers by Usage</h3>
          {[
            { name: "BridgeCo", services: 2, total: "$1,800.00" },
            { name: "TechNova Inc.", services: 2, total: "$2,900.00" },
            { name: "DataFlow Corp", services: 1, total: "$900.00" },
            { name: "NexGen Systems", services: 1, total: "$360.00" },
            { name: "CloudBase SA", services: 1, total: "$143.36" },
          ].map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{c.name}</span>
              <span style={{ color: "#6B7280" }}>{c.services} services</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{c.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Record", "Customer", "Service", "Usage", "Rate", "Amount", "Period", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usageRecords.map((rec) => (
              <tr key={rec.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{rec.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{rec.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{rec.service}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{rec.unit}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{rec.rate}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{rec.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{rec.period}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(rec.status), background: `${statusColor(rec.status)}15`,
                  }}>{rec.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
