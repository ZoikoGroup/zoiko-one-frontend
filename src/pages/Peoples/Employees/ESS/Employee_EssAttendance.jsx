 export default function EssAttendance() {
  const records = [
    { date: "Jun 25, 2026", checkIn: "09:02 AM", checkOut: "06:15 PM", hours: "9h 13m", status: "Present" },
    { date: "Jun 24, 2026", checkIn: "09:18 AM", checkOut: "06:00 PM", hours: "8h 42m", status: "Present" },
    { date: "Jun 23, 2026", checkIn: "—",        checkOut: "—",        hours: "—",       status: "Absent" },
    { date: "Jun 22, 2026", checkIn: "08:55 AM", checkOut: "05:45 PM", hours: "8h 50m", status: "Present" },
    { date: "Jun 21, 2026", checkIn: "10:10 AM", checkOut: "06:00 PM", hours: "7h 50m", status: "Late" },
    { date: "Jun 20, 2026", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: "9h 00m", status: "Present" },
  ];

  const statusColor = {
    Present: { color: "#059669", bg: "#ECFDF5" },
    Absent:  { color: "#DC2626", bg: "#FEF2F2" },
    Late:    { color: "#D97706", bg: "#FFFBEB" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>My Attendance</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Track your daily check-in and check-out records.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Present Days", value: "21", color: "#059669" },
          { label: "Absent Days", value: "2", color: "#DC2626" },
          { label: "Late Arrivals", value: "3", color: "#D97706" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: "32px", fontWeight: "800", color: s.color, margin: "0 0 4px 0" }}>{s.value}</p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Records Table */}
      <div style={{ borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>Attendance Records</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#111827", fontWeight: "500" }}>{r.date}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>{r.checkIn}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>{r.checkOut}</td>
                <td style={{ padding: "14px 20px", fontSize: "14px", color: "#374151" }}>{r.hours}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[r.status].color, background: statusColor[r.status].bg }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}