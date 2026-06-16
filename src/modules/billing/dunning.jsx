const dunningEntries = [
  { id: "DUN-001", client: "BridgeCo", invoice: "INV-003", amount: "$9,200.00", dueDate: "2026-06-01", daysOverdue: 14, level: 2, status: "Second Notice" },
  { id: "DUN-002", client: "OmniCorp", invoice: "INV-007", amount: "$5,500.00", dueDate: "2026-05-28", daysOverdue: 18, level: 3, status: "Final Notice" },
  { id: "DUN-003", client: "TechNova Inc.", invoice: "INV-001", amount: "$12,400.00", dueDate: "2026-05-15", daysOverdue: 32, level: 4, status: "Escalated" },
  { id: "DUN-004", client: "GreenPath Ltd.", invoice: "INV-002", amount: "$4,800.00", dueDate: "2026-06-15", daysOverdue: 1, level: 1, status: "Payment Reminder" },
  { id: "DUN-005", client: "DataFlow Corp", invoice: "INV-004", amount: "$3,600.00", dueDate: "2026-07-01", daysOverdue: 0, level: 0, status: "Scheduled" },
];

const levelColor = (s) =>
  s === "Payment Reminder" ? "#0891B2" : s === "Second Notice" ? "#D97706" : s === "Final Notice" ? "#DC2626" : s === "Escalated" ? "#7C3AED" : "#6B7280";

const dunningLevels = [
  { level: 1, label: "Payment Reminder", days: "0–7", action: "Automated email reminder" },
  { level: 2, label: "Second Notice", days: "8–14", action: "Automated email + letter" },
  { level: 3, label: "Final Notice", days: "15–21", action: "Phone call + formal notice" },
  { level: 4, label: "Escalated", days: "22+", action: "Collections team intervention" },
];

export default function DunningPage() {
  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>Dunning</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Automated dunning process — manage overdue stages, reminders and escalations.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Active Dunning", value: "4", color: "#DC2626" },
          { label: "Level 1 (Reminder)", value: "1", color: "#0891B2" },
          { label: "Level 2–3 (Notices)", value: "2", color: "#D97706" },
          { label: "Level 4 (Escalated)", value: "1", color: "#7C3AED" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Dunning Levels</h3>
          {dunningLevels.map((dl) => (
            <div key={dl.level} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #F3F4F6", fontSize: "13px" }}>
              <div>
                <span style={{ color: "#374151", fontWeight: "500" }}>Level {dl.level}: {dl.label}</span>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "12px" }}>{dl.action}</p>
              </div>
              <span style={{ color: "#6B7280", fontSize: "12px", whiteSpace: "nowrap" }}>{dl.days} days overdue</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" }}>Total at Risk</h3>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "36px", fontWeight: "800", color: "#DC2626", margin: "0 0 4px 0" }}>$27,100.00</p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>across 4 active dunning cases</p>
          </div>
          <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 0", fontSize: "13px" }}>
            {[
              { label: "Level 1", amount: "$4,800.00", color: "#0891B2" },
              { label: "Level 2", amount: "$9,200.00", color: "#D97706" },
              { label: "Level 3", amount: "$5,500.00", color: "#DC2626" },
              { label: "Level 4", amount: "$12,400.00", color: "#7C3AED" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#374151" }}>{l.label}</span>
                <span style={{ fontWeight: "600", color: l.color }}>{l.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
              {["Case", "Client", "Invoice", "Amount", "Due Date", "Overdue", "Level", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dunningEntries.map((dun) => (
              <tr key={dun.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{dun.id}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{dun.client}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{dun.invoice}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{dun.amount}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6B7280" }}>{dun.dueDate}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: dun.daysOverdue > 0 ? "#DC2626" : "#6B7280", fontWeight: dun.daysOverdue > 0 ? "600" : "400" }}>
                  {dun.daysOverdue > 0 ? `${dun.daysOverdue}d` : "\u2014"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: "#6B7280", background: "#F3F4F6",
                  }}>{dun.level}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "999px",
                    color: levelColor(dun.status), background: `${levelColor(dun.status)}15`,
                  }}>{dun.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
