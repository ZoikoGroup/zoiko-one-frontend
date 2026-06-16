const subscriptions = [
  { id: "SUB-001", plan: "Business Monthly", customer: "TechNova Inc.", amount: "$599/mo", nextBilling: "2026-07-01", status: "Active" },
  { id: "SUB-002", plan: "Starter", customer: "GreenPath Ltd.", amount: "$0/mo", nextBilling: "2026-07-05", status: "Active" },
  { id: "SUB-003", plan: "Enterprise Annual", customer: "BridgeCo", amount: "$9,600/yr", nextBilling: "2026-08-10", status: "Active" },
  { id: "SUB-004", plan: "Business Monthly", customer: "DataFlow Corp", amount: "$599/mo", nextBilling: "2026-07-12", status: "Past Due" },
  { id: "SUB-005", plan: "Starter", customer: "CloudBase SA", amount: "$0/mo", nextBilling: "2026-07-14", status: "Cancelled" },
  { id: "SUB-006", plan: "Enterprise Annual", customer: "NexGen Systems", amount: "$9,600/yr", nextBilling: "2026-09-15", status: "Active" },
];

const statusColor = (s) =>
  s === "Active" ? "#059669" : s === "Past Due" ? "#DC2626" : "#6B7280";

export default function SubscriptionsPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Subscriptions</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Manage recurring plans, billing cycles and customer subscriptions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Active Subscriptions", value: "4", color: "#059669" },
          { label: "Monthly Recurring", value: "$1,198", color: "#4F46E5" },
          { label: "Annual Recurring", value: "$19,200", color: "#D97706" },
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
              {["Subscription", "Plan", "Customer", "Amount", "Next Billing", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{sub.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{sub.plan}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{sub.customer}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{sub.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{sub.nextBilling}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: statusColor(sub.status), background: `${statusColor(sub.status)}15`,
                  }}>{sub.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
