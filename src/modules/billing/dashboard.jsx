export default function ZoikoBillingModule() {
  const metrics = [
    { label: "Revenue (MTD)", value: "$36,999", change: "+12%", color: "#059669" },
    { label: "Outstanding", value: "$14,000", change: "-8%", color: "#D97706" },
    { label: "Active Subscriptions", value: "4", change: "+1", color: "#4F46E5" },
    { label: "Collection Rate", value: "94%", change: "+2%", color: "#059669" },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Zoiko Billing</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Dashboard overview — invoicing, subscriptions, collections and revenue.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{m.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <p style={{ fontSize: "28px", fontWeight: "800", color: m.color, margin: 0 }}>{m.value}</p>
              <span style={{ fontSize: "13px", fontWeight: "600", color: m.change.startsWith("+") ? "#059669" : "#DC2626" }}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Recent Invoices</h3>
          {[
            { id: "INV-006", client: "NexGen Systems", amount: "$18,200", status: "Paid" },
            { id: "INV-003", client: "BridgeCo", amount: "$9,200", status: "Overdue" },
            { id: "INV-005", client: "CloudBase SA", amount: "$6,750", status: "Pending" },
          ].map((inv) => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{inv.id}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{inv.client}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>{inv.amount}</p>
                <span style={{
                  fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px",
                  color: inv.status === "Paid" ? "#059669" : inv.status === "Overdue" ? "#DC2626" : "#D97706",
                  background: inv.status === "Paid" ? "#ECFDF5" : inv.status === "Overdue" ? "#FEF2F2" : "#FFFBEB",
                }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Upcoming Renewals</h3>
          {[
            { plan: "Business Monthly", customer: "TechNova Inc.", date: "Jul 1", amount: "$599" },
            { plan: "Enterprise Annual", customer: "BridgeCo", date: "Aug 10", amount: "$9,600" },
            { plan: "Starter", customer: "GreenPath Ltd.", date: "Jul 5", amount: "$0" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{r.plan}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{r.customer} — {r.date}</p>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: 0 }}>{r.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
