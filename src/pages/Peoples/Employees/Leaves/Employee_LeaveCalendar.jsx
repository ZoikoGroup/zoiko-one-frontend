export default function LeaveCalendar() {
  const holidays = [
    { date: "Jan 26", name: "Republic Day" },
    { date: "Mar 25", name: "Holi" },
    { date: "Apr 14", name: "Ambedkar Jayanti" },
    { date: "Aug 15", name: "Independence Day" },
    { date: "Oct 2",  name: "Gandhi Jayanti" },
    { date: "Nov 1",  name: "Diwali" },
    { date: "Dec 25", name: "Christmas" },
  ];

  const myLeaves = [
    { date: "Jun 10–11", type: "Annual Leave", status: "Approved" },
    { date: "May 22",    type: "Sick Leave",   status: "Approved" },
    { date: "Jul 5",     type: "Casual Leave", status: "Pending" },
  ];

  const statusColor = {
    Approved: { color: "#059669", bg: "#ECFDF5" },
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Leave Calendar</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>View your personal leave schedule and public holidays.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* My Leave Schedule */}
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>My Leave Schedule</h3>
          {myLeaves.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F3F4F6" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 2px 0" }}>{l.type}</p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{l.date}</p>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "999px", color: statusColor[l.status].color, background: statusColor[l.status].bg }}>{l.status}</span>
            </div>
          ))}
        </div>

        {/* Public Holidays */}
        <div style={{ padding: "24px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 16px 0" }}>Public Holidays 2026</h3>
          {holidays.map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>{h.name}</p>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#4F46E5" }}>{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}