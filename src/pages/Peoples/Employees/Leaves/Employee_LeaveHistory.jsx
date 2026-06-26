export default function LeaveHistory() {
  const records = [
    { id: "LV-001", type: "Annual Leave", from: "Jun 10, 2026", to: "Jun 11, 2026", days: 2, appliedOn: "Jun 5, 2026",  approver: "Rahul Sharma", status: "Approved" },
    { id: "LV-002", type: "Sick Leave",   from: "May 22, 2026", to: "May 22, 2026", days: 1, appliedOn: "May 22, 2026", approver: "Rahul Sharma", status: "Approved" },
    { id: "LV-003", type: "Casual Leave", from: "Apr 14, 2026", to: "Apr 14, 2026", days: 1, appliedOn: "Apr 12, 2026", approver: "Priya Mehta",  status: "Approved" },
    { id: "LV-004", type: "Annual Leave", from: "Mar 1, 2026",  to: "Mar 3, 2026",  days: 3, appliedOn: "Feb 25, 2026", approver: "Rahul Sharma", status: "Rejected" },
    { id: "LV-005", type: "Unpaid Leave", from: "Feb 10, 2026", to: "Feb 10, 2026", days: 1, appliedOn: "Feb 9, 2026",  approver: "Priya Mehta",  status: "Approved" },
  ];

  const statusColor = {
    Approved: { color: "#059669", bg: "#ECFDF5" },
    Rejected: { color: "#DC2626", bg: "#FEF2F2" },
    Pending:  { color: "#D97706", bg: "#FFFBEB" },
  };

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Leave History</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>Complete record of all your leave requests.</p>
      </div>

      <div style={{ borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["ID", "Type", "From", "To", "Days", "Applied On", "Approver", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td style={{ padding: "13px 16px", fontSize: "12px", color: "#9CA3AF", fontWeight: "600" }}>{r.id}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#111827", fontWeight: "600" }}>{r.type}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{r.from}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{r.to}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151", textAlign: "center" }}>{r.days}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{r.appliedOn}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{r.approver}</td>
                <td style={{ padding: "13px 16px" }}>
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