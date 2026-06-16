const schedules = [
  { id: "SCH-001", client: "TechNova Inc.", plan: "Enterprise Monthly", frequency: "Monthly", amount: "$2,400.00", nextDate: "2026-07-01", status: "Active" },
  { id: "SCH-002", client: "BridgeCo", plan: "Business Annual", frequency: "Yearly", amount: "$9,600.00", nextDate: "2026-08-10", status: "Active" },
  { id: "SCH-003", client: "GreenPath Ltd.", plan: "Starter", frequency: "Monthly", amount: "$0.00", nextDate: "2026-07-05", status: "Trial" },
  { id: "SCH-004", client: "DataFlow Corp", plan: "Business Monthly", frequency: "Monthly", amount: "$599.00", nextDate: "2026-07-15", status: "Active" },
  { id: "SCH-005", client: "CloudBase SA", plan: "Enterprise Monthly", frequency: "Monthly", amount: "$2,400.00", nextDate: "2026-07-20", status: "Active" },
  { id: "SCH-006", client: "NexGen Systems", plan: "Enterprise Annual", frequency: "Yearly", amount: "$18,200.00", nextDate: "2027-01-15", status: "Active" },
  { id: "SCH-007", client: "OmniCorp", plan: "Business Monthly", frequency: "Monthly", amount: "$599.00", nextDate: "2026-07-22", status: "Paused" },
  { id: "SCH-008", client: "TechNova Inc.", plan: "Add-on: AI Pack", frequency: "Monthly", amount: "$399.00", nextDate: "2026-07-01", status: "Active" },
];

const statusColor = (s) =>
  s === "Active" ? "#059669" : s === "Paused" ? "#D97706" : s === "Trial" ? "#0891B2" : "#6B7280";

export default function InvoiceSchedulesPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Invoice Schedules</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Manage recurring invoice schedules, subscription plans and billing cycles.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Active Schedules", value: "6", color: "#4F46E5" },
          { label: "Monthly Revenue", value: "$6,397.00", color: "#059669" },
          { label: "Annual Revenue", value: "$27,800.00", color: "#0891B2" },
          { label: "Paused / Trial", value: "2", color: "#D97706" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Schedule Breakdown</h3>
          {[
            { label: "Monthly Schedules", count: 5, revenue: "$6,397.00" },
            { label: "Yearly Schedules", count: 2, revenue: "$27,800.00" },
            { label: "One-time / Ad-hoc", count: 1, revenue: "$0.00" },
          ].map((sb) => (
            <div key={sb.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <span style={{ color: "#374151" }}>{sb.label}</span>
              <span style={{ color: "#6B7280" }}>{sb.count} schedules</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{sb.revenue}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Next 7 Days</h3>
          {[
            { client: "TechNova Inc.", date: "Jul 1", amount: "$2,799.00", plan: "Enterprise + AI Pack" },
            { client: "GreenPath Ltd.", date: "Jul 5", amount: "$0.00", plan: "Starter (Trial)" },
            { client: "DataFlow Corp", date: "Jul 15", amount: "$599.00", plan: "Business Monthly" },
          ].map((n, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{n.client}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{n.plan} — {n.date}</p>
              </div>
              <p style={{ margin: 0, fontWeight: "600", color: "#111827" }}>{n.amount}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Schedule", "Client", "Plan", "Frequency", "Amount", "Next Invoice", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr key={sch.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{sch.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{sch.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{sch.plan}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{sch.frequency}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{sch.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{sch.nextDate}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(sch.status), background: `${statusColor(sch.status)}15`,
                  }}>{sch.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
