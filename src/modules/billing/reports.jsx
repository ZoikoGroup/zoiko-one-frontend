const reportCategories = [
  {
    title: "Revenue Reports",
    reports: [
      { name: "Revenue Summary", desc: "MTD, QTD, YTD revenue breakdown", format: "PDF / CSV" },
      { name: "Revenue by Customer", desc: "Top customers by revenue contribution", format: "PDF / CSV" },
      { name: "Revenue by Product", desc: "Revenue per service / product line", format: "PDF / CSV" },
      { name: "Recurring Revenue", desc: "MRR / ARR with growth trends", format: "PDF / CSV" },
    ],
  },
  {
    title: "Invoice Reports",
    reports: [
      { name: "Invoice Aging", desc: "Aging analysis of all outstanding invoices", format: "PDF / CSV" },
      { name: "Invoice History", desc: "Complete invoice transaction log", format: "PDF / CSV" },
      { name: "Paid vs Unpaid", desc: "Ratio analysis of paid vs overdue invoices", format: "PDF / CSV" },
      { name: "Tax Summary", desc: "Tax collected per jurisdiction and period", format: "PDF / CSV" },
    ],
  },
  {
    title: "Collections Reports",
    reports: [
      { name: "Collections Activity", desc: "All collections actions and outcomes", format: "PDF / CSV" },
      { name: "Dunning Summary", desc: "Dunning levels, counts and recovery rates", format: "PDF / CSV" },
      { name: "Credit Note Usage", desc: "Credit notes issued, applied and expired", format: "PDF / CSV" },
      { name: "Bad Debt Analysis", desc: "Write-offs, provisions and recovery trends", format: "PDF / CSV" },
    ],
  },
  {
    title: "Customer Reports",
    reports: [
      { name: "Customer Billing History", desc: "Complete billing lifecycle per customer", format: "PDF / CSV" },
      { name: "Usage Report", desc: "Metered usage by customer and service", format: "PDF / CSV" },
      { name: "Subscription Summary", desc: "Active plans, renewals and churn analysis", format: "PDF / CSV" },
      { name: "Schedule Compliance", desc: "Invoice schedule adherence and gaps", format: "PDF / CSV" },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Billing Reports</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Generate and export billing reports — revenue, invoices, collections and customer analytics.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Available Reports", value: "16", color: "#4F46E5" },
          { label: "Generated (MTD)", value: "8", color: "#059669" },
          { label: "Scheduled", value: "4", color: "#0891B2" },
          { label: "Last Generated", value: "Today", color: "#6B7280" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Quick Access</h3>
          {[
            { name: "Revenue Summary", icon: "📊", color: "#4F46E5" },
            { name: "Invoice Aging", icon: "📄", color: "#D97706" },
            { name: "Collections Activity", icon: "📋", color: "#DC2626" },
            { name: "Usage Report", icon: "📈", color: "#0891B2" },
            { name: "Tax Summary", icon: "🧾", color: "#059669" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: "1px solid #F3F4F6", cursor: "pointer" }}>
              <span style={{ fontSize: "18px" }}>{r.icon}</span>
              <span style={{ flex: 1, color: "#374151", fontSize: "13px", fontWeight: "500" }}>{r.name}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: r.color, padding: "4px 10px", borderRadius: "999px", background: `${r.color}10` }}>Generate</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Recently Generated</h3>
          {[
            { name: "Revenue Summary — Jun 2026", date: "Jun 15, 2026 09:30 AM", status: "Ready" },
            { name: "Invoice Aging — Q2 2026", date: "Jun 14, 2026 02:15 PM", status: "Ready" },
            { name: "Customer Billing — TechNova Inc.", date: "Jun 13, 2026 11:00 AM", status: "Ready" },
            { name: "Tax Summary — Jun 2026", date: "Jun 12, 2026 04:45 PM", status: "Processing" },
          ].map((rg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{rg.name}</p>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{rg.date}</p>
              </div>
              <span style={{
                fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px",
                color: rg.status === "Ready" ? "#059669" : "#D97706",
                background: rg.status === "Ready" ? "#ECFDF5" : "#FFFBEB",
              }}>{rg.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {reportCategories.map((cat) => (
          <div key={cat.title} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>{cat.title}</h3>
            {cat.reports.map((rep, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
                <div>
                  <p style={{ margin: 0, color: "#374151", fontWeight: "500" }}>{rep.name}</p>
                  <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{rep.desc}</p>
                </div>
                <span style={{ fontSize: "11px", color: "#6B7280", whiteSpace: "nowrap" }}>{rep.format}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
