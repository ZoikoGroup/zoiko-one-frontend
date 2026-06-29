export default function LeaveTypes() {
  const types = [
    { name: "Annual Leave",  days: 18, carry: "Yes (max 10)", paid: true,  desc: "For planned personal time off, vacations, and personal commitments." },
    { name: "Sick Leave",    days: 10, carry: "No",           paid: true,  desc: "For medical illness, doctor visits, or health recovery." },
    { name: "Casual Leave",  days: 6,  carry: "No",           paid: true,  desc: "For unplanned personal matters requiring short-term absence." },
    { name: "Maternity",     days: 180,carry: "N/A",          paid: true,  desc: "For female employees before and after childbirth. (As per law)" },
    { name: "Paternity",     days: 15, carry: "No",           paid: true,  desc: "For new fathers. Must be availed within 3 months of child's birth." },
    { name: "Unpaid Leave",  days: 0,  carry: "N/A",          paid: false, desc: "Leave taken without pay when all paid leaves are exhausted." },
  ];

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Leave Types</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Understand the different types of leaves and their policies.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {types.map((t) => (
          <div key={t.name} style={{ padding: "22px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>{t.name}</h3>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: t.paid ? "#059669" : "#DC2626", background: t.paid ? "#ECFDF5" : "#FEF2F2" }}>
                {t.paid ? "Paid" : "Unpaid"}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 12px 0" }}>{t.desc}</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px 0" }}>Days / Year</p>
                <p style={{ fontSize: "16px", fontWeight: "800", color: "#4F46E5", margin: 0 }}>{t.days === 0 ? "—" : t.days}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", margin: "0 0 2px 0" }}>Carry Forward</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>{t.carry}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}